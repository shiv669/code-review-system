import { db } from "./db.js";

async function test() {
  await db.run(
    `
    insert into users(username, email, password_hash, is_author, is_reviewer)
    values(?,?,?,?,?)
    `,
    [
      "shivam3",
      "example2@gmail.com",
      "hash3",
      1,
      1
    ]
  );
  const users = await db.all("select * from users");
  console.log(users);
}

test();