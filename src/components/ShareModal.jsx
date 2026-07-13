/**
 * ShareModal — Partage marketing d'un véhicule
 * Utilisé depuis le dashboard admin (VehiculeList).
 * Aucune dépendance externe ajoutée — utilise uniquement ce qui est déjà
 * présent dans le projet (react-hot-toast, react-icons, framer-motion).
 */
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiX, FiCopy, FiMessageCircle, FiFacebook, FiFileText } from 'react-icons/fi';
import { formatFCFA } from '../utils/format';

// URL de base du site — à configurer dans frontend/.env sous VITE_SITE_URL
// Exemple : VITE_SITE_URL=https://toureautoservice.com
const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ||
  window.location.origin;

/**
 * Construit le lien public d'un véhicule.
 */
function vehiculeUrl(id) {
  return `${SITE_URL}/vehicule/${id}`;
}

/**
 * Construit le texte marketing d'une annonce.
 * Les champs vides/null sont ignorés.
 */
function buildTexteAnnonce(vehicule) {
  const lien = vehiculeUrl(vehicule.id);
  const lignes = ['🚗 ' + vehicule.nom];

  if (vehicule.annee) lignes.push(`📅 Année : ${vehicule.annee}`);
  if (vehicule.prix) lignes.push(`💰 Prix : ${formatFCFA(vehicule.prix)}`);
  if (vehicule.carburant) lignes.push(`⛽ ${vehicule.carburant}`);
  if (vehicule.transmission) lignes.push(`⚙️ ${vehicule.transmission}`);

  lignes.push('');
  lignes.push('📍 Disponible chez Toure Auto Service SARL');
  lignes.push(`👉 ${lien}`);

  return lignes.join('\n');
}

/**
 * Copie un texte dans le presse-papiers de façon sécurisée.
 * Utilise navigator.clipboard si disponible, fallback execCommand sinon.
 */
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback pour les contextes non-HTTPS ou anciens navigateurs
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

/**
 * ShareModal
 * @param {Object}   vehicule  - Objet véhicule complet
 * @param {Function} onClose   - Callback fermeture
 */
export default function ShareModal({ vehicule, onClose }) {
  const overlayRef = useRef(null);

  // Fermeture avec Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Fermeture au clic sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const lien = vehiculeUrl(vehicule.id);
  const texte = buildTexteAnnonce(vehicule);

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(texte)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(lien)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLien = async () => {
    try {
      await copyToClipboard(lien);
      toast.success('Lien copié !');
    } catch {
      toast.error('Impossible de copier le lien.');
    }
  };

  const handleCopyTexte = async () => {
    try {
      await copyToClipboard(texte);
      toast.success('Annonce copiée !');
    } catch {
      toast.error('Impossible de copier l\'annonce.');
    }
  };

  const actions = [
    {
      icon: <FiMessageCircle size={20} />,
      label: 'Partager sur WhatsApp',
      sublabel: 'Message pré-rempli avec les infos du véhicule',
      color: 'text-green-600 bg-green-50 hover:bg-green-100',
      onClick: handleWhatsApp,
    },
    {
      icon: <FiFacebook size={20} />,
      label: 'Partager sur Facebook',
      sublabel: 'Ouvre le partage Facebook avec le lien',
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
      onClick: handleFacebook,
    },
    {
      icon: <FiCopy size={20} />,
      label: 'Copier le lien',
      sublabel: lien,
      color: 'text-copper-700 bg-copper-50 hover:bg-copper-100',
      onClick: handleCopyLien,
    },
    {
      icon: <FiFileText size={20} />,
      label: "Copier le texte de l'annonce",
      sublabel: 'Texte marketing complet prêt à coller',
      color: 'text-ink-900 bg-cream-100 hover:bg-cream-200',
      onClick: handleCopyTexte,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-cream-200">
            <div>
              <h2 className="font-extrabold text-ink-900">Partager</h2>
              <p className="text-xs text-ink-800/60 mt-0.5 truncate max-w-[220px]">
                {vehicule.nom}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-cream-100 text-ink-800/60 hover:text-ink-900 transition-colors"
              aria-label="Fermer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-2">
            {actions.map(({ icon, label, sublabel, color, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 text-left ${color}`}
              >
                <span className="flex-shrink-0">{icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{label}</span>
                  <span className="block text-xs opacity-60 truncate mt-0.5">{sublabel}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Aperçu du texte */}
          <div className="px-4 pb-4">
            <details className="group">
              <summary className="text-xs text-ink-800/50 cursor-pointer select-none hover:text-ink-800/80 transition-colors list-none flex items-center gap-1">
                <span className="group-open:hidden">▶ Aperçu du texte</span>
                <span className="hidden group-open:inline">▼ Masquer</span>
              </summary>
              <pre className="mt-2 text-xs bg-cream-50 rounded-lg p-3 whitespace-pre-wrap break-words text-ink-800/70 border border-cream-200 max-h-40 overflow-y-auto">
                {texte}
              </pre>
            </details>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
