import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar, BottomNav } from "@/components/layout";
import { useListClans, useCreateClan, getListClansQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CLAN_IMAGES = ["/clan1.png", "/clan2.png"];
const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Người mới" },
  { value: "Intermediate", label: "Trung cấp" },
  { value: "Advanced", label: "Nâng cao" },
  { value: "Elite", label: "Tinh nhuệ" },
];
const TAG_OPTIONS = ["Cạnh tranh", "Thân thiện", "Tập luyện", "Giao lưu", "Trẻ em", "Hỗn hợp", "Đánh đơn", "Đánh đôi"];

export default function Clans() {
  const { user } = useAuth();
  const { data, isLoading } = useListClans();
  const clans = data ?? [];
  const featured = clans[0];
  const queryClient = useQueryClient();
  const createClan = useCreateClan();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [createOpen, setCreateOpen] = useState(false);
  const [customClanImage, setCustomClanImage] = useState<string | null>(null);
  const clanImageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    level: "Intermediate",
    description: "",
    image: "/clan1.png",
    tags: [] as string[],
  });

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleClanImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomClanImage(dataUrl);
      setForm((f) => ({ ...f, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.location.trim() || !form.description.trim()) {
      toast({ title: "Vui lòng điền đầy đủ thông tin bắt buộc.", duration: 3000 });
      return;
    }
    createClan.mutate(
      { data: { ...form, name: form.name.trim(), location: form.location.trim(), description: form.description.trim(), tags: form.tags.length ? form.tags : ["Giao lưu"] } },
      {
        onSuccess: (newClan) => {
          toast({ title: "Tạo CLB thành công!", description: `${newClan.name} đã sẵn sàng.`, duration: 3000 });
          queryClient.invalidateQueries({ queryKey: getListClansQueryKey() });
          setCreateOpen(false);
          setForm({ name: "", location: "", level: "Intermediate", description: "", image: "/clan1.png", tags: [] });
          setCustomClanImage(null);
          navigate(`/clans/${newClan.id}`);
        },
        onError: () => {
          toast({ title: "Tạo CLB thất bại", description: "Vui lòng thử lại.", duration: 3000 });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <section className="mb-8 rounded-3xl overflow-hidden relative h-[250px] md:h-[400px] shadow-xl group">
          <img
            src="/clan1.png"
            alt="Clan Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-accent text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    ĐỈNH CAO
                  </span>
                  <span className="bg-primary text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm">HẠNG TOÀN QUỐC #12</span>
                </div>
                <h1 className="text-white font-display text-3xl md:text-5xl font-bold mb-2">Thể Công Smash Elite</h1>
                <p className="text-white/90 text-sm md:text-base max-w-xl">Tận tâm với sự chính xác, tốc độ và tinh thần đồng đội trong cầu lông. Trụ sở tại Sân Thể Công, Đống Đa.</p>
              </div>
              <div className="flex gap-3">
                {user && (
                  <Button onClick={() => setCreateOpen(true)} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm px-5 h-12 rounded-xl font-bold">
                    <span className="material-symbols-outlined text-[18px] mr-1">add</span>
                    Tạo CLB
                  </Button>
                )}
                {featured && (
                  <Link href={`/clans/${featured.id}`}>
                    <Button className="bg-primary hover:bg-primary/90 text-white px-6 h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                      Tham gia CLB
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "groups", color: "text-primary", value: clans.reduce((s, c) => s + c.members, 0) || 42, label: "Thành viên" },
            { icon: "emoji_events", color: "text-accent", value: 156, label: "Trận thắng" },
            { icon: "trending_up", color: "text-teal-500", value: "88%", label: "Tỉ lệ thắng" },
            { icon: "star", color: "text-orange-500", value: "2.4k", label: "Điểm CLB" },
          ].map(({ icon, color, value, label }) => (
            <div key={label} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform">
              <span className={`material-symbols-outlined ${color} mb-2 text-[28px]`}>{icon}</span>
              <span className="font-display text-2xl font-bold text-slate-900">{value}</span>
              <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="font-display text-2xl font-bold text-slate-900">Khám phá CLB</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">{clans.length} CLB gần bạn</span>
            {user && (
              <Button onClick={() => setCreateOpen(true)} size="sm" className="bg-primary text-white font-bold rounded-xl h-9 px-4">
                <span className="material-symbols-outlined text-[16px] mr-1">add</span>
                Tạo CLB mới
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-medium">Đang tải CLB…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clans.map((clan) => (
              <div key={clan.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/30 transition-all flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={clan.image}
                      alt={clan.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/clan1.png"; }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{clan.name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{clan.location} • {clan.members} thành viên</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {clan.tags.map((tag) => (
                    <span key={tag} className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-grow">{clan.description}</p>

                <Link href={`/clans/${clan.id}`}>
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold h-11 transition-colors">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Tạo CLB mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Tên CLB *</label>
              <Input
                placeholder="VD: Hoàn Kiếm Kings"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-xl border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Địa điểm *</label>
              <Input
                placeholder="VD: Sân Mỹ Đình, Nam Từ Liêm"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="rounded-xl border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Mô tả *</label>
              <textarea
                placeholder="Giới thiệu về CLB của bạn…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Trình độ</label>
              <div className="grid grid-cols-2 gap-2">
                {LEVEL_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setForm((f) => ({ ...f, level: value }))}
                    className={`py-2 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                      form.level === value
                        ? "border-primary bg-teal-50 text-primary"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Nhãn</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      form.tags.includes(tag)
                        ? "border-primary bg-teal-50 text-primary"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Ảnh CLB</label>
              <div className="flex gap-3 flex-wrap items-center">
                {CLAN_IMAGES.map((img) => (
                  <button
                    key={img}
                    onClick={() => { setForm((f) => ({ ...f, image: img })); setCustomClanImage(null); }}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-4 transition-all ${
                      form.image === img && !customClanImage ? "border-primary scale-105 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="clan" className="w-full h-full object-cover" />
                  </button>
                ))}

                {customClanImage && (
                  <div
                    className="w-20 h-16 rounded-xl overflow-hidden border-4 border-primary scale-105 shadow-md"
                  >
                    <img src={customClanImage} alt="Ảnh tải lên" className="w-full h-full object-cover" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => clanImageInputRef.current?.click()}
                  className="w-20 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">upload</span>
                  <span className="text-[9px] font-bold">Tải lên</span>
                </button>
                <input
                  ref={clanImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleClanImageUpload}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-bold border-2 border-slate-200 h-11"
                onClick={() => setCreateOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11"
                onClick={handleCreate}
                disabled={createClan.isPending}
              >
                {createClan.isPending ? "Đang tạo…" : "Tạo CLB"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
