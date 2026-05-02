import { Link, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMatch,
  useConfirmMatch,
  getGetMatchQueryKey,
  getListMatchesQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ConfirmedMatch() {
  const [, params] = useRoute("/confirmed/:id");
  const matchId = params?.id ?? "";
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: match, isLoading } = useGetMatch(matchId);
  const confirmMutation = useConfirmMatch();

  const handleConfirm = () => {
    if (!matchId || !user) return;
    confirmMutation.mutate(
      { id: matchId, data: { username: user } },
      {
        onSuccess: () => {
          toast({
            title: "Kết quả đã xác nhận",
            description: "Kết quả trận đấu đã được ghi nhận.",
            duration: 3000,
          });
          queryClient.invalidateQueries({ queryKey: getGetMatchQueryKey(matchId) });
          queryClient.invalidateQueries({ queryKey: getListMatchesQueryKey() });
        },
        onError: (err) => {
          toast({
            title: "Không thể xác nhận",
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
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-8">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-0 flex justify-between items-center w-full px-4 md:px-6 h-16 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-slate-600 hover:text-slate-900 transition-colors p-1">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-xl font-bold text-primary font-display">Trận đang diễn ra</span>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 py-6 md:py-8 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-teal-800 p-6 md:p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Đang diễn ra
                </span>
                <span className="text-xs font-semibold text-teal-100">{match.court} • Phiên: #BC-{match.id}</span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-bold mb-2">{match.title}</h1>
              <p className="text-sm text-teal-50">{match.location} • {match.skillLevel}</p>
            </div>
            <div className="flex flex-col md:items-end bg-black/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/10">
              <span className="font-display text-3xl font-bold tabular-nums">42:15</span>
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-widest mt-1">Thời gian chơi</span>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-px h-full bg-white"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-display text-xl font-bold text-slate-900">Người tham gia</h2>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{match.players.length} Người đã xác nhận</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {match.players.map((player, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={player.avatar} alt={player.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                      <div className="absolute -top-2 -right-2 bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                        Lvl 8
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{player.name}</h3>
                      <div className="mt-1">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                          {player.level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="/profile" className="block w-full">
                    <Button variant="outline" className="w-full h-10 text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
                      Xem hồ sơ
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden mt-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-widest text-teal-400 border border-teal-500/30 px-2 py-1 rounded">BẢN GHI ĐIỂM</span>
                  <span className="text-xs font-bold text-slate-400">Ván 2/3</span>
                </div>
                
                <div className="flex items-center justify-between text-center px-4 md:px-12">
                  <div className="flex-1">
                    <div className="text-[48px] md:text-[64px] font-display font-bold text-white leading-none">21</div>
                    <div className="text-[10px] font-bold text-teal-400 tracking-wider mt-2">ĐỘI A</div>
                  </div>
                  <div className="px-6 text-xl font-bold text-slate-600 italic">vs</div>
                  <div className="flex-1">
                    <div className="text-[48px] md:text-[64px] font-display font-bold text-white leading-none">18</div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-wider mt-2">ĐỘI B</div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 pt-2">
                  <div className="h-1.5 w-10 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
                  <div className="h-1.5 w-10 bg-slate-700 rounded-full"></div>
                  <div className="h-1.5 w-10 bg-slate-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-display font-bold text-slate-900 text-lg">Thông tin sân đấu</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="aspect-video rounded-xl overflow-hidden relative shadow-inner">
                  <img src="/clan1.png" alt="Venue Map" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                      <span className="text-sm font-bold text-slate-900">{match.court}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-500">Giờ bắt đầu</span>
                    <span className="font-bold text-slate-900">{match.time}, hôm nay</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-500">Loại đặt sân</span>
                    <span className="font-bold text-slate-900">Tiêu chuẩn</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-500">Phí sân</span>
                    <span className="font-bold text-primary text-base">{match.fee.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleConfirm} disabled={confirmMutation.isPending} className="w-full h-14 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold shadow-md shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-60">
                <span className="material-symbols-outlined text-[20px]">sports_score</span>
                {confirmMutation.isPending ? "Đang xử lý…" : "Xác nhận kết quả trận đấu"}
              </Button>
              <Button variant="outline" className="w-full h-12 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50" onClick={() => toast({ title: "Báo cáo đã được ghi nhận", description: "Đội ngũ RallyHub sẽ xem xét trong vòng 24 giờ.", duration: 3000 })}>
                <span className="material-symbols-outlined text-[18px]">flag</span>
                Báo cáo vấn đề
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
