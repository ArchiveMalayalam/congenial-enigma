---
layout: post
title: "The Human Element in Digitizing Historical Records: Lessons from the Field"
date: 2026-03-31
categories: project
---
# The Human Element in Digitizing Historical Records: Lessons from the Field

## Introduction

This project began not with a model or a dataset, but with a visit.

At the Thiruvananthapuram Taluk Office, we were able to directly inspect historical land records dating back to the late 1960s. The documents were exactly what our project required: handwritten and printed records in Malayalam, preserved in their original form.

The setting itself underscored their significance. The office, housed in a heritage-style building with wooden rafters and tiled roofing, contained shelves filled with what appeared to be millions of archived documents. These were not digitized systems or curated datasets—they were physical records, aging but intact, representing decades of administrative history.

This visit confirmed both the existence and the accessibility—at least in principle—of a large, untapped corpus of historical data.

---

## Understanding the Gap in Digitization

During our visit, we spoke with staff at the Taluk office to better understand how land records are currently digitized in Kerala.

We were informed that modern systems rely primarily on **new surveys**, rather than digitizing legacy documents. Platforms such as *Ente Bhoomi* reflect updated land data, but do not incorporate these older, original records.

This revealed a critical gap:

* Historical land records remain largely undigitized
* Existing digital systems are not derived from archival sources
* There is no systematic effort to convert legacy documents into machine-readable formats

This gap is precisely where our project is positioned.

---

## Field Experience: Attempting Access

To build a pilot dataset, we sought permission to photograph a subset of these archival documents.

Initial interactions at the office level were mixed. Some staff members were cooperative and provided alternative contacts, while others appeared constrained by time, communication barriers, or uncertainty about the request. These inconsistencies highlighted how informal factors—such as language and perceived authority—can significantly influence access.

Despite these challenges, we were eventually able to secure a meeting with the Commissioner of Land Revenue.

---

## Institutional Perspective: Misaligned Expectations

In our meeting, we presented:

* A proof of concept demonstrating OCR applied to historical Malayalam text
* A proposed pilot involving approximately 500 documents
* A workflow for iterative correction and model improvement

The request was intentionally scoped as a low-risk, no-cost pilot for a hackathon.

However, the proposal was evaluated against criteria more appropriate for a full-scale deployment. We were asked to demonstrate how the approach would scale across all administrative units and large volumes of records.

Additionally, the problem itself was characterized as already solved, despite field evidence indicating that these specific archival documents remain undigitized.

---

## Key Challenges Identified

### 1. Risk Aversion in Public Institutions

Even small, experimental requests may be perceived as introducing administrative or reputational risk.

### 2. Expectation of Immediate Scalability

Early-stage prototypes are often evaluated as if they must already function at statewide scale, limiting opportunities for iterative development.

### 3. Communication and Language Barriers

Differences in language proficiency can affect clarity and engagement, sometimes resulting in indirect or non-committal responses.

### 4. Informal Gatekeeping

Access to resources is frequently mediated through individuals rather than transparent systems, making persistence and adaptability essential.

---

## Lessons for Future Work

From this experience, several strategies emerge:

* **Frame pilot projects as foundational steps toward institutional goals**
* **Align proposals with visible value for stakeholders**, such as documentation or public-facing outputs
* **Engage multiple points of contact** to reduce dependency on a single decision-maker
* **Incorporate non-technical barriers into project planning**, including delays and communication challenges

---

## Conclusion

Digitizing historical records is not solely a technical challenge. It requires navigating institutional structures, aligning incentives, and adapting to human dynamics that are often unpredictable.

Our experience demonstrates that while the data may exist and the technology may be ready, access depends on factors beyond either.

**In many cases, the hardest part of innovation is not building the system—it is reaching the data.**

---

## Appendix: Technical Context (Summary)

* Source: Pre-1971 land records in Malayalam
* Input Types: Handwritten and printed text
* Observed Condition: Physical archives stored in legacy infrastructure
* Current Systems: Based on new surveys, not archival digitization
* Approach: OCR + post-processing correction pipeline
* Goal: Build a high-quality dataset for fine-tuning models on historical Malayalam text

---
