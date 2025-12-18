import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

/*
  create review session
*/
app.post("/sessions", async (req, res) => {
  try {
    const { author_id } = req.body;

    const result = await db.run(
      `
      insert into review_sessions (author_id, status)
      values (?, 'open')
      `,
      [author_id]
    );

    res.status(201).json({
      session_id: result.lastID
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
  add revision to a session
*/
app.post("/sessions/:id/revisions", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { code_snapshot } = req.body;

    if (!code_snapshot) {
      return res.status(400).json({
        error: "code snapshot is required"
      });
    }

    const session = await db.get(
      `
      select * from review_sessions
      where id = ?
      `,
      [sessionId]
    );

    if (!session) {
      return res.status(404).json({
        error: "session not found"
      });
    }

    if (session.status === "closed") {
      return res.status(409).json({
        error: "session is closed"
      });
    }

    const last = await db.get(
      `
      select max(revision_number) as last_revision
      from revisions
      where review_session_id = ?
      `,
      [sessionId]
    );

    const nextRevisionNumber =
      last.last_revision === null ? 1 : last.last_revision + 1;

    const result = await db.run(
      `
      insert into revisions
        (review_session_id, revision_number, code_snapshot)
      values (?, ?, ?)
      `,
      [sessionId, nextRevisionNumber, code_snapshot]
    );

    res.status(201).json({
      revision_id: result.lastID,
      revision_number: nextRevisionNumber
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
  add comment to a revision
*/
app.post("/revisions/:id/comments", async (req, res) => {
  try {
    const revisionId = req.params.id;
    const { user_id, content, line_number } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "comment is required"
      });
    }

    const revision = await db.get(
      `
      select * from revisions
      where id = ?
      `,
      [revisionId]
    );

    if (!revision) {
      return res.status(404).json({
        error: "revision not found"
      });
    }

    const session = await db.get(
      `
      select status from review_sessions
      where id = ?
      `,
      [revision.review_session_id]
    );

    if (session.status === "closed") {
      return res.status(409).json({
        error: "session is closed"
      });
    }

    const result = await db.run(
      `
      insert into comments
        (revision_id, user_id, line_number, content)
      values (?, ?, ?, ?)
      `,
      [revisionId, user_id, line_number ?? null, content]
    );

    res.status(201).json({
      comment_id: result.lastID
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});