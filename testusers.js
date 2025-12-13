import { db } from "./db.js";

async function usertest() {
  await db.run(
    `
    insert into users(username, email, password_hash, is_author, is_reviewer)
    values(?,?,?,?,?)
    `,
    [
      "shivam01",
      "example01@gmail.com",
      "hash01",
      1,
      1
    ]
  );
  const users = await db.all("select * from users");
  console.log(users);
}

usertest();

async function reviewtest(){
  await db.run(
    `
    insert into review_session(author_id,status)
    values(?,?)
    `,
    [
      7,
      "open"
    ]
  );
  const status = await db.all("select * from review_session");
  console.log(status);
}

reviewtest();

async function revisiontest(){
  await db.run(
    `
    insert into revision(revision_id, review_session_id, revision_number,code_snapshot)
    values(?,?,?,?)
    `,
    [
      3,
      3,
      3,
      "print(hello)"
    ]
  );
  const revision = await db.all("select * from revision")
  console.log(revision);
}

revisiontest();

async function commenttest(){
  await db.run(
    `
    insert into comments(revision_id_no, user_id, content)
    values(?,?,?)
    `,
    [
      2,
      2,
      "its easy bro"
    ]
  );
  const comment = await db.all("select * from comments")
  console.log(comment);
}

commenttest();