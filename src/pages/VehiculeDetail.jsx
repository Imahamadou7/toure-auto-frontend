import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../api/client';
import { formatFCFA, photosOf } from '../utils/format';
import { useCompany } from '../contexts/CompanyContext';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowLeft,
} from 'react-icons/fi';

import ReservationModal from '../components/ReservationModal';

export default function VehiculeDetail() {
  const { company } = useCompany();
  const { id } = useParams();

  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadVehicule = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const { data } = await api.get(`/vehicules/${id}`);

        if (!mounted) return;

        if (!data || typeof data !== 'object') {
          throw new Error('Données invalides');
        }

        setV(data);
        // Incrémente le compteur de vues (silencieux, pas bloquant)
        api.post(`/vehicules/${id}/vue`).catch(() => {});
      } catch (error) {
        if (mounted) {
          setNotFound(true);
          setV(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadVehicule();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-20 text-center text-ink-800/60">
        Chargement…
      </div>
    );
  }

  if (notFound || !v) {
    return (
      <div className="p-20 text-center">
        <p className="text-ink-800/60">
          Véhicule introuvable.
        </p>

        <Link
          to="/"
          className="btn-ghost mt-4"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const photos = photosOf(v);

  const message = `Bonjour, je suis intéressé par "${v.nom}" (${formatFCFA(v.prix)}).`;

  const whatsappNumber = company?.telephone
    ? company.telephone.replace(/\D/g, '')
    : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      <Link
        to={v.type === 'location' ? '/location' : '/ventes'}
        className="inline-flex items-center gap-2 text-copper-700 mb-4 hover:underline"
      >
        <FiArrowLeft />
        Retour
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">

        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden border border-cream-200 bg-white">

            {photos.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop={photos.length > 1}
                className="aspect-[16/10]"
              >
                {photos.map((photo, index) => (
                  <SwiperSlide key={`${photo}-${index}`}>
                    <img
                      src={photo}
                      alt={`${v.nom} ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="aspect-[16/10] grid place-items-center text-ink-800/40 bg-cream-100">
                Aucune photo disponible
              </div>
            )}

          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">

          <div className="flex flex-wrap gap-2">

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                v.type === 'vente'
                  ? 'bg-copper-600 text-white'
                  : 'bg-ink-900 text-white'
              }`}
            >
              {v.type === 'vente'
                ? 'À vendre'
                : 'Location'}
            </span>

            {v.statut === 'vendu' && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">
                ✓ Vendu
              </span>
            )}

            {v.statut === 'loue' && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                🔒 Loué
              </span>
            )}

          </div>

          <h1 className="text-3xl font-extrabold text-ink-900">
            {v.nom}
          </h1>

          <div className="text-3xl font-bold text-copper-700">
            {formatFCFA(v.prix)}

            {v.type === 'location' && (
              <span className="text-base text-ink-800/60 font-normal">
                {' '}
                /jour
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-sm">

            {v.annee && (
              <span className="px-3 py-1 bg-cream-100 rounded-full">
                Année {v.annee}
              </span>
            )}

            {v.carburant && (
              <span className="px-3 py-1 bg-cream-100 rounded-full">
                {v.carburant}
              </span>
            )}

            {/* prêt pour la future transmission */}
            {v.transmission && (
              <span className="px-3 py-1 bg-cream-100 rounded-full">
                {v.transmission}
              </span>
            )}

          </div>

          {v.description && (
            <div>
              <h2 className="font-semibold text-ink-900 mb-1">
                Description
              </h2>

              <p className="text-ink-800/70 whitespace-pre-wrap">
                {v.description}
              </p>
            </div>
          )}

          <div className="border-t border-cream-200 pt-4 space-y-2 text-sm">

            <h2 className="font-semibold text-ink-900 mb-2">
              Nous contacter
            </h2>

            {company?.telephone && (
              <a
                href={`tel:${company.telephone}`}
                className="flex items-center gap-2 hover:text-copper-700"
              >
                <FiPhone />
                {company.telephone}
              </a>
            )}

            {company?.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 hover:text-copper-700"
              >
                <FiMail />
                {company.email}
              </a>
            )}

            {company?.adresse && (
              <p className="flex items-center gap-2">
                <FiMapPin />
                {company.adresse}
              </p>
            )}

          </div>

          {v.statut && v.statut !== 'disponible' ? (
            <div
              className={`w-full py-3 rounded-xl text-center font-semibold text-sm ${
                v.statut === 'vendu'
                  ? 'bg-red-50 text-red-500 border border-red-200'
                  : 'bg-blue-50 text-blue-500 border border-blue-200'
              }`}
            >
              {v.statut === 'vendu'
                ? '✓ Ce véhicule a été vendu'
                : '🔒 Ce véhicule est actuellement loué'}
            </div>
          ) : (
            <>
              {v.type === 'location' && (
                <button
                  onClick={() => setShowReservation(true)}
                  className="btn-primary w-full"
                >
                  Réserver ce véhicule
                </button>
              )}

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    v.type === 'location'
                      ? 'btn-ghost w-full'
                      : 'btn-primary w-full'
                  }
                >
                  Demander via WhatsApp
                </a>
              )}

              <Link
                to="/contact"
                className="btn-ghost w-full"
              >
                Formulaire de contact
              </Link>
            </>
          )}

        </div>
      </div>

      {showReservation && (
        <ReservationModal
          vehicule={v}
          onClose={() => setShowReservation(false)}
        />
      )}
    </div>
  );
}