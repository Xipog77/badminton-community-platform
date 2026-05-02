import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCreatePost, getListPostsQueryKey } from "@workspace/api-client-react";

export default function CreateMatch() {
  const [, setLocation] = useLocation();
  const { user, extraInfo, userProfile } = useAuth();
  const { toast } = useToast();
  const userAvatar = extraInfo?.avatarUrl || userProfile?.avatar || "/avatar1.png";
  const queryClient = useQueryClient();
  const createMutation = useCreatePost();

  const [location, setVenueLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [playersNeeded, setPlayersNeeded] = useState(2);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createMutation.mutate(
      {
        data: {
          title: location ? `Trận ${skillLevel} tại ${location}` : `Trận ${skillLevel}`,
          hostName: user,
          date,
          time,
          location: location || "Chưa xác định",
          court: "Sân số 1",
          skillLevel,
          playersNeeded,
          fee: 70000,
          description: description || "Trận đấu giao lưu thân thiện.",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Đã đăng trận",
            description: "Trận đấu của bạn đã được đăng thành công.",
            duration: 3000,
          });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          setLocation("/home");
        },
        onError: (err) => {
          toast({
            title: "Không thể đăng trận",
            description: err instanceof Error ? err.message : "Vui lòng thử lại sau.",
            duration: 4000,
          });
        },
      }
    );
  };

  const isSubmitting = createMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-0 flex justify-between items-center w-full px-4 md:px-6 h-16 z-50">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-xl font-bold text-slate-900 font-display tracking-tight">Tạo trận đấu</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <img src={userAvatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }} />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Tổ chức buổi đấu</h2>
          <p className="text-sm font-medium text-slate-500">Điền thông tin để tìm đối thủ phù hợp cho trận tiếp theo của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              Địa điểm sân đấu
            </label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={location}
                onChange={(e) => setVenueLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm" 
                placeholder="Tìm sân hoặc CLB..." 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              <button type="button" onClick={() => setVenueLocation("Sân Thể Công")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-teal-50 hover:text-primary transition-colors border border-slate-200">Sân Thể Công</button>
              <button type="button" onClick={() => setVenueLocation("Nhà thi đấu Hoàn Kiếm")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-teal-50 hover:text-primary transition-colors border border-slate-200">Hoàn Kiếm</button>
              <button type="button" onClick={() => setVenueLocation("Sân cầu lông Tây Hồ")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-teal-50 hover:text-primary transition-colors border border-slate-200">Tây Hồ</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                Ngày thi đấu
              </label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                Giờ bắt đầu
              </label>
              <input 
                type="time" 
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
                Trình độ
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm appearance-none"
              >
                <option value="Beginner">Người mới</option>
                <option value="Intermediate">Trung cấp</option>
                <option value="Advanced">Nâng cao</option>
                <option value="Pro">Chuyên nghiệp</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">groups</span>
                Số người cần
              </label>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <button type="button" onClick={() => setPlayersNeeded(Math.max(1, playersNeeded - 1))} className="p-3 text-slate-500 hover:bg-slate-50 transition-colors border-r border-slate-200">
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <input
                  type="number"
                  value={playersNeeded}
                  onChange={(e) => setPlayersNeeded(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                  min="1"
                  max="10"
                  className="w-full text-center border-none bg-transparent focus:ring-0 font-bold text-sm"
                />
                <button type="button" onClick={() => setPlayersNeeded(Math.min(10, playersNeeded + 1))} className="p-3 text-slate-500 hover:bg-slate-50 transition-colors border-l border-slate-200">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">notes</span>
              Ghi chú & yêu cầu
            </label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border-slate-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm resize-none" 
              placeholder="Số sân, loại cầu, nội quy giao lưu..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl flex items-center gap-3 border-2 border-transparent hover:border-primary cursor-pointer transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Trận riêng tư</p>
                <p className="text-[10px] text-slate-500 font-medium">Chỉ theo lời mời</p>
              </div>
            </div>
            <div className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 border-2 border-primary cursor-pointer transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>public</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Phòng mở</p>
                <p className="text-[10px] text-white/80 font-medium">Ai cũng có thể tham gia</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 bg-primary text-white font-display font-semibold text-lg rounded-2xl shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Đang đăng..."
              ) : (
                <>
                  <span className="material-symbols-outlined">add_circle</span>
                  Đăng trận
                </>
              )}
            </Button>
            <p className="text-center text-xs font-medium text-slate-500 mt-4">Trận đấu sẽ hiển thị với người chơi trong khu vực của bạn.</p>
          </div>
        </form>
      </main>
    </div>
  );
}
