import {Router} from "express";
import * as taskController from "./controller";
import { authenticateUser } from "../../lib/auth";

const router = Router();

// Apply authentication to all task routes
router.use(authenticateUser);

router.get("/board/:boardId", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;