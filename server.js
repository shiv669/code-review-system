import express from "express";
import { db } from "./db.js";

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{res.json({status: "ok"})});

app.post("/sessions", async (req, res)=>{
  const { author_id } = req.body;
  try{
    const result = await db.run(
      `
      insert into review_sessions(author_id, status)
      values(?,'open')
      `,
      [author_id]
    );
    res.status(201).json(
      {
        session_id: result.lastID
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

app.post("/sessions/:id/revisions", async (req, res) => {
  try{
    const session_id = req.params.id;
    const { code_snapshot } = req.body;
    if(!code_snapshot){
      return res.status(400).json({
        error:"code snapshot is required"
      })
    }
    const session = await db.get(
      "select * from review_sessions where id = ?",
      [session_id]
    );
    if(!session){
      return res.status(404).json({
        error: "session not found"
      });
    }
    if(session.status == "closed"){
      return res.status(409).json({
        error: "session is closed"
      });
    }

    const last = await db.get(
      "select max(revision_number) as last_revision from revisions where review_session_id = ?",
      [session_id]
    );

    let new_revision;
    if(last.last_revision === null){
      new_revision = 1;
    }else{
      new_revision = last.last_revision + 1;
    }

    const result = await db.run(
      `
      insert into revisions(review_session_id, revision_number, code_snapshot)
      values(?,?,?)`,
      [session_id, new_revision, code_snapshot]

    );

    res.status(201).json({
      revision_id: result.lastID,
      revision_number: new_revision
    });
    
  }catch(error){
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000, ()=> {
  console.log("server is running");
});