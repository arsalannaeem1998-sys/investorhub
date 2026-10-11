import { UserRole, CategoryKey } from "../constants";

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  status: "ACTIVE" | "SUSPENDED";
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface InvestorProfileDto {
  id: string;
  userId: string;
  investorType?: string | null;
  interests: string[];
  state?: string | null;
  riskProfile?: string | null;
}

export interface ProviderServiceDto {
  id: string;
  providerId: string;
  title: string;
  description: string;
  type?: string | null;
}

export interface TeamMemberDto {
  id: string;
  providerId: string;
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface VerificationDocumentDto {
  id: string;
  providerId: string;
  docType: "ABN" | "ACN" | "AFSL" | "ID" | "OTHER";
  fileUrl: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  reviewerNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface ProviderDto {
  id: string;
  ownerUserId: string;
  companyName: string;
  slug: string;
  category: CategoryKey;
  tagline: string;
  overview: string;
  specialities: string[];
  serviceRegions: string[];
  websiteUrl?: string | null;
  socialLinks?: Record<string, string> | null;
  contactEmail: string;
  contactPhone?: string | null;
  logoUrl?: string | null;
  minInvestment?: string | null;
  feeSummary?: string | null;
  riskProfile?: string | null;
  aumText?: string | null;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  verificationStatus: "UNVERIFIED" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
  verifiedBadge: boolean;
  isFeatured: boolean;
  featuredUntil?: string | null;
  avgRating: number;
  reviewCount: number;
  submittedAt?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectionReason?: string | null;
  providerDisclaimer?: string | null;
  createdAt: string;
  updatedAt: string;
  services?: ProviderServiceDto[];
  team?: TeamMemberDto[];
  documents?: VerificationDocumentDto[];
}

export interface EnquiryDto {
  id: string;
  investorId?: string | null;
  providerId: string;
  provider?: Partial<ProviderDto>;
  type: "ENQUIRY" | "CONSULTATION";
  message: string;
  preferredContactMethod?: "EMAIL" | "PHONE" | null;
  preferredTime?: string | null;
  investorName: string;
  investorEmail: string;
  investorPhone?: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKED" | "WON" | "LOST" | "SPAM";
  leadScore: number;
  aiSummary?: string | null;
  internalNotes?: string | null;
  source: string;
  createdAt: string;
  statusUpdatedAt: string;
}

export interface ReviewDto {
  id: string;
  providerId: string;
  providerName?: string;
  investorId: string;
  investorName?: string;
  rating: number;
  title: string;
  body: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";
  moderatedBy?: string | null;
  moderatedAt?: string | null;
  moderationNote?: string | null;
  aiFlag: boolean;
  aiFlagReason?: string | null;
  createdAt: string;
}

export interface ArticleDto {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string | null;
  categoryId: string;
  categoryName?: string;
  authorName: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags: string[];
  createdAt: string;
}

export interface AuditLogDto {
  id: string;
  actorId?: string | null;
  actorName?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  beforeJson?: any;
  afterJson?: any;
  ip?: string | null;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AiSearchFilterResult {
  rawQuery: string;
  category?: CategoryKey | null;
  specialities?: string[];
  region?: string | null;
  verifiedOnly?: boolean;
  minRating?: number | null;
  confidence: number;
  interpretationText: string;
}

export interface AiMatchRecommendation {
  provider: ProviderDto;
  matchScore: number;
  matchReason: string;
  keyStrengths: string[];
}
