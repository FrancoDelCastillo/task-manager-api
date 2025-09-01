import { Router } from "express";
import * as boardController from "./controller";
import { authenticateUser } from "../../lib/auth";

const router = Router();

// Apply authentication to all board routes
router.use(authenticateUser);

router.get("/", boardController.getBoards);
router.post("/", boardController.createBoard);
router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);

export default router;