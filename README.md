# Code Review System

This project explores how code review systems work at a fundamental level. The goal is to understand how teams reason about code changes, feedback, and history rather than to build a feature rich platform.

## Motivation

While learning software engineering, I noticed that many projects focus on building features without thinking deeply about how code is reviewed and changed over time. I built this project to understand how review workflows preserve context and how design choices affect collaboration.

## What the system does

An author can submit a piece of code for review.

Each time the code changes, a new snapshot is created instead of modifying the previous one.

Reviewers can leave feedback that refers to a specific version of the code and specific lines.

Older versions and comments are kept so that past feedback never becomes confusing or misleading.

## Key ideas explored

The project focuses on treating code versions as immutable records.

Feedback is always tied to the exact version of code it refers to.

Users are modeled as a single entity that can act as an author or reviewer depending on context.

The system is built as a simple monolithic application to avoid unnecessary complexity.

## Design choices

Code is never updated in place because changing old code would break the meaning of existing feedback.

Automation and real time editing are intentionally avoided so the focus stays on data modeling and system behavior.

SQLite is used to keep setup simple while still working with a relational schema that could be moved to another database later.

## Current progress

The database schema is implemented.

User creation and querying are working.

Basic data flow between the application and the database is in place.

## What I am learning

How relational data models represent real world workflows.

Why preserving history matters in collaborative systems.

How small design decisions affect clarity and correctness over time.

## Next steps

Add review session support.

Add immutable code revisions.

Add line based review comments.

Improve validation and error handling.

This project is part of my learning process and is being built incrementally with a focus on understanding rather than completeness. 