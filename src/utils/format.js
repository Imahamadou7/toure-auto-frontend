export const formatFCFA = (n) => {
  if (n == null || isNaN(Number(n))) return '—';
  return new Intl.NumberFormat('fr-FR').format(Number(n)) + ' FCFA';
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Transforme un chemin relatif renvoyé par l'API (/uploads/...) en URL absolue
// pointant vers le serveur backend. Laisse intactes les URL déjà absolues
// (lien collé manuellement, ou future intégration Cloudinary).
export const mediaUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const rawPhotosOf = (v) =>
  [v.photo1, v.photo2, v.photo3, v.photo4, v.photo5].filter(Boolean);

export const photosOf = (v) => rawPhotosOf(v).map(mediaUrl);
