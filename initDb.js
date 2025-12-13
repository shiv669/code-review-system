import { db } from "./db.js";

async function init(){
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
  console.log("user table created");
}

init();

async function reviewinit() {
  await db.exec(
    `
    create table if not exists review_session(
    session_id integer primary key autoincrement,
    author_id integer not null,
    status text not null check(status in ('open','closed')),
    created_at datetime not null default current_timestamp,
    closed_at datetime,

    foreign key(author_id) references users(id)
    );
    `
  );
}

reviewinit();

async function revision(){
  await db.exec(
    `
    create table if not exists revision(
    revision_id integer primary key autoincrement,
    review_session_id integer not null,
    revision_number integer not null,
    code_snapshot text not null,
    created_at datetime not null default current_timestamp,
    foreign key(review_session_id) references review_session(session_id)
    unique(review_session_id, revision_number)
    );
    `
  );
}

revision();