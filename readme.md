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

The long-term goal is to make large collections of historical documents **searchable and explorable**.

---

# Architecture Overview

ArchiveML is designed as a multi-stage pipeline.

### 1. OCR Extraction

Scanned document images are processed using OCR tools to extract text.

Older Malayalam documents present challenges such as:

* degraded scans
* historical typefaces
* inconsistent layouts

Improving OCR accuracy is a key focus of the project.

---

### 2. Human Tagging Workflow

OCR results are reviewed and corrected through a tagging workflow.

This allows contributors to:

* fix OCR mistakes
* label important information
* generate training data to improve OCR models

---

### 3. Vector Database

Extracted text is stored in a vector database.

This allows documents to be searched based on **semantic similarity**, not just exact keywords.

---

### 4. LLM Retrieval Layer

A language model layer allows users to query the archive using natural language.

Example queries:

* "Find land records from this village in the 1950s"
* "Show documents related to this property owner"

The system retrieves and summarizes relevant documents.

---

# Development Environment

This repository uses **VS Code Dev Containers** to provide a reproducible development environment.

All dependencies are installed automatically inside the container.

## Requirements

You will need:

* Docker
* VS Code
* Dev Containers extension

---

# Running the Project

1. Clone the repository

```
git clone https://github.com/ArchiveMalayalam/congenial-enigma
cd ArchiveML
```

2. Open the folder in **VS Code**

3. Open the command palette

```
Ctrl + Shift + P
```

4. Run

```
Dev Containers: Rebuild and Reopen in Container
```

VS Code will build the development container and reopen the project inside it.

Once the container finishes building, the development environment will be ready to use.
1. Documentation (Jekyll): http://localhost:4000/
---

# Project Status

ArchiveML is currently in early development.

Current work focuses on:

* OCR pipeline experimentation
* building a document tagging workflow
* designing the retrieval pipeline

Future work will explore improving OCR accuracy for historical Malayalam documents and scaling the archive search system.