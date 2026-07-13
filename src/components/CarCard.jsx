import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { formatFCFA, photosOf } from '../utils/format';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=70';
const INTERVAL = 4500;

function PhotoCarousel({ photos, nom, onNavigate }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const imgs = photos.length ? photos : [PLACEHOLDER];

  useEffect(() => {
    if (imgs.length <= 1 || paused) return;
    timer.current = setInterval(() => setCurrent(c => (c + 1) % imgs.length), INTERVAL);
    return () => clearInterval(timer.current);
  }, [imgs.length, paused]);

  const handleClick = (e) => {
    // Si on clique sur un point, ne pas naviguer
    if (e.target.tagName === 'BUTTON') return;
    onNavigate();
  };

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden bg-cream-100 cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={current}
          src={imgs[current]}
          alt={`${nom} ${current + 1}`}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {imgs.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {imgs.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CarCard({ vehicule, index = 0 }) {
  const navigate = useNavigate();
  const photos = photosOf(vehicule);
  const tagStyle = vehicule.type === 'vente' ? 'bg-copper-600 text-white' : 'bg-ink-900 text-white';
  const estDisponible = !vehicule.statut || vehicule.statut === 'disponible';
  const vues = Number(vehicule.vues) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Zone image — carousel indépendant du Link */}
      <div className="relative">
        <PhotoCarousel
          photos={photos}
          nom={vehicule.nom}
          onNavigate={() => navigate(`/vehicule/${vehicule.id}`)}
        />
        <span className={`absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full shadow ${tagStyle}`}>
          {vehicule.type === 'vente' ? 'À vendre' : 'Location'}
        </span>
        {/* Compteur de vues — toujours visible */}
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
          <FiEye size={11} /> {vues}
        </span>
        {/* Overlay Vendu / Loué */}
        {!estDisponible && (
          <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center z-20 pointer-events-none">
            <span className={`text-white text-lg font-extrabold tracking-widest uppercase px-4 py-2 rounded-lg border-2 ${
              vehicule.statut === 'vendu' ? 'border-red-400 bg-red-500/30' : 'border-blue-400 bg-blue-500/30'
            }`}>
              {vehicule.statut === 'vendu' ? '✓ Vendu' : '🔒 Loué'}
            </span>
          </div>
        )}
      </div>

      {/* Infos cliquables */}
      <Link to={`/vehicule/${vehicule.id}`} className="block p-4">
        <h3 className="font-bold text-ink-900 truncate group-hover:text-copper-700 transition-colors duration-200">
          {vehicule.nom}
        </h3>
        <div className="mt-1 text-xs text-ink-800/60 flex gap-2">
          {vehicule.annee && <span>{vehicule.annee}</span>}
          {vehicule.carburant && <span>· {vehicule.carburant}</span>}
        </div>
        <div className="mt-3 text-copper-700 font-bold text-lg">
          {formatFCFA(vehicule.prix)}
          {vehicule.type === 'location' && <span className="text-xs text-ink-800/60 font-normal"> /jour</span>}
        </div>
      </Link>

      {/* Bouton CTA */}
      <div className="px-4 pb-4">
        {!estDisponible ? (
          <div className={`text-center w-full py-2.5 rounded-lg text-sm font-semibold ${
            vehicule.statut === 'vendu' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-500'
          }`}>
            {vehicule.statut === 'vendu' ? 'Véhicule vendu' : 'Véhicule loué'}
          </div>
        ) : (
          <Link
            to={`/vehicule/${vehicule.id}`}
            className={`block text-center w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              vehicule.type === 'vente'
                ? 'bg-copper-600 text-white hover:bg-copper-700 active:scale-95'
                : 'bg-ink-900 text-white hover:bg-ink-800 active:scale-95'
            }`}
          >
            {vehicule.type === 'vente' ? 'Voir ce véhicule' : 'Réserver ce véhicule'}
          </Link>
        )}
      </div>
    </motion.div>
  );
}
