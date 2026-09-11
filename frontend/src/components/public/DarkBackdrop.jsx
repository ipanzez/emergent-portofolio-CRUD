const SPARKLES = [
  { top: "18%", left: "12%", size: 22, delay: "0s" },
  { top: "30%", left: "78%", size: 30, delay: "1.2s" },
  { top: "64%", left: "22%", size: 14, delay: "2.1s" },
  { top: "72%", left: "68%", size: 18, delay: "0.6s" },
  { top: "12%", left: "58%", size: 12, delay: "2.8s" },
  { top: "48%", left: "90%", size: 16, delay: "1.7s" },
  { top: "84%", left: "42%", size: 10, delay: "3.3s" },
];

export const Sparkle = ({ size = 16, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
    <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" />
  </svg>
);

export const GlowSparkle = ({ size = 32, color = "text-blue-500", className = "", style }) => (
  <span className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size, ...style }} aria-hidden>
    <Sparkle size={size} className={`${color} absolute inset-0 opacity-70 blur-md`} />
    <Sparkle size={size} className={`${color} relative animate-twinkle`} />
  </span>
);

export const LightBackdrop = () => (
  <div aria-hidden className="absolute inset-0 overflow-hidden bg-white">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        opacity: 0.6,
      }}
    />
    <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200/80" />
    <div className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200/50" />
    <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-blue-400/15 blur-[110px]" />
    <div className="absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-purple-400/15 blur-[110px]" />
  </div>
);

export const DarkBackdrop = () => (
  <div aria-hidden className="absolute inset-0 overflow-hidden bg-ink">
    <div className="absolute -left-40 -top-40 h-[560px] w-[560px] animate-drift rounded-full bg-blue-600/30 blur-[150px]" />
    <div className="absolute right-[-12%] top-1/4 h-[480px] w-[480px] animate-drift rounded-full bg-purple-600/25 blur-[150px] [animation-delay:-6s]" />
    <div className="absolute bottom-[-25%] left-1/3 h-[420px] w-[680px] rounded-full bg-indigo-500/20 blur-[170px]" />
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }}
    />
    {SPARKLES.map((s, i) => (
      <Sparkle
        key={i}
        size={s.size}
        className="absolute animate-twinkle text-blue-200/80"
        style={{ top: s.top, left: s.left, animationDelay: s.delay }}
      />
    ))}
    <div className="grain absolute inset-0" />
  </div>
);
