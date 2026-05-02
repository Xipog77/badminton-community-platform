import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCreateProduct, getListProductsQueryKey } from "@workspace/api-client-react";

const CATEGORIES = ["Vợt cầu lông", "Giày", "Cầu lông", "Trang phục", "Phụ kiện"];
const CONDITIONS = ["Mới hoàn toàn", "Như mới", "Đã qua sử dụng nhẹ", "Đã qua sử dụng"];

export default function SellItem() {
  const [, setLocation] = useLocation();
  const { user, extraInfo, userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateProduct();
  const userAvatar = extraInfo?.avatarUrl || userProfile?.avatar || "/avatar1.png";
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [productLocation, setProductLocation] = useState("");
  const [image, setImage] = useState("/racket1.png");
  const [description, setDescription] = useState("");

  const isSubmitting = createMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || price <= 0 || !productLocation.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền tên sản phẩm, giá và địa điểm.",
        duration: 3000,
      });
      return;
    }

    createMutation.mutate(
      {
        data: {
          name: name.trim(),
          price,
          condition,
          location: productLocation.trim(),
          sellerName: user,
          sellerAvatar: userAvatar,
          image,
          category,
        },
      },
      {
        onSuccess: (created) => {
          toast({
            title: "Đã đăng sản phẩm",
            description: `${created.name} đã xuất hiện trên chợ.`,
            duration: 3000,
          });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          setLocation(`/marketplace/${created.id}`);
        },
        onError: (err) => {
          toast({
            title: "Không thể đăng sản phẩm",
            description: err instanceof Error ? err.message : "Vui lòng thử lại sau.",
            duration: 4000,
          });
        },
      }
    );
  };

  const previewImages = ["/racket1.png", "/racket2.png", "/shoe1.png", "/shoe2.png"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-0 flex justify-between items-center w-full px-4 md:px-6 h-16 z-50">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-xl font-bold text-slate-900 font-display tracking-tight">Đăng bán sản phẩm</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <img src={userAvatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }} />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Đăng dụng cụ của bạn</h2>
          <p className="text-sm font-medium text-slate-500">Chia sẻ những gì bạn không còn dùng với cộng đồng. Sản phẩm sẽ hiển thị ngay sau khi đăng.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">label</span>
              Tên sản phẩm
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm"
              placeholder="vd: Yonex Astrox 88D Pro"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">sell</span>
                Giá (VNĐ)
              </label>
              <input
                type="number"
                required
                min="1"
                step="1000"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">category</span>
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                Tình trạng
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm appearance-none"
              >
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                Địa điểm
              </label>
              <input
                type="text"
                required
                value={productLocation}
                onChange={(e) => setProductLocation(e.target.value)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm"
                placeholder="Quận, Hà Nội"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">image</span>
              Ảnh sản phẩm
            </label>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {previewImages.map((img) => (
                  <button
                    type="button"
                    key={img}
                    onClick={() => setImage(img)}
                    className={`aspect-square rounded-xl bg-white border-2 p-2 flex items-center justify-center transition-all ${
                      image === img ? "border-primary shadow-md" : "border-slate-200 hover:border-primary/50"
                    }`}
                  >
                    <img src={img} alt="preview" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {image && !previewImages.includes(image) && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary shrink-0">
                    <img src={image} alt="Ảnh tải lên" className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary text-slate-500 hover:text-primary text-sm font-bold transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">upload</span>
                  Tải ảnh lên
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">notes</span>
              Mô tả (tùy chọn)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm resize-none"
              placeholder="Mô tả tình trạng, phụ kiện kèm theo, lý do bán…"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-primary text-white font-display font-semibold text-lg rounded-2xl shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Đang đăng…"
              ) : (
                <>
                  <span className="material-symbols-outlined">storefront</span>
                  Đăng sản phẩm
                </>
              )}
            </Button>
            <p className="text-center text-xs font-medium text-slate-500 mt-4">
              Bằng cách đăng, bạn cam kết thông tin chính xác và phản hồi người mua.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
