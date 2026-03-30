"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function adjustCreditLedger(userId: string, data: {
  limit: string;
  balance: string;
}) {
  try {
    await db.update(users).set({
      creditLimit: data.limit,
      creditBalance: data.balance,
      updatedAt: new Date()
    }).where(eq(users.id, userId));

    revalidatePath("/admin/users");
    return { success: "Institutional Ledger Adjusted." };
  } catch (error: unknown) {
    console.error("Ledger Sync Failure:", error);
    return { error: "Manual adjustment failed." };
  }
}