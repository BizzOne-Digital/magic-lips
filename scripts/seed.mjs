import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/magic-lips";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String, order: Number, isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, description: String, price: Number, originalPrice: Number,
  category: mongoose.Schema.Types.ObjectId, images: [String], videos: [String],
  stock: { type: Number, default: 100 }, isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }, isBundle: { type: Boolean, default: false },
  tags: [String], sku: String,
}, { timestamps: true });

const HeroSlideSchema = new mongoose.Schema({
  heading: String, subheading: String, buttonText: String, buttonLink: String,
  secondaryButtonText: String, secondaryButtonLink: String,
  order: Number, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const SiteSettingsSchema = new mongoose.Schema({
  businessName: String, phone: String, email: String, address: String,
  instagramHandle: String, tiktokHandle: String,
  announcementBarText: String, announcementBarActive: Boolean,
  footerCopyright: String, metaTitle: String, metaDescription: String,
}, { timestamps: true });

const OfferSchema = new mongoose.Schema({
  title: String, description: String,
  type: { type: String, enum: ["percentage", "fixed", "bundle", "bogo"] },
  discountValue: Number, couponCode: String,
  isActive: { type: Boolean, default: true }, usageCount: { type: Number, default: 0 },
}, { timestamps: true });

const GalleryMediaSchema = new mongoose.Schema({
  title: String, url: String, type: { type: String, enum: ["image", "video"] },
  order: Number, isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Models ───────────────────────────────────────────────────────────────────
const Category = mongoose.model("Category", CategorySchema);
const Product = mongoose.model("Product", ProductSchema);
const HeroSlide = mongoose.model("HeroSlide", HeroSlideSchema);
const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
const Offer = mongoose.model("Offer", OfferSchema);
const GalleryMedia = mongoose.model("GalleryMedia", GalleryMediaSchema);

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing (except gallerymedias already there)
  await Category.deleteMany({});
  await Product.deleteMany({});
  await HeroSlide.deleteMany({});
  await SiteSettings.deleteMany({});
  await Offer.deleteMany({});
  await GalleryMedia.deleteMany({});
  console.log("🗑️  Cleared old data");

  // ── Categories ──────────────────────────────────────────────────────────────
  const cats = await Category.insertMany([
    { name: "Gloss",         slug: "gloss",         description: "Premium high-shine lip glosses",           order: 1 },
    { name: "Liner",         slug: "liner",         description: "Smooth, long-lasting lip liners",          order: 2 },
    { name: "Keychain Gloss",slug: "keychain-gloss",description: "Adorable portable keychain gloss",         order: 3 },
    { name: "Accessories",   slug: "accessories",   description: "Beauty accessories & cute purses",         order: 4 },
  ]);
  const [glossCat, linerCat, keychainCat] = cats;
  console.log("✅ Categories seeded:", cats.map(c => c.name).join(", "));

  // ── Products ────────────────────────────────────────────────────────────────
  await Product.insertMany([
    {
      name: "Magic Lip Gloss",
      slug: "magic-lip-gloss",
      description: "High-shine lip gloss for a bold, glossy finish. Long-lasting formula with a beautiful shimmer that makes your lips pop. Available in multiple beautiful shades.",
      price: 12,
      category: glossCat._id,
      images: [],
      stock: 100,
      isFeatured: true,
      isActive: true,
      sku: "ML-GLOSS-001",
      tags: ["gloss", "lip", "shine", "featured", "bestseller"],
    },
    {
      name: "Magic Lip Liner",
      slug: "magic-lip-liner",
      description: "Smooth, creamy lip liner to shape and define your lips perfectly. Long-wearing formula that stays in place all day with rich colour payoff.",
      price: 8,
      category: linerCat._id,
      images: [],
      stock: 100,
      isFeatured: true,
      isActive: true,
      sku: "ML-LINER-001",
      tags: ["liner", "lip", "define", "precision"],
    },
    {
      name: "Labubu Keychain Gloss",
      slug: "labubu-keychain-gloss",
      description: "Adorable Labubu character keychain gloss — a playful beauty essential and cute accessory in one. Clip it to your bag and gloss up anywhere! Perfect gift for beauty lovers.",
      price: 15,
      category: keychainCat._id,
      images: [],
      stock: 50,
      isFeatured: true,
      isActive: true,
      sku: "ML-KEY-001",
      tags: ["keychain", "gloss", "cute", "labubu", "gift", "accessory"],
    },
    {
      name: "Gloss + Liner Bundle",
      slug: "gloss-liner-bundle",
      description: "Buy Magic Lip Gloss and get a Magic Lip Liner at the special bundle price of just $5! The perfect lip duo for a complete, glamorous look. Save $3 when you bundle!",
      price: 17,
      originalPrice: 20,
      category: glossCat._id,
      images: [],
      stock: 50,
      isFeatured: true,
      isBundle: true,
      isActive: true,
      sku: "ML-BUNDLE-001",
      tags: ["bundle", "gloss", "liner", "deal", "save", "value"],
    },
  ]);
  console.log("✅ Products seeded: 4 products");

  // ── Hero Slides ─────────────────────────────────────────────────────────────
  await HeroSlide.insertMany([
    {
      heading: "Welcome to Magic Lips",
      subheading: "Gloss that shines, sparkles, and makes every look unforgettable.",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      secondaryButtonText: "Explore",
      secondaryButtonLink: "/about",
      order: 1,
      isActive: true,
    },
    {
      heading: "10% Off for New Subscribers",
      subheading: "Join our beauty list and get 10% off your very first order.",
      buttonText: "Subscribe & Save",
      buttonLink: "/#newsletter",
      secondaryButtonText: "View Offers",
      secondaryButtonLink: "/offers",
      order: 2,
      isActive: true,
    },
    {
      heading: "Gloss, Liners & Cute Keychain Gloss",
      subheading: "Pretty lip essentials made for bold, glossy looks.",
      buttonText: "View Products",
      buttonLink: "/shop",
      secondaryButtonText: "See Gallery",
      secondaryButtonLink: "/gallery",
      order: 3,
      isActive: true,
    },
    {
      heading: "Bundle & Save",
      subheading: "Buy lip gloss and liner together — get the liner for only $5.",
      buttonText: "Shop Bundle",
      buttonLink: "/shop",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/offers",
      order: 4,
      isActive: true,
    },
  ]);
  console.log("✅ Hero Slides seeded: 4 slides");

  // ── Site Settings ───────────────────────────────────────────────────────────
  await SiteSettings.create({
    businessName: "Magic Lips",
    phone: "+1 647 495 0299",
    email: "magiclips2013@gmail.com",
    address: "3735 Dundas St W, York, ON M6S 2T6, Canada",
    instagramHandle: "magiclips2013",
    tiktokHandle: "magiclips02",
    announcementBarText: "✨ New subscribers get 10% off their first order! Use code: MAGIC10 ✨",
    announcementBarActive: true,
    footerCopyright: "© 2024 Magic Lips. All rights reserved.",
    metaTitle: "Magic Lips — Premium Lip Gloss & Beauty",
    metaDescription: "Shop premium lip gloss, lip liners, and keychain gloss accessories at Magic Lips. Bold, glamorous, magical beauty.",
  });
  console.log("✅ Site Settings seeded");

  // ── Offers ──────────────────────────────────────────────────────────────────
  await Offer.insertMany([
    {
      title: "New Subscriber Discount",
      description: "10% off for new newsletter subscribers",
      type: "percentage",
      discountValue: 10,
      couponCode: "MAGIC10",
      isActive: true,
    },
    {
      title: "Bundle Deal",
      description: "Buy lip gloss and get liner for only $5",
      type: "bundle",
      discountValue: 3,
      isActive: true,
    },
  ]);
  console.log("✅ Offers seeded: 2 offers");

  // ── Gallery ─────────────────────────────────────────────────────────────────
  await GalleryMedia.insertMany([
    { title: "Magic Lips Collection",     url: "", type: "image", order: 1 },
    { title: "Gloss Shine",              url: "", type: "image", order: 2 },
    { title: "Lip Liner Look",           url: "", type: "image", order: 3 },
    { title: "Keychain Gloss",           url: "", type: "image", order: 4 },
    { title: "Bundle Deal",              url: "", type: "image", order: 5 },
    { title: "Beauty Essentials",        url: "", type: "image", order: 6 },
  ]);
  console.log("✅ Gallery seeded: 6 items");

  console.log("\n🎉 DATABASE FULLY SEEDED! Magic Lips is ready.");
  console.log("Collections created:");
  console.log("  → categories (4 docs)");
  console.log("  → products (4 docs)");
  console.log("  → heroslides (4 docs)");
  console.log("  → sitesettings (1 doc)");
  console.log("  → offers (2 docs)");
  console.log("  → gallerymedias (6 docs)");

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
