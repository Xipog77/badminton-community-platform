import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar, BottomNav } from "@/components/layout";
import {
  useGetClan,
  useJoinClan,
  useListPosts,
  useListMatches,
  getGetClanQueryKey,
  getListClansQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "members" | "activity" | "matches";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Tổng quan" },
  { id: "members", label: "Danh sách thành viên" },
  { id: "activity", label: "Hoạt động gần đây" },
  { id: "matches", label: "Trận CLB" },
];

const AVATARS = ["/avatar1.png", "/avatar2.png"];

export default function ClanDetails() {
  const [, params] = useRoute("/clans/:id");
  const clanId = params?.id ?? "";
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: clan, isLoading } = useGetClan(clanId);
  const joinMutation = useJoinClan();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data: postsData } = useListPosts();
  const { data: matchesData } = useListMatches();

  const openPosts = (postsData ?? []).filter((p) => p.status === "Open").slice(0, 3);
  const completedMatches = (matchesData ?? []).filter((m) => m.status === "Completed");
  const allPostsAndMatches = [
    ...completedMatches,
    ...(postsData ?? []).filter((p) => p.status === "Full"),
    ...(postsData ?? []).filter((p) => p.status === "Open"),
  ];

  const recentMembers = (clan?.memberNames ?? []).slice(-3);

  const handleJoin = () => {
    if (!clanId || !user || !clan) return;
    joinMutation.mutate(
      { id: clanId, data: { username: user } },
      {
        onSuccess: () => {
          toast({
            title: "Đã gửi yêu cầu",
            description: `Bạn đã yêu cầu tham gia ${clan.name}.`,
            duration: 3000,
          });
          queryClient.invalidateQueries({ queryKey: getGetClanQueryKey(clanId) });
          queryClient.invalidateQueries({ queryKey: getListClansQueryKey() });
        },
        onError: (err) => {
          toast({
            title: "Không thể tham gia",
            description: err instanceof Error ? err.message : "Vui lòng thử lại sau.",
            duration: 4000,
          });
        },
      }
    );
  };

  if (isLoading || !clan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Đang tải CLB…</p>
      </div>
    );
  }

  const alreadyMember = !!user && clan.memberNames.includes(user);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 border-b-2 font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-40 bg-primary relative">
                  <img src={clan.image} alt={clan.name} className="w-full h-full object-cover opacity-80 mix-blend-overlay" onError={(e) => { (e.target as HTMLImageElement).src = "/clan1.png"; }} />
                  <div className="absolute -bottom-10 left-6 md:left-8">
                    <div className="w-20 h-20 bg-white p-1.5 rounded-2xl shadow-md border border-slate-100">
                      <div className="w-full h-full bg-teal-500 rounded-xl flex items-center justify-center text-white overflow-hidden">
                        <img src={clan.image} alt="Logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/clan1.png"; }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-14 px-6 md:px-8 pb-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-1">{clan.name}</h1>
                      <p className="text-sm font-semibold text-slate-500">CLB riêng tư • {clan.level}</p>
                    </div>
                    <Button onClick={handleJoin} disabled={joinMutation.isPending || alreadyMember} className="bg-primary text-white px-8 py-5 rounded-full font-bold shadow-md hover:bg-primary/90 w-full md:w-auto disabled:opacity-60">
                      {alreadyMember ? "Đã tham gia" : joinMutation.isPending ? "Đang tham gia…" : "Tham gia CLB"}
                    </Button>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-8">
                    {clan.description} Chúng tôi tập trung vào tập luyện hiệu suất cao, kết nối trận đấu chiến lược và xây dựng cộng đồng hỗ trợ cho các vận động viên ở mọi trình độ.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">Sân nhà</p>
                        <p className="text-xs font-semibold text-slate-500">{clan.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="material-symbols-outlined text-primary text-[24px]">schedule</span>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">Buổi tập chính</p>
                        <p className="text-xs font-semibold text-slate-500">Thứ 3 & Thứ 5, 18:00 - 22:00</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900">Thành viên ({clan.members})</h3>
                      <button onClick={() => setActiveTab("members")} className="text-xs text-primary font-bold hover:underline">Xem tất cả</button>
                    </div>
                    <div className="flex -space-x-3">
                      {recentMembers.length > 0 ? (
                        <>
                          {recentMembers.map((name, i) => (
                            <img key={name} src={AVATARS[i % AVATARS.length]} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt={name} title={name} onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }} />
                          ))}
                          {clan.members > recentMembers.length && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm z-10 relative">
                              +{clan.members - recentMembers.length}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <img src="/avatar1.png" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="Member" />
                          <img src="/avatar2.png" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="Member" />
                          {clan.members > 2 && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm z-10 relative">
                              +{clan.members - 2}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="font-display text-xl font-bold mb-6">Trận sắp tới</h2>
                {openPosts.length === 0 ? (
                  <div className="text-center py-6">
                    <span className="material-symbols-outlined text-slate-300 text-[40px] block mb-2">sports_tennis</span>
                    <p className="text-slate-500 text-sm">Chưa có trận nào đang mở.</p>
                    <Link href="/create" className="mt-3 inline-block">
                      <Button className="bg-primary text-white rounded-xl px-4 text-sm">Đăng trận</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openPosts.map((post) => {
                      const postDate = new Date(post.date);
                      const month = postDate.toLocaleDateString("vi-VN", { month: "short" }).toUpperCase();
                      const day = postDate.getDate();
                      const spotsLeft = post.playersNeeded - post.playersJoined;
                      return (
                        <Link key={post.id} href={`/match/${post.id}`} className="block">
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                              <div className="text-center px-3 py-2 bg-white rounded-xl shadow-sm border border-slate-200 min-w-[60px]">
                                <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">{month}</p>
                                <p className="text-xl font-display font-bold text-primary leading-none">{day}</p>
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{post.title}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">{post.location} • {post.time}</p>
                              </div>
                            </div>
                            <span className={`border text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide ${
                              spotsLeft <= 1
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-teal-50 text-primary border-teal-100"
                            }`}>
                              {spotsLeft <= 0 ? "ĐẦY" : `${spotsLeft} CHỖ`}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-display text-lg font-bold mb-6">Hoạt động gần đây</h3>
                <div className="space-y-6">
                  {clan.memberNames.length > 0 ? (
                    clan.memberNames.slice(-3).reverse().map((name, i) => (
                      <div key={name} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? "bg-orange-50 text-accent" : "bg-teal-50 text-primary"}`}>
                          <span className="material-symbols-outlined text-[20px]">person_add</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900"><span className="text-primary">{name}</span> đã tham gia CLB</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">Thành viên mới</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0 text-primary">
                          <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">CLB vừa được thành lập</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">Chào mừng đến với {clan.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">CLB đã được xác thực</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">Trên RallyHub</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">campaign</span>
                  <span className="text-xs font-bold text-slate-500 tracking-wider">THÔNG BÁO MỚI NHẤT</span>
                </div>
                <p className="text-sm font-medium text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "Chào mừng tất cả thành viên mới! Hãy tham gia trận đấu để làm quen với nhau. Cùng nhau phát triển CLB {clan.name}!"
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-3 flex items-center justify-end gap-1">
                  <img src="/avatar1.png" className="w-4 h-4 rounded-full" alt="Admin" />
                  Quản trị CLB
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl font-bold text-slate-900">Thành viên ({clan.members})</h2>
              {alreadyMember && (
                <span className="text-xs font-bold bg-teal-50 text-primary border border-teal-100 px-3 py-1 rounded-full">Bạn đã là thành viên</span>
              )}
            </div>
            {clan.memberNames.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <span className="material-symbols-outlined text-slate-300 text-[48px]">group</span>
                <p className="text-slate-500 font-medium mt-3">Chưa có thành viên. Hãy là người đầu tiên tham gia!</p>
                {!alreadyMember && (
                  <Button onClick={handleJoin} disabled={joinMutation.isPending} className="mt-4 bg-primary text-white font-bold rounded-xl">
                    {joinMutation.isPending ? "Đang tham gia…" : "Tham gia CLB"}
                  </Button>
                )}
              </div>
            ) : (
              clan.memberNames.map((name, idx) => (
                <div key={name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all">
                  <img
                    src={AVATARS[idx % AVATARS.length]}
                    alt={name}
                    className="w-12 h-12 rounded-full border-2 border-slate-100 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{name}</p>
                    <p className="text-xs font-semibold text-slate-400">Thành viên</p>
                  </div>
                  {name === user && (
                    <span className="text-[10px] font-bold bg-teal-50 text-primary border border-teal-100 px-2 py-1 rounded-full">Bạn</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="max-w-2xl space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Hoạt động gần đây</h2>
            {clan.memberNames.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <span className="material-symbols-outlined text-slate-300 text-[48px]">history</span>
                <p className="text-slate-500 font-medium mt-3">Chưa có hoạt động nào. Tham gia CLB để bắt đầu!</p>
              </div>
            ) : (
              clan.memberNames.slice().reverse().map((name, i) => (
                <div key={name + i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    i % 2 === 0 ? "bg-orange-50 text-accent" : "bg-teal-50 text-primary"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      <span className="text-primary">{name}</span> đã tham gia CLB
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Thành viên mới của {clan.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "matches" && (
          <div className="max-w-2xl space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Trận CLB</h2>
            {allPostsAndMatches.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <span className="material-symbols-outlined text-slate-300 text-[48px]">sports_tennis</span>
                <p className="text-slate-500 font-medium mt-3">Chưa có trận nào. Hãy đăng trận đầu tiên!</p>
                <Link href="/create" className="mt-4 inline-block">
                  <Button className="bg-primary text-white font-bold rounded-xl">Đăng trận</Button>
                </Link>
              </div>
            ) : (
              allPostsAndMatches.slice(0, 10).map((match) => {
                const matchDate = new Date(match.date);
                const month = matchDate.toLocaleDateString("vi-VN", { month: "short" }).toUpperCase();
                const day = matchDate.getDate();
                const isCompleted = match.status === "Completed";
                const isFull = match.status === "Full";
                const isOpen = match.status === "Open";
                return (
                  <Link key={match.id} href={`/match/${match.id}`} className="block">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all">
                      <div className="text-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 min-w-[60px]">
                        <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">{month}</p>
                        <p className="text-xl font-display font-bold text-primary leading-none">{day}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{match.title}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{match.location} • {match.time}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{match.court}</p>
                      </div>
                      <span className={`border text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide whitespace-nowrap ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : isFull
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : isOpen
                          ? "bg-teal-50 text-primary border-teal-100"
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>
                        {isCompleted ? "XONG" : isFull ? "ĐẦY" : "MỞ"}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
