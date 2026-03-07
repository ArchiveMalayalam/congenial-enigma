import fs from "fs";
import path from "path";

const OLLAMA_URL = "http://ollama:11434";
const MODEL = "llava";
const IMAGES_DIR = "/workspace/images";

async function getCompletion(imagePath) {
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: "Extract all text from this image. Return only the text, nothing else.",
      images: [imageData],
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp"].includes(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No images found in /workspace/images");
    return;
  }

  console.log(`Found ${files.length} images\n`);

  for (const file of files) {
    const imagePath = path.join(IMAGES_DIR, file);
    console.log(`--- ${file} ---`);
    try {
      const result = await getCompletion(imagePath);
      console.log(result);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
    console.log();
  }
}

main();