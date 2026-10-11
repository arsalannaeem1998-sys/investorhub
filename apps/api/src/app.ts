import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { getCorsOrigins } from "./cors-origins";
import authRoutes from "./routes/auth.routes";
import providerRoutes from "./routes/provider.routes";
import providerPortalRoutes from "./routes/provider-portal.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import reviewRoutes from "./routes/review.routes";
import categoryRoutes from "./routes/category.routes";
import homeRoutes from "./routes/home.routes";
import adminRoutes from "./routes/admin.routes";
import articleRoutes from "./routes/article.routes";
import aiRoutes from "./routes/ai.routes";
import investorRoutes from "./routes/investor.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "InvestorHub Australia API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/providers", providerRoutes);
app.use("/api/v1/provider", providerPortalRoutes);
app.use("/api/v1/enquiries", enquiryRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/home", homeRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/investor", investorRoutes);

export default app;
