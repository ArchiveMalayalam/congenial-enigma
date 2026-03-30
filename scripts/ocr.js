import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { pdf } from "pdf-to-img";
import fetch from "node-fetch"; // Make sure to install node-fetch if using Node < 18

const IMAGES_DIR = "/workspace/samples/kerala_university_malayalam_print_1900_1950";
const OUTPUT_DIR = "/workspace/samples/images";
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];
const QDRANT_URL = "http://qdrant:6333"; // internal Docker network
const COLLECTION_NAME = "ArchiveML";

function tesseract(imagePath) {
  const result = execSync(
    `tesseract "${imagePath}" stdout -l mal --oem 1 --psm 6`,
    { encoding: "utf8" }
  );
  return result.trim();
}

async function sendToQdrant(id, text, metadata = {}) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      text,
      metadata,
    }),
  });

  if (!res.ok) {
    console.error(`Failed to push ${id} to Qdrant:`, await res.text());
  } else {
    console.log(`✅ Pushed ${id} to Qdrant`);
  }
}

async function processImage(imagePath) {
  const text = tesseract(imagePath);
  const id = path.basename(imagePath, path.extname(imagePath));
  await sendToQdrant(id, text, { source: "image file" });
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
    const docId = `${baseName}-page${i}`;
    await sendToQdrant(docId, text, { source: "pdf page" });

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