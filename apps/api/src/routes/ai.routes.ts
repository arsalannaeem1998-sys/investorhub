import { Router } from "express";
import {
  aiSearch,
  aiMatch,
  aiCompareSummary,
  aiChat,
} from "../controllers/ai.controller";

const router = Router();

router.post("/search", aiSearch);
router.post("/match", aiMatch);
router.post("/compare-summary", aiCompareSummary);
router.post("/chat", aiChat);

export default router;
