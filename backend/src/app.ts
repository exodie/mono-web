import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { api } from "./routes";
import { getSwaggerOptions } from "./config/swagger";

config();

const app = express();
const PORT = process.env.PORT || 8001;

const swaggerOptions = getSwaggerOptions;

const SWAGGER_OPTIONS = swaggerJSDoc(swaggerOptions(Number(PORT)));

app.use(cors());
app.use(json());
app.use(morgan("[HTTP] :method :url :status - :response-time ms"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SWAGGER_OPTIONS));
app.use("/api", api);

app.get("/", (_req, res) => {
  res.send({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Application listening on http://localhost:${PORT}`);
});
