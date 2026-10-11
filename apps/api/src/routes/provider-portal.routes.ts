import { Router } from "express";
import {
  getProviderProfile,
  applyOrUpdateProvider,
  uploadDocument,
  getProviderStats,
} from "../controllers/provider-portal.controller";
import {
  getProviderEnquiries,
  updateProviderEnquiry,
} from "../controllers/enquiry.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireRole("PROVIDER", "ADMIN", "SUPER_ADMIN"));

router.get("/profile", getProviderProfile);
router.post("/apply", applyOrUpdateProvider);
router.put("/profile", applyOrUpdateProvider);
router.post("/documents", uploadDocument);
router.get("/stats", getProviderStats);

// Lead CRM endpoints
router.get("/enquiries", getProviderEnquiries);
router.patch("/enquiries/:id", updateProviderEnquiry);

export default router;
