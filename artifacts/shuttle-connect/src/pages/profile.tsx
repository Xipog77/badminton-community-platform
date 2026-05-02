import { useState, useRef } from "react";
import { Link } from "wouter";
import { useListPosts, useListMatches } from "@workspace/api-client-react";
import { Navbar, BottomNav } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const AVATARS = [
  { src: "/avatar1.png", label: "Avatar 1" },
  { src: "/avatar2.png", label: "Avatar 2" },
];

const SKILL_LEVELS: { value: string; label: string }[] = [
  { value: "new", label: "Mới" },
  { value: "weak", label: "Yếu" },
  { value: "average", label: "Trung bình" },
  { value: "good", label: "Khá" },
  { value: "very_good", label: "Tốt" },
  { value: "pro", label: "Chuyên nghiệp" },
];

const AVATAR_SRCS = ["/avatar1.png", "/avatar2.png"];

export default function Profile() {
  const { user, userProfile, extraInfo, updateProfile, updateExtraInfo } = useAuth();
  const { toast } = useToast();

  const { data: postsData } = useListPosts();
  const { data: matchesData } = useListMatches();

  const userPosts = (postsData ?? []).filter(
    (m) => m.hostName === user || m.players.some((p) => p.name === user)
  );
  const userCompletedMatches = (matchesData ?? []).filter(
    (m) => m.hostName === user || m.players.some((p) => p.name === user)
  );
  const seenIds = new Set<string>();
  const allUserMatches = [...userCompletedMatches, ...userPosts].filter((m) => {
    if (seenIds.has(m.id)) return false;
    seenIds.add(m.id);
    return true;
  });
  const totalMatchCount = allUserMatches.length;

  const partnerMap = new Map<string, number>();
  allUserMatches.forEach((m) => {
    m.players.forEach((p) => {
      if (p.name !== user) {
        partnerMap.set(p.name, (partnerMap.get(p.name) ?? 0) + 1);
      }
    });
  });
  const topPartners = [...partnerMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(extraInfo.avatarUrl ?? userProfile?.avatar ?? "/avatar1.png");
  const [selectedSkill, setSelectedSkill] = useState(userProfile?.skillLevel ?? "Intermediate");
  const [editPhone, setEditPhone] = useState(extraInfo.phone);
  const [editDob, setEditDob] = useState(extraInfo.dob);
  const [editNationalId, setEditNationalId] = useState(extraInfo.nationalId);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const avatar = extraInfo.avatarUrl || userProfile?.avatar || "/avatar1.png";
  const skillLevel = userProfile?.skillLevel ?? "Intermediate";
  const skillLabel = SKILL_LEVELS.find((s) => s.value === skillLevel)?.label ?? skillLevel;

  const handleOpenEdit = () => {
    setSelectedAvatar(avatar);
    setSelectedSkill(skillLevel);
    setEditPhone(extraInfo.phone);
    setEditDob(extraInfo.dob);
    setEditNationalId(extraInfo.nationalId);
    setEditOpen(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setSelectedAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(selectedAvatar, selectedSkill);
      updateExtraInfo({ avatarUrl: selectedAvatar, phone: editPhone, dob: editDob, nationalId: editNationalId });
      toast({ title: "Cập nhật hồ sơ thành công", description: "Thay đổi của bạn đã được lưu.", duration: 3000 });
      setEditOpen(false);
    } catch {
      toast({ title: "Cập nhật thất bại", description: "Vui lòng thử lại.", duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const formatDob = (dob: string) => {
    if (!dob) return "—";
    const d = new Date(dob);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-8">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm">
                <img
                  src={avatar}
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm tracking-wider">PRO</div>
            </div>

            <div className="text-center md:text-left flex-1 w-full">
              <h1 className="font-display text-2xl md:text-4xl font-bold text-slate-900">{user || "Người chơi"}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">stars</span> {skillLabel}
                </span>
                <span className="bg-teal-50 text-primary border border-teal-100 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> Hà Nội
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">phone</span> Số điện thoại
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{extraInfo.phone || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">cake</span> Ngày sinh
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{formatDob(extraInfo.dob)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">badge</span> Số CCCD
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {extraInfo.nationalId ? `${"•".repeat(Math.max(0, extraInfo.nationalId.length - 4))}${extraInfo.nationalId.slice(-4)}` : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-5 w-full max-w-sm mx-auto md:mx-0">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tiến độ XP mùa giải</span>
                  <span className="text-xs font-bold text-primary">2.450 / 3.000</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-primary w-[75%] rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 overflow-hidden">
                      <div className="h-full w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button onClick={handleOpenEdit} className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11">
                Chỉnh sửa hồ sơ
              </Button>
              <Button variant="outline" className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl h-11">
                Chia sẻ hồ sơ
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Trận đấu</span>
              <span className="font-display text-3xl font-bold text-slate-900">{totalMatchCount}</span>
              <span className="text-[10px] text-primary font-bold mt-1 bg-teal-50 px-2 py-0.5 rounded-full">tổng tham gia</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Tỉ lệ thắng</span>
              <span className="font-display text-3xl font-bold text-accent">68%</span>
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-2">
                <div className="h-full bg-accent w-[68%] rounded-full"></div>
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Chuỗi thắng</span>
              <span className="font-display text-3xl font-bold text-slate-900 flex items-center gap-1">5 <span className="text-accent text-2xl">🔥</span></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Hiện tại</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Hạng</span>
              <span className="font-display text-3xl font-bold text-slate-900">#24</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">BXH Thành phố</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex border-b border-slate-200">
              <button className="pb-3 px-4 font-bold text-primary border-b-2 border-primary relative">
                Lịch sử trận đấu
                {totalMatchCount > 0 && (
                  <span className="absolute top-0 -right-2 bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-primary/20">{totalMatchCount}</span>
                )}
              </button>
              <button className="pb-3 px-6 font-bold text-slate-400 hover:text-slate-700 transition-colors">CLB</button>
            </div>

            {allUserMatches.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center space-y-3">
                <span className="material-symbols-outlined text-slate-300 text-[48px] block">sports_tennis</span>
                <p className="text-slate-500 font-medium">Bạn chưa tham gia trận nào. Hãy tham gia trận đấu đầu tiên!</p>
                <Link href="/matches">
                  <Button className="bg-primary text-white rounded-xl px-5 mt-2">Tìm trận đấu</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {allUserMatches.slice(0, 5).map((match) => (
                  <Link
                    key={match.id}
                    href={`/match/${match.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-4 items-center hover:shadow-md transition-all group block"
                  >
                    <div className="shrink-0 w-full sm:w-24 h-24 rounded-xl bg-slate-100 overflow-hidden relative">
                      <img
                        src="/clan2.png"
                        alt="Trận đấu"
                        className="w-full h-full object-cover grayscale opacity-80"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/clan1.png"; }}
                      />
                      <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-white/20 ${
                        match.status === "Completed" ? "bg-primary" : match.status === "Full" ? "bg-slate-600" : "bg-accent"
                      }`}>
                        {match.status === "Completed" ? "XONG" : match.status === "Full" ? "ĐẦY" : "MỞ"}
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">{match.title}</h3>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          {new Date(match.date).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span> {match.location}, {match.court}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex -space-x-2">
                          {match.players.slice(0, 3).map((p, i) => (
                            <img
                              key={i}
                              src={p.avatar}
                              className="w-7 h-7 rounded-full border-2 border-white object-cover"
                              alt={p.name}
                              onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500">{match.playersJoined}/{match.playersNeeded} người</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {allUserMatches.length > 5 && (
              <Link href="/matches">
                <Button variant="outline" className="w-full rounded-xl font-bold text-slate-600 h-12 border-slate-200 bg-white hover:bg-slate-50 mt-2">
                  Xem toàn bộ lịch sử ({allUserMatches.length} trận)
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-5">Chỉ số kỹ năng</h2>
              <div className="space-y-4">
                {[
                  { label: "Lực smash", pct: 85 },
                  { label: "Sự nhanh nhẹn", pct: 72 },
                  { label: "Lưới", pct: 94 },
                  { label: "Sức bền", pct: 60 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600">{label}</span>
                      <span className="text-primary">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 py-2 border-2 border-dashed border-slate-200 text-slate-500 font-bold rounded-xl hover:border-primary hover:text-primary transition-all h-10">
                Yêu cầu đánh giá
              </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Đối tác thường xuyên</h2>
              {topPartners.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Chưa có đối tác nào. Tham gia trận đấu để gặp bạn cùng chơi!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {topPartners.map(([name, count], idx) => (
                    <div key={name} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <img
                        src={AVATAR_SRCS[idx % AVATAR_SRCS.length]}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        alt={name}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                      />
                      <div>
                        <p className="font-bold text-sm text-slate-900">{name}</p>
                        <p className="text-[10px] font-semibold text-slate-500">{count} trận cùng nhau</p>
                      </div>
                      <button className="ml-auto text-primary hover:bg-teal-50 p-2 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <BottomNav />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Chỉnh sửa hồ sơ</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ảnh đại diện</p>
              <div className="flex gap-3 flex-wrap items-center">
                {AVATARS.map(({ src, label }) => (
                  <button
                    key={src}
                    onClick={() => setSelectedAvatar(src)}
                    className={`relative w-16 h-16 rounded-2xl overflow-hidden border-4 transition-all ${
                      selectedAvatar === src
                        ? "border-primary shadow-md scale-105"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    aria-label={label}
                  >
                    <img src={src} alt={label} className="w-full h-full object-cover" />
                    {selectedAvatar === src && (
                      <div className="absolute inset-0 bg-primary/10 flex items-end justify-end p-1">
                        <span className="material-symbols-outlined text-primary text-[16px] bg-white rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </div>
                    )}
                  </button>
                ))}

                {selectedAvatar && !AVATARS.some((a) => a.src === selectedAvatar) && (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-4 border-primary shadow-md scale-105">
                    <img src={selectedAvatar} alt="Ảnh tải lên" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/10 flex items-end justify-end p-1">
                      <span className="material-symbols-outlined text-primary text-[16px] bg-white rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">upload</span>
                  <span className="text-[9px] font-bold">Tải lên</span>
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Trình độ</p>
              <div className="grid grid-cols-2 gap-2">
                {SKILL_LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedSkill(value)}
                    className={`py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                      selectedSkill === value
                        ? "border-primary bg-teal-50 text-primary"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin cá nhân</p>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">phone</span> Số điện thoại
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="0912 345 678"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">cake</span> Ngày sinh
                </label>
                <input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">badge</span> Số CCCD
                </label>
                <input
                  type="text"
                  value={editNationalId}
                  onChange={(e) => setEditNationalId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="012345678901"
                  maxLength={12}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-bold border-2 border-slate-200 h-11"
                onClick={() => setEditOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu…" : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
