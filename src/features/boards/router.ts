import { Router } from "express";
import * as boardController from "./controller";
import { authenticateUser } from "../../lib/auth";

const router = Router();

router.use(authenticateUser);

router.get("/", boardController.getBoards);
router.post("/", boardController.createBoard);
router.put("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);

export default router;