import { Search } from 'lucide-react';

export default function Filters({ q, setQ, marque, setMarque, marques, tri, setTri }) {
  return (
    <div className="card p-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"/>
        <input className="input pl-9" placeholder="Rechercher (marque, modèle…)" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <select className="input md:w-48" value={marque} onChange={e=>setMarque(e.target.value)}>
        <option value="">Toutes les marques</option>
        {marques.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className="input md:w-52" value={tri} onChange={e=>setTri(e.target.value)}>
        <option value="recent">Plus récents</option>
        <option value="prix_asc">Prix croissant</option>
        <option value="prix_desc">Prix décroissant</option>
      </select>
    </div>
  );
}
