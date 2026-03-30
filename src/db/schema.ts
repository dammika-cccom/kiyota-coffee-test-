import { pgTable, uuid, text, integer, boolean, timestamp, decimal, pgEnum, jsonb } from "drizzle-orm/pg-core";

// --- 1. ENUMS ---
export const roleEnum = pgEnum("role", [
  "SUPER_ADMIN", 
  "RETAIL_ADMIN",    // B2C
  "WHOLESALE_ADMIN", // B2B
  "COFFEESHOP_ADMIN",// Flagships/Menus
  "FARM_ADMIN",      // Supply Chain/Journal
  "ACADEMY_ADMIN",   // Education/CRM
  "BUYER", 
  "WHOLESALE_USER",
  "STUDENT" 
]);

export const pricingLogicEnum = pgEnum("pricing_logic", ["MANUAL", "AUTO_CONVERT"]);
export const displayModeEnum = pgEnum("display_mode", ["LKR_ONLY", "USD_ONLY", "BOTH"]);

export const categoryEnum = pgEnum("category", [
  "SPECIALTY_ARABICA", 
  "MICRO_LOT_SPECIALTY",
  "ROASTED_COFFEE_RETAIL",
  "INSTITUTIONAL_BLENDS",
  "WHITE_LABEL_SOLUTIONS",
  "CASCARA_AND_BYPRODUCTS",
  "GREEN_BEANS", 
  "CEYLON_SPICES", 
  "GIFT_CURATED_BUNDLES",
  "EQUIPMENT",
  "BARISTA_ACCESSORIES",
  "SAMPLE",
]);

export const productStatusEnum = pgEnum("status", ["NEW", "COMING_SOON", "SEASONAL", "ACTIVE"]);
export const saleTypeEnum = pgEnum("sale_type", ["LOCAL_ONLY", "INTERNATIONAL_ONLY", "GLOBAL"]);

export const b2bStatusEnum = pgEnum("b2b_status", ["NONE", "PENDING", "ACTIVE", "REJECTED"]);
export const visibilityEnum = pgEnum("visibility", ["B2C_ONLY", "B2B_ONLY", "BOTH"]);

// --- 2. USERS TABLE ---
export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), 
  mobile: text("mobile"),
  whatsapp: text("whatsapp"),
  addressLine1: text("address_1"),
  addressLine2: text("address_2"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country").default("Sri Lanka"),
  role: roleEnum("role").default("BUYER"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  verificationToken: text("verification_token"), // For email links
  otpCode: text("otp_code"), // For mobile validation
  otpExpires: timestamp("otp_expires"),
  passwordResetToken: text("password_reset_token"),
  isApproved: boolean("is_approved").default(true),
  isSuspended: boolean("is_suspended").default(false),
  loyaltyPoints: integer("loyalty_points").default(0),
  // B2B CRM Fields
  b2bStatus: b2bStatusEnum("b2b_status").default("NONE"),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }).default("0.00"),
  creditTermsDays: integer("credit_terms_days").default(0),
  creditBalance: decimal("credit_balance", { precision: 12, scale: 2 }).default("0.00"), // Available credit
  isCreditRestricted: boolean("is_credit_restricted").default(false),
  lastCreditMilestone: integer("last_credit_milestone").default(0), // 25, 50, 75, 100
  businessProfile: jsonb("business_profile"), // Stores BR Number, VAT, etc.
  requestingUpgrade: boolean("requesting_upgrade").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 3. PRODUCTS TABLE (Global B2B/B2C & Technical Specs) ---
export const products = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  weightGrams: integer("weight_grams").notNull(),
  priceLkr: decimal("price_lkr", { precision: 10, scale: 2 }), 
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }), // Manual override
  pricingLogic: pricingLogicEnum("pricing_logic").default("AUTO_CONVERT"),
  displayMode: displayModeEnum("display_mode").default("BOTH"),
  wholesalePriceLkr: decimal("wholesale_price_lkr", { precision: 10, scale: 2 }),
  wholesalePriceUsd: decimal("wholesale_price_usd", { precision: 10, scale: 2 }),
  visibility: visibilityEnum("visibility").default("BOTH"),
  isInquiryOnly: boolean("is_inquiry_only").default(false),
  isWholesaleOnly: boolean("is_wholesale_only").default(false),
  category: categoryEnum("category").notNull(),
  status: productStatusEnum("status").default("ACTIVE"),
  saleType: saleTypeEnum("sale_type").default("GLOBAL"),
  altitude: text("altitude"),
  moistureContent: text("moisture_percent"), 
  scaScore: text("sca_score"),
  originRegion: text("origin_region"),
  processingMethod: text("processing_method"),
  roastLevel: integer("roast_level").default(3),
  isSampleOnly: boolean("is_sample_only").default(false),
  specifications: text("specifications"), 
  stockQuantity: integer("stock_quantity").default(0),
  flavorProfile: jsonb("flavor_profile"), 
  isRetailEnabled: boolean("is_retail_enabled").default(false),
  moq: integer("moq").default(1),
  imageUrls: jsonb("image_urls"), 
  slug: text("slug").unique().notNull(), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 4. FARMER NETWORK (Requirement: Farm Admin Publishing Control) ---
export const farms = pgTable("farm", {
  id: uuid("id").primaryKey().defaultRandom(),
  region: text("region").notNull().unique(),
  farmerCount: integer("farmer_count").default(0),
  nurseryPlants: integer("nursery_plants").default(0),
  elevation: text("elevation"),
  description: text("description"),
  isChemicalFree: boolean("is_chemical_free").default(true),
  facilitationDetails: text("facilitation_details"),
  
  // Farm Admin Controls
  isPubliclyVisible: boolean("is_publicly_visible").default(true), // Decide what frontend shows
  internalNotes: text("internal_notes"), // Backend operations only
  featuredImageUrl: text("featured_image_url"), // Cloudinary URL
});

// --- 5. STORIES & NEWS TABLE (New: Highland Journal) ---
export const stories = pgTable("story", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").default("Kiyota Editorial"),
  category: text("category"), // e.g. "Farmer Spotlight", "Nursery News"
  imageUrl: text("image_url"), // Cloudinary URL
  isPublished: boolean("is_published").default(false),
  slug: text("slug").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 6. ACADEMY COURSES ---
export const courses = pgTable("course", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull().unique(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date"),
  maxStudents: integer("max_students").default(4),
  isActive: boolean("is_active").default(true),
});

// --- 7. COFFEE SHOPS ---
export const coffeeShops = pgTable("coffee_shop", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  location: text("location").notNull(),
  openingHours: text("opening_hours"),
  menuData: jsonb("menu_data"), 
});

// --- 8. ORDERS ---
export const orders = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").default("PENDING"),
  isB2B: boolean("is_b2b").default(false),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  paymentType: text("payment_type").default("BANK_TRANSFER"), // COD, BANK_TRANSFER, PAYHERE
  paymentStatus: text("payment_status").default("UNPAID"), // UNPAID, PAID, ACCRUED (for COD)
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0.00"),
  reconciliationId: text("reconciliation_id"), // For bank/delivery agent tracking
  customerName: text("customer_name"), // For guest checkouts
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  customerNotes: text("customer_notes"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- 9. INQUIRIES (Product & Academy) ---
export const academyInquiries = pgTable("academy_inquiry", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "set null" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  experienceLevel: text("experience_level").notNull(),
  message: text("message"),
  status: text("status").default("NEW"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productInquiries = pgTable("product_inquiry", {
  id: uuid("id").primaryKey().defaultRandom(),
  segment: text("segment").notNull(), 
  origin: text("origin").notNull(),   
  companyName: text("company_name"),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  volumeRequirement: text("volume_requirement"),
  priority: text("priority").default("MEDIUM"), 
  status: text("status").default("NEW_LEAD"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotions = pgTable("promotion", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
});

export const infrastructure = pgTable("infrastructure", {
  id: uuid("id").primaryKey().defaultRandom(),
  facilityName: text("facility_name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // e.g., "Milling Center", "Roastery", "Nursery"
  annualCapacity: text("annual_capacity"), // e.g., "1,200 Metric Tons"
  machinerySpecs: text("machinery_specs"), // e.g., "Japanese High-Airflow Roasters"
  certifications: jsonb("certifications"), // e.g., ["ISO 22000", "JFTC", "Organic"]
  imageUrl: text("image_url"),
  slug: text("slug").unique().notNull(),
});

export const lots = pgTable("lot", {
  id: uuid("id").primaryKey().defaultRandom(),
  lotNumber: text("lot_number").notNull().unique(), // e.g., "MT-2026-04"
  productId: uuid("product_id").references(() => products.id),
  farmId: uuid("farm_id").references(() => farms.id),
  harvestDate: timestamp("harvest_date"),
  roastDate: timestamp("roast_date"),
  moistureLevel: text("moisture_level"), // e.g., "11.2%"
  density: text("density"), // e.g., "710g/L"
  scaScore: text("sca_score"),
  opticalSorterStatus: text("optical_sorter_status").default("PASSED"),
  tastingNotes: text("tasting_notes"),
  inspector: text("inspector").default("K. Kiyota"),
});

export const shippingRates = pgTable("shipping_rate", {
  id: uuid("id").primaryKey().defaultRandom(),
  region: text("region").default("SRI_LANKA"),
  firstKgRate: decimal("first_kg_rate", { precision: 10, scale: 2 }).default("500.00"),
  additionalKgRate: decimal("additional_kg_rate", { precision: 10, scale: 2 }).default("150.00"),
  currency: text("currency").default("LKR"), // Shipping is usually quoted in LKR locally
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const nurseryLedger = pgTable("nursery_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  farmId: uuid("farm_id").references(() => farms.id, { onDelete: "cascade" }),
  farmerName: text("farmer_name").notNull(),
  plantsGiven: integer("plants_given").notNull(),
  facilitator: text("facilitator"), // The Admin who performed the action
  distributionDate: timestamp("distribution_date").defaultNow(),
  notes: text("notes"),
});

// 10. ACADEMY BATCHES (Schedules)
export const academyBatches = pgTable("academy_batch", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }),
  batchName: text("batch_name").notNull(), // e.g., "April 2026 Morning Session"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxCapacity: integer("max_capacity").default(4),
  currentEnrollment: integer("current_enrollment").default(0),
  status: text("status").default("OPEN"), // OPEN, FULL, COMPLETED
});

// 11. ENROLLMENTS (The Bridge)
export const academyEnrollments = pgTable("academy_enrollment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").references(() => courses.id),
  batchId: uuid("batch_id").references(() => academyBatches.id),
  status: text("status").default("PENDING_APPROVAL"), // PENDING, APPROVED, REJECTED, GRADUATED
  paymentStatus: text("payment_status").default("UNPAID"), 
  appliedAt: timestamp("applied_at").defaultNow(),
});

// 12. INTERNAL COMMUNICATION (Dashboard Chat)
export const academyMessages = pgTable("academy_message", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  senderRole: text("sender_role").notNull(), // ADMIN or STUDENT
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- 13. NEW: SYSTEM SETTINGS (The Super Admin Control Tower) ---
export const systemSettings = pgTable("system_settings", {
  id: integer("id").primaryKey().default(1), 
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 2 }).default("300.00"), // LKR per 1 USD
  defaultGlobalCurrency: text("default_currency").default("LKR"), 
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 14. COUNTRIES REGISTRY ---
export const countries = pgTable("country", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").notNull(), // ISO Code
  isActive: boolean("is_active").default(true),
  isExportTarget: boolean("is_export_target").default(false),
});

// --- 15. BANK ACCOUNTS ---
export const bankAccounts = pgTable("bank_account", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // "RETAIL" or "CORPORATE"
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  branch: text("branch").notNull(),
  swiftCode: text("swift_code"),
  isActive: boolean("is_active").default(true),
});