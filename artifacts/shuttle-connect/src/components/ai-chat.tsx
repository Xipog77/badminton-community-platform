import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useListPosts, useListClans, useListProducts } from "@workspace/api-client-react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  options?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
}

type ScenarioKey = "root" | "match" | "match_skill" | "clan" | "marketplace" | "tips";

const SKILL_LEVELS = [
  { value: "new", label: "Mới" },
  { value: "weak", label: "Yếu" },
  { value: "average", label: "Trung bình" },
  { value: "good", label: "Khá" },
  { value: "very_good", label: "Tốt" },
  { value: "pro", label: "Chuyên nghiệp" },
];

const SKILL_VI: Record<string, string> = {
  Beginner: "Người mới",
  Intermediate: "Trung cấp",
  Advanced: "Nâng cao",
  Pro: "Chuyên nghiệp",
};

function makeId() {
  return Math.random().toString(36).slice(2);
}

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Xin chào! Tôi là Rally AI 🏸 — trợ lý cầu lông của bạn tại Hà Nội. Hôm nay tôi có thể giúp gì cho bạn?",
  options: [
    { label: "🎯 Tìm trận phù hợp với trình độ", value: "match" },
    { label: "🏆 Giới thiệu về CLB", value: "clan" },
    { label: "🛒 Mua sắm dụng cụ", value: "marketplace" },
    { label: "💡 Mẹo tập luyện", value: "tips" },
  ],
};

export default function AiChat() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [scenario, setScenario] = useState<ScenarioKey>("root");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: posts } = useListPosts();
  const { data: clans } = useListClans();
  const { data: products } = useListProducts();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const authRoutes = ["/login", "/register"];
  if (!user || authRoutes.some((r) => location === r)) return null;

  const pushBot = (msg: Omit<Message, "id" | "role">, delay = 800) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: makeId(), role: "bot", ...msg }]);
    }, delay);
  };

  const pushUser = (text: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text }]);
  };

  const reset = () => {
    setMessages([GREETING]);
    setScenario("root");
  };

  const handleOption = (value: string, label: string) => {
    pushUser(label);

    if (value === "match") {
      setScenario("match");
      pushBot({
        text: "Tuyệt! Trình độ của bạn là gì? Tôi sẽ tìm trận phù hợp nhất cho bạn.",
        options: SKILL_LEVELS.map((s) => ({ label: s.label, value: `skill_${s.value}` })),
      });
      return;
    }

    if (value.startsWith("skill_")) {
      const skill = value.replace("skill_", "");
      const skillVi = SKILL_VI[skill] ?? skill;
      setScenario("match_skill");
      const found = (posts ?? []).filter(
        (m) => m.skillLevel?.toLowerCase() === skill.toLowerCase() && m.status === "Open"
      );
      if (found.length === 0) {
        pushBot({
          text: `Hiện tại không có trận ${skillVi} nào đang mở, nhưng trận mới được đăng hàng ngày! Bạn cũng có thể tự tạo trận.`,
          links: [
            { label: "Xem tất cả trận", href: "/matches" },
            { label: "Đăng trận", href: "/create" },
          ],
          options: [{ label: "🔄 Bắt đầu lại", value: "restart" }],
        });
      } else {
        pushBot({
          text: `Tìm thấy **${found.length} trận ${skillVi}** đang mở cho bạn! 🎉\n\n${found
            .slice(0, 3)
            .map((m) => `• **${m.title}** — ${m.location}, ${m.time}`)
            .join("\n")}`,
          links: [{ label: `Xem trận ${skillVi}`, href: `/matches` }],
          options: [{ label: "🔄 Bắt đầu lại", value: "restart" }],
        });
      }
      return;
    }

    if (value === "clan") {
      setScenario("clan");
      const clanList = clans ?? [];
      pushBot({
        text: `CLB là nhóm người chơi cầu lông cùng tập luyện và thi đấu. Hiện có **${clanList.length} CLB đang hoạt động** tại Hà Nội.\n\nMỗi CLB có trình độ, sân nhà và tổ chức trận đấu thường xuyên. Tham gia CLB là cách tốt nhất để tìm bạn đấu thường xuyên!`,
        links: [{ label: "Xem tất cả CLB", href: "/clans" }],
        options: [
          { label: "CLB nào phù hợp với tôi?", value: "clan_recommend" },
          { label: "🔄 Bắt đầu lại", value: "restart" },
        ],
      });
      return;
    }

    if (value === "clan_recommend") {
      const clanList = clans ?? [];
      const pick = clanList[0];
      pushBot({
        text: pick
          ? `Dựa trên hồ sơ của bạn, tôi đề xuất **${pick.name}** — CLB trình độ ${pick.level} tại ${pick.location}. Họ có ${pick.members} thành viên và rất năng động!`
          : "Hãy xem trang CLB để tìm CLB phù hợp với phong cách chơi và địa điểm của bạn.",
        links: pick
          ? [{ label: `Xem ${pick.name}`, href: `/clans/${pick.id}` }]
          : [{ label: "Xem danh sách CLB", href: "/clans" }],
        options: [{ label: "🔄 Bắt đầu lại", value: "restart" }],
      });
      return;
    }

    if (value === "marketplace") {
      setScenario("marketplace");
      const items = products ?? [];
      const featured = items.slice(0, 3);
      pushBot({
        text: `Chợ trao đổi có nhiều dụng cụ từ người chơi khác! Một số sản phẩm nổi bật:\n\n${featured
          .map((p) => `• **${p.name}** — ${p.price.toLocaleString("vi-VN")}đ (${p.condition})`)
          .join("\n")}\n\nTất cả sản phẩm đều được RallyHub xác thực.`,
        links: [{ label: "Đến Chợ trao đổi", href: "/marketplace" }],
        options: [
          { label: "Xem vợt cầu lông", value: "market_rackets" },
          { label: "Xem giày", value: "market_shoes" },
          { label: "🔄 Bắt đầu lại", value: "restart" },
        ],
      });
      return;
    }

    if (value === "market_rackets") {
      const rackets = (products ?? []).filter(
        (p) => p.category?.toLowerCase().includes("racket") || p.name?.toLowerCase().includes("racket") || p.name?.toLowerCase().includes("vợt")
      );
      pushBot({
        text: rackets.length
          ? `Đây là các vợt hiện có:\n\n${rackets.map((r) => `• **${r.name}** — ${r.price.toLocaleString("vi-VN")}đ`).join("\n")}`
          : "Hiện chưa có vợt nào, hãy kiểm tra lại sau! Sản phẩm mới được thêm hàng ngày.",
        links: [{ label: "Xem tất cả dụng cụ", href: "/marketplace" }],
        options: [{ label: "🔄 Bắt đầu lại", value: "restart" }],
      });
      return;
    }

    if (value === "market_shoes") {
      const shoes = (products ?? []).filter(
        (p) => p.category?.toLowerCase().includes("shoe") || p.name?.toLowerCase().includes("shoe") || p.name?.toLowerCase().includes("giày")
      );
      pushBot({
        text: shoes.length
          ? `Đây là các giày cầu lông hiện có:\n\n${shoes.map((s) => `• **${s.name}** — ${s.price.toLocaleString("vi-VN")}đ`).join("\n")}`
          : "Hiện chưa có giày nào. Thử xem trực tiếp trên chợ để xem sản phẩm mới nhất.",
        links: [{ label: "Xem chợ trao đổi", href: "/marketplace" }],
        options: [{ label: "🔄 Bắt đầu lại", value: "restart" }],
      });
      return;
    }

    if (value === "tips") {
      pushBot({
        text: "Đây là một số mẹo tập luyện từ huấn luyện viên của chúng tôi:\n\n🏸 **Bước chân trước tiên** — 80% cầu lông là về vị trí. Hãy luyện tập split-step!\n\n💪 **Cổ tay bật** — Lực smash đến từ cú bật cổ tay nhanh ở điểm tiếp xúc.\n\n🎯 **Kiểm soát lưới** — Người làm chủ lưới thắng hầu hết các pha bóng.\n\n😤 **Ổn định hơn tấn công** — Giảm lỗi trước khi đi tìm điểm dứt.",
        options: [
          { label: "Thêm mẹo nâng cao", value: "tips_more" },
          { label: "🔄 Bắt đầu lại", value: "restart" },
        ],
      });
      return;
    }

    if (value === "tips_more") {
      pushBot({
        text: "🌟 **Mẹo nâng cao:**\n\n⚡ **Đánh lừa đối thủ** — Dùng cùng động tác cho cả cú drop và smash để đánh lừa đối phương.\n\n📐 **Hình học sân** — Luôn trở về trung tâm (vị trí T) sau mỗi cú đánh.\n\n🔋 **Quản lý thể lực** — Trong pha bóng dài, nhắm vào góc sân để làm kiệt sức đối thủ.\n\n🤝 **Giao tiếp đồng đội** — Trong đánh đôi, gọi rõ ràng để tránh nhầm lẫn.",
        options: [{ label: "🔄 Bắt đầu lại", value: "restart" }],
      });
      return;
    }

    if (value === "restart") {
      reset();
      return;
    }
  };

  const handleLinkClick = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} className={line === "" ? "h-2" : "leading-snug"} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-32 md:bottom-20 right-4 md:right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white"
        aria-label="Mở trợ lý AI"
      >
        {open ? (
          <span className="material-symbols-outlined text-[24px]">close</span>
        ) : (
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-48 md:bottom-36 right-4 md:right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Rally AI</p>
                <p className="text-white/70 text-[10px] mt-0.5">Trợ lý cầu lông của bạn</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/70 text-[10px]">Trực tuyến</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex gap-2 items-start"}`}>
                  {msg.role === "bot" && (
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm space-y-0.5 ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm"
                      }`}
                    >
                      {renderText(msg.text)}
                    </div>

                    {msg.links && msg.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.links.map((link) => (
                          <button
                            key={link.href}
                            onClick={() => handleLinkClick(link.href)}
                            className="text-xs font-bold text-primary bg-teal-50 border border-teal-100 px-3 py-1 rounded-full hover:bg-teal-100 transition-colors flex items-center gap-1"
                          >
                            {link.label}
                            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleOption(opt.value, opt.label)}
                            className="text-xs font-semibold text-slate-700 bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl hover:border-primary hover:text-primary transition-colors"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={reset}
              className="w-full text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Bắt đầu lại cuộc trò chuyện
            </button>
          </div>
        </div>
      )}
    </>
  );
}
