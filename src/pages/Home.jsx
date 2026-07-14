import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../api/client';
import { smartSearch } from '../utils/smartSearch';
import CarCard from '../components/CarCard';
import SmartSearch from '../components/SmartSearch';
import heroImage from '../assets/hero.png'; 

const HERO_BG = heroImage;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: 'easeOut' },
});

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

export default function Home() {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]); // parallax léger

  useEffect(() => {
    api.get('/vehicules').then(({ data }) => {
      if (Array.isArray(data)) setVehicules(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => smartSearch(vehicules, query).slice(0, 6), [vehicules, query]);

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: '52vh' }}>
        {/* Fond photo avec parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 scale-110"
        >
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Overlay dégradé cohérent avec la charte copper/ink */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/60 to-copper-600/40" />
        </motion.div>

        {/* Contenu hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <motion.span
              {...fadeUp(0)}
              className="inline-block text-copper-300 text-sm font-semibold tracking-widest uppercase mb-4"
            >
              Vente &amp; Location — Bamako, Mali
            </motion.span>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl sm:text-5xl font-extrabold text-white leading-tight"
            >
              Trouvez votre{' '}
              <span className="text-copper-400">véhicule idéal</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-4 text-white/75 text-lg max-w-xl"
            >
              Sélection rigoureuse, prix transparents, service de confiance.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="mt-6 w-full max-w-xl">
              <SmartSearch value={query} onChange={setQuery} dark />
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="mt-5 flex gap-3 flex-wrap">
              <Link to="/ventes" className="btn-primary shadow-lg">
                Voir les ventes
              </Link>
              <Link
                to="/location"
                className="px-5 py-2.5 rounded-lg font-semibold text-white border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                Voir la location
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Vague décorative bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 fill-cream-50">
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS RAPIDES ── */}
      <motion.section
        {...inView(0)}
        className="bg-cream-50 border-b border-cream-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { val: vehicules.filter(v => v.type === 'vente').length, label: 'Véhicules à vendre' },
            { val: vehicules.filter(v => v.type === 'location').length, label: 'Véhicules à louer' },
            { val: '100%', label: 'Inspectés' },
            { val: '7j/7', label: 'Service client' },
          ].map((s, i) => (
            <motion.div key={i} {...inView(i * 0.08)}>
              <div className="text-2xl font-extrabold text-copper-700">{loading ? '—' : s.val}</div>
              <div className="text-xs text-ink-800/60 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── VÉHICULES VEDETTES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div {...inView(0)} className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900">
              {query ? 'Résultats de recherche' : 'Véhicules vedettes'}
            </h2>
            <p className="text-ink-800/60 text-sm mt-1">
              {query
                ? `${results.length} véhicule(s) trouvé(s)`
                : 'Une sélection de nos meilleurs véhicules'}
            </p>
          </div>
          <Link to="/ventes" className="text-copper-700 font-semibold text-sm hidden sm:inline hover:underline">
            Tout voir →
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
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
          <motion.div {...inView()} className="text-center py-16 text-ink-800/60">
            {query ? 'Aucun véhicule ne correspond à votre recherche.' : 'Aucun véhicule disponible pour le moment.'}
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((v, i) => <CarCard key={v.id} vehicule={v} index={i} />)}
          </div>
        )}

        {results.length > 0 && (
          <motion.div {...inView(0.1)} className="text-center mt-8">
            <Link to="/ventes" className="btn-ghost">Voir tous les véhicules →</Link>
          </motion.div>
        )}
      </section>

      {/* ── AVANTAGES ── */}
      <section className="bg-white border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: '🔍', t: 'Qualité garantie', d: 'Chaque véhicule est inspecté avant mise en vente ou location.' },
            { icon: '🤝', t: 'Service personnalisé', d: 'Nos conseillers vous accompagnent à chaque étape.' },
            { icon: '💡', t: 'Tarifs transparents', d: 'Aucun frais caché — un prix clair affiché pour chaque véhicule.' },
          ].map((b, i) => (
            <motion.div
              key={i}
              {...inView(i * 0.12)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-cream-50 border border-cream-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-ink-900">{b.t}</h3>
              <p className="text-sm text-ink-800/70 mt-2 leading-relaxed">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BAS DE PAGE ── */}
      <motion.section
        {...inView(0)}
        className="relative overflow-hidden bg-ink-900 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-copper-700/30 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <motion.h2 {...inView(0.05)} className="text-2xl sm:text-3xl font-extrabold">
            Votre prochain véhicule vous attend
          </motion.h2>
          <motion.p {...inView(0.12)} className="mt-3 text-white/70 max-w-lg mx-auto">
            Contactez-nous dès aujourd'hui pour une offre personnalisée ou une visite sans engagement.
          </motion.p>
          <motion.div {...inView(0.18)} className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/contact" className="btn-primary shadow-lg">Nous contacter</Link>
            <Link to="/entretien" className="px-5 py-2.5 rounded-lg font-semibold border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-200">
              Entretien véhicule
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
