import express from "express";
import { db } from "./db.js";

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{res.json({status: "ok"})});

app.post("/sessions", (req, res)=>{
  const { author_id } = req.body;
  try{
    const result = db.run(
      `
      insert into review_session(author_id, status)
      values(?,"open")
      `,
      [author_id]
    );
    res.status(201).json(
      {
        session_id: result.lastId
      }
    );
  } catch(error) {
    res.status(500).json(
      {
        error: error.message
      }
    );
  }
});

app.listen(3000, ()=> {
  console.log("server is running");
});