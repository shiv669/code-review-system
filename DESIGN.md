# Design Notes and Learnings

This document captures the real design journey of the project. It intentionally documents incorrect assumptions, flawed reasoning, syntax mistakes, integration errors, and how each of them was corrected.

The purpose of this project was not to build a large system quickly, but to understand how a real code review workflow should be modeled, implemented, enforced, and exercised end to end.

The final design is the result of multiple iterations, failures, and corrections.

---

## Early Conceptual Mistakes

### Treating Roles as Separate Identities

The earliest design attempted to separate authors and reviewers into different tables, along with ideas for separate login tables. This approach was fundamentally flawed.

The mistake was thinking of roles as identities instead of capabilities. In reality, a person can be an author in one context and a reviewer in another. Treating them as separate entities caused duplication, unclear ownership, and unnecessary complexity.

This was corrected by introducing a single users table where roles are represented as capability flags rather than separate identities. Ownership is always explicit and stored via foreign keys, never inferred from role flags.

---

### Trying to Combine Code and Reviews in One Table

Another early mistake was attempting to store code, reviews, and feedback in a single table. While this looked simpler at first, it quickly became clear that this approach destroys history.

If code is updated in place, existing comments and feedback lose their meaning. There is no longer a guarantee that a comment refers to the version of code it was written for.

This mistake forced a re-evaluation of how real review systems preserve context.

---

## Core Design Corrections

### Review Sessions as First-Class State

The introduction of the review_sessions table was a major conceptual correction.

A review session represents the entire lifecycle of a review initiated by an author. It is not tied to a single code snapshot or a single reviewer. It exists independently and owns the review’s state.

A session has exactly two states:
- open
- closed

Only the author can close a session.  
Once closed, no further revisions or comments are allowed.

This explicit lifecycle prevents ambiguous behavior and makes the system state-driven instead of intention-driven.

---

### Revisions as Immutable Snapshots

Initially, updating code directly felt intuitive. This was wrong.

The key realization was that immutability is essential in collaborative systems. Once feedback is given, the code it refers to must never change.

Revisions were introduced as immutable snapshots. Each revision:
- belongs to exactly one review session
- has a strictly increasing revision number per session
- is never updated or deleted

Revision numbers are derived by the backend from existing state, never provided by the client. This avoids race conditions and enforces correctness at the system level.

---

### Comments Bound to Revisions, Not Sessions

Another incorrect assumption was that comments could belong directly to sessions. This breaks down once multiple revisions exist.

Comments were correctly modeled as immutable annotations tied to a specific revision. Optionally, a comment may reference a line number, but it always belongs to one snapshot of code.

This ensures that comments remain accurate even after new revisions are created.

---

## Backend Logic and State Enforcement

### Avoiding Database Errors as Business Logic

An early mistake was relying on database constraint failures to implicitly enforce business rules.

This approach was corrected by explicitly querying and validating system state in the backend before performing mutations. The backend deliberately checks:
- whether a session exists
- whether it is open or closed
- whether a revision exists
- whether new actions are allowed

Database constraints are used for integrity, not control flow.

---

### Syntax and Async Errors During Development

Several implementation mistakes were made and corrected:
- forgetting to mark route handlers as async
- forgetting to await database operations
- using db.all instead of db.run for insert operations
- writing malformed SQL queries
- mismatching table and column names across files
- missing return statements after error responses

These errors reinforced the importance of understanding asynchronous control flow and database APIs instead of copying patterns mechanically.

---

## Endpoint Evolution

Each endpoint was designed incrementally and validated through real HTTP requests.

### Creating a Review Session

A session can only be created if the author exists. The backend returns the created session identifier and does not rely on success messages.

---

### Adding Revisions

Revisions are created only if the session exists and is open. The revision number is derived from existing revisions. This endpoint enforces immutability and state-based transitions.

---

### Adding Comments

Comments can only be added to existing revisions whose parent session is open. Comments are insert-only and never edited or deleted.

This ensures that feedback remains historically accurate.

---

## Frontend Integration Learnings

A minimal React frontend was added late in the project to exercise backend endpoints and visualize the review lifecycle.

### Initial Frontend Assumptions

Early frontend attempts failed due to incorrect assumptions:
- assuming localhost URLs would work unchanged on Replit
- forgetting that browsers enforce CORS
- not handling non-JSON error responses
- assuming backend tables existed without running initialization scripts

These issues initially appeared as “frontend bugs” but were actually integration and environment problems.

---

### Environment and Deployment Corrections

Several key corrections were made:
- explicitly enabling CORS in the backend
- aligning frontend API URLs with Replit’s public backend URL
- removing trailing slashes that caused route mismatches
- understanding that deleting a SQLite file deletes the entire schema
- explicitly running initDb.js to create tables before starting the server

This reinforced the distinction between local development assumptions and deployed environments.

---

### Frontend Scope Deliberately Limited

The frontend was intentionally kept minimal:
- no authentication
- no UI validation
- no derived state or client-side rules

All business logic remains in the backend. The frontend acts only as a thin interface to exercise system behavior and display raw backend responses.

---

## Final Data Model

The final system consists of four core tables with strict dependency order:

- users
- review_sessions
- revisions
- comments

Dependencies flow in one direction only:

users → review_sessions → revisions → comments

This structure makes invalid states difficult to represent and valid states easy to reason about.

---

## Data Flow and Entity Relationships

The diagram below provides a visual overview of the final system design and how data flows through the backend.

It highlights the strict ownership and dependency order between entities, the immutability of revisions, and how all feedback remains permanently tied to the exact code snapshot it refers to.

![Data flow and entity relationship diagram](design-flow.png)

---

## Tooling and Workflow Learnings

The project was committed incrementally to Git to reflect learning rather than presenting a polished history.

Mistakes included:
- committing local database files
- committing editor configuration files
- git authentication and identity issues
- rebasing mistakes during cleanup

These were corrected transparently using proper gitignore usage, token-based authentication, and history cleanup. The commit history reflects real iteration rather than artificial cleanliness.

---

## Docker and Environment Design Decisions

Docker was introduced late in the project to formalize runtime assumptions and system boundaries.

The goal was not deployment or optimization, but **reproducibility and clarity**.

---

### Separate Containers for Frontend and Backend

The frontend and backend are dockerized as separate services.

This reflects the fact that they are independent programs with different responsibilities, lifecycles, and runtime concerns. Combining them into a single container would obscure these boundaries and reduce clarity.

Each Dockerfile defines exactly one responsibility:
- the backend container runs the API server
- the frontend container runs the UI used to exercise backend behavior

---

### Environment Configuration via Docker Compose

Docker Compose is used to define how services communicate.

Instead of hardcoding API URLs, the frontend receives the backend address through environment variables. This mirrors how real systems adapt behavior across environments without code changes.

Within Docker, services communicate using service names rather than localhost. This reinforces a correct mental model of distributed systems and network boundaries.

---

### Docker as Specification, Not Deployment

The Docker configuration is treated as a declarative specification rather than a mandatory execution environment.

In environments where Docker execution is not available, the configuration still serves important purposes:
- documenting runtime assumptions
- defining startup commands
- making environment dependencies explicit

This approach prioritizes correctness and understanding over forced execution.

---

### Key Insight

Introducing Docker clarified the distinction between:
- application logic
- runtime environment
- deployment constraints

This reinforced the importance of separating concerns and designing systems that remain understandable even when execution environments vary.

---

## Key Learnings

- clear data modeling prevents entire classes of bugs
- immutability preserves meaning in collaborative systems
- backend systems should be state-driven, not intention-driven
- APIs should return state, not success messages
- frontend bugs often originate from backend or environment mismatches
- explicit logic in code is preferable to implicit behavior in databases

Most importantly, good system design is not about adding features, but about making incorrect behavior impossible and correct behavior obvious.