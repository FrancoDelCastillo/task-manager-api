import { Router } from "express";
import { authenticateUser } from "../../lib/auth";
import {
  getBoardMembers,
  addBoardMember,
  removeBoardMember,
} from "./controller";

const router = Router({ mergeParams: true });

router.use(authenticateUser);

router.get("/", getBoardMembers);
router.post("/", addBoardMember);
router.delete("/", removeBoardMember);

export default router;