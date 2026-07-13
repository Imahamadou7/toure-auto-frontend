import emailjs from '@emailjs/browser';

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT;
const TEMPLATE_SERVICE = import.meta.env.VITE_EMAILJS_TEMPLATE_SERVICE;

let initialized = false;
function ensureInit() {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init({ publicKey: PUBLIC_KEY });
    initialized = true;
  }
}

export async function sendContactEmail({ nom, email, telephone, message }) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_CONTACT) {
    console.warn('[emailjs] Config manquante — contact non envoyé.');
    return { skipped: true };
  }
  console.log('EmailJS vars:', { PUBLIC_KEY, SERVICE_ID, TEMPLATE_SERVICE });
  ensureInit();
  return emailjs.send(SERVICE_ID, TEMPLATE_CONTACT, { nom, email, telephone: telephone || '—', message });
}

export async function sendReservationEmail({ vehiculeNom, nomClient, telephone, email, dateDebut, dateFin, message }) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_SERVICE) {
    console.warn('[emailjs] Config manquante — réservation non envoyée.');
    return { skipped: true };
  }
  ensureInit();
  return emailjs.send(SERVICE_ID, TEMPLATE_SERVICE, {
    type_demande: 'Réservation location',
    vehicule: vehiculeNom,
    nom_client: nomClient,
    telephone,
    email: email || '—',
    details: `Du ${dateDebut} au ${dateFin}`,
    total: '—',
    message: message || '—',
  });
}

export async function sendEntretienEmail({ nomClient, telephone, email, vehiculeInfo, services, total, dateSouhaitee, description }) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_SERVICE) {
    console.warn('[emailjs] Config manquante — entretien non envoyé.');
    return { skipped: true };
  }
  ensureInit();
  return emailjs.send(SERVICE_ID, TEMPLATE_SERVICE, {
    type_demande: "Demande d'entretien",
    vehicule: vehiculeInfo,
    nom_client: nomClient,
    telephone,
    email: email || '—',
    details: `Date souhaitée : ${dateSouhaitee || 'Non précisée'} | Services : ${services || 'Non précisé'}`,
    total: total || '—',
    message: description || '—',
  });
}