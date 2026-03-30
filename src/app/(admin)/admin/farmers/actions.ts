"use server";

import { db } from "@/db";
import { farms, stories, nurseryLedger } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm"; 
import { revalidatePath } from "next/cache";

/**
 * INSTITUTIONAL TYPE DEFINITIONS
 * FIXED: Removed "| null" to prevent UI "state is possibly null" errors.
 * This ensures state.success and state.error are always safe to check.
 */
export type ActionResponse = {
  success?: string;
  error?: string;
};

// Type alias to satisfy AddRegionForm.tsx requirement
export type FarmFormState = ActionResponse;

/**
 * 1. NURSERY FACILITATION LEDGER
 * Requirement: Log plants given to a farmer AND update the regional total automatically.
 */
export async function logPlantDistribution(
  prevState: ActionResponse, // Removed nullability
  formData: FormData
): Promise<ActionResponse> {
  const farmerName = formData.get("farmerName") as string;
  const count = parseInt(formData.get("count") as string) || 0;
  const farmId = formData.get("farmId") as string;

  if (!farmerName || count <= 0 || !farmId) {
    return { error: "Farmer name, valid count, and region are required." };
  }

  try {
    await db.insert(nurseryLedger).values({
      farmId,
      farmerName,
      plantsGiven: count,
      distributionDate: new Date(),
    });

    await db.update(farms)
      .set({ 
        nurseryPlants: sql`${farms.nurseryPlants} + ${count}` 
      })
      .where(eq(farms.id, farmId));

    revalidatePath("/admin/farmers");
    revalidatePath("/"); 
    
    return { success: `Successfully facilitated ${count} plants for ${farmerName}.` };
  } catch (err) {
    console.error("Ledger Update Error:", err);
    return { error: "Failed to log distribution to ledger." };
  }
}

/**
 * 2. UPDATE FARM DATA
 */
export async function updateFarmData(
  id: string, 
  prevState: ActionResponse, // Removed nullability
  formData: FormData
): Promise<ActionResponse> {
  const farmerCount = parseInt(formData.get("farmerCount") as string) || 0;
  const nurseryPlants = parseInt(formData.get("nurseryPlants") as string) || 0;
  const isPublic = formData.get("isPublic") === "on";
  const internalNotes = formData.get("internalNotes") as string;
  const elevation = formData.get("elevation") as string;

  try {
    await db.update(farms)
      .set({ 
        farmerCount, 
        nurseryPlants, 
        isPubliclyVisible: isPublic, 
        internalNotes,
        elevation: elevation || "1200m"
      })
      .where(eq(farms.id, id));

    revalidatePath("/admin/farmers");
    revalidatePath("/");
    return { success: "Supply chain synced successfully." };
  } catch (err) {
    console.error("Database Update Error:", err);
    return { error: "Failed to update region data." };
  }
}

export const updateFarmRegion = updateFarmData;

/**
 * 3. CREATE A HIGHLAND JOURNAL STORY (CMS)
 */
export async function createStory(
  prevState: ActionResponse, // Removed nullability
  formData: FormData
): Promise<ActionResponse> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const isPublished = formData.get("isPublished") === "on";
  
  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  try {
    await db.insert(stories).values({
      title,
      content,
      category: category || "General",
      imageUrl,
      isPublished,
      slug,
    });

    revalidatePath("/admin/stories");
    revalidatePath("/stories");
    return { success: "Story published to Highland Journal." };
  } catch (err) {
    console.error("Story Creation Error:", err);
    return { error: "Failed to save story." };
  }
}

/**
 * 4. ADD NEW GROWING REGION
 */
export async function createRegion(
  prevState: ActionResponse, // Removed nullability
  formData: FormData
): Promise<ActionResponse> {
  const region = formData.get("region") as string;
  const elevation = formData.get("elevation") as string;

  if (!region) return { error: "Region name required" };

  try {
    await db.insert(farms).values({
      region,
      elevation: elevation || "1200m",
      farmerCount: 0,
      nurseryPlants: 0,
      isPubliclyVisible: true,
    });
    revalidatePath("/admin/farmers");
    return { success: "New region established." };
  } catch (err) {
    console.error("Region Creation Error:", err);
    return { error: "Failed to create region." };
  }
}

/**
 * 5. DELETE REGION
 */
export async function deleteFarmRegion(id: string) {
  try {
    await db.delete(farms).where(eq(farms.id, id));
    revalidatePath("/admin/farmers");
    return { success: "Region deleted." };
  } catch (err) {
    console.error("Delete Error:", err);
    return { error: "Delete failed." };
  }
}

/**
 * 6. FETCH LEDGER HISTORY
 */
export async function getLedgerHistory() {
  try {
    return await db
      .select({
        id: nurseryLedger.id,
        farmerName: nurseryLedger.farmerName,
        plantsGiven: nurseryLedger.plantsGiven,
        date: nurseryLedger.distributionDate,
        region: farms.region,
      })
      .from(nurseryLedger)
      .leftJoin(farms, eq(nurseryLedger.farmId, farms.id))
      .orderBy(desc(nurseryLedger.distributionDate))
      .limit(20);
  } catch (err) {
    console.error("Fetch Ledger Error:", err);
    return [];
  }
}