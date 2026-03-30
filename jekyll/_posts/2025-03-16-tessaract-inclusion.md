## OCR Model Journey`

We went through several models before landing on a working solution.

### DeepSeek OCR
First attempt. Returned empty responses, and when it did produce output it hallucinated C++ code completely unrelated to the document. Abandoned immediately.

### Qwen2.5vl 3B
Refused to output Malayalam claiming it "couldn't write in the language". When pushed, hallucinated repetitive looping text. Too small for the task.

### Qwen2.5vl 7B
An improvement but still hallucinating — generating plausible-sounding Malayalam phrases with no relation to the actual page content. We considered slicing pages into smaller chunks to reduce hallucination drift but this wouldn't fix a fundamental model quality problem. Even the comparison against Gemini's translation showed qwen2.5vl hallucinating "rice plant" where Gemini correctly identified the Nair community and Travancore kingdom.

### Tesseract
Switched away from vision LLMs entirely. Tesseract is a dedicated OCR engine (Apache 2.0, maintained by Google) built for exactly one task — recognizing text in images. Unlike the generalist vision models, it's not trying to chat, reason, or generate — it just reads. It uses an LSTM neural network under the hood but is small, fast, and runs entirely on CPU.

The Malayalam language pack (`tesseract-ocr-mal`) is trained specifically on Malayalam script including older typefaces, which is exactly what our 1900s documents require. First attempt correctly read historical Malayalam text that 7B vision models had completely failed on.
```dockerfile
FROM node:22

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-mal \
    && rm -rf /var/lib/apt/lists/*
```

The pattern throughout: we kept reaching for generalist vision LLMs when what we needed was a specialized tool built for the job.