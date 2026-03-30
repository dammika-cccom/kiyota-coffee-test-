"use server";

import { db } from "@/db";
import { coffeeShops, orders, lots, shippingRates, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { MenuItem, ShopMenuData } from "@/types/retail";

// --- STRICT TYPES ---
export type ShopState = {
  error?: string;
  success?: string;
};

/**
 * 1. EXISTING: ADD SHOP LOCATION (Preserved)
 */
export async function addShop(prevState: ShopState, formData: FormData): Promise<ShopState> {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  if (!name || !location) return { error: "Name and City are mandatory." };

  try {
    await db.insert(coffeeShops).values({
      name,
      location,
      menuData: [],
    });
    revalidatePath("/admin/shops");
    return { success: `Successfully added ${name}.` };
  } catch (err) {
    console.error("Add Shop Error:", err);
    return { error: "Failed to add shop. Ensure the name is unique." };
  }
}

/**
 * 2. EXISTING: ADD MENU ITEM (Preserved & Enhanced for B2C QR Menu)
 */
export async function addMenuItemToShop(
  shopId: string, 
  prevState: ShopState, 
  formData: FormData
): Promise<ShopState> {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as MenuItem["category"];
  const imageUrl = formData.get("imageUrl") as string;

  try {
    const [shop] = await db.select().from(coffeeShops).where(eq(coffeeShops.id, shopId)).limit(1);
    if (!shop) return { error: "Shop not found." };
    const [exists] = await db.select().from(products).where(eq(products.name, name)).limit(1);
    if (!exists) {
      return { error: "This product must be created in the Master Catalog first." };
    }
    const currentMenu = (shop.menuData as ShopMenuData) || [];
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name,
      price,
      category,
      description: "",
      isAvailable: true,
      imageUrl: imageUrl || null 
    };

    await db.update(coffeeShops).set({ menuData: [...currentMenu, newItem] }).where(eq(coffeeShops.id, shopId));

    revalidatePath(`/admin/shops/${shopId}`);
    return { success: `Added ${name} to menu.` };
  } catch (err) {
    console.error("Menu Update Error:", err);
    return { error: "Failed to update menu." };
  }
}

/**
 * 3. NEW: B2C SHIPPING MODIFICATION
 * Requirement: Admin needs to modify shipping charges for local delivery.
 */
export async function updateLocalShippingCharges(firstKg: string, additionalKg: string) {
  try {
    await db.update(shippingRates)
      .set({ firstKgRate: firstKg, additionalKgRate: additionalKg, updatedAt: new Date() })
      .where(eq(shippingRates.region, "SRI_LANKA"));
    
    revalidatePath("/admin/orders");
    return { success: "Shipping rates updated for B2C." };
  } catch (err) {
    console.error("Shipping Update Error:", err);
    return { error: "Failed to update rates." };
  }
}

/**
 * 4. NEW: B2B LANDED COST CALCULATOR (FOB Logic)
 * Requirement: Convert FOB price to logistics-added invoice.
 */
export async function calculateB2BLandedCost(orderId: string, freightCost: number, insurance: number) {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return { error: "Order not found" };

    const finalTotal = Number(order.totalAmount) + freightCost + insurance;

    await db.update(orders)
      .set({ 
        totalAmount: finalTotal.toString(),
        // Logic: Mark as B2B and store freight in metadata if needed
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: "Landed cost applied to B2B invoice." };
  } catch (err) {
    console.error("B2B Cost Error:", err);
    return { error: "Calculation failed." };
  }
}

/**
 * 5. NEW: LOT BATCH LINKER (The Hero Traceability Feature)
 * Requirement: Link a bag of coffee to a specific "Traceable Lot #" from the Matale nursery.
 */
export async function linkOrderToLot(orderId: string, lotNumber: string) {
  try {
    // Verify lot exists in the Matale/Nuwara Eliya nursery registry
    const [lot] = await db.select().from(lots).where(eq(lots.lotNumber, lotNumber)).limit(1);
    if (!lot) return { error: "Traceable Lot not found." };

    await db.update(orders)
      .set({ 
        // @ts-expect-error - using sql for jsonb metadata injection
        metadata: sql`jsonb_set(COALESCE(metadata, '{}'), '{lotNumber}', ${JSON.stringify(lotNumber)})`
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: `Order linked to Traceable Lot: ${lotNumber}` };
  } catch (err) {
    console.error("Lot Linker Error:", err);
    return { error: "Failed to link lot." };
  }
}

/**
 * 6. EXISTING: FINALISE B2B ORDER (Fixed & Preserved)
 */
export async function finaliseB2BOrder(orderId: string, trackingNumber: string) {
  try {
    await db.update(orders)
      .set({ 
        status: "SHIPPED",
        // @ts-expect-error - trackingNumber inference handling
        trackingNumber: trackingNumber 
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: "B2B Export documentation updated." };
  } catch (err) {
    console.error("Finalise B2B Error:", err);
    return { error: "Logistics update failed." };
  }
}