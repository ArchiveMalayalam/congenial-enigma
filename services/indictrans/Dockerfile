FROM python:3.11

WORKDIR /app

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