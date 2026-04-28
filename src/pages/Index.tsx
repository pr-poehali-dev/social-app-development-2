import { useState } from "react";
import Icon from "@/components/ui/icon";

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
    filter: "Фото",
    likes: 248,
    comments: 32,
    time: "2 часа назад",
    tags: ["#закат", "#природа", "#фото"],
  },
  {
    id: 2,
    user: { name: "Макс Романов", username: "@maxrom", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max" },
    content: "Новый трек уже в работе 🎵 Это будет нечто особенное. Следите за обновлениями!",
    image: null,
    filter: "Музыка",
    likes: 184,
    comments: 47,
    time: "4 часа назад",
    tags: ["#музыка", "#творчество"],
  },
  {
    id: 3,
    user: { name: "Соня Лебедева", username: "@sonya_art", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sonya" },
    content: "Новая работа в цифровом арте. Экспериментирую с неоновыми оттенками и геометрией 🎨",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80",
    filter: "Арт",
    likes: 512,
    comments: 89,
    time: "6 часов назад",
    tags: ["#арт", "#диджитал", "#неон"],
  },
  {
    id: 4,
    user: { name: "Денис Волков", username: "@denis_v", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=denis" },
    content: "Городские пейзажи на рассвете — это магия. Вышел в 5 утра и не пожалел ни секунды 📸",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    filter: "Фото",
    likes: 367,
    comments: 51,
    time: "8 часов назад",
    tags: ["#город", "#рассвет", "#стрит"],
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
  { name: "Неон", style: { filter: "saturate(2) hue-rotate(270deg) brightness(1.1)" } },
  { name: "Ретро", style: { filter: "sepia(0.6) contrast(1.1) brightness(0.9)" } },
  { name: "Холод", style: { filter: "hue-rotate(180deg) saturate(1.5)" } },
  { name: "Тепло", style: { filter: "sepia(0.3) saturate(1.5) brightness(1.05)" } },
  { name: "Ч/Б", style: { filter: "grayscale(1) contrast(1.2)" } },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeFilter, setActiveFilter] = useState("Все");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [follows, setFollows] = useState<Set<number>>(new Set());
  const [activePhotoFilter, setActivePhotoFilter] = useState(0);
  const [notifCount] = useState(7);

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const toggleFollow = (userId: number) => {
    setFollows(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const filteredPosts = activeFilter === "Все"
    ? POSTS
    : POSTS.filter(p => p.filter === activeFilter);

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#0a0a0f" }}>
      {/* Ambient blobs */}
      <div className="ambient-blob w-96 h-96 top-0 left-0" style={{ background: "rgba(168,85,247,0.15)", transform: "translate(-30%, -30%)" }} />
      <div className="ambient-blob w-80 h-80" style={{ background: "rgba(236,72,153,0.1)", top: "40%", right: "-80px", animationDelay: "3s" }} />
      <div className="ambient-blob w-64 h-64" style={{ background: "rgba(6,182,212,0.08)", bottom: "10%", left: "30%", animationDelay: "5s" }} />

      <div className="relative z-10 max-w-md mx-auto pb-28">

        {/* ──────────── FEED ──────────── */}
        {activeTab === "feed" && (
          <div>
            {/* Header */}
            <div className="sticky top-0 z-50 px-4 pt-6 pb-3" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-display text-2xl font-black gradient-text">VIBE</h1>
                <div className="flex gap-2 items-center">
                  <button className="relative p-2 glass rounded-xl hover:bg-white/10 transition-all">
                    <Icon name="MessageCircle" size={20} className="text-white" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>3</span>
                  </button>
                  <button className="relative p-2 glass rounded-xl hover:bg-white/10 transition-all" onClick={() => setActiveTab("notifications")}>
                    <Icon name="Bell" size={20} className="text-white" />
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>{notifCount}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={activeFilter === f
                      ? { background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", color: "white", boxShadow: "0 4px 20px rgba(168,85,247,0.4)" }
                      : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories */}
            <div className="px-4 py-4">
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {STORIES.map(story => (
                  <div key={story.id} className="flex flex-col items-center gap-1 min-w-fit cursor-pointer">
                    <div className="relative">
                      {story.isMe && (
                        <div className="absolute -bottom-0.5 -right-0.5 z-10 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0f] text-white" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                          <Icon name="Plus" size={10} className="text-white" />
                        </div>
                      )}
                      <div
                        className="p-[2px] rounded-full"
                        style={!story.viewed && !story.isMe
                          ? { background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)" }
                          : { background: "rgba(255,255,255,0.15)" }
                        }
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] max-w-[56px] truncate text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {story.isMe ? "Моя" : story.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="px-4 flex flex-col gap-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="post-card rounded-2xl overflow-hidden hover-lift" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Post header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-[2px] rounded-full cursor-pointer" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)" }}>
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{post.user.name}</div>
                        <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{post.time}</div>
                      </div>
                    </div>
                    <button style={{ color: "rgba(255,255,255,0.4)" }} className="hover:text-white transition-colors">
                      <Icon name="MoreHorizontal" size={18} />
                    </button>
                  </div>

                  {post.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt="post"
                        className="w-full object-cover"
                        style={{ aspectRatio: "4/3", ...PHOTO_FILTERS[activePhotoFilter].style }}
                      />
                      {activePhotoFilter > 0 && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", color: "rgba(255,255,255,0.8)" }}>
                          {PHOTO_FILTERS[activePhotoFilter].name}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="px-4 py-3">
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.85)" }}>{post.content}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs cursor-pointer transition-colors" style={{ color: "#a855f7" }}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1.5 text-sm transition-all like-btn"
                          style={{ color: likedPosts.has(post.id) ? "#ec4899" : "rgba(255,255,255,0.5)" }}
                        >
                          <Icon name="Heart" size={18} className={likedPosts.has(post.id) ? "fill-pink-500 text-pink-500" : ""} />
                          <span>{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                          <Icon name="MessageCircle" size={18} />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                          <Icon name="Send" size={18} />
                        </button>
                      </div>
                      <button className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <Icon name="Bookmark" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="ImageOff" size={40} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Нет постов в этой категории</p>
                </div>
              )}
            </div>

            {/* Photo filter strip */}
            <div className="px-4 mt-6 mb-2">
              <p className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Фильтры фото</p>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {PHOTO_FILTERS.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => setActivePhotoFilter(i)}
                    className="min-w-fit flex flex-col items-center gap-1.5 transition-all"
                    style={{ opacity: activePhotoFilter === i ? 1 : 0.45 }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl overflow-hidden transition-all"
                      style={{
                        border: activePhotoFilter === i ? "2px solid #a855f7" : "2px solid transparent",
                        boxShadow: activePhotoFilter === i ? "0 0 20px rgba(168,85,247,0.5)" : "none",
                      }}
                    >
                      <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", ...f.style }} />
                    </div>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──────────── SEARCH ──────────── */}
        {activeTab === "search" && (
          <div className="px-4 pt-6">
            <h2 className="font-display text-xl font-bold mb-4 text-white">Поиск</h2>
            <div className="relative mb-6">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
              <input
                className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm outline-none transition-all text-white"
                placeholder="Люди, хэштеги, посты..."
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>В тренде</h3>
              <div className="flex flex-wrap gap-2">
                {["#неон", "#арт2024", "#городскиефото", "#закат", "#диджитал", "#стрит", "#творчество", "#музыка"].map(tag => (
                  <button key={tag} className="px-3 py-1.5 rounded-full text-sm transition-all" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Рекомендуем</h3>
            <div className="flex flex-col gap-3">
              {RECOMMENDED.map(user => (
                <div key={user.id} className="rounded-2xl p-4 flex items-center gap-3 hover-lift" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="p-[2px] rounded-full" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)" }}>
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={user.avatar} alt={user.name} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-white">{user.name}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{user.username} · {user.followers} подписчиков</div>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={follows.has(user.id)
                      ? { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
                      : { background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "white", boxShadow: "0 4px 15px rgba(168,85,247,0.35)" }
                    }
                  >
                    {follows.has(user.id) ? "Вы подписаны" : "Подписаться"}
                  </button>
                </div>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider mt-6 mb-3 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Популярное</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70",
                "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&q=70",
                "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70",
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70",
                "https://images.unsplash.com/photo-1514565131-fce0801e6f49?w=300&q=70",
                "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&q=70",
              ].map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────── CREATE ──────────── */}
        {activeTab === "create" && (
          <div className="px-4 pt-6">
            <h2 className="font-display text-xl font-bold mb-6 text-white">Новый пост</h2>

            <div className="rounded-3xl p-8 text-center mb-4 cursor-pointer group transition-all" style={{ border: "2px dashed rgba(255,255,255,0.12)" }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)" }}>
                <Icon name="ImagePlus" size={28} className="text-white" />
              </div>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Загрузите фото или видео</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>JPG, PNG, MP4 до 50 МБ</p>
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Выберите фильтр</p>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {PHOTO_FILTERS.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => setActivePhotoFilter(i)}
                    className="flex flex-col items-center gap-1.5 min-w-fit transition-all"
                    style={{ opacity: activePhotoFilter === i ? 1 : 0.45, transform: activePhotoFilter === i ? "scale(1.05)" : "scale(1)" }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden transition-all"
                      style={{
                        border: activePhotoFilter === i ? "2px solid #a855f7" : "2px solid rgba(255,255,255,0.1)",
                        boxShadow: activePhotoFilter === i ? "0 0 20px rgba(168,85,247,0.5)" : "none",
                      }}
                    >
                      <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", ...f.style }} />
                    </div>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none transition-all mb-4 text-white"
              rows={3}
              placeholder="Напишите что-нибудь..."
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            />

            <input
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all mb-6 text-white"
              placeholder="#хэштеги через пробел"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            />

            <button
              className="w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", boxShadow: "0 8px 30px rgba(168,85,247,0.4)" }}
            >
              ОПУБЛИКОВАТЬ
            </button>
          </div>
        )}

        {/* ──────────── NOTIFICATIONS ──────────── */}
        {activeTab === "notifications" && (
          <div className="px-4 pt-6">
            <h2 className="font-display text-xl font-bold mb-5 text-white">Уведомления</h2>

            {[
              { id: 1, type: "like", user: "Алина К.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alina", text: "лайкнула ваш пост", time: "2 мин назад", unread: true },
              { id: 2, type: "comment", user: "Макс Р.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max", text: "прокомментировал: «Это шедевр!»", time: "15 мин назад", unread: true },
              { id: 3, type: "follow", user: "Соня Л.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sonya", text: "подписалась на вас", time: "1 час назад", unread: true },
              { id: 4, type: "like", user: "Денис В.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=denis", text: "лайкнул ваш пост", time: "2 часа назад", unread: false },
              { id: 5, type: "mention", user: "Катя М.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=katya", text: "упомянула вас в посте", time: "5 часов назад", unread: false },
            ].map(notif => (
              <div key={notif.id} className="flex items-center gap-3 p-4 rounded-2xl mb-2 transition-all hover-lift" style={{ background: notif.unread ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${notif.unread ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                <div className="relative flex-shrink-0">
                  <div className="p-[2px] rounded-full" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                    <div className="w-11 h-11 rounded-full overflow-hidden">
                      <img src={notif.avatar} alt={notif.user} />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{
                    background: notif.type === "like" ? "#ec4899" : notif.type === "comment" ? "#a855f7" : notif.type === "follow" ? "#06b6d4" : "#f97316"
                  }}>
                    {notif.type === "like" ? "❤️" : notif.type === "comment" ? "💬" : notif.type === "follow" ? "➕" : "@"}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm text-white">{notif.user} </span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{notif.text}</span>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{notif.time}</div>
                </div>
                {notif.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#a855f7" }} />}
              </div>
            ))}
          </div>
        )}

        {/* ──────────── PROFILE ──────────── */}
        {activeTab === "profile" && (
          <div>
            <div className="relative h-44 overflow-hidden">
              <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #1a0533 0%, #0d1a3a 50%, #0a0a0f 100%)" }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(236,72,153,0.2) 0%, transparent 60%)" }} />
              <button className="absolute top-4 right-4 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                <Icon name="Settings" size={18} className="text-white" onClick={() => {}} />
              </button>
            </div>

            <div className="px-4 -mt-14 mb-5 relative z-10">
              <div className="flex items-end justify-between mb-4">
                <div className="p-[3px] rounded-full" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", boxShadow: "0 8px 30px rgba(168,85,247,0.5)" }}>
                  <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: "4px solid #0a0a0f" }}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=me&backgroundColor=b6e3f4" alt="Профиль" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button className="px-5 py-2.5 rounded-2xl text-sm font-semibold hover-lift transition-all text-white" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Редактировать
                </button>
              </div>

              <h2 className="font-display text-xl font-bold text-white">Александр Некто</h2>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>@alexander_n</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
                Фотограф & дизайнер ✨ Создаю визуальные истории о мире вокруг. Москва 📍
              </p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Публикации", value: "84" },
                  { label: "Подписчики", value: "4.2K" },
                  { label: "Подписки", value: "312" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-3 text-center hover-lift cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="font-display text-lg font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", boxShadow: "0 8px 25px rgba(168,85,247,0.4)" }}
                >
                  Поделиться профилем
                </button>
                <button className="p-3 rounded-2xl hover-lift transition-all" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon name="Link" size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
                </button>
              </div>

              <h3 className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Публикации</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70",
                  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70",
                  "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&q=70",
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70",
                  "https://images.unsplash.com/photo-1514565131-fce0801e6f49?w=300&q=70",
                  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&q=70",
                  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&q=70",
                  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=70",
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=70",
                ].map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer transition-all hover:opacity-90 hover:scale-[0.98]">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──────────── BOTTOM NAV ──────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="rounded-3xl px-2 py-3 flex items-center justify-around" style={{ background: "rgba(15,15,25,0.9)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const isCreate = tab.id === "create";
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center gap-1 transition-all"
                  style={{ transform: isActive && !isCreate ? "scale(1.1)" : "scale(1)" }}
                >
                  {isCreate ? (
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)", boxShadow: "0 4px 20px rgba(168,85,247,0.5)" }}>
                      <Icon name="Plus" size={22} className="text-white" />
                    </div>
                  ) : (
                    <>
                      <div className="p-2 rounded-xl transition-all" style={{ background: isActive ? "rgba(168,85,247,0.15)" : "transparent" }}>
                        <Icon name={tab.icon} size={22} style={{ color: isActive ? "#a855f7" : "rgba(255,255,255,0.35)" }} />
                      </div>
                      {isActive && <div className="w-1 h-1 rounded-full" style={{ background: "#a855f7" }} />}
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
