import express from "express";
import { db } from "./db.js";

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{res.json({status: "ok"})});

app.listen(3000, ()=> {
  console.log("server is running");
});