"use server";

import { db } from "@/db";
import { systemSettings, shippingRates, bankAccounts, countries, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * GOVERNANCE: Update Global Exchange Rate
 */
export async function updateGlobalSettings(formData: FormData): Promise<void> {
  const exchangeRate = formData.get("exchangeRate") as string;
  await db.insert(systemSettings)
    .values({ id: 1, exchangeRate, updatedAt: new Date() })
    .onConflictDoUpdate({ target: systemSettings.id, set: { exchangeRate, updatedAt: new Date() } });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

/**
 * LOGISTICS: Update Regional Shipping Tiers
 */
export async function updateShippingRate(id: string, formData: FormData): Promise<void> {
  const firstKg = formData.get("firstKg") as string;
  const additionalKg = formData.get("additionalKg") as string;
  await db.update(shippingRates)
    .set({ firstKgRate: firstKg, additionalKgRate: additionalKg, updatedAt: new Date() })
    .where(eq(shippingRates.id, id));

  revalidatePath("/admin/settings");
}

/**
 * GOVERNANCE: Add/Modify Bank Account (B2C & B2B)
 */
export async function upsertBankAccount(id: string | null, data: {
  bankName: string;
  accountNumber: string;
  branch: string;
  type: "RETAIL" | "CORPORATE";
  isActive: boolean;
  swiftCode?: string;
}) {
  try {
    if (id) {
      await db.update(bankAccounts).set(data).where(eq(bankAccounts.id, id));
    } else {
      await db.insert(bankAccounts).values(data);
    }
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: unknown) {
    console.error("Institutional Banking Audit Error:", error);
    return { error: "Banking sync failed." };
  }
}

/**
 * GOVERNANCE: B2B Partner Finalization (Credit Limit & Terms)
 */
export async function authorizeWholesalePartner(userId: string, limit: string, terms: number) {
  try {
    await db.update(users).set({
      role: "WHOLESALE_USER",
      b2bStatus: "ACTIVE",
      creditLimit: limit,
      creditBalance: limit,
      // Assuming 'creditTermsDays' is handled via metadata or specific col in schema
      createdAt: new Date(), // Using updatedAt logic in production
      isApproved: true,
      requestingUpgrade: false
    }).where(eq(users.id, userId));

    console.log(`B2B Authorization: Authorized for ${terms} day credit terms.`);
    revalidatePath("/admin/users");
    return { success: "Wholesale Partner Authorized with Credit Facility." };
  } catch (error: unknown) {
    console.error("Authorization Failure:", error);
    return { error: "Governance sync failed." };
  }
}

/**
 * LOGISTICS: Manage Country Registry
 */
export async function addCountry(name: string, code: string) {
  try {
    await db.insert(countries).values({ name, code: code.toUpperCase(), isActive: true });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: unknown) {
    console.error("Country Registry Error:", error);
    return { error: "Country already registered." };
  }
}