import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function POST() {
  try {
    await connectDB();

    // Clear existing products and categories
    await Product.deleteMany({});
    await Category.deleteMany({});

    // ── Categories ─────────────────────────────────────────────
    const categories = await Category.insertMany([
      { name: "Lip Gloss",             slug: "gloss",          description: "Premium lip glosses",                    order: 1 },
      { name: "Lip Liners",            slug: "liner",          description: "Smooth lip liners",                      order: 2 },
      { name: "Labubu Keychain Gloss", slug: "keychain-gloss", description: "Cute Labubu keychain gloss accessories", order: 3 },
      { name: "Bags",                  slug: "bags",           description: "Stylish bags and pouches",               order: 4 },
      { name: "Bundles",               slug: "bundles",        description: "Save more with our bundle deals",        order: 5 },
    ]);

    const glossCat    = categories[0];
    const linerCat    = categories[1];
    const keychainCat = categories[2];
    const bagsCat     = categories[3];
    const bundlesCat  = categories[4];

    // ── Products ───────────────────────────────────────────────
    await Product.insertMany([

      // Lip Gloss (8)
      { name: "Syrup Glow",   slug: "lip-gloss-syrup-glow",   description: "A rich, syrupy gloss with a high-shine finish.",           price: 12, category: glossCat._id, images: ["/images/products/gloss-syrup-glow.jpg"],   stock: 100, isFeatured: true,  isActive: true, sku: "ML-GLOSS-001", tags: ["gloss","lip","shine"] },
      { name: "Cherry Amour", slug: "lip-gloss-cherry-amour", description: "Sweet cherry-tinted gloss with a beautiful shimmer.",      price: 12, category: glossCat._id, images: ["/images/products/gloss-cherry-amour.jpg"], stock: 100, isFeatured: true,  isActive: true, sku: "ML-GLOSS-002", tags: ["gloss","lip","cherry"] },
      { name: "Juicy Berry",  slug: "lip-gloss-juicy-berry",  description: "Bold berry gloss packed with shine and colour.",           price: 12, category: glossCat._id, images: ["/images/products/gloss-juicy-berry.jpg"],  stock: 100, isFeatured: false, isActive: true, sku: "ML-GLOSS-003", tags: ["gloss","lip","berry"] },
      { name: "Sugar High",   slug: "lip-gloss-sugar-high",   description: "Sweet, glittery gloss for a playful candy-inspired look.", price: 12, category: glossCat._id, images: ["/images/products/gloss-sugar-high.jpg"],   stock: 100, isFeatured: false, isActive: true, sku: "ML-GLOSS-004", tags: ["gloss","lip","glitter"] },
      { name: "Lip Gloss",    slug: "lip-gloss-5",            description: "High-shine lip gloss for a bold, glossy finish.",          price: 12, category: glossCat._id, images: ["/images/products/gloss-5.jpg"],            stock: 100, isFeatured: false, isActive: true, sku: "ML-GLOSS-005", tags: ["gloss","lip"] },
      { name: "Lip Gloss",    slug: "lip-gloss-6",            description: "High-shine lip gloss for a bold, glossy finish.",          price: 12, category: glossCat._id, images: ["/images/products/gloss-6.jpg"],            stock: 100, isFeatured: false, isActive: true, sku: "ML-GLOSS-006", tags: ["gloss","lip"] },
      { name: "Lip Gloss",    slug: "lip-gloss-7",            description: "High-shine lip gloss for a bold, glossy finish.",          price: 12, category: glossCat._id, images: ["/images/products/gloss-7.jpg"],            stock: 100, isFeatured: false, isActive: true, sku: "ML-GLOSS-007", tags: ["gloss","lip"] },
      { name: "Lip Gloss",    slug: "lip-gloss-8",            description: "High-shine lip gloss for a bold, glossy finish.",          price: 12, category: glossCat._id, images: ["/images/products/gloss-8.jpg"],            stock: 100, isFeatured: false, isActive: true, sku: "ML-GLOSS-008", tags: ["gloss","lip"] },

      // Lip Liners (3)
      { name: "Goddess",               slug: "lip-liner-goddess",               description: "Rich pigment liner to define and shape your lips perfectly.", price: 8, category: linerCat._id, images: ["/images/products/liner-goddess.jpg"],              stock: 100, isFeatured: true,  isActive: true, sku: "ML-LINER-001", tags: ["liner","lip","define"] },
      { name: "Blossom",               slug: "lip-liner-blossom",               description: "Soft blossom-toned liner for a natural everyday lip look.",   price: 8, category: linerCat._id, images: ["/images/products/liner-blossom.jpg"],              stock: 100, isFeatured: false, isActive: true, sku: "ML-LINER-002", tags: ["liner","lip","blossom"] },
      { name: "Kiss Me Thru the Phone",slug: "lip-liner-kiss-me-thru-the-phone",description: "Bold statement liner for a dramatic, unforgettable lip look.", price: 8, category: linerCat._id, images: ["/images/products/liner-kiss-me-thru-the-phone.jpg"],stock: 100, isFeatured: false, isActive: true, sku: "ML-LINER-003", tags: ["liner","lip","bold"] },

      // Labubu Keychain Gloss (2)
      { name: "Sugar High Labubu Lip Gloss Keychain", slug: "labubu-keychain-sugar-high", description: "Adorable Labubu keychain with Sugar High lip gloss — a playful beauty essential.", price: 15, category: keychainCat._id, images: ["/images/products/keychain-sugar-high.jpg"], stock: 50, isFeatured: true, isActive: true, sku: "ML-KEY-001", tags: ["keychain","gloss","labubu","sugar high"] },
      { name: "Syrup Glow Labubu Lip Gloss Keychain", slug: "labubu-keychain-syrup-glow", description: "Adorable Labubu keychain with Syrup Glow lip gloss — the perfect gift.",           price: 15, category: keychainCat._id, images: ["/images/products/keychain-syrup-glow.jpg"], stock: 50, isFeatured: true, isActive: true, sku: "ML-KEY-002", tags: ["keychain","gloss","labubu","syrup glow"] },

      // Bags (10)
      { name: "Wallet 1",   slug: "bags-wallet-1",   description: "Stylish compact wallet — perfect for everyday carry.",                          price: 20, category: bagsCat._id, images: ["/images/products/bag-wallet-1.jpg"],   stock: 30, isFeatured: false, isActive: true, sku: "ML-BAG-W01", tags: ["bag","wallet"] },
      { name: "Wallet 2",   slug: "bags-wallet-2",   description: "Stylish compact wallet — perfect for everyday carry.",                          price: 20, category: bagsCat._id, images: ["/images/products/bag-wallet-2.jpg"],   stock: 30, isFeatured: false, isActive: true, sku: "ML-BAG-W02", tags: ["bag","wallet"] },
      { name: "Wallet 3",   slug: "bags-wallet-3",   description: "Stylish compact wallet — perfect for everyday carry.",                          price: 20, category: bagsCat._id, images: ["/images/products/bag-wallet-3.jpg"],   stock: 30, isFeatured: false, isActive: true, sku: "ML-BAG-W03", tags: ["bag","wallet"] },
      { name: "Wallet 4",   slug: "bags-wallet-4",   description: "Stylish compact wallet — perfect for everyday carry.",                          price: 20, category: bagsCat._id, images: ["/images/products/bag-wallet-4.jpg"],   stock: 30, isFeatured: false, isActive: true, sku: "ML-BAG-W04", tags: ["bag","wallet"] },
      { name: "Purse 1",    slug: "bags-purse-1",    description: "Elegant purse with a chic design for every occasion.",                          price: 35, category: bagsCat._id, images: ["/images/products/bag-purse-1.jpg"],    stock: 20, isFeatured: true,  isActive: true, sku: "ML-BAG-P01", tags: ["bag","purse"] },
      { name: "Purse 2",    slug: "bags-purse-2",    description: "Elegant purse with a chic design for every occasion.",                          price: 35, category: bagsCat._id, images: ["/images/products/bag-purse-2.jpg"],    stock: 20, isFeatured: false, isActive: true, sku: "ML-BAG-P02", tags: ["bag","purse"] },
      { name: "Purse 3",    slug: "bags-purse-3",    description: "Elegant purse with a chic design for every occasion.",                          price: 35, category: bagsCat._id, images: ["/images/products/bag-purse-3.jpg"],    stock: 20, isFeatured: false, isActive: true, sku: "ML-BAG-P03", tags: ["bag","purse"] },
      { name: "Backpack 1", slug: "bags-backpack-1", description: "Stylish backpack with a fun girly design — perfect for school or everyday use.", price: 45, category: bagsCat._id, images: ["/images/products/bag-backpack-1.jpg"], stock: 15, isFeatured: true,  isActive: true, sku: "ML-BAG-B01", tags: ["bag","backpack"] },
      { name: "Backpack 2", slug: "bags-backpack-2", description: "Stylish backpack with a fun girly design — perfect for school or everyday use.", price: 45, category: bagsCat._id, images: ["/images/products/bag-backpack-2.jpg"], stock: 15, isFeatured: false, isActive: true, sku: "ML-BAG-B02", tags: ["bag","backpack"] },
      { name: "Backpack 3", slug: "bags-backpack-3", description: "Stylish backpack with a fun girly design — perfect for school or everyday use.", price: 45, category: bagsCat._id, images: ["/images/products/bag-backpack-3.jpg"], stock: 15, isFeatured: false, isActive: true, sku: "ML-BAG-B03", tags: ["bag","backpack"] },

      // Bundles (4)
      { name: "Labubu Keychain with Lip Liner 1", slug: "bundle-labubu-keychain-lip-liner-1", description: "Labubu Keychain Lip Gloss bundled with a Lip Liner — the perfect gift set.", price: 20, category: bundlesCat._id, images: ["/images/products/bundle-labubu-liner-1.jpg"], stock: 30, isFeatured: true, isBundle: true, isActive: true, sku: "ML-BNDL-001", tags: ["bundle","keychain","liner","labubu"] },
      { name: "Labubu Keychain with Lip Liner 2", slug: "bundle-labubu-keychain-lip-liner-2", description: "Labubu Keychain Lip Gloss bundled with a Lip Liner — the perfect gift set.", price: 20, category: bundlesCat._id, images: ["/images/products/bundle-labubu-liner-2.jpg"], stock: 30, isFeatured: true, isBundle: true, isActive: true, sku: "ML-BNDL-002", tags: ["bundle","keychain","liner","labubu"] },
      { name: "Lip Gloss with Lip Liner 1",       slug: "bundle-lip-gloss-lip-liner-1",       description: "Magic Lip Gloss + Lip Liner — the perfect duo for a bold, glossy look.",   price: 17, originalPrice: 20, category: bundlesCat._id, images: ["/images/products/bundle-gloss-liner-1.jpg"], stock: 50, isFeatured: true, isBundle: true, isActive: true, sku: "ML-BNDL-003", tags: ["bundle","gloss","liner","deal"] },
      { name: "Lip Gloss with Lip Liner 2",       slug: "bundle-lip-gloss-lip-liner-2",       description: "Magic Lip Gloss + Lip Liner — the perfect duo for a bold, glossy look.",   price: 17, originalPrice: 20, category: bundlesCat._id, images: ["/images/products/bundle-gloss-liner-2.jpg"], stock: 50, isFeatured: true, isBundle: true, isActive: true, sku: "ML-BNDL-004", tags: ["bundle","gloss","liner","deal"] },
    ]);

    return NextResponse.json({
      success: true,
      message: "Products and categories reset successfully!",
      summary: {
        categories: 5,
        products: 27,
        breakdown: { lipGloss: 8, lipLiners: 3, labubuKeychain: 2, bags: 10, bundles: 4 },
      },
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Reset failed", details: String(error) }, { status: 500 });
  }
}
