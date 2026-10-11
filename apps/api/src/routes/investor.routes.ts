import { Router } from "express";
import {
  addFavourite,
  removeFavourite,
  getFavourites,
  getInvestorEnquiries,
} from "../controllers/investor.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/favourites/:providerId", addFavourite);
router.delete("/favourites/:providerId", removeFavourite);
router.get("/favourites", getFavourites);
router.get("/enquiries", getInvestorEnquiries);

export default router;
