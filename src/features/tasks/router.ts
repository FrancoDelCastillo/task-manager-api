import {Router} from "express";
import * as taskController from "./controller";
import { authenticateUser } from "../../lib/auth";

const router = Router({ mergeParams: true });

router.use(authenticateUser);

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

export default router;