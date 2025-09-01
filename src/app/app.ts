import express from "express";
import type {Application} from "express";
import cors from "cors";
import boardRouter from "../features/boards/router";
import taskRouter from "../features/tasks/router";

const app: Application = express();

app.use(cors({origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());

app.get("/api/v1/health", (_req, res)=>{
    res.json({ok: true})
})

app.use("/boards", boardRouter);
app.use("/tasks", taskRouter);

export default app;