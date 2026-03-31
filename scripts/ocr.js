import pkg from 'pg';
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { pdf } from "pdf-to-img";

const { Client } = pkg;
const IMAGES_DIR = "/workspace/samples/kerala_university_malayalam_print_1900_1950";
const OUTPUT_DIR = "/workspace/samples/images";
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

// Use the ENV variable from Docker Compose
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// Initialize Table
await client.query(`
  CREATE TABLE IF NOT EXISTS ocr_pages (
    id SERIAL PRIMARY KEY,
    doc_name TEXT,
    page_number INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

function tesseract(imagePath) {
  const result = execSync(
    `tesseract "${imagePath}" stdout -l mal --oem 1 --psm 6`,
    { encoding: "utf8" }
  );
  return result.trim();
}

async function saveToDb(docName, pageNum, text) {
  await client.query(
    "INSERT INTO ocr_pages (doc_name, page_number, content) VALUES ($1, $2, $3)",
    [docName, pageNum, text]
  );
  console.log(`✅ Saved ${docName} p${pageNum} to Postgres`);
}

async function processImage(imagePath) {
  const text = tesseract(imagePath);
  const id = path.basename(imagePath, path.extname(imagePath));
  // Fixed arguments: docName, pageNum (1 for single image), text
  await saveToDb(id, 1, text);
  return text;
}

async function processPdf(pdfPath) {
  const baseName = path.basename(pdfPath, ".pdf");
  const doc = await pdf(pdfPath, { scale: 2.0 });
  let i = 1;

  for await (const page of doc) {
    process.stdout.write(`  [page ${i}/${doc.length}] `);

    const imagePath = path.join(OUTPUT_DIR, `${baseName}-page${i}.png`);
    fs.writeFileSync(imagePath, page);

    const text = tesseract(imagePath);
    // FIXED: Changed sendToQdrant to saveToDb
    await saveToDb(baseName, i, text);

    console.log("done");
    i++;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTS.includes(ext) || ext === ".pdf";
  });

  if (files.length === 0) {
    console.log("No images or PDFs found");
    return;
  }

  console.log(`Found ${files.length} file(s)\n`);

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const ext = path.extname(file).toLowerCase();
    console.log(`--- ${file} ---`);
    try {
      await (ext === ".pdf" ? processPdf(filePath) : processImage(filePath));
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
    console.log();
  }
}

main();