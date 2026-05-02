import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);
    try {
      await login(email.split("@")[0] || "Player");
      setLocation("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface-container-lowest font-sans">
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 overflow-hidden">
        <img 
          src="/clan1.png" 
          alt="Badminton Smash Action" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 w-full h-full bg-black/30 backdrop-blur-[2px] flex flex-col justify-between p-12 lg:p-20">
          <div>
            <span className="text-2xl font-black text-white italic font-display tracking-tight">RallyHub</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-display text-white text-[48px] leading-tight mb-4">Nâng tầm kỹ năng, kết nối sân cầu.</h1>
            <p className="text-white/90 text-lg">Tham gia cộng đồng cầu lông lớn nhất Hà Nội và tìm đối thủ xứng tầm ngay hôm nay.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              <img src="/avatar1.png" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="/avatar2.png" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            </div>
            <span className="text-white text-sm font-medium tracking-wide">+2k người chơi đang hoạt động</span>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center p-4 lg:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="md:hidden flex justify-center mb-10">
            <span className="text-2xl font-black text-primary italic font-display tracking-tight">RallyHub</span>
          </div>
          
          <header className="text-center md:text-left">
            <h2 className="font-display text-[32px] font-bold text-slate-900 leading-tight">Chào mừng trở lại</h2>
            <p className="text-slate-600 mt-1">Đăng nhập để theo dõi trận đấu và bảng xếp hạng của bạn.</p>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 hover:bg-slate-50 transition-all active:scale-95 duration-200 shadow-sm">
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 hover:bg-slate-50 transition-all active:scale-95 duration-200 shadow-sm">
              <span className="text-sm font-semibold">Apple</span>
            </button>
          </div>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-grow h-px bg-slate-200"></div>
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Hoặc đăng nhập bằng email</span>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-slate-900 px-1">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                <input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-slate-900 transition-colors placeholder:text-slate-400" 
                  placeholder="name@example.com" 
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-sm font-semibold text-slate-900">Mật khẩu</label>
                <a href="#" className="text-primary text-xs font-medium hover:underline">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                <input 
                  id="password" 
                  type="password" 
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-slate-900 transition-colors placeholder:text-slate-400" 
                  placeholder="••••••••" 
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1 py-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-xs font-medium text-slate-600 select-none">Ghi nhớ đăng nhập trong 30 ngày</label>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium px-1">{error}</p>
            )}
            <button type="submit" disabled={submitting} className="w-full py-4 bg-primary text-white rounded-xl font-display font-semibold text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 disabled:opacity-60">
              {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>

          <footer className="text-center pt-2">
            <p className="text-slate-600 text-sm">
              Chưa có tài khoản? <Link href="/register" className="text-primary font-semibold hover:underline ml-1">Đăng ký ngay</Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
