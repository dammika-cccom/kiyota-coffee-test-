// Requirement: Professional Industry Standard Type Definitions
// Updated to support Cloudinary Image strings for QR Menus
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "DRINK" | "FOOD" | "MERCHANDISE";
  description: string;
  isAvailable: boolean;
  imageUrl?: string | null; // ADDED THIS: Fixes the 'Object literal' error
}

// This represents the JSONB structure in our coffee_shop table
export type ShopMenuData = MenuItem[];