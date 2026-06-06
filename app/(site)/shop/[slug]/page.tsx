"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Star, ArrowLeft, Minus, Plus, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getProductImage, getProductName } from "@/lib/productImages";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  stock: number;
  isBundle?: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string };
  tags?: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/products/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        if (d.product) setImgSrc(getProductImage(d.product));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const image = getProductImage(product);
    const name = getProductName(product);
    addItem({ id: product._id, name, price: product.price, quantity: qty, image, slug: product.slug });
    toast.success(`${name} × ${qty} added to cart! 💄`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#07051A] flex items-center justify-center">
      <div className="text-white/50">Loading product...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#07051A] flex items-center justify-center text-center px-4 sm:px-6">
      <div>
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  );

  const displayName = getProductName(product);
  const displayImage = imgSrc || getProductImage(product);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07051A] to-[#0F0A2E] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-3xl overflow-hidden glass border border-purple-500/20 relative bg-gradient-to-br from-purple-900/30 to-pink-900/20">
              <Image
                src={displayImage}
                alt={displayName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={() => setImgSrc("/images/category-gloss.png")}
              />
              {product.isBundle && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 text-sm font-bold z-10">
                  Bundle Deal ✨
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-purple-400 text-sm font-medium uppercase tracking-wider mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {displayName}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                <span className="text-white/50 text-sm ml-1">Popular</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-white">${product.price}</span>
              <span className="text-lg text-white/50">CAD</span>
              {product.originalPrice && (
                <span className="text-xl text-white/30 line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-white/70 leading-relaxed">{product.description}</p>

            {product.isBundle && (
              <div className="glass rounded-xl p-4 border border-yellow-500/30">
                <p className="text-yellow-400 font-semibold text-sm mb-1">🎉 Bundle Deal!</p>
                <p className="text-white/60 text-sm">Includes Lip Gloss ($12) + Lip Liner at special bundle price. Save $3!</p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-sm text-white/60">
                {product.stock > 0 ? `${product.stock > 10 ? "In Stock" : `Only ${product.stock} left!`}` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm">Quantity</span>
              <div className="flex items-center glass rounded-xl border border-white/10">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-white/10 rounded-l-xl transition-colors">
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="px-4 py-3 text-white font-semibold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-white/10 rounded-r-xl transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 btn-primary py-4 gap-2 disabled:opacity-50">
                <ShoppingBag className="w-5 h-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button onClick={() => setWishlisted(!wishlisted)} className={`p-4 rounded-full glass border transition-all self-center sm:self-auto ${wishlisted ? "border-pink-500/50 bg-pink-500/20 text-pink-400" : "border-white/10 text-white/50 hover:border-pink-500/30 hover:text-pink-400"}`}>
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-pink-400" : ""}`} />
              </button>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full glass border border-white/10 text-white/50 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 border-t border-white/10">
              {["🚚 Fast shipping", "✨ Premium quality", "💖 Cruelty free"].map((f) => (
                <p key={f} className="text-white/40 text-xs">{f}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
