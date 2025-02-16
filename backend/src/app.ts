import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";

import { api } from "./routes";

config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(json());

app.use("/api", api);

app.get("/", (_req, res) => {
  res.send({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Application listening on http://localhost:${PORT}`);
});
