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