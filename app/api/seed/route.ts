import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import HeroSlide from "@/models/HeroSlide";
import SiteSettings from "@/models/SiteSettings";
import Offer from "@/models/Offer";
import GalleryMedia from "@/models/GalleryMedia";
import { galleryImages } from "@/lib/galleryImages";

export async function POST() {
  try {
    await connectDB();

    // Categories
    const categories = await Category.insertMany([
      { name: "Gloss", slug: "gloss", description: "Premium lip glosses", order: 1 },
      { name: "Liner", slug: "liner", description: "Smooth lip liners", order: 2 },
      { name: "Keychain Gloss", slug: "keychain-gloss", description: "Cute keychain gloss accessories", order: 3 },
      { name: "Accessories", slug: "accessories", description: "Beauty accessories and purses", order: 4 },
    ]);

    const glossCat = categories[0];
    const linerCat = categories[1];
    const keychainCat = categories[2];

    // Products
    await Product.insertMany([
      {
        name: "Magic Lip Gloss",
        slug: "magic-lip-gloss",
        description: "High-shine lip gloss for a bold, glossy finish. Long-lasting formula with a beautiful shimmer that makes your lips pop. Available in multiple shades.",
        price: 12,
        category: glossCat._id,
        images: ["/images/placeholder-gloss.jpg"],
        stock: 100,
        isFeatured: true,
        isActive: true,
        sku: "ML-GLOSS-001",
        tags: ["gloss", "lip", "shine", "featured"],
      },
      {
        name: "Magic Lip Liner",
        slug: "magic-lip-liner",
        description: "Smooth, creamy lip liner to shape and define your lips perfectly. Long-wearing formula that stays in place all day.",
        price: 8,
        category: linerCat._id,
        images: ["/images/placeholder-liner.jpg"],
        stock: 100,
        isFeatured: true,
        isActive: true,
        sku: "ML-LINER-001",
        tags: ["liner", "lip", "define"],
      },
      {
        name: "Labubu Keychain Gloss",
        slug: "labubu-keychain-gloss",
        description: "Adorable Labubu character keychain gloss — a playful beauty essential and cute accessory. Perfect gift for beauty lovers!",
        price: 15,
        category: keychainCat._id,
        images: ["/images/placeholder-keychain.jpg"],
        stock: 50,
        isFeatured: true,
        isActive: true,
        sku: "ML-KEY-001",
        tags: ["keychain", "gloss", "cute", "labubu", "gift"],
      },
      {
        name: "Gloss + Liner Bundle",
        slug: "gloss-liner-bundle",
        description: "Buy Magic Lip Gloss and get Magic Lip Liner at a special price of $5! The perfect duo for a bold, glossy look. Save when you bundle!",
        price: 17,
        originalPrice: 20,
        category: glossCat._id,
        images: ["/images/placeholder-bundle.jpg"],
        stock: 50,
        isFeatured: true,
        isBundle: true,
        isActive: true,
        sku: "ML-BUNDLE-001",
        tags: ["bundle", "gloss", "liner", "deal", "save"],
      },
    ]);

    // Hero Slides
    await HeroSlide.insertMany([
      {
        heading: "Welcome to Magic Lips",
        subheading: "Gloss that shines, sparkles, and makes every look unforgettable.",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        secondaryButtonText: "Explore",
        secondaryButtonLink: "/about",
        image: "/images/hero-slide-1-welcome.png",
        order: 1,
        isActive: true,
      },
      {
        heading: "10% Off for New Subscribers",
        subheading: "Join our beauty list and get 10% off your very first order.",
        buttonText: "Subscribe & Save",
        buttonLink: "#newsletter",
        secondaryButtonText: "Learn More",
        secondaryButtonLink: "/offers",
        image: "/images/hero-slide-2-offer.png",
        order: 2,
        isActive: true,
      },
      {
        heading: "Gloss, Liners & Cute Keychain Gloss",
        subheading: "Pretty lip essentials made for bold, glossy looks.",
        buttonText: "View Products",
        buttonLink: "/shop",
        image: "/images/hero-slide-3-collection.png",
        order: 3,
        isActive: true,
      },
      {
        heading: "Bundle & Save!",
        subheading: "Buy lip gloss and liner together — get the liner for only $5.",
        buttonText: "Shop Bundle",
        buttonLink: "/shop",
        image: "/images/hero-slide-4-bundle.png",
        order: 4,
        isActive: true,
      },
    ]);

    // Site Settings
    await SiteSettings.findOneAndUpdate(
      {},
      {
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
      },
      { upsert: true, new: true }
    );

    // Offers
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

    // Gallery
    await GalleryMedia.insertMany(
      galleryImages.map((g, i) => ({
        title: g.title,
        url: g.url,
        type: g.type,
        order: i + 1,
        isActive: true,
      }))
    );

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
