---
layout: post
title: "IndicTrans2 Deployment: Technical Post-Mortem"
date: 2026-03-17
categories: project
---
# IndicTrans2 Deployment: Technical Post-Mortem

This document summarizes the technical hurdles and architectural pivots required to implement a local Indic-to-English translation API in a portable Docker environment.

## The Stack
* **Engine:** FastAPI + Uvicorn (Python 3.11)
* **Model:** `indictrans2-indic-en-1B` (Gated Hugging Face repository)
* **Toolkit:** `IndicTransToolkit` (Source-built from GitHub)
* **Orchestration:** Docker Compose + Node.js Client

---

## Technical Issues and Resolutions

### 1. Docker Networking and DNS Failures
**Issue:** Docker in WSL2 was unable to pull images or reach external repositories, resulting in I/O timeouts.
**Root Cause:** Improper IPv6 handling within the WSL2 virtual network.
**Resolution:** Modified `/etc/docker/daemon.json` to disable IPv6 and force Google DNS (8.8.8.8). A full system restart via `wsl --shutdown` was required to apply the changes.

### 2. Version Incompatibility in Dependencies
**Issue:** `ImportError: PreTrainedTokenizerBase`.
**Root Cause:** The latest version of the `transformers` library broke compatibility with the `IndicTransToolkit` helper.
**Resolution:** Pinned the dependency to `transformers==4.51.3` to ensure a stable build environment.

### 3. Service Connectivity and Initialization
**Issue:** The container status was "Up," but connection attempts via `curl` were refused.
**Root Cause:** The model was hardcoded to `DEVICE = "cuda"`. Without a functional GPU pass-through, the model loading process blocked the server from binding to the port. Additionally, `stdout` buffering prevented error logs from appearing.
**Resolution:** Updated the Python logic to use `torch.cuda.is_available()` as a fallback, added `uvicorn` to the requirements, and set `PYTHONUNBUFFERED=1` in the Dockerfile.

### 4. Gated Model Authentication
**Issue:** `403 Forbidden` errors during model download.
**Root Cause:** The `indictrans2` weights require explicit user permission on Hugging Face.
**Resolution:** Requested repository access and injected the `HF_TOKEN` via environment variables. The Python initialization was updated to explicitly pass the token to the `from_pretrained` method.

---

## Final Configuration

### Updated Dockerfile
The build uses a layered approach to minimize re-installation time:

```dockerfile
FROM python:3.11
WORKDIR /app
ENV PYTHONUNBUFFERED=1

# Install core machine learning and API dependencies
RUN pip install --no-cache-dir \
    fastapi uvicorn torch sentencepiece sacremoses \
    "transformers==4.51.3"

# Install toolkit from source
RUN pip install --no-cache-dir git+https://github.com/VarunGumma/IndicTransToolkit.git

COPY main.py .
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cleaned indictrans Service (CPU-Only)
You can now use this simplified block in your `docker-compose.yml`:

```yaml
  indictrans:
    build:
      context: ./services/indictrans
    ports:
      - "8000:8000"
    restart: unless-stopped
    environment:
      - HUGGINGFACE_HUB_TOKEN=${HUGGINGFACE_HUB_TOKEN}
      - HF_TOKEN=${HUGGINGFACE_HUB_TOKEN}
```

---

## Key Lessons
* **Portability over Performance:** Prioritizing a functional CPU build ensured a working demo for the deadline, avoiding the complexities of GPU driver pass-through in WSL2.
* **Initialization Blocking:** Large model weights loading at the script's top level will prevent the API from becoming reachable until the load is complete.
* **Environment Verification:** DevContainer terminals can obscure the network context. Always use `docker logs` from the host to verify the internal state of secondary containers.

### Current Status
End-to-end translation is operational. Malayalam OCR text is successfully transmitted from the Node script to the IndicTrans API, returning English translations for database storage.