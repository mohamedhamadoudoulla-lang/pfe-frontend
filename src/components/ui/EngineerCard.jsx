import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Briefcase, GraduationCap } from "lucide-react";

export default function EngineerCard({ engineer }) {
  const navigate = useNavigate();

  const initials = (engineer.user?.name || engineer.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      onClick={() => navigate(`/ingenieur/${engineer._id}`)}
    >
      <div className="h-24 bg-gradient-to-r from-[#1f1f1f] via-[#2d2d2d] to-[#b08d3b]" />

      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end gap-4">
          {engineer.image ? (
            <img
              src={engineer.image}
              alt={engineer.name}
              className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#f4f1ea] text-2xl font-bold text-[#1f1f1f] shadow-md">
              {initials}
            </div>
          )}

          <div className="pb-1">
            <h3 className="text-lg font-bold text-[#1f1f1f]">
              {engineer.user?.name || engineer.name}
            </h3>
            <p className="text-sm text-gray-500">{engineer.specialty || engineer.speciality}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(engineer.certifications || []).slice(0, 3).map((cert, i) => (
            <span
              key={i}
              className="rounded-full bg-[#f6f1e6] px-3 py-1 text-xs font-medium text-[#8b6a1f]"
            >
              {cert}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-gray-50 p-3 text-center">
            <MapPin size={14} className="mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Ville</p>
            <p className="mt-0.5 font-semibold text-gray-800 text-xs">{engineer.city || engineer.region || "—"}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 text-center">
            <Briefcase size={14} className="mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Experience</p>
            <p className="mt-0.5 font-semibold text-gray-800 text-xs">{engineer.experience} ans</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 text-center">
            <Star size={14} className="mx-auto mb-1 text-yellow-500" />
            <p className="text-xs text-gray-500">Note</p>
            <p className="mt-0.5 font-semibold text-gray-800 text-xs">{engineer.rating}/5</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500 line-clamp-2">{engineer.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {engineer.projectsCount || 0} projets
          </span>

          <button className="rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b08d3b]">
            Voir profil
          </button>
        </div>
      </div>
    </div>
  );
}
