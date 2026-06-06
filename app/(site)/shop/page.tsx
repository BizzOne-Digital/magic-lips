"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Filter, Search, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface Product {
  _id: string; name: string; slug: string;
  price: number; originalPrice?: number; images: string[];
  description: string; isFeatured: boolean; isBundle?: boolean;
  stock: number; category: { name: string; slug: string };
}
interface Category { _id: string; name: string; slug: string; }

const fallback: Product[] = [
  { _id:"1", name:"Magic Lip Gloss",      slug:"magic-lip-gloss",      price:12, images:["/images/category-gloss.png"], description:"High-shine lip gloss for a bold glossy finish.", isFeatured:true, stock:100, category:{name:"Gloss",slug:"gloss"} },
  { _id:"2", name:"Magic Lip Liner",      slug:"magic-lip-liner",      price:8,  images:["/images/category-liner.png"], description:"Smooth lip liner to shape and define lips.",      isFeatured:true, stock:100, category:{name:"Liner",slug:"liner"} },
  { _id:"3", name:"Labubu Keychain Gloss",slug:"labubu-keychain-gloss",price:15, images:["/images/featured-keychain.png"], description:"Adorable Labubu character keychain gloss — a playful beauty essential and cute accessory.", isFeatured:true, stock:50,  category:{name:"Keychain Gloss",slug:"keychain-gloss"} },
  { _id:"4", name:"Gloss + Liner Bundle", slug:"gloss-liner-bundle",   price:17, originalPrice:20, images:["/images/category-bundles.png"], description:"Buy lip gloss and liner — liner for only $5.", isFeatured:true, isBundle:true, stock:50, category:{name:"Gloss",slug:"gloss"} },
];

const categoryImagesBySlug: Record<string, string> = {
  "magic-lip-gloss": "/images/category-gloss.png",
  "magic-lip-liner": "/images/category-liner.png",
  "gloss-liner-bundle": "/images/category-bundles.png",
};

const productImagesBySlug: Record<string, string> = {
  "labubu-keychain-gloss": "/images/featured-keychain.png",
};

const productNamesBySlug: Record<string, string> = {
  "labubu-keychain-gloss": "Labubu Keychain Gloss",
};

const categoryImagesByCategorySlug: Record<string, string> = {
  gloss: "/images/category-gloss.png",
  liner: "/images/category-liner.png",
  "keychain-gloss": "/images/category-keychain.png",
  bundles: "/images/category-bundles.png",
};

function getProductName(p: Product): string {
  return productNamesBySlug[p.slug] || p.name;
}

function getProductImage(p: Product): string {
  if (p.isBundle) return categoryImagesBySlug["gloss-liner-bundle"];
  return (
    productImagesBySlug[p.slug] ||
    categoryImagesBySlug[p.slug] ||
    categoryImagesByCategorySlug[p.category?.slug] ||
    p.images?.[0] ||
    "/images/category-gloss.png"
  );
}

const accentMap: Record<string,string> = { Gloss:"#4C1D95", Liner:"#0284C7", "Keychain Gloss":"#DB2777", Bundles:"#D97706" };

function ShopContent() {
  const searchParams = useSearchParams();
  const [products,setProducts] = useState<Product[]>([]);
  const [categories,setCategories] = useState<Category[]>([]);
  const [activeCategory,setActiveCategory] = useState(searchParams.get("category")||"all");
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(true);
  const addItem = useCartStore((s)=>s.addItem);

  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  useEffect(()=>{
    fetch("/api/categories").then(r=>r.json()).then(d=>setCategories(d.categories||[])).catch(()=>{});
    fetch("/api/products").then(r=>r.json()).then(d=>{ setProducts(d.products?.length?d.products:fallback); setLoading(false); }).catch(()=>{ setProducts(fallback); setLoading(false); });
  },[]);

  const filtered = products.filter(p => {
    const matchCat =
      activeCategory === "all" ||
      (activeCategory === "bundles" && p.isBundle) ||
      p.category?.slug === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (p:Product) => {
    addItem({id:p._id,name:getProductName(p),price:p.price,quantity:1,image:getProductImage(p),slug:p.slug});
    toast.success(`${getProductName(p)} added! 💄`);
  };

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(180deg,#faf8ff 0%,#ffffff 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20 sm:pb-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
            style={{background:"rgba(167,139,250,0.12)",color:"#5B21B6",border:"1px solid rgba(167,139,250,0.3)"}}>
            💄 Beauty Collection
          </motion.span>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{fontFamily:"var(--font-playfair)"}}>
            Our <span className="text-gradient">Shop</span>
          </motion.h1>
          <p className="text-gray-400">Premium lip gloss and beauty essentials</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="text" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-purple-100 text-gray-700 placeholder-gray-300 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-300 flex-shrink-0" />
            {["all", ...categories.map(c => c.slug).filter(s => s !== "accessories"), "bundles"].map(slug => {
              const cat = categories.find(c => c.slug === slug);
              const label = slug === "all" ? "All" : slug === "bundles" ? "Bundles" : cat?.name || slug;
              return (
                <button key={slug} onClick={()=>setActiveCategory(slug)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: activeCategory===slug ? "linear-gradient(135deg,#5B21B6,#0EA5E9)" : "white",
                    color: activeCategory===slug ? "white" : "#6B7280",
                    border: activeCategory===slug ? "none" : "1px solid rgba(196,181,253,0.4)",
                    boxShadow: activeCategory===slug ? "0 4px 15px rgba(124,58,237,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i=><div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-24 text-gray-300">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p,i)=>{
              const accent = p.isBundle ? accentMap.Bundles : (accentMap[p.category?.name] || "#4C1D95");
              const image = getProductImage(p);
              const name = getProductName(p);
              return (
                <motion.div key={p._id} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
                  <div className="group card relative">
                    <div className="relative h-52 overflow-hidden" style={{background:`linear-gradient(135deg,${accent}15,${accent}06)`}}>
                      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {p.isBundle&&<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-white">Bundle</span>}
                        {p.stock===0&&<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-400 text-white">Sold Out</span>}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:accent}}>{p.category?.name}</p>
                      <h3 className="text-gray-900 font-semibold text-sm mb-2">{name}</h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3">{p.description}</p>
                      <div className="flex items-center gap-0.5 mb-4">
                        {[1,2,3,4,5].map(s=><Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-900">${p.price}</span>
                          <span className="text-[10px] text-gray-400">CAD</span>
                          {p.originalPrice&&<span className="text-xs text-gray-300 line-through">${p.originalPrice}</span>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>handleAdd(p)} disabled={p.stock===0}
                            className="p-2 rounded-xl transition-all disabled:opacity-40"
                            style={{background:`${accent}15`,border:`1px solid ${accent}30`,color:accent}}>
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <Link href={`/shop/${p.slug}`} className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-medium transition-all">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
