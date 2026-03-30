export interface SensoryProduct {
  id: string;
  name: string;
  description: string | null;
  weightGrams: number;
  priceLkr: string | null;
  priceUsd: string | null;
  wholesalePriceLkr: string | null;
  wholesalePriceUsd: string | null;
  pricingLogic: "MANUAL" | "AUTO_CONVERT" | null;
  displayMode: "LKR_ONLY" | "USD_ONLY" | "BOTH" | null;
  category: "SPECIALTY_ARABICA" | "GREEN_BEANS" | "CEYLON_SPICES" | "EQUIPMENT" | "SAMPLE";
  scaScore: string | null;
  altitude: string | null;
  processingMethod: string | null;
  roastLevel: number | null;
  originRegion: string | null;
  slug: string;
  imageUrls: string[]; // Strictly non-nullable array
  isInquiryOnly: boolean | null;
  isRetailEnabled: boolean | null;
  isWholesaleOnly: boolean | null;
  visibility: "B2C_ONLY" | "B2B_ONLY" | "BOTH" | null;
  stockQuantity: number;
  moq: number | null;
  status: "NEW" | "COMING_SOON" | "SEASONAL" | "ACTIVE" | null;
}

