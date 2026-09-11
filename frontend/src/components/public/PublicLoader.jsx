import { LightBackdrop, Sparkle } from "./DarkBackdrop";

export const PublicLoader = ({ error = false }) => (
  <div className="relative grid min-h-screen place-items-center text-gray-900">
    <LightBackdrop />
    <div className="relative flex flex-col items-center gap-4" data-testid={error ? "public-error" : "public-loader"}>
      <Sparkle size={28} className={`text-blue-500 ${error ? "" : "animate-twinkle"}`} />
      <p className="text-sm text-gray-500">{error ? "Konten belum bisa dimuat. Coba muat ulang halaman." : "Loading portfolio…"}</p>
    </div>
  </div>
);
