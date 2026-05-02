import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, BottomNav } from "@/components/layout";
import { useListPosts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

const SKILL_LEVELS = ["Mọi trình độ", "Beginner", "Intermediate", "Advanced", "Pro"];
const SKILL_LABEL: Record<string, string> = {
  "Beginner": "Người mới",
  "Intermediate": "Trung cấp",
  "Advanced": "Nâng cao",
  "Pro": "Chuyên nghiệp",
  "Mọi trình độ": "Mọi trình độ",
};

const SKILL_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
  Advanced: "bg-purple-50 text-purple-700 border-purple-200",
  Pro: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Matches() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("Mọi trình độ");
  const { data, isLoading } = useListPosts();
  const matches = data ?? [];

  const filteredMatches = matches.filter((m) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Live" && m.status === "In Progress") ||
      (statusFilter === "Upcoming" && m.status === "Open");

    const matchesSkill =
      skillFilter === "Mọi trình độ" ||
      m.skillLevel?.toLowerCase() === skillFilter.toLowerCase();

    return matchesStatus && matchesSkill;
  });

  const activeCount = matches.filter((m) => m.status === "Open").length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Tìm trận đấu</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Duyệt phòng chờ, lọc theo trạng thái hoặc trình độ, hoặc tự đăng trận.</p>
          </div>
          <Link href="/create">
            <Button className="bg-primary text-white px-5 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 flex items-center gap-2 w-full md:w-auto">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Đăng trận
            </Button>
          </Link>
        </div>

        <section className="mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
            <div className="p-4 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "All", label: "Tất cả" },
                  { key: "Upcoming", label: "Sắp tới" },
                  { key: "Live", label: "Đang diễn ra" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      statusFilter === key
                        ? key === "Live"
                          ? "bg-accent text-white border-accent"
                          : "bg-primary text-white border-primary"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {key === "Live" && <span className="w-2 h-2 rounded-full bg-current"></span>}
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Sắp xếp:</span>
                <select className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 cursor-pointer">
                  <option>Gần nhất</option>
                  <option>Sớm nhất</option>
                </select>
              </div>
            </div>

            <div className="px-4 py-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Trình độ:</span>
              {SKILL_LEVELS.map((level) => {
                const isActive = skillFilter === level;
                const colorClass = level !== "Mọi trình độ" ? SKILL_COLORS[level] : "";
                return (
                  <button
                    key={level}
                    onClick={() => setSkillFilter(level)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      isActive
                        ? level === "Mọi trình độ"
                          ? "bg-slate-800 text-white border-slate-800"
                          : colorClass + " ring-2 ring-offset-1 ring-current"
                        : level === "Mọi trình độ"
                        ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        : (colorClass ?? "") + " opacity-70 hover:opacity-100"
                    }`}
                  >
                    {SKILL_LABEL[level] ?? level}
                  </button>
                );
              })}

              {(statusFilter !== "All" || skillFilter !== "Mọi trình độ") && (
                <button
                  onClick={() => { setStatusFilter("All"); setSkillFilter("Mọi trình độ"); }}
                  className="ml-auto text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Bỏ lọc
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                {skillFilter !== "Mọi trình độ" ? `Trận ${SKILL_LABEL[skillFilter] ?? skillFilter}` : "Trận đấu có sẵn"}
              </h2>
              <span className="bg-orange-100 text-accent text-[12px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-accent rounded-full"></span> {activeCount} SẮP TỚI
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-32 animate-pulse flex gap-4">
                    <div className="w-full bg-slate-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredMatches.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredMatches.map((match) => {
                  const skillColor = SKILL_COLORS[match.skillLevel] ?? "bg-slate-100 text-slate-600 border-slate-200";
                  return (
                    <motion.article
                      key={match.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-5 flex flex-col md:flex-row gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                    >
                      <div className="flex-grow flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={match.hostAvatar}
                              alt={match.hostName}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                            />
                            <div>
                              <p className="font-semibold text-slate-900">{match.hostName}</p>
                              <p className="text-sm font-medium text-slate-500">
                                {match.time} • {new Date(match.date).toLocaleDateString("vi-VN", { weekday: "short" })}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${skillColor}`}>
                            {SKILL_LABEL[match.skillLevel] ?? match.skillLevel}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-900">
                            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                            <span className="font-medium text-sm md:text-base">{match.location}, {match.court}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                            <span className="text-sm font-medium">{match.playersJoined}/{match.playersNeeded} người tham gia</span>
                          </div>
                        </div>

                        <div className="flex -space-x-2 mt-1">
                          {match.players.map((p, i) => (
                            <img
                              key={i}
                              src={p.avatar}
                              alt={p.name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                            />
                          ))}
                          {match.playersJoined > match.players.length && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              +{match.playersJoined - match.players.length}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between items-end gap-4 md:w-32">
                        <div className="text-right hidden md:block">
                          <p className="text-[20px] font-extrabold text-primary">{match.fee.toLocaleString("vi-VN")}đ</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phí sân</p>
                        </div>
                        <Link href={`/match/${match.id}`} className="w-full">
                          <Button className="w-full rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white">
                            Xem
                          </Button>
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-slate-300 text-5xl mb-3">search_off</span>
                <h3 className="font-display text-xl font-bold text-slate-800 mb-1">Không tìm thấy trận nào</h3>
                <p className="text-slate-500">Thử thay đổi bộ lọc hoặc đăng trận mới.</p>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => { setStatusFilter("All"); setSkillFilter("Mọi trình độ"); }} className="rounded-lg">
                    Bỏ lọc
                  </Button>
                  <Link href="/create">
                    <Button className="rounded-lg bg-primary text-white">Tạo trận</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-sm font-medium opacity-80 mb-1">Tiến độ của bạn</p>
                <h3 className="font-display text-2xl font-bold mb-4">Cấp 14 · Chiến binh</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold">2.450</span>
                  <span className="text-sm font-medium opacity-80 mb-1">/ 3.000 XP</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-6">
                  <div className="bg-white h-full rounded-full w-[75%]"></div>
                </div>
                <Button className="w-full bg-white text-primary hover:bg-slate-50 font-semibold rounded-xl">Xem bảng xếp hạng</Button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">filter_list</span>
                Hướng dẫn trình độ
              </h4>
              <div className="space-y-2">
                {[
                  { level: "Beginner", desc: "Mới chơi, đang học kỹ thuật cơ bản" },
                  { level: "Intermediate", desc: "Đánh ổn định, nắm được chiến thuật" },
                  { level: "Advanced", desc: "Sẵn sàng thi đấu, kỹ thuật chính xác" },
                  { level: "Pro", desc: "Tay vợt đỉnh cao, thi đấu chuyên nghiệp" },
                ].map(({ level, desc }) => (
                  <button
                    key={level}
                    onClick={() => setSkillFilter(level)}
                    className={`w-full text-left flex items-start gap-2 p-2 rounded-lg transition-colors ${skillFilter === level ? "bg-slate-50" : "hover:bg-slate-50"}`}
                  >
                    <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 border ${SKILL_COLORS[level]}`} style={{ backgroundColor: "currentcolor" }}></span>
                    <div>
                      <p className={`text-xs font-bold ${SKILL_COLORS[level]?.split(" ")[1] ?? "text-slate-700"}`}>{SKILL_LABEL[level] ?? level}</p>
                      <p className="text-[11px] font-medium text-slate-500">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <span className="material-symbols-outlined text-accent mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <h4 className="font-semibold text-slate-900 mb-2">Mẹo hay: Lực nắm vợt</h4>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">Giữ lỏng cổ tay cho đến khoảnh khắc tiếp xúc cầu giúp tăng lực smash đáng kể và tránh mỏi cổ tay.</p>
            </div>
          </aside>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
