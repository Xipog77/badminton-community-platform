import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [, setLocation] = useLocation();
  const { login, updateExtraInfo } = useAuth();
  const [skill, setSkill] = useState("beginner");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSubmitting(true);
    setError(null);
    try {
      await login(name);
      updateExtraInfo({ phone, dob, nationalId });
      setLocation("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-surface-bright font-sans">
      <section className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="/clan1.png" alt="Ảnh nền" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-black/40"></div>
        <div className="relative z-10 max-w-md text-white">
          <h1 className="font-display text-[32px] font-black italic uppercase tracking-tighter mb-4">RallyHub</h1>
          <p className="font-display text-[24px] font-semibold mb-8 opacity-90 leading-tight">Tham gia cộng đồng cầu lông lớn nhất Hà Nội.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-teal-200">groups</span>
              <span className="font-semibold text-lg">Tìm câu lạc bộ gần bạn</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-teal-200">emoji_events</span>
              <span className="font-semibold text-lg">Theo dõi bảng xếp hạng</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-teal-200">sports_tennis</span>
              <span className="font-semibold text-lg">Đặt sân nhanh chóng</span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden mb-4 flex justify-center">
              <span className="text-3xl font-black text-primary italic tracking-tight font-display">RallyHub</span>
            </div>
            <h2 className="font-display text-[32px] font-bold text-slate-900 mb-1">Tạo tài khoản</h2>
            <p className="text-slate-600">Sẵn sàng bước vào sân cầu lông chưa?</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="full_name" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Họ và tên *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                <input
                  id="full_name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Địa chỉ Email *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="ten@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Số điện thoại *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone</span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="0912 345 678"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="dob" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Ngày sinh *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">cake</span>
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="nationalId" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Số CCCD *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">badge</span>
                  <input
                    id="nationalId"
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="012345678901"
                    required
                    maxLength={12}
                    pattern="[0-9]{9,12}"
                    title="Số CCCD gồm 9–12 chữ số"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Mật khẩu *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 px-1">Trình độ</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'beginner', label: 'Người mới' },
                  { value: 'intermediate', label: 'Trung cấp' },
                  { value: 'advanced', label: 'Nâng cao' },
                  { value: 'pro', label: 'Chuyên nghiệp' },
                ].map((l) => (
                  <div key={l.value} className="relative">
                    <input
                      type="radio"
                      name="skill_level"
                      id={`lvl-${l.value}`}
                      value={l.value}
                      className="peer hidden"
                      checked={skill === l.value}
                      onChange={() => setSkill(l.value)}
                    />
                    <label
                      htmlFor={`lvl-${l.value}`}
                      className="flex flex-col items-center justify-center py-3 px-2 border border-slate-200 rounded-xl cursor-pointer transition-all text-center text-[12px] font-bold text-slate-600 peer-checked:border-primary peer-checked:bg-teal-50 peer-checked:text-primary hover:bg-slate-50"
                    >
                      {l.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium px-1 -mt-2">{error}</p>
            )}
            <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60">
              {submitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
            </button>

            <div className="text-center pt-2">
              <p className="text-slate-600">
                Đã có tài khoản? <Link href="/login" className="text-primary font-semibold hover:underline ml-1">Đăng nhập</Link>
              </p>
            </div>
          </form>

          <p className="mt-8 text-center text-[12px] leading-relaxed text-slate-400">
            Bằng cách tạo tài khoản, bạn đồng ý với <br/>
            <a href="#" className="underline">Điều khoản dịch vụ</a> và <a href="#" className="underline">Chính sách bảo mật</a> của RallyHub.
          </p>
        </div>
      </section>
    </main>
  );
}
