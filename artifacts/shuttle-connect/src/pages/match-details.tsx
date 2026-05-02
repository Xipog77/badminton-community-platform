import { Link, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPost,
  useJoinPost,
  getGetPostQueryKey,
  getListPostsQueryKey,
  getListMatchesQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function MatchDetails() {
  const [, params] = useRoute("/match/:id");
  const matchId = params?.id ?? "";
  const { user, extraInfo, userProfile } = useAuth();
  const { toast } = useToast();
  const userAvatar = extraInfo?.avatarUrl || userProfile?.avatar || "/avatar1.png";
  const queryClient = useQueryClient();
  const { data: match, isLoading } = useGetPost(matchId);
  const joinMutation = useJoinPost();
  const hasJoined = !!(match && user && match.players.some(p => p.name === user));

  const handleJoin = () => {
    if (!matchId || !user) return;
    joinMutation.mutate(
      { id: matchId, data: { username: user } },
      {
        onSuccess: () => {
          toast({
            title: "Tham gia thành công",
            description: "Bạn đã đăng ký tham gia trận đấu này.",
            duration: 3000,
          });
          queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(matchId) });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListMatchesQueryKey() });
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

  if (isLoading || !match) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Đang tải trận đấu…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm flex justify-between items-center w-full px-4 md:px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="active:scale-95 duration-200 hover:bg-slate-50 p-2 rounded-full text-slate-600">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-display tracking-tight text-xl font-bold text-primary">Chi tiết trận đấu</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="active:scale-95 duration-200 hover:bg-slate-50 p-2 rounded-full text-slate-600">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <section className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100">
              <div className="h-48 md:h-72 w-full relative">
                <img src="/clan1.png" alt="Court" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center bg-accent/90 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-3">
                    <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                    PHÒNG MỞ
                  </div>
                  <h1 className="text-white font-display text-2xl md:text-4xl font-bold">{match.title}</h1>
                </div>
              </div>
              
              <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-teal-50 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ngày</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{new Date(match.date).toLocaleDateString("vi-VN", {weekday: 'long', month: 'short', day: 'numeric'})}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-teal-50 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Giờ</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{match.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-teal-50 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Địa điểm</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{match.location}, {match.court}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-display text-xl font-semibold mb-4 text-slate-900">Về trận đấu</h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                {match.description || "Tham gia cùng chúng tôi trong một buổi đấu thân thiện nhưng nhiệt huyết. Mang vợt của bạn, cầu sẽ được cung cấp."}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{match.skillLevel}</span>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-200">Tranh tài</span>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-200">Cầu Victor</span>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="font-display text-xl font-semibold text-slate-900">Người chơi</h2>
                <span className="text-sm font-bold text-primary">{match.playersJoined} / {match.playersNeeded} Đã đăng ký</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={match.hostAvatar} alt={match.hostName} className="w-12 h-12 rounded-full object-cover" />
                      <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-bold border border-white">CHỦ</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{match.hostName}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">Lvl 12 • {match.skillLevel}</p>
                    </div>
                  </div>
                  <button className="p-2 text-primary hover:bg-teal-50 rounded-lg transition-all">
                    <span className="material-symbols-outlined">chat</span>
                  </button>
                </div>

                {match.players.filter(p => p.name !== match.hostName).map((player, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{player.name}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Lvl 8 • {player.level}</p>
                      </div>
                    </div>
                    <button className="p-2 text-primary hover:bg-teal-50 rounded-lg transition-all">
                      <span className="material-symbols-outlined">chat</span>
                    </button>
                  </div>
                ))}
                
                {hasJoined && (
                  <div className="bg-teal-50 p-4 rounded-xl shadow-sm border border-teal-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={userAvatar} alt="You" className="w-12 h-12 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }} />
                      <div>
                        <h4 className="text-sm font-bold text-primary">Bạn</h4>
                        <p className="text-xs font-semibold text-teal-600 mt-0.5">Sẵn sàng thi đấu</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">Vị trí sân đấu</h3>
              <div className="h-52 rounded-xl mb-3 overflow-hidden border border-slate-100">
                <iframe
                  title="Venue map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(match.location + " badminton court")}&output=embed&z=15`}
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm font-bold text-slate-900">{match.location}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{match.court}</p>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(match.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-primary text-xs font-bold flex items-center gap-1 hover:underline"
              >
                Chỉ đường
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phí sân</p>
                  <p className="font-display text-3xl font-bold text-slate-900 mt-1">{match.fee.toLocaleString("vi-VN")}đ <span className="text-sm font-medium text-slate-400">/ người</span></p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold tracking-wider border border-red-100">
                    CÒN {match.playersNeeded - match.playersJoined} CHỖ
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {hasJoined ? (
                  <Link href={`/confirmed/${match.id}`} className="block w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl font-bold text-base shadow-md">
                      Xem xác nhận tham gia
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={handleJoin} disabled={joinMutation.isPending || match.status !== "Open"} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl font-bold text-base shadow-md disabled:opacity-60">
                    {joinMutation.isPending ? "Đang xử lý…" : match.status !== "Open" ? "Phòng đã đầy" : "Yêu cầu tham gia"}
                  </Button>
                )}
                <Button variant="outline" className="w-full bg-white border-2 border-slate-200 text-slate-700 py-6 rounded-xl font-bold" onClick={() => toast({ title: "Tính năng đang phát triển", description: "Tính năng chat sẽ sớm ra mắt.", duration: 3000 })}>
                  Nhắn tin chủ phòng
                </Button>
              </div>
              
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="material-symbols-outlined text-[16px] text-green-500">verified_user</span>
                Đặt chỗ an toàn qua RallyHub
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
