---
layout: post
title: "LLM & AI Disclosure"
date: 2026-03-31
categories: project
---
# LLM & AI Disclosure

This project was developed using a **"Human-in-the-Loop" AI Orchestration** model. We utilized LLMs—including **ChatGPT, Claude, and Gemini**—as specialized pair programmers to accelerate prototyping and brainstorm infrastructure patterns.

### The Role of AI in Our Process
While AI suggested various paths, the final architectural decisions and every line of code were strictly overseen, audited, and refined by the human team. The AI acted as a sounding board, while the humans acted as the **System Architects**.

### Strategic Architectural Pivots
Our interaction with AI was a process of "Calculated Rejection." The AI provided a broad map of possibilities, which allowed us to identify and avoid technical debt early:

* **The Qdrant Pivot:** Early AI suggestions leaned toward **Qdrant** for vector storage. While powerful, we determined that for our current phase of Digital Archiving, a high-performance relational database was more appropriate for data integrity.
* **The SQLite vs. Portability Battle:** AI suggested **SQLite** for its simplicity. However, our rigorous evaluation revealed that SQLite required local C++ compilation and specific machine bindings. 
* **The Decision:** In alignment with our **Core Philosophy**, we rejected SQLite to avoid the "it works on my machine" trap. We opted instead for **PostgreSQL** delivered via official, pre-built Docker images.

### Our Engineering Philosophy: "Binary-First Portability"
We maintained a strict rule throughout the hackathon: **No local compilation.** By refusing to install C++ build tools or compile binaries from source, we ensured that our stack remains 100% portable. If you have Docker, our project will run exactly as intended—regardless of your OS or local environment.

