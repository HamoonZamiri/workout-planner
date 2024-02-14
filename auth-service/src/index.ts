import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 8081, () => {
  console.log("Listening on port " + (process.env.PORT || 8081));
});
