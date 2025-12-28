import { db } from "./db.js";

const tables = await db.all(
  "select name from sqlite_master where type='table' and name not like 'sqlite_%'"
);

for (const { name } of tables) {
  const rows = await db.all(`select * from ${name}`);
  console.log(`\n${name}`);
  console.table(rows);
}
