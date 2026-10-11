import { z } from "zod";
import { CATEGORIES, USER_ROLES } from "../constants";

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  role: z.enum([USER_ROLES.INVESTOR, USER_ROLES.PROVIDER]).default(USER_ROLES.INVESTOR),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Enquiry Schema
export const createEnquirySchema = z.object({
  providerId: z.string().uuid("Invalid provider ID"),
  type: z.enum(["ENQUIRY", "CONSULTATION"]).default("ENQUIRY"),
  message: z.string().min(10, "Please provide at least 10 characters describing your inquiry"),
  investorName: z.string().min(2, "Your name is required"),
  investorEmail: z.string().email("Valid email is required"),
  investorPhone: z.string().optional(),
  preferredContactMethod: z.enum(["EMAIL", "PHONE"]).default("EMAIL"),
  preferredTime: z.string().optional(),
  source: z.string().default("DIRECT"),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "BOOKED", "WON", "LOST", "SPAM"]),
  internalNotes: z.string().optional(),
});

// Review Schema
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  body: z.string().min(15, "Review details must be at least 15 characters").max(1500),
});

export const moderateReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "FLAGGED"]),
  moderationNote: z.string().optional(),
});

// Provider Application & Edit Schemas
export const providerApplySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  category: z.nativeEnum(CATEGORIES),
  tagline: z.string().min(5, "Tagline is required").max(160),
  overview: z.string().min(30, "Please provide an overview of at least 30 characters"),
  specialities: z.array(z.string()).min(1, "Select at least one speciality"),
  serviceRegions: z.array(z.string()).min(1, "Select at least one service region"),
  contactEmail: z.string().email("Valid business email is required"),
  contactPhone: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  minInvestment: z.string().optional(),
  feeSummary: z.string().optional(),
  aumText: z.string().optional(),
  riskProfile: z.string().optional(),
});

export const adminProviderApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
  rejectionReason: z.string().optional(),
  verifiedBadge: z.boolean().optional(),
  verificationStatus: z.enum(["UNVERIFIED", "IN_REVIEW", "VERIFIED", "REJECTED"]).optional(),
});

// Article Schema
export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt is required"),
  body: z.string().min(20, "Content body is required"),
  categoryId: z.string().uuid(),
  authorName: z.string().min(2),
  coverImageUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// AI Search Schema
export const aiSearchSchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters"),
});

// AI Match Wizard Schema
export const aiMatchWizardSchema = z.object({
  investorType: z.string().min(1),
  goal: z.string().min(1),
  experienceLevel: z.string().min(1),
  region: z.string().min(1),
  category: z.string().optional(),
});
