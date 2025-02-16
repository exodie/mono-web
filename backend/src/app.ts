import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();

app.use(cors());
app.use(json());

const PORT = process.env.PORT || 8001;

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Application listening on http://localhost:${PORT}`);
});
