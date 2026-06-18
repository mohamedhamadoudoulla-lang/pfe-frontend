import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="mb-6">
      <div className="relative w-full lg:max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-11 pr-5 text-sm outline-none transition focus:border-[#b08d3b] focus:ring-4 focus:ring-[#b08d3b]/10"
        />
      </div>
    </div>
  );
}
