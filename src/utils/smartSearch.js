// Recherche intelligente : nom + prix flou
// - extrait un nombre depuis la requête (gère espaces, points, "fcfa", "millions"/"M")
// - calcule un score combinant pertinence textuelle et proximité prix
// - retourne la liste triée

const normalize = (s = '') =>
  s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function extractPrice(q) {
  if (!q) return null;
  const s = q.toLowerCase().replace(/fcfa|cfa|francs?|€|\$/g, ' ');
  // millions: "6m", "6 millions"
  const mMatch = s.match(/(\d+(?:[.,]\d+)?)\s*(m|millions?)/);
  if (mMatch) return Math.round(parseFloat(mMatch[1].replace(',', '.')) * 1_000_000);
  // nombre direct (avec espaces/points/virgules comme séparateurs)
  const numMatch = s.match(/(\d[\d\s.,]{2,})/);
  if (numMatch) {
    const raw = numMatch[1].replace(/[\s.,]/g, '');
    const n = parseInt(raw, 10);
    if (n >= 1000) return n;
  }
  return null;
}

function textScore(query, nom) {
  const q = normalize(query).trim();
  const n = normalize(nom);
  if (!q) return 0;
  if (n.includes(q)) return 100;
  const tokens = q.split(/\s+/).filter(Boolean);
  let s = 0;
  tokens.forEach(t => { if (n.includes(t)) s += 30; });
  return s;
}

export function smartSearch(vehicules, query) {
  const q = (query || '').trim();
  if (!q) return vehicules;
  const targetPrice = extractPrice(q);

  const scored = vehicules.map(v => {
    const tScore = textScore(q, v.nom);
    let pScore = 0;
    if (targetPrice && v.prix) {
      const diff = Math.abs(v.prix - targetPrice) / targetPrice;
      // 100 si exact, ~0 au-delà de +-50%
      pScore = Math.max(0, 100 - diff * 200);
    }
    const total = Math.max(tScore, pScore) + Math.min(tScore, pScore) * 0.3;
    return { v, total, hasMatch: tScore > 0 || pScore > 5 };
  });

  // si aucun nom matche mais un prix est donné, on garde tous les véhicules triés par proximité
  const anyText = scored.some(s => s.total >= 30 && s.hasMatch);
  const list = (targetPrice || anyText)
    ? scored.filter(s => s.hasMatch)
    : scored.filter(s => s.total > 0);

  return list.sort((a, b) => b.total - a.total).map(s => s.v);
}
