import { db } from "./db.js";

async function usertest() {
  await db.run(
    `
    insert into users(username, email, password_hash, is_author, is_reviewer)
    values(?,?,?,?,?)
    `,
    [
      "shivam5",
      "example5@gmail.com",
      "hash5",
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
      1,
      "open"
    ]
  );
  const status = await db.all("select * from review_session");
  console.log(status);
}

reviewtest();