import { db } from "./db.js";

async function initDb() {
  // users
  await db.exec(`
    create table if not exists users (
      id integer primary key autoincrement,
      username text not null unique,
      email text not null unique,
      password_hash text not null,
      is_author boolean not null default 0,
      is_reviewer boolean not null default 0,
      created_at datetime not null default current_timestamp
    );
  `);

  // review sessions
  await db.exec(`
    create table if not exists review_sessions (
      id integer primary key autoincrement,
      author_id integer not null,
      status text not null check (status in ('open', 'closed')),
      created_at datetime not null default current_timestamp,
      closed_at datetime,

      foreign key (author_id) references users(id)
    );
  `);

  // revisions
  await db.exec(`
    create table if not exists revisions (
      id integer primary key autoincrement,
      review_session_id integer not null,
      revision_number integer not null,
      code_snapshot text not null,
      created_at datetime not null default current_timestamp,

      foreign key (review_session_id) references review_sessions(id),
      unique (review_session_id, revision_number)
    );
  `);

  // comments
  await db.exec(`
    create table if not exists comments (
      id integer primary key autoincrement,
      revision_id integer not null,
      user_id integer not null,
      line_number integer,
      content text not null,
      created_at datetime not null default current_timestamp,

      foreign key (revision_id) references revisions(id),
      foreign key (user_id) references users(id)
    );
  `);

  console.log("all tables created successfully");
}

initDb();