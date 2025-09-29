import express from "express";
import type {Application} from "express";
import cors from "cors";
import boardRouter from "../features/boards/router";
import boardMembersRouter from "../features/boardMembers/router";
import taskRouter from "../features/tasks/router";
import profileRouter from "../features/profiles/router";

const app: Application = express();

app.use(cors({origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());

app.get("/api/v1/health", (_req, res)=>{
    res.json({ok: true})
})

app.get("/", (_req, res) => {
    res.redirect("/login");
  });
  
app.use("/boards", boardRouter);
app.use("/boards/:boardId/tasks", taskRouter);
app.use("/boards/:boardId/members", boardMembersRouter);
app.use("/profiles", profileRouter);

export default app;