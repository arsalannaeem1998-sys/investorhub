import { Router } from "express";
import {
  getAdminDashboard,
  getAdminProviders,
  approveProvider,
  rejectProvider,
  toggleProviderVerification,
  getAuditLogs,
  exportProvidersCsv,
  exportEnquiriesCsv,
} from "../controllers/admin.controller";
import { getAdminEnquiries } from "../controllers/enquiry.controller";
import { getAdminReviews } from "../controllers/review.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireRole("ADMIN", "SUPER_ADMIN"));

// Dashboard KPIs & Analytics
router.get("/dashboard", getAdminDashboard);

// Providers Management & Verification Queue
router.get("/providers", getAdminProviders);
router.patch("/providers/:id/approve", approveProvider);
router.patch("/providers/:id/reject", rejectProvider);
router.patch("/providers/:id/verification", toggleProviderVerification);

// Central Leads Management
router.get("/enquiries", getAdminEnquiries);

// Reviews Moderation Queue
router.get("/reviews", getAdminReviews);

// Audit Trail
router.get("/audit-log", getAuditLogs);

// CSV Data Exports
router.get("/export/providers.csv", exportProvidersCsv);
router.get("/export/enquiries.csv", exportEnquiriesCsv);

export default router;
