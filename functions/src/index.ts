import * as functions from "firebase-functions";
import "./admin";
import "firebase-functions";
import express, { Request, Response } from "express";
import cors from "cors";

import { commentsRouter, searchRouter, userRatingRouter } from "./routes";

const app = express();

app.use(cors());
app.use("/search", searchRouter);
app.use("/user-rating", userRatingRouter);
app.use("/comments", commentsRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ data: "all good" });
});

// Export API for gateway through Firbase Cloud Functions (Serverless)
exports.api = functions.https.onRequest(app);
