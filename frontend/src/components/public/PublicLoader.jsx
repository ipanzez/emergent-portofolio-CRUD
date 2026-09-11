import { DarkBackdrop, Sparkle } from "./DarkBackdrop";

export const PublicLoader = ({ error = false }) => (
  <div className="relative grid min-h-screen place-items-center text-white">
    <DarkBackdrop />
    <div className="relative flex flex-col items-center gap-4" data-testid={error ? "public-error" : "public-loader"}>
      <Sparkle size={28} className={`text-blue-300 ${error ? "" : "animate-twinkle"}`} />
      <p className="text-sm text-white/60">{error ? "Konten belum bisa dimuat. Coba muat ulang halaman." : "Loading portfolio…"}</p>
    </div>
  </div>
);
