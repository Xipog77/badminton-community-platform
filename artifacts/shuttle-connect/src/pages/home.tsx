import { Link } from "wouter";
import { Navbar, BottomNav } from "@/components/layout";
import {
  useListPosts,
  useListClans,
  useListProducts,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user } = useAuth();
  const { data: postsData } = useListPosts();
  const { data: clansData } = useListClans();
  const { data: productsData } = useListProducts();

  const upcomingMatches = (postsData ?? [])
    .filter((m) => m.status === "Open")
    .slice(0, 3);
  const featuredClans = (clansData ?? []).slice(0, 3);
  const featuredProducts = (productsData ?? []).slice(0, 4);
  const totalOpen = (postsData ?? []).filter((m) => m.status === "Open").length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 py-6 md:py-8">
        <section className="bg-gradient-to-r from-primary to-teal-600 text-white rounded-3xl p-6 md:p-8 mb-6 md:mb-8 shadow-lg overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold opacity-80 mb-2">Chào mừng trở lại{user ? `, ${user}` : ""}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Sân cầu lông đang chờ bạn.
            </h1>
            <p className="text-sm md:text-base font-medium opacity-90 mb-6 max-w-lg">
              {totalOpen} phòng chờ đang mở gần bạn tại Hà Nội, cùng với nhiều dụng cụ mới và câu lạc bộ hoạt động.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/matches">
                <Button className="bg-white text-primary hover:bg-slate-50 font-bold rounded-full px-6 py-2.5">
                  Tìm trận đấu
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-bold rounded-full px-6 py-2.5">
                  Đăng trận
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">Trận sắp tới</h2>
                <Link href="/matches" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  Xem tất cả <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              </div>
              {upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingMatches.map((match) => (
                    <Link
                      key={match.id}
                      href={`/match/${match.id}`}
                      className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-teal-50 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                          {match.skillLevel}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {new Date(match.date).toLocaleDateString(undefined, { weekday: "short" })} · {match.time}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                        {match.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {match.location}
                      </p>
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={match.hostAvatar} alt={match.hostName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold text-slate-700">{match.hostName}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {match.playersJoined}/{match.playersNeeded}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                  <p className="text-slate-500 mb-3">Hiện chưa có trận nào được đăng.</p>
                  <Link href="/create">
                    <Button className="bg-primary text-white rounded-full px-5">Hãy đăng trận đầu tiên</Button>
                  </Link>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">CLB nổi bật</h2>
                <Link href="/clans" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  Khám phá tất cả <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredClans.map((clan) => (
                  <Link
                    key={clan.id}
                    href={`/clans/${clan.id}`}
                    className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="h-24 bg-slate-100 overflow-hidden">
                      <img src={clan.image} alt={clan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                        {clan.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">groups</span>
                        {clan.members} thành viên · {clan.level}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">Dụng cụ nổi bật</h2>
                <Link href="/marketplace" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  Xem tất cả <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/marketplace/${item.id}`}
                    className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="aspect-square bg-slate-50 p-3 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </p>
                      <p className="font-display font-bold text-primary text-sm mt-1">{item.price.toLocaleString("vi-VN")}đ</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-sm font-medium opacity-80 mb-1">Tiến độ của bạn</p>
                <h3 className="font-display text-2xl font-bold mb-4">Cấp 14 · Chiến binh</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold">2,450</span>
                  <span className="text-sm font-medium opacity-80 mb-1">/ 3,000 XP</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-6">
                  <div className="bg-white h-full rounded-full w-[75%]"></div>
                </div>
                <Link href="/profile">
                  <Button className="w-full bg-white text-primary hover:bg-slate-50 font-semibold rounded-xl">Xem bảng xếp hạng</Button>
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sponsored</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">campaign</span>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-accent text-white p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-2">Yonex Pro Series</p>
                  <h4 className="font-display text-xl font-bold mb-2 leading-tight">
                    Cú smash mạnh hơn với Astrox 88
                  </h4>
                  <p className="text-xs font-medium opacity-90 mb-4">
                    Giảm 15% tuần này cho vợt và phụ kiện thi đấu chuyên nghiệp.
                  </p>
                  <Link href="/marketplace">
                    <Button className="bg-white text-accent hover:bg-slate-50 font-bold rounded-full px-4 py-2 text-xs">
                      Mua ngay
                    </Button>
                  </Link>
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-15" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-slate-900">Truy cập nhanh</h4>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">bolt</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/matches" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">sports_tennis</span>
                  <span className="text-xs font-bold text-slate-700">Trận đấu</span>
                </Link>
                <Link href="/clans" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                  <span className="text-xs font-bold text-slate-700">CLB</span>
                </Link>
                <Link href="/marketplace" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
                  <span className="text-xs font-bold text-slate-700">Mua bán</span>
                </Link>
                <Link href="/marketplace/sell" className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px]">sell</span>
                  <span className="text-xs font-bold text-slate-700">Bán đồ</span>
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <span className="material-symbols-outlined text-accent mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <h4 className="font-semibold text-slate-900 mb-2">Mẹo hay: Lực nắm vợt</h4>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Giữ lỏng cổ tay cho đến khoảnh khắc tiếp xúc cầu giúp tăng lực smash đáng kể và tránh mỏi cổ tay.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sponsored</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">campaign</span>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-2">Sân Cầu Lông HN</p>
                  <h4 className="font-display text-xl font-bold mb-2 leading-tight">
                    Đặt sân trong 60 giây
                  </h4>
                  <p className="text-xs font-medium opacity-90 mb-4">
                    Kiểm tra sân trực tuyến tại 200+ địa điểm ở Hà Nội. Đặt lần đầu miễn phí.
                  </p>
                  <Button className="bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-full px-4 py-2 text-xs">
                    Đặt sân ngay
                  </Button>
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
