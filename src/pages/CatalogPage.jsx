import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { smartSearch } from '../utils/smartSearch';
import CarCard from '../components/CarCard';
import SmartSearch from '../components/SmartSearch';

export default function CatalogPage({ type, titre, sousTitre }) {
  const [vehicules, setVehicules] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get('/vehicules', { params: { type } })
      .then(({ data }) => setVehicules(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [type]);

  const results = useMemo(() => smartSearch(vehicules, query), [vehicules, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* En-tête animé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">{titre}</h1>
        <p className="text-ink-800/60 mt-2">{sousTitre}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <SmartSearch value={query} onChange={setQuery} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-sm text-ink-800/60 text-center"
      >
        {loading ? 'Chargement…' : `${results.length} véhicule(s)`}
      </motion.div>

      {error ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20 text-ink-800/60"
        >
          Impossible de charger les véhicules pour le moment. Réessayez plus tard.
        </motion.div>
      ) : loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[16/10] bg-cream-200 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-cream-200 rounded w-3/4" />
                <div className="h-3 bg-cream-200 rounded w-1/2" />
                <div className="h-5 bg-cream-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 text-ink-800/60"
        >
          {query ? 'Aucun résultat. Essayez un autre mot-clé ou un prix.' : 'Aucun véhicule disponible pour le moment.'}
        </motion.div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((v, i) => <CarCard key={v.id} vehicule={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
