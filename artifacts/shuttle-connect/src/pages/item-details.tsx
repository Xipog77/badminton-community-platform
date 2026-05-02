import { Link, useRoute } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ItemDetails() {
  const [, params] = useRoute("/marketplace/:id");
  const itemId = params?.id ?? "";
  const { data: item, isLoading } = useGetProduct(itemId);
  const { toast } = useToast();

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Đang tải sản phẩm…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-8">
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 h-16 z-50">
        <div className="flex items-center gap-4">
          <Link href="/marketplace" className="p-2 text-slate-500 active:scale-95 duration-200 hover:bg-slate-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-xl font-bold text-primary font-display">Chi tiết sản phẩm</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-accent hover:bg-orange-50 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </nav>

      <main className="mt-16 max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-8 flex items-center justify-center relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
              {item.isNewArrival && (
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  MỚI VỀ
                </div>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <div className="w-20 h-20 bg-white rounded-xl border-2 border-primary p-2 flex-shrink-0 cursor-pointer">
                <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt="Thumb" />
              </div>
              <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 p-2 flex-shrink-0 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400">image</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-teal-50 text-primary border border-teal-100 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide">{item.condition}</span>
                <span className="text-slate-400 text-xs font-bold">Đăng 2 giờ trước</span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-slate-900 leading-tight">{item.name}</h1>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl md:text-4xl font-bold text-primary font-display">{item.price.toLocaleString("vi-VN")}đ</span>
                {item.originalPrice && (
                  <span className="text-slate-400 line-through text-lg">{item.originalPrice.toLocaleString("vi-VN")}đ</span>
                )}
              </div>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={item.sellerAvatar} alt="Người bán" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.sellerName}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-yellow-500 text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="text-xs font-semibold text-slate-500">4.9 (124 đánh giá)</span>
                  </div>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="ghost" className="text-primary font-bold hover:bg-teal-50">Xem hồ sơ</Button>
              </Link>
            </div>

            {item.category === "Rackets" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Khối lượng</span>
                  <span className="font-bold text-slate-900">4U (khoảng 83g)</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Cỡ cán</span>
                  <span className="font-bold text-slate-900">G5</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Lực căng dây</span>
                  <span className="font-bold text-slate-900">26 lbs (BG80)</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Cân bằng</span>
                  <span className="font-bold text-slate-900">Nặng đầu</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-3 text-lg">Mô tả</h4>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Cần bán {item.name}. Tình trạng 9.5/10, gần như không có dấu hiệu sử dụng. Đây là dụng cụ tuyệt vời dành cho lối chơi tấn công. Có hộp đựng gốc. Ưu tiên gặp mặt trao đổi tại {item.location}. Sẵn sàng thương lượng hợp lý.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2" onClick={() => toast({ title: "Liên hệ người bán", description: "Nhắn tin người bán để thỏa thuận giá và gặp mặt trao đổi.", duration: 4000 })}>
                <span className="material-symbols-outlined">payments</span>
                Mua ngay
              </Button>
              <Button variant="outline" className="w-full bg-white border-2 border-primary text-primary h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-50" onClick={() => toast({ title: "Tính năng đang phát triển", description: "Chat sẽ sớm ra mắt.", duration: 3000 })}>
                <span className="material-symbols-outlined">chat_bubble</span>
                Nhắn tin người bán
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
