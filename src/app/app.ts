import express from "express";
import type { Application } from "express";
import cors from "cors";

import boardRouter from "../features/boards/router";
import boardMembersRouter from "../features/boardMembers/router";
import taskRouter from "../features/tasks/router";
import profileRouter from "../features/profiles/router";

const app: Application = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://task-manager-web-sigma.vercel.app"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed for this origin"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/api/v1/health", (_req, res) => {
    res.json({ ok: true })
})

app.get("/", (_req, res) => {
    res.redirect("/login");
});

// Routes
app.use("/boards", boardRouter);
app.use("/boards/:boardId/tasks", taskRouter);
app.use("/boards/:boardId/members", boardMembersRouter);
app.use("/profiles", profileRouter);

export default app;