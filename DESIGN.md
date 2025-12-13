# Design Notes and Learnings

This document describes how the system design evolved during development, the mistakes made early on, and how those mistakes were corrected. The goal of this project was not speed or feature count, but understanding how real code review systems are structured.

## Initial Design Mistakes

The first database schema design mixed responsibilities across tables.

Initially, there were separate tables for authors and reviewers, and login related tables were also considered. This created unnecessary duplication and confusion. Roles were treated as identities instead of capabilities.

Another early mistake was attempting to store code and review data in a single table. This approach made it unclear how code history should be preserved and how comments would remain meaningful after changes.

These designs would have led to overwritten history and ambiguous ownership.

## Correction and Key Design Decisions

### Single Users Table

The first major correction was consolidating all people into a single users table. A user can act as an author, reviewer, or both depending on context. Capability flags exist only to control permissions, not ownership.

Ownership is always explicit and stored using foreign keys, never inferred from role flags.

### Review Sessions as First Class Entities

A review session represents one complete review process started by an author. It is not tied to a single code snapshot or a reviewer.

The session exists independently and owns the lifecycle of the review. It starts when the author creates it and ends only when the author explicitly closes it.

This separation avoids fragmenting review history and matches real world workflows.

### Revisions as Immutable Snapshots

Initially, updating code in place seemed simpler. This was corrected after realizing that updating code would invalidate existing feedback.

Revisions were introduced as immutable snapshots of code. Each revision belongs to exactly one review session. Once created, a revision never changes.

All comments attach to a specific revision, which guarantees that feedback always refers to the correct version of code.

### Comments Tied to Revisions

Comments are written by users and always reference a specific revision. They may optionally reference a line number but are never moved when new revisions are created.

This design ensures that older comments remain accurate even as the code evolves.

## Final Data Model Overview

The final schema consists of four core tables.

Users store identity and capability information.

Review sessions store ownership and lifecycle state.

Revisions store immutable snapshots of code.

Comments store feedback linked to specific revisions.

The dependency order is strictly enforced:
users → review_sessions → revisions → comments

## Git and Development Workflow Learnings

The project was developed incrementally and pushed to Git early. Initial mistakes included committing local database files and editor configuration files.

These mistakes were corrected by properly using a gitignore file and committing fixes transparently.

Git authentication issues were encountered and resolved using modern token based authentication. This reinforced the importance of understanding tooling, not just writing code.

Commit history was kept incremental to reflect learning and iteration rather than presenting a finished project all at once.

## Key Learnings

Clear separation of responsibility in data models prevents ambiguity later.

Immutability is essential for preserving context in collaborative systems.

Ownership must always be explicit and never inferred.

Systems should rely on explicit state changes rather than interpreting human intent.

Clean tooling practices matter, but design clarity matters more.

This project reinforced that good system design is about making correct concepts obvious and mistakes difficult, not about adding features or complexity.