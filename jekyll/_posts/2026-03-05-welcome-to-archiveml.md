---
layout: post
title: "Introducing ArchiveML: Digitizing Old Malayalam Documents"
date: 2026-03-05
categories: project
---

# Introducing ArchiveML

ArchiveML is an experimental project focused on digitizing and making searchable old Malayalam-language government documents.

Across Kerala and other regions, many historical and administrative records still exist only as aging paper documents. These include land records, legal documents, and archival materials that are difficult to access, search, or analyze digitally. Even when scanned, the information inside them is often locked inside images.

ArchiveML explores how modern machine learning tools can help unlock these archives.

## The Goal

The goal of ArchiveML is simple:

**Turn scanned Malayalam documents into structured, searchable knowledge.**

Instead of manually reading hundreds of pages to find one record, users should be able to search and retrieve information quickly.

This project focuses particularly on older records where:

- The Malayalam script may be difficult for standard OCR systems
- Documents are low quality or degraded
- Metadata and indexing are missing

## The Pipeline

ArchiveML is structured as a multi-stage pipeline.

### 1. OCR Extraction

The first step is extracting text from scanned documents.

Older Malayalam documents present challenges such as:

- Degraded print quality  
- Historical typefaces  
- Irregular layouts  

ArchiveML experiments with OCR tools and fine-tuning approaches to improve extraction accuracy.

### 2. Human Tagging Workflow

OCR alone is rarely perfect, especially for historical documents.

To improve accuracy and create structured data, ArchiveML includes a **tagging workflow** where users review extracted text and annotate key fields. This process helps:

- Correct OCR errors
- Label important information
- Generate training data for improving the OCR models

### 3. Vector Database (RAG Storage)

Once text is extracted and structured, the documents are stored in a **vector database**.

This allows semantic search across the archive. Instead of exact keyword matches, users can retrieve documents based on meaning and context.

### 4. LLM Retrieval Layer

Finally, a language model layer allows users to query the archive in natural language.

For example:

- “Find land records from this village in the 1950s.”
- “Show documents related to this property owner.”

The system retrieves relevant documents and presents them in a readable format.

## Why This Matters

Many archival records remain effectively inaccessible because they exist only on paper.

Digitizing them does more than preserve history. It can:

- Reduce the time required to complete administrative processes
- Improve access to public records
- Make historical documents searchable and analyzable

ArchiveML is a small step toward unlocking these archives.

## Current Status

The project is currently in early development.

Current work focuses on:

- Building the OCR pipeline
- Creating a document tagging workflow
- Setting up a vector database for retrieval

Future posts will document the progress, technical challenges, and lessons learned along the way.

## Accessing the Data Layer

Since ArchiveML runs in a fully containerized environment, the data is stored in a persistent PostgreSQL instance. This ensures that the digitized text is decoupled from the application logic and can be exported or queried by other services.

To verify the OCR pipeline results during development, we use the following commands to interact directly with the database container.

### 1. Check Processing Progress
To see a summary of how many pages have been successfully digitized and stored, run:

`docker exec -it 02d2a4a9e3f3 psql -U archive_user -d ocr_results -c "SELECT doc_name, COUNT(page_number) as pages FROM ocr_pages GROUP BY doc_name;"`

### 2. Inspect Extracted Malayalam Text
To pull a sample of the raw OCR output directly from the database for quality checking:

`docker exec -it 02d2a4a9e3f3 psql -U archive_user -d ocr_results -c "SELECT doc_name, page_number, substring(content from 1 for 100) AS snippet FROM ocr_pages LIMIT 5;"`

### 3. Open an Interactive SQL Shell
For deep-diving into the records or performing manual data cleaning:

`docker exec -it 02d2a4a9e3f3 psql -U archive_user -d ocr_results`

*Note: Replace `02d2a4a9e3f3` with your current container ID if the stack is rebuilt.*

## Viewing the Documentation

The ArchiveML documentation and project logs are available in two formats depending on your environment:

### 1. Local Web Interface (Recommended)
If the Docker stack is running, you can view the fully rendered documentation, including technical logs and project updates, at:

**[http://localhost:4000](http://localhost:4000)**

*Note: Jekyll may take 1-2 minutes to initialize on the first boot as it builds the site from source.*

### 2. Raw Markdown Files
If you are browsing the source code directly or the web server is offline, all project posts and documentation are stored as human-readable Markdown files in the repository:

**`archiveml/jekyll/_posts/`**

These files contain the full technical history of the project, including OCR configurations and database schema designs, and can be read in any text editor or GitHub's file viewer.