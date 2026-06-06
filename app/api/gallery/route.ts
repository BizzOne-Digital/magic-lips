import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import GalleryMedia from "@/models/GalleryMedia";

import { isAdminAuthenticated } from "@/lib/auth";

import { resolveGalleryMedia, type GalleryMediaItem } from "@/lib/galleryImages";



export async function GET() {

  try {

    await connectDB();

    const media = await GalleryMedia.find({ isActive: true }).sort({ order: 1 }).lean();

    const resolved = resolveGalleryMedia(

      media.map((m) => ({

        _id: String(m._id),

        url: m.url,

        title: m.title,

        type: m.type as GalleryMediaItem["type"],

      }))

    );

    return NextResponse.json({ media: resolved });

  } catch {

    return NextResponse.json({ media: resolveGalleryMedia(undefined) });

  }

}



export async function POST(request: NextRequest) {

  try {

    if (!isAdminAuthenticated(request)) {

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }

    await connectDB();

    const data = await request.json();

    const item = await GalleryMedia.create(data);

    return NextResponse.json({ item }, { status: 201 });

  } catch {

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  }

}

