import { Router } from "express";
import { getProviders, getProviderBySlug } from "../controllers/provider.controller";

const router = Router();

router.get("/", getProviders);
router.get("/:slug", getProviderBySlug);

export default router;
