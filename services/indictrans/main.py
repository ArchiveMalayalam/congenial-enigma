import os
from fastapi import FastAPI
from pydantic import BaseModel
from IndicTransToolkit import IndicProcessor
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

app = FastAPI()

MODEL_NAME = "ai4bharat/indictrans2-indic-en-1B"
DEVICE = "cpu" 
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")

print(f"Starting app. Device: {DEVICE}")
print(f"HF token present: {bool(HF_TOKEN)}")
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True,
    token=HF_TOKEN,
)
print("Tokenizer loaded.")

print("Loading model...")
model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True,
    token=HF_TOKEN,
).to(DEVICE)
print("Model loaded.")

print("Loading IndicProcessor...")
ip = IndicProcessor(inference=True)
print("IndicProcessor loaded.")
print("Model ready.")

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "mal_Mlym"
    target_lang: str = "eng_Latn"

@app.get("/health")
def health():
    return {"status": "ok", "device": DEVICE}

@app.post("/translate")
def translate(req: TranslateRequest):
    batch = ip.preprocess_batch([req.text], src_lang=req.source_lang, tgt_lang=req.target_lang)
    inputs = tokenizer(batch, return_tensors="pt", padding=True, truncation=True).to(DEVICE)
    with torch.no_grad():
        outputs = model.generate(**inputs, num_beams=5, max_length=512)
    result = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    result = ip.postprocess_batch(result, lang=req.target_lang)
    return {"translation": result[0]}