import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, extraInfo, userProfile } = useAuth();
  const userAvatar = extraInfo?.avatarUrl || userProfile?.avatar || "/avatar1.png";

  const isNavActive = (path: string) => location === path || location.startsWith(path + "/");

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm sticky top-0 flex justify-between items-center w-full px-4 md:px-6 h-16 z-50">
      <div className="flex items-center gap-2">
        <Link href="/home" className="text-2xl font-extrabold text-primary font-display tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">sports_tennis</span>
          RallyHub
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <nav className="flex gap-6">
          <Link 
            href="/home" 
            className={`font-display tracking-tight transition-colors ${isNavActive('/home') ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
          >
            Trang chủ
          </Link>
          <Link
            href="/matches"
            className={`font-display tracking-tight transition-colors ${isNavActive('/matches') || isNavActive('/match') ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
          >
            Trận đấu
          </Link>
          <Link
            href="/clans"
            className={`font-display tracking-tight transition-colors ${isNavActive('/clans') ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
          >
            CLB
          </Link>
          <Link
            href="/marketplace"
            className={`font-display tracking-tight transition-colors ${isNavActive('/marketplace') ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
          >
            Mua bán
          </Link>
          <Link
            href="/profile"
            className={`font-display tracking-tight transition-colors ${isNavActive('/profile') ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
          >
            Hồ sơ
          </Link>
        </nav>
        
        <div className="relative group hidden lg:block">
          <input 
            type="text" 
            placeholder="Tìm kiếm trận đấu..." 
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border-none focus:ring-2 focus:ring-primary w-64 text-sm"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2 rounded-full active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2 rounded-full active:scale-95 duration-200">
          <span className="material-symbols-outlined">chat_bubble</span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm font-medium text-slate-700">{user}</span>
            <Link href="/profile" className="block w-8 h-8 rounded-full object-cover border-2 border-primary overflow-hidden active:scale-95 duration-200 cursor-pointer">
              <img src={userAvatar} alt={user} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/avatar1.png"; }} />
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="hidden md:flex text-xs">Đăng xuất</Button>
          </div>
        ) : (
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">Đăng nhập</Link>
        )}
      </div>
    </header>
  );
}

export function BottomNav() {
  const [location] = useLocation();
  const isNavActive = (path: string) => location === path || location.startsWith(path + "/");
  const isHomeActive = location === "/home";
  const isMatchesActive = isNavActive("/matches") || isNavActive("/match");

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] rounded-t-2xl md:hidden pb-safe">
      <Link href="/home" className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 active:scale-90 ${isHomeActive ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isHomeActive ? "'FILL' 1" : "'FILL' 0" }}>home</span>
        <span className="font-display text-[10px] font-medium mt-1">Trang chủ</span>
      </Link>

      <Link href="/matches" className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 active:scale-90 ${isMatchesActive ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isMatchesActive ? "'FILL' 1" : "'FILL' 0" }}>sports_tennis</span>
        <span className="font-display text-[10px] font-medium mt-1">Trận đấu</span>
      </Link>

      <Link href="/create" className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 active:scale-90 ${isNavActive('/create') ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}>
        <span className="material-symbols-outlined text-primary text-[32px] leading-none mb-1">add_circle</span>
        <span className="font-display text-[10px] font-medium">Tạo trận</span>
      </Link>

      <Link href="/clans" className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 active:scale-90 ${isNavActive('/clans') ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isNavActive('/clans') ? "'FILL' 1" : "'FILL' 0" }}>group</span>
        <span className="font-display text-[10px] font-medium mt-1">CLB</span>
      </Link>

      <Link href="/marketplace" className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 active:scale-90 ${isNavActive('/marketplace') ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isNavActive('/marketplace') ? "'FILL' 1" : "'FILL' 0" }}>shopping_bag</span>
        <span className="font-display text-[10px] font-medium mt-1">Mua bán</span>
      </Link>
    </nav>
  );
}
