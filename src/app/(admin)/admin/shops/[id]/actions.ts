"use server";

import { db } from "@/db";
import { coffeeShops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { MenuItem, ShopMenuData } from "@/types/retail";

export type MenuState = {
  error?: string;
  success?: string;
};

// 1. Add Item to JSONB Array
export async function addMenuItem(shopId: string, prevState: MenuState, formData: FormData): Promise<MenuState> {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as MenuItem["category"];
  const description = formData.get("description") as string;

  try {
    // Fetch current shop data
    const [shop] = await db.select().from(coffeeShops).where(eq(coffeeShops.id, shopId)).limit(1);
    if (!shop) return { error: "Shop not found." };

    const currentMenu = (shop.menuData as ShopMenuData) || [];

    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name,
      price,
      category,
      description: description || "",
      isAvailable: true
    };

    // Update the database with the new array
    await db.update(coffeeShops)
      .set({ menuData: [...currentMenu, newItem] })
      .where(eq(coffeeShops.id, shopId));

    revalidatePath(`/admin/shops/${shopId}`);
    return { success: `Added ${name} to menu.` };
  } catch (err: unknown) {
    console.error(err);
    return { error: "Failed to update menu." };
  }
}

// 2. Remove Item from JSONB Array
export async function removeMenuItem(shopId: string, itemId: string) {
  try {
    const [shop] = await db.select().from(coffeeShops).where(eq(coffeeShops.id, shopId)).limit(1);
    if (!shop) return;

    const currentMenu = (shop.menuData as ShopMenuData) || [];
    const filteredMenu = currentMenu.filter(item => item.id !== itemId);

    await db.update(coffeeShops)
      .set({ menuData: filteredMenu })
      .where(eq(coffeeShops.id, shopId));

    revalidatePath(`/admin/shops/${shopId}`);
  } catch (err: unknown) {
    console.error(err);
  }
}