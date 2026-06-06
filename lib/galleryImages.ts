export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  type: "image";
}

export interface GalleryMediaItem {
  _id: string;
  url: string;
  title?: string;
  type: "image" | "video";
}

export const galleryImages: GalleryImage[] = [
  { id: "1",  url: "/images/gallery-1-gloss-collection.png", title: "Gloss Collection",  type: "image" },
  { id: "2",  url: "/images/gallery-2-sparkle-look.png",      title: "Sparkle Look",      type: "image" },
  { id: "3",  url: "/images/gallery-3-bold-lips.png",        title: "Bold Lips",         type: "image" },
  { id: "4",  url: "/images/gallery-4-star-shine.png",        title: "Star Shine",        type: "image" },
  { id: "5",  url: "/images/gallery-5-pink-magic.png",       title: "Pink Magic",        type: "image" },
  { id: "6",  url: "/images/gallery-6-liner-art.png",         title: "Liner Art",         type: "image" },
  { id: "7",  url: "/images/gallery-7-keychain-gloss.png",    title: "Keychain Gloss",    type: "image" },
  { id: "8",  url: "/images/gallery-8-beauty-moment.png",      title: "Beauty Moment",     type: "image" },
  { id: "9",  url: "/images/gallery-9-crystal-gloss.png",     title: "Crystal Gloss",     type: "image" },
  { id: "10", url: "/images/gallery-10-cloud-kiss.png",        title: "Cloud Kiss",        type: "image" },
];

/** Legacy seed paths that no longer exist — map to static PNGs */
const legacyUrlMap: Record<string, string> = {
  "/images/gallery-1.jpg": galleryImages[0].url,
  "/images/gallery-2.jpg": galleryImages[1].url,
  "/images/gallery-3.jpg": galleryImages[2].url,
  "/images/gallery-4.jpg": galleryImages[3].url,
};

function normalizeUrl(url: string | undefined): string {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "";
  return legacyUrlMap[trimmed] ?? trimmed;
}

export function toStaticGallery(limit?: number): GalleryMediaItem[] {
  const list = limit ? galleryImages.slice(0, limit) : galleryImages;
  return list.map((g) => ({
    _id: g.id,
    url: g.url,
    title: g.title,
    type: g.type,
  }));
}

export function resolveGalleryMedia(
  apiMedia: GalleryMediaItem[] | undefined,
  limit?: number
): GalleryMediaItem[] {
  const staticItems = toStaticGallery(limit);

  if (!apiMedia?.length) return staticItems;

  const normalized = apiMedia
    .map((item) => ({
      ...item,
      _id: String(item._id),
      url: normalizeUrl(item.url),
    }))
    .filter((item) => item.url.length > 0);

  if (!normalized.length) return staticItems;

  const result = limit ? normalized.slice(0, limit) : normalized;

  // Pad preview grid if API returned fewer valid items than needed
  if (limit && result.length < limit) {
    const used = new Set(result.map((r) => r.url));
    for (const s of staticItems) {
      if (result.length >= limit) break;
      if (!used.has(s.url)) result.push(s);
    }
  }

  return result;
}
