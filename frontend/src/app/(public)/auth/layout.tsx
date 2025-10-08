
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative
      bg-[url('/images/theme2.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/30" />
      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
}
