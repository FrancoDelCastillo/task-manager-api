import { Router } from "express";
import { authenticateUser } from "../../lib/auth";
import { getProfile, updateProfile } from "./controller";

const router = Router();

router.use(authenticateUser);

router.get("/:profileId", getProfile);
router.put("/:profileId", updateProfile);

export default router;