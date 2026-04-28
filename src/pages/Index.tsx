import { useState } from "react";
import Icon from "@/components/ui/icon";
import { UserData } from "./Auth";

interface IndexProps {
  user: UserData;
  onLogout: () => void;
}

const FILTERS = ["Все", "Фото", "Видео", "Музыка", "Арт"];

const STORIES = [
  { id: 1, name: "Моя история", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me", isMe: true, viewed: false },
  { id: 2, name: "Алина К.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alina", viewed: false },
  { id: 3, name: "Макс Р.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max", viewed: false },
  { id: 4, name: "Соня", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sonya", viewed: true },
  { id: 5, name: "Денис В.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=denis", viewed: false },
  { id: 6, name: "Катя М.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=katya", viewed: true },
];

const POSTS = [
  {
    id: 1,
    user: { name: "Алина Корнева", username: "@alinakorn", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alina" },
    content: "Сегодня закат был просто нереальным ✨ Иногда нужно просто остановиться и посмотреть вокруг",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    filter: "Фото", likes: 248, comments: 32, time: "2 часа назад",
    tags: ["#закат", "#природа", "#фото"],
  },
  {
    id: 2,
    user: { name: "Макс Романов", username: "@maxrom", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max" },
    content: "Новый трек уже в работе 🎵 Это будет нечто особенное. Следите за обновлениями!",
    image: null, filter: "Музыка", likes: 184, comments: 47, time: "4 часа назад",
    tags: ["#музыка", "#творчество"],
  },
  {
    id: 3,
    user: { name: "Соня Лебедева", username: "@sonya_art", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sonya" },
    content: "Новая работа в цифровом арте. Экспериментирую с формами и светом 🎨",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80",
    filter: "Арт", likes: 512, comments: 89, time: "6 часов назад",
    tags: ["#арт", "#диджитал"],
  },
  {
    id: 4,
    user: { name: "Денис Волков", username: "@denis_v", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=denis" },
    content: "Городские пейзажи на рассвете — это магия 📸",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    filter: "Фото", likes: 367, comments: 51, time: "8 часов назад",
    tags: ["#город", "#рассвет"],
  },
];

const RECOMMENDED = [
  { id: 1, name: "Юлия Нова", username: "@julia_nova", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=julia", followers: "12.4K" },
  { id: 2, name: "Артём Мир", username: "@artem_mir", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=artem", followers: "8.1K" },
  { id: 3, name: "Дарья Рик", username: "@dasha_rik", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dasha", followers: "21K" },
];

const TABS = [
  { id: "feed", icon: "Home", label: "Лента" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "create", icon: "Plus", label: "Создать" },
  { id: "notifications", icon: "Bell", label: "Уведомления" },
  { id: "profile", icon: "User", label: "Профиль" },
];

const PHOTO_FILTERS = [
  { name: "Оригинал", style: {} },
  { name: "Мягкий", style: { filter: "brightness(1.1) saturate(1.2)" } },
  { name: "Ретро", style: { filter: "sepia(0.5) contrast(1.1)" } },
  { name: "Холод", style: { filter: "hue-rotate(180deg) saturate(1.3)" } },
  { name: "Тепло", style: { filter: "sepia(0.25) saturate(1.5) brightness(1.05)" } },
  { name: "Ч/Б", style: { filter: "grayscale(1) contrast(1.15)" } },
];

const BG = "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 40%, #bae6fd 100%)";
const TEXT_MAIN = "#1e1b4b";
const TEXT_MUTED = "rgba(80,60,160,0.55)";
const TEXT_LIGHT = "rgba(100,80,200,0.4)";
const VIOLET = "#7c3aed";
const GRAD = "linear-gradient(135deg, #7c3aed, #6366f1)";
const GRAD_WARM = "linear-gradient(135deg, #7c3aed, #e879f9, #fb7185)";

export default function Index({ user, onLogout }: IndexProps) {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeFilter, setActiveFilter] = useState("Все");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [follows, setFollows] = useState<Set<number>>(new Set());
  const [activePhotoFilter, setActivePhotoFilter] = useState(0);
  const [notifCount] = useState(7);

  const toggleLike = (id: number) => setLikedPosts(p => {
    const n = new Set(p);
    if (n.has(id)) { n.delete(id); } else { n.add(id); }
    return n;
  });
  const toggleFollow = (id: number) => setFollows(p => {
    const n = new Set(p);
    if (n.has(id)) { n.delete(id); } else { n.add(id); }
    return n;
  });

  const filteredPosts = activeFilter === "Все" ? POSTS : POSTS.filter(p => p.filter === activeFilter);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: BG, color: TEXT_MAIN }}>
      {/* Blobs */}
      <div className="blob w-[500px] h-[500px]" style={{ background: "rgba(167,139,250,0.35)", top: "-150px", left: "-150px" }} />
      <div className="blob w-96 h-96" style={{ background: "rgba(251,113,133,0.22)", bottom: "5%", right: "-80px", animationDelay: "4s" }} />
      <div className="blob w-72 h-72" style={{ background: "rgba(56,189,248,0.2)", top: "45%", left: "60%", animationDelay: "7s" }} />

      <div className="relative z-10 max-w-md mx-auto pb-28">

        {/* ─── FEED ─── */}
        {activeTab === "feed" && (
          <div>
            {/* Sticky header */}
            <div className="sticky top-0 z-50 px-4 pt-5 pb-3"
              style={{ background: "rgba(237,233,254,0.75)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.6)" }}>
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-display text-2xl font-black gradient-text">VIBE</h1>
                <div className="flex gap-2">
                  <button className="relative p-2.5 glass rounded-2xl hover-lift">
                    <Icon name="MessageCircle" size={19} style={{ color: VIOLET }} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: GRAD }}>3</span>
                  </button>
                  <button className="relative p-2.5 glass rounded-2xl hover-lift" onClick={() => setActiveTab("notifications")}>
                    <Icon name="Bell" size={19} style={{ color: VIOLET }} />
                    {notifCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: GRAD }}>{notifCount}</span>}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={activeFilter === f
                      ? { background: GRAD, color: "white", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }
                      : { background: "rgba(255,255,255,0.5)", color: TEXT_MUTED, border: "1px solid rgba(255,255,255,0.8)" }
                    }
                  >{f}</button>
                ))}
              </div>
            </div>

            {/* Stories */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {STORIES.map(story => (
                  <div key={story.id} className="flex flex-col items-center gap-1.5 min-w-fit cursor-pointer">
                    <div className="relative">
                      {story.isMe && (
                        <div className="absolute -bottom-0.5 -right-0.5 z-10 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: GRAD, border: "2px solid white" }}>
                          <Icon name="Plus" size={9} className="text-white" />
                        </div>
                      )}
                      <div className="p-[2.5px] rounded-full" style={{ background: story.viewed ? "rgba(180,160,240,0.3)" : GRAD_WARM }}>
                        <div className="w-14 h-14 rounded-full overflow-hidden" style={{ border: "2.5px solid white" }}>
                          <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium max-w-[56px] truncate text-center" style={{ color: TEXT_MUTED }}>{story.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="px-4 flex flex-col gap-4 pt-2">
              {filteredPosts.map(post => (
                <div key={post.id} className="post-card glass-strong rounded-3xl overflow-hidden hover-lift">
                  {/* Author */}
                  <div className="flex items-center gap-3 p-4 pb-3">
                    <div className="p-[2px] rounded-full" style={{ background: GRAD_WARM }}>
                      <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: "2px solid white" }}>
                        <img src={post.user.avatar} alt={post.user.name} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: TEXT_MAIN }}>{post.user.name}</div>
                      <div className="text-xs" style={{ color: TEXT_LIGHT }}>{post.user.username} · {post.time}</div>
                    </div>
                    <button className="p-1.5 rounded-xl" style={{ color: TEXT_MUTED }}>
                      <Icon name="MoreHorizontal" size={17} />
                    </button>
                  </div>

                  {/* Image */}
                  {post.image && (
                    <div className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(100,80,200,0.12)" }}>
                      <img src={post.image} alt="" className="w-full object-cover" style={{ maxHeight: 280 }} />
                    </div>
                  )}

                  {/* Text */}
                  <div className="px-4 pb-1">
                    <p className="text-sm leading-relaxed" style={{ color: TEXT_MAIN }}>{post.content}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(124,58,237,0.1)", color: VIOLET }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 px-3 py-3 mt-1 border-t" style={{ borderColor: "rgba(200,190,240,0.3)" }}>
                    <button
                      className={`like-btn flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-1 justify-center ${likedPosts.has(post.id) ? "liked" : ""}`}
                      style={{ background: likedPosts.has(post.id) ? "rgba(251,113,133,0.12)" : "transparent" }}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Icon name="Heart" size={18} style={{ color: likedPosts.has(post.id) ? "#fb7185" : TEXT_MUTED, fill: likedPosts.has(post.id) ? "#fb7185" : "none" }} />
                      <span className="text-xs font-semibold" style={{ color: likedPosts.has(post.id) ? "#fb7185" : TEXT_MUTED }}>
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1 justify-center hover:bg-white/40 transition-all">
                      <Icon name="MessageCircle" size={18} style={{ color: TEXT_MUTED }} />
                      <span className="text-xs font-semibold" style={{ color: TEXT_MUTED }}>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1 justify-center hover:bg-white/40 transition-all">
                      <Icon name="Share2" size={17} style={{ color: TEXT_MUTED }} />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1 justify-center hover:bg-white/40 transition-all">
                      <Icon name="Bookmark" size={17} style={{ color: TEXT_MUTED }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SEARCH ─── */}
        {activeTab === "search" && (
          <div className="px-4 pt-6">
            <h2 className="font-display text-xl font-bold mb-4" style={{ color: TEXT_MAIN }}>Поиск</h2>
            <div className="relative mb-5">
              <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: TEXT_MUTED }} />
              <input
                className="glass-input w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
                placeholder="Люди, хэштеги, посты..."
              />
            </div>

            <div className="mb-5">
              <h3 className="text-xs uppercase tracking-wider mb-3 font-semibold" style={{ color: TEXT_LIGHT }}>В тренде</h3>
              <div className="flex flex-wrap gap-2">
                {["#природа", "#арт2024", "#городскиефото", "#закат", "#диджитал", "#музыка"].map(tag => (
                  <button key={tag} className="glass px-3 py-1.5 rounded-full text-sm font-medium hover-lift" style={{ color: VIOLET }}>{tag}</button>
                ))}
              </div>
            </div>

            <h3 className="text-xs uppercase tracking-wider mb-3 font-semibold" style={{ color: TEXT_LIGHT }}>Рекомендуем</h3>
            <div className="flex flex-col gap-3">
              {RECOMMENDED.map(rec => (
                <div key={rec.id} className="glass-strong rounded-2xl p-4 flex items-center gap-3 hover-lift">
                  <div className="p-[2px] rounded-full" style={{ background: GRAD_WARM }}>
                    <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: "2px solid white" }}>
                      <img src={rec.avatar} alt={rec.name} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: TEXT_MAIN }}>{rec.name}</div>
                    <div className="text-xs" style={{ color: TEXT_LIGHT }}>{rec.username} · {rec.followers} подписчиков</div>
                  </div>
                  <button
                    onClick={() => toggleFollow(rec.id)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={follows.has(rec.id)
                      ? { background: "rgba(124,58,237,0.1)", color: VIOLET, border: `1px solid rgba(124,58,237,0.25)` }
                      : { background: GRAD, color: "white", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }
                    }
                  >{follows.has(rec.id) ? "Вы подписаны" : "Подписаться"}</button>
                </div>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider mt-6 mb-3 font-semibold" style={{ color: TEXT_LIGHT }}>Популярное</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70",
                "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&q=70",
                "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70",
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70",
                "https://images.unsplash.com/photo-1514565131-fce0801e6f49?w=300&q=70",
                "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&q=70",
              ].map((src, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover-lift" style={{ boxShadow: "0 4px 16px rgba(100,80,200,0.1)" }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CREATE ─── */}
        {activeTab === "create" && (
          <div className="px-4 pt-6">
            <h2 className="font-display text-xl font-bold mb-5" style={{ color: TEXT_MAIN }}>Новый пост</h2>

            <div className="glass-strong rounded-3xl p-8 text-center mb-4 cursor-pointer group transition-all hover-lift"
              style={{ border: "2px dashed rgba(124,58,237,0.25)" }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: GRAD, boxShadow: "0 8px 25px rgba(124,58,237,0.35)" }}>
                <Icon name="ImagePlus" size={27} className="text-white" />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: TEXT_MAIN }}>Загрузите фото или видео</p>
              <p className="text-xs" style={{ color: TEXT_LIGHT }}>JPG, PNG, MP4 до 50 МБ</p>
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider mb-3 font-semibold" style={{ color: TEXT_LIGHT }}>Фильтр</p>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {PHOTO_FILTERS.map((f, i) => (
                  <button key={f.name} onClick={() => setActivePhotoFilter(i)}
                    className="flex flex-col items-center gap-1.5 min-w-fit transition-all"
                    style={{ opacity: activePhotoFilter === i ? 1 : 0.5 }}>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden"
                      style={{
                        border: activePhotoFilter === i ? `2px solid ${VIOLET}` : "2px solid rgba(200,190,240,0.4)",
                        boxShadow: activePhotoFilter === i ? "0 0 18px rgba(124,58,237,0.35)" : "none",
                      }}>
                      <div className="w-full h-full" style={{ background: GRAD, ...f.style }} />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: TEXT_MUTED }}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea rows={3} placeholder="Напишите что-нибудь..."
              className="glass-input w-full rounded-2xl px-4 py-3.5 text-sm resize-none mb-3" />
            <input placeholder="#хэштеги через пробел"
              className="glass-input w-full rounded-2xl px-4 py-3.5 text-sm mb-5" />
            <button className="w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white btn-primary">
              ОПУБЛИКОВАТЬ
            </button>
          </div>
        )}

        {/* ─── NOTIFICATIONS ─── */}
        {activeTab === "notifications" && (
          <div className="px-4 pt-6">
            <h2 className="font-display text-xl font-bold mb-4" style={{ color: TEXT_MAIN }}>Уведомления</h2>
            {[
              { id: 1, type: "like", user: "Алина К.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alina", text: "лайкнула ваш пост", time: "2 мин назад", unread: true },
              { id: 2, type: "comment", user: "Макс Р.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max", text: "прокомментировал: «Это шедевр!»", time: "15 мин назад", unread: true },
              { id: 3, type: "follow", user: "Соня Л.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sonya", text: "подписалась на вас", time: "1 час назад", unread: true },
              { id: 4, type: "like", user: "Денис В.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=denis", text: "лайкнул ваш пост", time: "2 часа назад", unread: false },
              { id: 5, type: "mention", user: "Катя М.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=katya", text: "упомянула вас в посте", time: "5 часов назад", unread: false },
            ].map(notif => (
              <div key={notif.id} className="flex items-center gap-3 p-4 rounded-2xl mb-2 hover-lift"
                style={{
                  background: notif.unread ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.45)",
                  border: `1px solid ${notif.unread ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.75)"}`,
                  backdropFilter: "blur(16px)",
                }}>
                <div className="relative flex-shrink-0">
                  <div className="p-[2px] rounded-full" style={{ background: GRAD_WARM }}>
                    <div className="w-11 h-11 rounded-full overflow-hidden" style={{ border: "2px solid white" }}>
                      <img src={notif.avatar} alt={notif.user} />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                    style={{ background: notif.type === "like" ? "#fb7185" : notif.type === "comment" ? VIOLET : notif.type === "follow" ? "#38bdf8" : "#f97316" }}>
                    {notif.type === "like" ? "❤️" : notif.type === "comment" ? "💬" : notif.type === "follow" ? "➕" : "@"}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm" style={{ color: TEXT_MAIN }}>{notif.user} </span>
                  <span className="text-sm" style={{ color: TEXT_MUTED }}>{notif.text}</span>
                  <div className="text-xs mt-0.5" style={{ color: TEXT_LIGHT }}>{notif.time}</div>
                </div>
                {notif.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: VIOLET }} />}
              </div>
            ))}
          </div>
        )}

        {/* ─── PROFILE ─── */}
        {activeTab === "profile" && (
          <div>
            {/* Cover */}
            <div className="relative h-44 overflow-hidden rounded-b-3xl"
              style={{ background: "linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 50%, #bae6fd 100%)" }}>
              <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(2px)" }} />
              <button onClick={onLogout}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium glass hover-lift"
                style={{ color: "#3730a3" }}>
                <Icon name="LogOut" size={14} />
                Выйти
              </button>
            </div>

            <div className="px-4 -mt-14 relative z-10 mb-5">
              <div className="flex items-end justify-between mb-4">
                <div className="p-[3px] rounded-full" style={{ background: GRAD_WARM, boxShadow: "0 8px 25px rgba(124,58,237,0.35)" }}>
                  <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: "4px solid white" }}>
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.display_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <button className="glass hover-lift px-5 py-2.5 rounded-2xl text-sm font-semibold" style={{ color: VIOLET }}>
                  Редактировать
                </button>
              </div>

              <h2 className="font-display text-xl font-bold mb-0.5" style={{ color: TEXT_MAIN }}>{user.display_name}</h2>
              <p className="text-sm mb-2" style={{ color: TEXT_MUTED }}>@{user.username}</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                {user.bio || "Привет! Я только что зарегистрировался в VIBE ✨"}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Публикации", value: String(user.posts_count) },
                  { label: "Подписчики", value: String(user.followers_count) },
                  { label: "Подписки", value: String(user.following_count) },
                ].map(stat => (
                  <div key={stat.label} className="glass-strong rounded-2xl p-3 text-center hover-lift cursor-pointer">
                    <div className="font-display text-lg font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: TEXT_LIGHT }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Posts grid */}
              <h3 className="text-xs uppercase tracking-wider mb-3 font-semibold" style={{ color: TEXT_LIGHT }}>Публикации</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70",
                  "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&q=70",
                  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70",
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70",
                  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&q=70",
                  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=70",
                ].map((src, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden hover-lift cursor-pointer" style={{ boxShadow: "0 4px 16px rgba(100,80,200,0.1)" }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM NAV ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 pb-4 pt-2">
          <div className="glass-strong rounded-3xl px-2 py-2.5 flex items-center justify-around"
            style={{ boxShadow: "0 -4px 30px rgba(100,80,200,0.12), 0 8px 30px rgba(100,80,200,0.15)" }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const isCreate = tab.id === "create";
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center gap-0.5 transition-all"
                  style={{ transform: isActive && !isCreate ? "scale(1.08)" : "scale(1)" }}>
                  {isCreate ? (
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center btn-primary">
                      <Icon name="Plus" size={22} className="text-white" />
                    </div>
                  ) : (
                    <>
                      <div className="p-2 rounded-xl transition-all"
                        style={{ background: isActive ? "rgba(124,58,237,0.12)" : "transparent" }}>
                        <Icon name={tab.icon} size={21} style={{ color: isActive ? VIOLET : "rgba(140,120,200,0.5)" }} />
                      </div>
                      {isActive && <div className="w-1 h-1 rounded-full" style={{ background: VIOLET }} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}