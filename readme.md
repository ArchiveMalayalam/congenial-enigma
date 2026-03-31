# ArchiveML

ArchiveML is a research project exploring how to digitize and make searchable **old Malayalam-language archival documents**, such as historical land records and government paperwork.

Many of these records exist only as aging paper documents or low-quality scans. Even when digitized, their contents remain locked inside images that cannot easily be searched.

ArchiveML aims to build a pipeline that converts these documents into **structured, searchable knowledge**.

The project combines **OCR, human review workflows, vector search, and language models** to make historical records accessible.

---

# Project Goals

ArchiveML focuses on solving several challenges related to historical documents:

* Extract text from **old Malayalam printed documents**
* Correct OCR errors through **human tagging workflows**
* Structure extracted information into usable data
* Enable **semantic search across archival records**

---

# Architecture Overview

ArchiveML is designed as a multi-stage pipeline.

### 1. OCR Extraction
Scanned document images are processed using OCR tools to extract text. This handles degraded scans and historical Malayalam typefaces.

### 2. Human Tagging Workflow
OCR results are reviewed and corrected. This allows contributors to fix mistakes and label important metadata.

### 3. Vector Database
Extracted text is stored in a **PostgreSQL** database (with vector support) to allow for semantic similarity searches.

### 4. LLM Retrieval Layer
A language model layer allows users to query the archive using natural language (e.g., "Find land records from this village in the 1950s").

---

# Running the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArchiveMalayalam/congenial-enigma
   cd ArchiveML
   ```

2. **Open in VS Code Dev Containers**
   * Press `Ctrl + Shift + P`
   * Run: `Dev Containers: Rebuild and Reopen in Container`

3. **Execute the OCR Pipeline**
   Once the container is ready, trigger the processing script to perform OCR on the sample documents and save them to the database:
   ```bash
   node scripts/ocr.js
   ```

---

# Viewing Results & Documentation

### 1. Documentation & Project Logs (Jekyll)
The project documentation, technical logs, and detailed research notes are served locally. 
* **Web URL:** [http://localhost:4000](http://localhost:4000)
* **Offline Access:** If the server is down, you can read the raw updates in `jekyll/_posts/`.

### 2. Database Verification (Manual Audit)
To verify that the OCR data has been successfully saved to the PostgreSQL backend, run the following commands in your terminal (using the active container ID `02d2a4a9e3f3`):

**View processed page counts:**
```bash
docker exec -it 02d2a4a9e3f3 psql -U archive_user -d ocr_results -c "SELECT doc_name, COUNT(page_number) FROM ocr_pages GROUP BY doc_name;"
```

**Preview extracted Malayalam text:**
```bash
docker exec -it 02d2a4a9e3f3 psql -U archive_user -d ocr_results -c "SELECT doc_name, substring(content from 1 for 100) AS snippet FROM ocr_pages LIMIT 5;"
```

---

# Project Status

ArchiveML is currently in early development. Current work focuses on the OCR pipeline, the document tagging workflow, and the retrieval system. Future updates will focus on fine-tuning accuracy for historical Malayalam scripts.