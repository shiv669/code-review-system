import { db } from "./db.js";

async function usertest() {
  await db.run(
    `
    insert into users(username, email, password_hash, is_author, is_reviewer)
    values(?,?,?,?,?)
    `,
    [
      "shivam8",
      "example8@gmail.com",
      "hash8",
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
      4,
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
      1,
      1,
      1,
      "print(hello)"
    ]
  );
  const revision = await db.all("select * from revision")
  console.log(revision);
}

revisiontest();