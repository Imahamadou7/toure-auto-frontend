import { FiSearch } from 'react-icons/fi';

export default function SmartSearch({ value, onChange, placeholder = 'Rechercher par nom ou prix…', dark = false }) {
  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? 'text-white/50' : 'text-ink-800/40'}`} size={18} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-200 ${
          dark
            ? 'bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder-white/50 focus:bg-white/20 focus:border-white/60'
            : 'border border-cream-200 bg-white shadow-sm focus:border-copper-500 focus:ring-2 focus:ring-copper-400/30'
        }`}
      />
    </div>
  );
}
