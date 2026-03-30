# 🧾 IndicTrans Docker Setup — Debugging Summary

## 🎯 Goal

Run a local translation API using:

* **FastAPI**
* **IndicTransToolkit**
* **Hugging Face model (`indictrans2-indic-en-1B`)**
* Docker + Docker Compose + Devcontainer
* Node client calling the API

---

# 🧩 Final Working Architecture

* `indictrans` → FastAPI + model server (Python)
* `node` → client script calling `/translate`
* Communication via Docker network:

  ```
  http://indictrans:8000
  ```

---

# 🔥 Issues Encountered & Fixes

## 1. Docker DNS / Network failure

**Error:**

```
lookup registry-1.docker.io ... i/o timeout
```

**Cause:**
Docker in WSL2 was trying to use broken IPv6 DNS.

**Fix:**
Created `/etc/docker/daemon.json`:

```json
{
  "dns": ["8.8.8.8", "1.1.1.1"],
  "ipv6": false
}
```

Then restarted WSL:

```bash
wsl --shutdown
```

---

## 2. Container restart loop (Python crash)

**Error:**

```
ImportError: PreTrainedTokenizerBase
```

**Cause:**
`transformers` version incompatible with IndicTransToolkit.

**Fix:**
Pinned version:

```dockerfile
"transformers==4.51.3"
```

---

## 3. Missing `uvicorn`

**Error:**

```
exec: "uvicorn": not found
```

**Cause:**
Not installed in Dockerfile.

**Fix:**

```dockerfile
pip install fastapi uvicorn
```

---

## 4. Hugging Face gated model access

**Error:**

```
Cannot access gated repo...
```

**Fix:**

* Requested access on Hugging Face
* Generated token
* Passed via docker-compose:

```yaml
environment:
  - HF_TOKEN=hf_xxx
  - HUGGINGFACE_HUB_TOKEN=hf_xxx
```

* Explicitly passed token in code:

```python
token=HF_TOKEN
```

---

## 5. Container "up" but no server listening

**Symptoms:**

* `curl` → connection refused
* no logs
* port mapped but dead

**Cause:**
Model loading happening **before Uvicorn binds port**

---

## 6. Hidden root cause: forced GPU

```python
DEVICE = "cuda"
```

**Problem:**

* Container had no working GPU
* Model load blocked → server never started

**Fix:**

```python
DEVICE = "cpu"
```

(or safe fallback)

```python
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
```

---

## 7. Logs not showing (buffering)

**Fix:**

Either:

```python
print(..., flush=True)
```

or Dockerfile:

```dockerfile
ENV PYTHONUNBUFFERED=1
```

---

## 8. Confusion from devcontainer shell

**Problem:**
Terminal opened inside `node` container, not host.

**Fix:**

* Use `docker logs` to inspect other containers
* Run compose commands from WSL host:

```bash
cd /mnt/c/.../ArchiveML
docker compose ...
```

---

# ✅ Final Working Setup

## Dockerfile

```dockerfile
FROM python:3.11

WORKDIR /app

ENV PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    "transformers==4.51.3" \
    torch \
    sentencepiece \
    sacremoses

RUN pip install --no-cache-dir git+https://github.com/VarunGumma/IndicTransToolkit.git

COPY main.py .

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## main.py (key points)

```python
DEVICE = "cpu"  # important

HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")

tokenizer = AutoTokenizer.from_pretrained(..., token=HF_TOKEN)
model = AutoModelForSeq2SeqLM.from_pretrained(..., token=HF_TOKEN).to(DEVICE)
```

---

## Node client

```javascript
const INDICTRANS_URL = "http://indictrans:8000";
```

---

# 🧠 Key Lessons

* Docker networking issues can look like app bugs
* Devcontainers hide build/runtime context → always verify container
* Hugging Face models may require authentication
* Model loading at import time blocks server startup
* GPU adds complexity — start with CPU first
* Always confirm what code is actually inside the container

---

# 🎉 Final Result

```text
Input: Malayalam text
Output: English translation
```

System works end-to-end:

* container stable
* API reachable
* translation successful

