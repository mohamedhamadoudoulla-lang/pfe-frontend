import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEngineers } from "../services/api";
import { FALLBACK_ENGINEERS } from "../data/fallbackEngineers";
import PageShell from "../components/ui/PageShell";
import SearchBar from "../components/ui/SearchBar";
import EngineerCard from "../components/ui/EngineerCard";
import { Building2 } from "lucide-react";

export default function Engineers() {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getEngineers()
      .then((res) => setEngineers(res.data.length > 0 ? res.data : FALLBACK_ENGINEERS))
      .catch(() => setEngineers(FALLBACK_ENGINEERS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = engineers.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.specialty?.toLowerCase().includes(search.toLowerCase()) ||
    e.speciality?.toLowerCase().includes(search.toLowerCase()) ||
    e.city?.toLowerCase().includes(search.toLowerCase()) ||
    e.region?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Ingenieurs disponibles", value: engineers.length, helper: "Experts verifies" },
    { label: "Projets realises", value: `${engineers.reduce((s, e) => s + (e.projectsCount || 0), 0)}+`, helper: "Depuis 2020" },
    { label: "Note moyenne", value: engineers.length > 0 ? (Math.round(engineers.reduce((s, e) => s + (e.rating || 0), 0) / engineers.length * 10) / 10) : "—", helper: "Sur 5 etoiles" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#b08d3b]" />
          <p className="text-sm text-gray-500">Chargement des ingenieurs...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      eyebrow="Nos experts"
      title="Ingenieurs & experts"
      subtitle="Des professionnels qualifies pour accompagner votre projet de construction"
      stats={stats}
    >
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher par nom, specialite ou ville..."
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 py-20">
          <Building2 size={40} className="mb-3 text-gray-300" />
          <p className="text-base font-medium text-gray-500">Aucun ingenieur trouve</p>
          <p className="mt-1 text-sm text-gray-400">Essayez de modifier votre recherche</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((eng) => (
            <EngineerCard key={eng._id} engineer={eng} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
