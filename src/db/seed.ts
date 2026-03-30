import * as dotenv from "dotenv";
import path from "path";
// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "./index";
import { 
  users, products, farms, stories, courses, 
  coffeeShops, orders, academyInquiries, productInquiries, 
  infrastructure, lots, shippingRates, 
  nurseryLedger, academyBatches, academyEnrollments, 
  academyMessages, systemSettings 
} from "./schema";

async function main() {
  console.log("🧨 QA INITIATED: Wiping Database...");
  
  await db.delete(academyMessages);
  await db.delete(academyEnrollments);
  await db.delete(academyBatches);
  await db.delete(nurseryLedger);
  await db.delete(lots);
  await db.delete(orders);
  await db.delete(productInquiries);
  await db.delete(academyInquiries);
  await db.delete(stories);
  await db.delete(infrastructure);
  await db.delete(coffeeShops);
  await db.delete(courses);
  await db.delete(products);
  await db.delete(farms);
  await db.delete(users);
  await db.delete(shippingRates);
  await db.delete(systemSettings);

  console.log("⚙️  1. SETTINGS...");
  await db.insert(systemSettings).values({ 
    id: 1, 
    exchangeRate: "325.50", 
    defaultGlobalCurrency: "LKR" 
  });

  console.log("👥 2. USERS...");
  await db.insert(users).values([
    { firstName: "Kenji", lastName: "Kiyota", email: "kenji@kiyota.com", password: "123", role: "SUPER_ADMIN", isApproved: true },
    { firstName: "Sarah", lastName: "Retail", email: "retail@kiyota.com", password: "123", role: "RETAIL_ADMIN", isApproved: true },
    { firstName: "Anjali", lastName: "Supply", email: "farm@kiyota.com", password: "123", role: "FARM_ADMIN", isApproved: true },
    { firstName: "David", lastName: "Export", email: "wholesale@kiyota.com", password: "123", role: "WHOLESALE_ADMIN", isApproved: true },
  ]);

  const b2cBuyers = await db.insert(users).values(
    Array.from({ length: 10 }).map((_, i) => ({
      firstName: `Buyer_${i + 1}`,
      lastName: "Retail",
      email: `buyer${i + 1}@gmail.com`,
      password: "123",
      role: "BUYER" as const,
      city: "Colombo",
      isEmailVerified: true
    }))
  ).returning();

  const studentUsers = await db.insert(users).values(
    Array.from({ length: 10 }).map((_, i) => ({
      firstName: `Student_${i + 1}`,
      lastName: "Academy",
      email: `student${i + 1}@academy.lk`,
      password: "123",
      role: "STUDENT" as const,
      isEmailVerified: true
    }))
  ).returning();

  const wholesalePartners = await db.insert(users).values(
    Array.from({ length: 5 }).map((_, i) => ({
      firstName: `Partner_${i + 1}`,
      lastName: "Global",
      email: `wholesale${i + 1}@export.com`,
      password: "123",
      role: "WHOLESALE_USER" as const,
      isApproved: true
    }))
  ).returning();

  console.log("🚜 3. SOURCE...");
  const regions = await db.insert(farms).values([
    { region: "Matale Central", farmerCount: 2200, nurseryPlants: 250000, elevation: "1200m", featuredImageUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad" },
    { region: "Nuwara Eliya Peaks", farmerCount: 1300, nurseryPlants: 100000, elevation: "1850m", featuredImageUrl: "https://images.unsplash.com/photo-1592483026330-70f97bc4040a" },
    { region: "Badulla Uva", farmerCount: 800, nurseryPlants: 40000, elevation: "1400m", featuredImageUrl: "https://images.unsplash.com/photo-1559056191-75902420fef5" },
    { region: "Kandy Heritage", farmerCount: 500, nurseryPlants: 10000, elevation: "900m", featuredImageUrl: "https://images.unsplash.com/photo-1596435017163-f220d91d6f2c" },
    { region: "Kegalle Slopes", farmerCount: 200, nurseryPlants: 5000, elevation: "600m", featuredImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" },
  ]).returning();

  await db.insert(nurseryLedger).values(
    Array.from({ length: 10 }).map((_, i) => ({
      farmId: regions[i % 5].id,
      farmerName: `Farmer Bandara ${i + 1}`,
      plantsGiven: 500,
      facilitator: "Anjali Supply"
    }))
  );

  console.log("☕ 4. PRODUCTS (Strict Category Enforcement)...");
  
  const b2c = await db.insert(products).values([
    { name: "Estate Reserve: Matale Honey", slug: "matale-honey", weightGrams: 250, priceLkr: "5200", pricingLogic: "AUTO_CONVERT" as const, displayMode: "BOTH" as const, category: "SPECIALTY_ARABICA" as const, isRetailEnabled: true, stockQuantity: 500, originRegion: "Matale", imageUrls: ["https://images.unsplash.com/photo-1559056191-75902420fef5"] },
    { name: "Nuwara Eliya Peaberry", slug: "ne-peaberry", weightGrams: 250, priceLkr: "7500", pricingLogic: "MANUAL" as const, priceUsd: "25.00", displayMode: "BOTH" as const, category: "SPECIALTY_ARABICA" as const, isRetailEnabled: true, stockQuantity: 120, originRegion: "Nuwara Eliya", imageUrls: ["https://images.unsplash.com/photo-1580915411954-282cb1b0d780"] },
    { name: "Kyoto Signature Dark", slug: "kyoto-dark", weightGrams: 500, priceLkr: "3850", category: "SPECIALTY_ARABICA" as const, isRetailEnabled: true, stockQuantity: 800, imageUrls: ["https://images.unsplash.com/photo-1611854779393-1b2da9d400fe"] },
    { name: "Ceylon Cinnamon C5", slug: "cinnamon-c5", weightGrams: 100, priceLkr: "1450", category: "CEYLON_SPICES" as const, isRetailEnabled: true, stockQuantity: 300, imageUrls: ["https://images.unsplash.com/photo-1588161108253-96f30e01763e"] },
    { name: "White Peppercorns", slug: "white-pepper", weightGrams: 150, priceLkr: "1200", category: "CEYLON_SPICES" as const, isRetailEnabled: true, stockQuantity: 250, imageUrls: ["https://images.unsplash.com/photo-1532336414038-cf19250c5757"] },
    { name: "Ceramic V60 White", slug: "v60-ceramic", weightGrams: 450, priceLkr: "8500", category: "EQUIPMENT" as const, isRetailEnabled: true, stockQuantity: 45, imageUrls: ["https://images.unsplash.com/photo-1511920170033-f8396924c348"] },
    { name: "Barista Kettle", slug: "gooseneck-kettle", weightGrams: 900, priceLkr: "18500", category: "EQUIPMENT" as const, isRetailEnabled: true, stockQuantity: 20, imageUrls: ["https://images.unsplash.com/photo-1577968897866-be5025be4552"] },
    { name: "Discovery Sample Box", slug: "sample-box", weightGrams: 300, priceLkr: "4500", category: "SAMPLE" as const, isRetailEnabled: true, stockQuantity: 100, imageUrls: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"] },
    { name: "Medium Roast: Kandy", slug: "kandy-medium", weightGrams: 250, priceLkr: "2800", category: "SPECIALTY_ARABICA" as const, isRetailEnabled: true, stockQuantity: 400, imageUrls: ["https://images.unsplash.com/photo-1459755486867-b55449bb39ff"] },
    { name: "Rare Honey Lot: Uva", slug: "rare-uva-honey", weightGrams: 250, priceLkr: "9500", category: "SPECIALTY_ARABICA" as const, isRetailEnabled: true, stockQuantity: 50, imageUrls: ["https://images.unsplash.com/photo-1521017432531-fbd92d768814"] },
  ]).returning();

  await db.insert(products).values([
    { name: "Green Arabica G1: Bulk", slug: "bulk-green-g1", weightGrams: 60000, wholesalePriceUsd: "580.00", category: "GREEN_BEANS" as const, isWholesaleOnly: true, isInquiryOnly: true, stockQuantity: 50, imageUrls: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"] },
    { name: "Roasted Espresso: Bulk", slug: "bulk-espresso", weightGrams: 10000, wholesalePriceLkr: "45000", category: "SPECIALTY_ARABICA" as const, isWholesaleOnly: true, stockQuantity: 200, imageUrls: ["https://images.unsplash.com/photo-1611854779393-1b2da9d400fe"] },
    { name: "Probat G-120 Roaster", slug: "probat-g120", weightGrams: 250000, wholesalePriceUsd: "48000.00", category: "EQUIPMENT" as const, isInquiryOnly: true, isWholesaleOnly: true, stockQuantity: 2, imageUrls: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"] },
    { name: "Cinnamon: Bulk (MT)", slug: "bulk-cinnamon", weightGrams: 1000000, wholesalePriceUsd: "12000.00", category: "CEYLON_SPICES" as const, isInquiryOnly: true, isWholesaleOnly: true, stockQuantity: 10, imageUrls: ["https://images.unsplash.com/photo-1588161108253-96f30e01763e"] },
    { name: "Peaberry Export G1", slug: "export-peaberry", weightGrams: 30000, wholesalePriceUsd: "950.00", category: "GREEN_BEANS" as const, isWholesaleOnly: true, stockQuantity: 150, imageUrls: ["https://images.unsplash.com/photo-1580915411954-282cb1b0d780"] },
    { name: "Jute Export Sacks", slug: "jute-sacks", weightGrams: 400, wholesalePriceLkr: "1800", category: "EQUIPMENT" as const, isWholesaleOnly: true, stockQuantity: 10000, imageUrls: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"] },
    { name: "Green Robusta: Bulk", slug: "bulk-robusta", weightGrams: 60000, wholesalePriceUsd: "350.00", category: "GREEN_BEANS" as const, isWholesaleOnly: true, stockQuantity: 300, imageUrls: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"] },
    { name: "EK43 Industrial Grinder", slug: "mahlkonig-ek43", weightGrams: 28000, wholesalePriceUsd: "3100.00", category: "EQUIPMENT" as const, isInquiryOnly: true, isWholesaleOnly: true, stockQuantity: 5, imageUrls: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"] },
    { name: "Wholesale Samples", slug: "wholesale-samples", weightGrams: 1500, priceUsd: "45.00", category: "SAMPLE" as const, isWholesaleOnly: true, stockQuantity: 100, imageUrls: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"] },
    { name: "Industrial Spices Mix", slug: "industrial-spices", weightGrams: 50000, wholesalePriceUsd: "850.00", category: "CEYLON_SPICES" as const, isWholesaleOnly: true, isInquiryOnly: true, stockQuantity: 40, imageUrls: ["https://images.unsplash.com/photo-1532336414038-cf19250c5757"] },
  ]);

  console.log("🎓 5. ACADEMY...");
  const academyCourses = await db.insert(courses).values([
    { title: "Barista Path", level: "Beginner", duration: "2 Days", price: "25000" },
    { title: "Sensory Mastery", level: "Intermediate", duration: "3 Days", price: "45000" },
    { title: "Industrial Roasting", level: "Advanced", duration: "5 Days", price: "155000" },
    { title: "Latte Art Theory", level: "Intermediate", duration: "1 Day", price: "18000" },
    { title: "Brewing Science", level: "Intermediate", duration: "2 Days", price: "32000" },
  ]).returning();

  const batches = await db.insert(academyBatches).values(academyCourses.map((c, i) => ({
    courseId: c.id,
    batchName: `Batch 2026-0${i+1}`,
    startDate: new Date("2026-04-01"),
    endDate: new Date("2026-04-10"),
    maxCapacity: 4,
    currentEnrollment: 2
  }))).returning();

  await db.insert(academyEnrollments).values(studentUsers.slice(0, 5).map((s, i) => ({
    userId: s.id,
    courseId: academyCourses[i].id,
    batchId: batches[i].id,
    status: "APPROVED",
    paymentStatus: "PAID"
  })));

  console.log("🚚 6. LOGISTICS...");
  await db.insert(shippingRates).values([
    { region: "SRI_LANKA", firstKgRate: "650.00", additionalKgRate: "200.00" },
    { region: "INTERNATIONAL", firstKgRate: "4800.00", additionalKgRate: "1650.00" }
  ]);

  console.log("📨 7. INQUIRIES...");
  await db.insert(productInquiries).values(Array.from({ length: 10 }).map((_, i) => ({
    segment: i < 5 ? "WHOLESALE" : "RETAIL",
    origin: "INTERNATIONAL",
    contactName: `Partner ${i+1}`,
    companyName: `Global Trade ${i+1}`,
    email: `trade${i+1}@export.jp`,
    phone: "+81 90",
    location: "Tokyo",
    message: "Requirement for export.",
    status: "NEW_LEAD"
  })));

  console.log("📦 8. ORDERS...");
  await db.insert(orders).values(Array.from({ length: 10 }).map((_, i) => ({
    userId: b2cBuyers[i].id,
    totalAmount: "8500",
    isB2B: false,
    status: "PAID",
    paymentType: "PAYHERE",
    paymentStatus: "PAID",
    customerName: b2cBuyers[i].firstName,
    shippingCost: "650"
  })));

  await db.insert(orders).values(Array.from({ length: 5 }).map((_, i) => ({
    userId: wholesalePartners[i].id,
    totalAmount: "2550000",
    isB2B: true,
    status: "PROCESSING",
    paymentStatus: "UNPAID",
    customerName: wholesalePartners[i].firstName
  })));

  console.log("🏪 9. SHOPS...");
  const menu = [{ id: "1", name: "V60", price: 1250, category: "DRINK" as const, isAvailable: true }];
  await db.insert(coffeeShops).values([
    { name: "Kiyota Matale HQ", location: "Matale", menuData: menu },
    { name: "Kiyota Colombo 07", location: "Ward Place", menuData: menu },
  ]);

  console.log("📖 10. JOURNAL...");
  await db.insert(stories).values(Array.from({ length: 10 }).map((_, i) => ({
    title: `Chapter ${i+1}`,
    slug: `chapter-${i+1}`,
    content: "Historical records.",
    category: "Heritage",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    isPublished: true
  })));

  console.log("💎 11. TRACEABILITY...");
  await db.insert(lots).values(Array.from({ length: 5 }).map((_, i) => ({
    lotNumber: `QA-V${i+1}`,
    productId: b2c[i].id,
    farmId: regions[i % 5].id,
    scaScore: "88",
    inspector: "Kenji Kiyota"
  })));

  console.log("⭐ SUCCESS.");
  process.exit(0);
}

main().catch(console.error);