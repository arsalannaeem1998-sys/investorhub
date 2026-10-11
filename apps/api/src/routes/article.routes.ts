import { Router } from "express";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
} from "../controllers/article.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.post("/admin", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), createArticle);

export default router;
