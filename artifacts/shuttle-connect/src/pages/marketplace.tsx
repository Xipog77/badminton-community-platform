import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Navbar, BottomNav } from "@/components/layout";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

const CATEGORY_VI: Record<string, string> = {
  "Rackets": "Vợt cầu lông",
  "Shoes": "Giày",
  "Shuttlecocks": "Cầu lông",
  "Apparel": "Trang phục",
  "Accessories": "Phụ kiện",
};

const CONDITION_VI: Record<string, string> = {
  "Brand New": "Mới hoàn toàn",
  "Like New": "Như mới",
  "Gently Used": "Đã dùng nhẹ",
  "Used": "Đã qua sử dụng",
};

export default function Marketplace() {
  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("Tất cả");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["Tất cả", "Vợt cầu lông", "Giày", "Cầu lông", "Trang phục", "Phụ kiện"];
  const conditions = ["Tất cả", "Mới hoàn toàn", "Như mới", "Đã dùng nhẹ", "Đã qua sử dụng"];

  const { data } = useListProducts();
  const items = data ?? [];

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = items.filter((item) => {
      const categoryVi = CATEGORY_VI[item.category] ?? item.category;
      const conditionVi = CONDITION_VI[item.condition] ?? item.condition;
      if (filter !== "Tất cả" && categoryVi !== filter) return false;
      if (conditionFilter !== "Tất cả" && conditionVi !== conditionFilter) return false;
      if (maxPrice !== "" && item.price > Number(maxPrice)) return false;
      if (q) {
        const haystack = `${item.name} ${item.category} ${item.sellerName} ${item.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [items, filter, conditionFilter, maxPrice, search, sort]);

  const activeFilterCount =
    (conditionFilter !== "Tất cả" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (sort !== "featured" ? 1 : 0);

  const clearFilters = () => {
    setConditionFilter("Tất cả");
    setMaxPrice("");
    setSort("featured");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 md:mb-1">Mua bán</h1>
            <p className="hidden md:block text-sm font-medium text-slate-500">Tìm hoặc đăng bán dụng cụ cầu lông trong cộng đồng của bạn.</p>
          </div>
          <Link href="/marketplace/sell">
            <Button className="bg-primary text-white px-5 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 flex items-center gap-2 w-full md:w-auto">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Đăng bán
            </Button>
          </Link>
        </div>

        <div className="relative w-full mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Tìm theo tên, người bán, hoặc địa điểm…"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-4 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all ${
                filter === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900">
            {filteredItems.length} sản phẩm
          </h2>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-1 text-primary font-bold text-xs md:text-sm hover:underline"
          >
            {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center bg-primary text-white rounded-full text-[10px] font-bold w-5 h-5">
                {activeFilterCount}
              </span>
            )}
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tình trạng</label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full p-2.5 rounded-lg border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              >
                {conditions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Giá tối đa (VNĐ)</label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Không giới hạn"
                className="w-full p-2.5 rounded-lg border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sắp xếp</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full p-2.5 rounded-lg border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              >
                <option value="featured">Nổi bật</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-primary underline"
                >
                  Bỏ lọc
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
              <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                />

                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-slate-400 hover:text-accent hover:scale-110 active:scale-95 transition-all border border-slate-100 z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>

                {item.isNewArrival && (
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-100 text-[10px] font-bold text-primary uppercase tracking-wide z-10">
                    Mới về
                  </div>
                )}
                {item.isOnSale && (
                  <div className="absolute bottom-3 left-3 bg-accent text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm z-10">
                    Giảm giá
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <Link href={`/marketplace/${item.id}`} className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm md:text-base leading-tight">
                    {item.name}
                  </Link>
                  <span className="font-display font-bold text-lg md:text-xl text-primary">{item.price.toLocaleString("vi-VN")}đ</span>
                </div>

                <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold text-slate-500">
                  <span className="material-symbols-outlined text-[14px]">
                    {item.category === "Rackets" ? "sports_tennis" : item.category === "Shoes" ? "do_not_step" : "category"}
                  </span>
                  <span>{CONDITION_VI[item.condition] ?? item.condition}</span>
                  <span className="mx-1">•</span>
                  <span>{item.location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.sellerAvatar}
                        alt="Người bán"
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                      />
                      <span className="text-xs font-bold text-slate-700">{item.sellerName}</span>
                    </div>
                    <Link href={`/marketplace/${item.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary font-bold text-xs hover:bg-teal-50 h-8 px-2">
                        Xem
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-slate-500 mb-4">Thử thay đổi tìm kiếm hoặc bộ lọc.</p>
            <Link href="/marketplace/sell">
              <Button className="bg-primary text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:bg-primary/90">
                Đăng sản phẩm đầu tiên
              </Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
