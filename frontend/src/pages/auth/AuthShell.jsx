import { Leaf } from 'lucide-react';

export function AuthShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-sand-50">

      {/* =====================================================
          FULL PAGE WILDLIFE BACKGROUND
      ====================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wildlife-login.png')",
        }}
      />

      {/* Slight overlay so the background doesn't overpower UI */}
      <div className="absolute inset-0 bg-white/5" />

      {/* =====================================================
          BRAND
      ====================================================== */}
      <div className="absolute left-8 top-7 z-20 flex items-center gap-3">

        <span className="grid h-10 w-10 place-items-center rounded-xl bg-moss-600 shadow-lg">
          <Leaf size={20} className="text-white" />
        </span>

        <div>
          <p className="font-display text-lg leading-tight text-canopy-900">
            Wildlife Population
          </p>

          <p className="font-display text-lg leading-tight text-canopy-900">
            Intelligence
          </p>
        </div>

      </div>


      {/* =====================================================
          LOGIN AREA
      ====================================================== */}
      <div className="relative z-10 flex min-h-screen items-center justify-end px-6 py-8 sm:px-10 lg:px-16">

        <div className="w-full max-w-[430px]">

          <div className="rounded-2xl border border-sand-300/80 bg-white/95 p-7 shadow-2xl backdrop-blur-sm sm:p-9">

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}