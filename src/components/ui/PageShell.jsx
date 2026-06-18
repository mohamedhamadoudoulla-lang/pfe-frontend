import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageShell({ eyebrow, title, subtitle, stats, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f4ec_0%,_#f4f1ea_35%,_#ffffff_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-white/60 bg-white/75 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur md:p-8">

          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:border-[#b08d3b] hover:text-[#b08d3b]"
            >
              <ArrowLeft size={16} /> Retour
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b08d3b]">
              {eyebrow}
            </p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1f1f1f] md:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {stats?.length > 0 && (
            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[#1f1f1f]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{s.helper}</p>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
