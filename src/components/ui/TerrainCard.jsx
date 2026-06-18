import React from "react";
import { MapPin, Maximize, DollarSign } from "lucide-react";
import { getImageProduit } from "../../utils/imageAuto";

const FALLBACK = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80';

export default function TerrainCard({ terrain, onChoose }) {
  const image = getImageProduit(terrain, 'terrain');
  const total = terrain.totalPrice || (terrain.surface * terrain.pricePerM2);

  return (
    <div className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={terrain.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1f1f1f]">
            <MapPin size={12} /> {terrain.city || terrain.region}
          </span>
          {terrain.isAvailable !== false && (
            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
              Disponible
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1f1f1f]">
              {terrain.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{terrain.description}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-gray-50 p-2.5 text-center">
            <Maximize size={14} className="mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Surface</p>
            <p className="font-bold text-[#1f1f1f] text-sm">{terrain.surface} m²</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-2.5 text-center">
            <DollarSign size={14} className="mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Prix/m²</p>
            <p className="font-bold text-[#1f1f1f] text-sm">{terrain.pricePerM2} DT</p>
          </div>
          <div className="rounded-xl bg-[#f6f1e6] p-2.5 text-center">
            <DollarSign size={14} className="mx-auto mb-1 text-[#b08d3b]" />
            <p className="text-xs text-[#8b6a1f]">Total</p>
            <p className="font-bold text-[#b08d3b] text-sm">{total?.toLocaleString()} DT</p>
          </div>
        </div>

        {terrain.seller && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f1ea] text-xs font-bold text-[#1f1f1f]">
              {terrain.seller.name?.[0] || "S"}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1f1f1f]">{terrain.seller.name}</p>
              {terrain.seller.phone && <p className="text-xs text-gray-500">{terrain.seller.phone}</p>}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => onChoose?.(terrain)}
            className="rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b08d3b]"
          >
            Choisir ce terrain
          </button>
        </div>
      </div>
    </div>
  );
}
