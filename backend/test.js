import { db } from "./db.js";

await db.run(
  "insert into users (username, email, password_hash, is_author, is_reviewer) values (?, ?, ?, ?, ?)",
  ["testuser", "test@example.com", "hash", 1, 1]
);