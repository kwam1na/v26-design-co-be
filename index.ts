import * as dotenv from "dotenv";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { api } from "./api";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/submit", api.sendMessage);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
