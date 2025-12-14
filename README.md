# Code Review System

This project is a minimal backend implementation of a code review workflow.  
It focuses on **how code review systems preserve context over time**, rather than on UI, automation, or feature count.

The goal of the project was to understand how real review systems model state, history, and feedback in a way that avoids ambiguity as code evolves.

---

## Motivation

While learning software engineering, I noticed that many projects emphasize features without addressing how teams actually reason about code changes and feedback.

Code review is fundamentally about **preserving meaning over time**:
- feedback should always refer to the exact version of code it was written for
- history should never be overwritten
- system state should be explicit, not implied

This project was built to explore those ideas from first principles.

---

## Core Workflow

The system models a simple but realistic review lifecycle:

1. An author creates a review session
2. The author submits code as immutable revisions
3. Reviewers add comments tied to specific revisions and optional line numbers
4. The author closes the session when review is complete
5. No further changes are allowed after closure

All actions are validated against system state to prevent invalid transitions.

---

## Key Design Principles

### Immutability

Code is never updated in place.  
Each change creates a new revision that permanently preserves the previous state.

This ensures that comments and feedback always remain meaningful.

---

### Explicit State

Review sessions have a clearly defined lifecycle:
- open
- closed

All backend logic checks state explicitly before allowing mutations.  
The system does not rely on assumptions or inferred intent.

---

### Contextual Feedback

Comments are attached to **revisions**, not sessions.  
This guarantees that feedback always refers to a specific snapshot of code.

Older comments are never moved or reinterpreted when new revisions are created.

---

### Clear Ownership

Users are modeled as a single entity.  
A user can act as an author or reviewer depending on context.

Ownership and relationships are always explicit through foreign keys.

---

## Technical Overview

- **Backend**: Node.js with Express
- **Database**: SQLite (relational schema, portable by design)
- **Architecture**: Monolithic backend focused on clarity
- **State Management**: Backend-enforced, not client-assumed

The project intentionally avoids:
- authentication
- real-time collaboration
- automation
- AI assistance

This keeps the focus on system behavior and data modeling.

---

## What This Project Demonstrates

- Designing state-driven backend systems
- Modeling immutable history correctly
- Using relational data to preserve context
- Enforcing business rules explicitly in code
- Translating real-world workflows into schemas and APIs

---

## Development Approach

The project was built incrementally, with frequent validation and iteration.

Mistakes were made intentionally visible in the design process, including:
- incorrect early schemas
- misuse of database constraints
- async and SQL syntax errors

Each mistake informed a clearer and more correct design.

A detailed explanation of these decisions and corrections is documented in `DESIGN.md`.

---

## Status

The core system is complete:
- review sessions
- immutable revisions
- revision-scoped comments
- explicit session closure

The project is intentionally frozen at this stage to preserve clarity and correctness.

---

## Purpose

This repository represents a learning-focused system design exercise.  
It prioritizes understanding over completeness and correctness over scale.

The goal was not to build a production platform, but to deeply understand how one *should* be structured.