import { Router } from "express";
import { authenticateUser } from "../../lib/auth";
import {
  getBoardMembers,
  getUserRoleInBoard,
  addBoardMember,
  removeBoardMember,
} from "./controller";

const router = Router({ mergeParams: true });

router.use(authenticateUser);

router.get("/", getBoardMembers);
router.get("/role", getUserRoleInBoard);
router.post("/", addBoardMember);
router.delete("/", removeBoardMember);

export default router;