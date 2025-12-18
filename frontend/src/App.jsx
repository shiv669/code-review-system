import { useState } from "react";

const API = "https://b0f3713b-8529-405f-9355-6dcc12b6e7fd-00-263pxhsc8m6nb.pike.replit.dev";

function App() {
  // input state
  const [authorId, setAuthorId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [revisionId, setRevisionId] = useState("");
  const [codeSnapshot, setCodeSnapshot] = useState("");
  const [comment, setComment] = useState("");

  // output state
  const [output, setOutput] = useState(null);

  // create review session
  async function createSession() {
    const res = await fetch(`${API}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author_id: Number(authorId)
      })
    });

    const data = await res.json();
    setOutput(data);
  }

  // add revision to a session
  async function addRevision() {
    const res = await fetch(`${API}/sessions/${sessionId}/revisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code_snapshot: codeSnapshot
      })
    });

    const data = await res.json();
    setOutput(data);
  }

  // add comment to a revision
  async function addComment() {
    const res = await fetch(`${API}/revisions/${revisionId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(authorId),
        content: comment
      })
    });

    const data = await res.json();
    setOutput(data);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Code Review System Demo</h2>

      {/* Create Session */}
      <div>
        <h4>Create Review Session</h4>
        <input
          placeholder="Author ID"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />
        <button onClick={createSession}>Create Session</button>
      </div>

      {/* Add Revision */}
      <div>
        <h4>Add Revision</h4>
        <input
          placeholder="Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <textarea
          placeholder="Code snapshot"
          value={codeSnapshot}
          onChange={(e) => setCodeSnapshot(e.target.value)}
        />
        <button onClick={addRevision}>Add Revision</button>
      </div>

      {/* Add Comment */}
      <div>
        <h4>Add Comment</h4>
        <input
          placeholder="Revision ID"
          value={revisionId}
          onChange={(e) => setRevisionId(e.target.value)}
        />
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={addComment}>Add Comment</button>
      </div>

      {/* Backend response */}
      <h4>Backend Response</h4>
      <pre>
        {output && JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}

export default App;