import { Router } from "express";
import {
  submitReview,
  getAdminReviews,
  moderateReview,
} from "../controllers/review.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Submit review for provider
router.post("/providers/:id", requireAuth, submitReview);

// Admin review moderation desk
router.get("/admin", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), getAdminReviews);
router.patch("/admin/:id", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), moderateReview);

export default router;
