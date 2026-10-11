"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CATEGORIES } from "@investorhub/shared";

export default function CategorySlugRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  useEffect(() => {
    // Map URL slug to Category Enum
    const formatted = slug.toUpperCase().replace(/-/g, "_");
    const matchedCategory = Object.values(CATEGORIES).find(
      (cat) => cat === formatted || cat.replace(/_/g, "") === formatted.replace(/_/g, "")
    );

    if (matchedCategory) {
      router.replace(`/providers?category=${matchedCategory}`);
    } else {
      router.replace("/providers");
    }
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-[#070D1F] flex items-center justify-center text-slate-400 text-xs">
      Loading category...
    </div>
  );
}
