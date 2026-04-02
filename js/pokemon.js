/* ══════════════════════════════════════════════
   Shopteria — pokemon.js
   Datos y render de cartas y sobres Pokémon.
   Solo se carga en pokemon.html
   ══════════════════════════════════════════════ */

// ── TIPOS ────────────────────────────────────────
const TYPE_EMOJI = {
  fuego:     '🔥',
  agua:      '💧',
  psiquico:  '🔮',
  electrico: '⚡',
  planta:    '🌿',
  oscuro:    '🌑',
};

// ── CARTAS ───────────────────────────────────────
const CARDS = [
  {
    id: 1, name: 'Charizard VMAX', type: 'fuego', emoji: '🦎',
    rarity: 'legendary', price: 45000,
    img: 'img/charizard.jfif',
    desc: "Charizard VMAX Gigantamax. HP 330. G-Max Wildfire. Edición especial Champion's Path."
  },
  {
    id: 2, name: 'Blastoise GX', type: 'agua', emoji: '🐢',
    rarity: 'rare', price: 18000,
    img: 'img/Blastoise.jfif',
    desc: 'Blastoise GX Hydro Pump + GX Torrent Zone. Ilustración alternativa. NM.'
  },
  {
    id: 3, name: 'Mewtwo EX', type: 'psiquico', emoji: '👾',
    rarity: 'legendary', price: 35000,
    img: 'img/Mewtwo.jfif',
    desc: 'Mewtwo EX Full Art serie XY. Psychic Infinity. Estado mint condition.'
  },
  {
    id: 4, name: 'Pikachu V', type: 'electrico', emoji: '⚡',
    rarity: 'uncommon', price: 8500,
    img: 'img/Pikachu.jfif',
    desc: 'Pikachu V ilustración especial. Quick Attack + Volt Tackle. Perfecto para colección.'
  },
  {
    id: 5, name: 'Gyarados VSTAR', type: 'agua', emoji: '🐉',
    rarity: 'rare', price: 22000,
    img: 'img/Gyarados.jfif',
    desc: 'Gyarados VSTAR full-art holo. Dragon Splash + VSTAR Power.'
  },
  {
    id: 6, name: 'Gengar EX', type: 'psiquico', emoji: '👻',
    rarity: 'rare', price: 14000,
    img: 'img/Gengar.jfif',
    desc: 'Gengar EX Paldea Evolved. Shadow Force + Poltergeist.'
  },
  {
    id: 7, name: 'Arcanine V', type: 'fuego', emoji: '🐕',
    rarity: 'uncommon', price: 7000,
    img: 'img/Arcanine.jfif',
    desc: 'Arcanine V ilustración especial. Extreme Speed + Flamethrower. Holo foil.'
  },
  {
    id: 8, name: 'Raichu VMAX', type: 'electrico', emoji: '🌟',
    rarity: 'legendary', price: 29000,
    img: 'img/Raichu.jfif',
    desc: 'Raichu VMAX Gigantamax Thunder Max. Vivid Voltage. Full Art holo.'
  },
];

// ── SOBRES ───────────────────────────────────────
const PACKS = [
  { id:'p1', name:'Sobre Scarlet & Violet', emoji:'🌺', img:'img/sobre_1.jfif', price: 3500, tag:'Nuevo' },
  { id:'p2', name:'Sobre Paldea Evolved',   emoji:'🔮', img:'img/sobre_2.jfif', price: 3200, tag:'Popular' },
  { id:'p3', name:'Sobre Obsidian Flames',  emoji:'🔥', img:'img/sobre_3.jfif', price: 3800, tag:'Especial' },
  { id:'p4', name:'Sobre Crown Zenith',     emoji:'👑', img:'img/sobre_4.jfif', price: 4200, tag:'Limitado' },
  { id:'p5', name:'Sobre Temporal Forces',  emoji:'⏳', img:'img/sobre_5.jfif', price: 3600, tag:'Nuevo' },
];

// ── ALMACÉN DE ITEMS (para onclick seguro) ────────
// Guarda todos los items en un objeto indexado por id
// así el onclick solo pasa el id como string simple, sin JSON
const ITEM_STORE = {};
CARDS.forEach(c => { ITEM_STORE[c.id] = c; });
PACKS.forEach(p => {
  ITEM_STORE[p.id] = {
    ...p,
    type: 'Booster Pack',
    desc: `Sobre sellado oficial. Contiene cartas aleatorias de la expansión ${p.name}.`,
  };
});

function getItem(id) {
  // Los ids numéricos llegan como string desde el atributo HTML
  const key = isNaN(id) ? id : Number(id);
  return ITEM_STORE[key] || ITEM_STORE[id];
}

// ── RENDER SOBRES ────────────────────────────────
function renderPacks() {
  const container = document.getElementById('packsRow');
  if (!container) return;
  container.innerHTML = PACKS.map(p => `
    <div class="pack-card" data-item-id="${p.id}">
      <div class="pack-img-wrap">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
          : `<span class="pack-emoji">${p.emoji}</span>`}
      </div>
      <span class="pack-badge uncommon">${p.tag}</span>
      <div class="pack-info">
        <div class="pack-name">${p.name}</div>
        <div class="pack-type">Booster Pack</div>
        <div class="pack-footer">
          <span class="pack-price">$${p.price.toLocaleString('es-CL')}</span>
          <button class="btn-buy">Comprar</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── RENDER CARTAS ────────────────────────────────
function renderCards(filter = 'all') {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  const list = filter === 'all' ? CARDS : CARDS.filter(c => c.type === filter);

  grid.innerHTML = list.map(c => `
    <div class="poke-card" data-item-id="${c.id}" data-type="${c.type}">
      <div class="card-img-wrap">
        ${c.img
          ? `<img src="${c.img}" alt="${c.name}" loading="lazy">`
          : `<span class="card-placeholder">${c.emoji}</span>`}
      </div>
      <span class="rarity-badge ${c.rarity}">${c.rarity}</span>
      <div class="card-info">
        <div class="card-name">${c.name}</div>
        <div class="card-type-tag">${TYPE_EMOJI[c.type] || ''} ${c.type.charAt(0).toUpperCase()+c.type.slice(1)}</div>
        <div class="card-footer">
          <span class="card-price">$${c.price.toLocaleString('es-CL')}</span>
          <button class="btn-buy">Comprar</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── DELEGACIÓN DE CLICKS (cartas + sobres) ────────
document.addEventListener('click', function(e) {
  // Filtro por tipo
  const tab = e.target.closest('[data-filter]');
  if (tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderCards(tab.dataset.filter);
    return;
  }

  // Click en carta o sobre
  const card = e.target.closest('[data-item-id]');
  if (card) {
    const item = getItem(card.dataset.itemId);
    if (item) openModal(item);
  }
});

// ── INIT ─────────────────────────────────────────
renderPacks();
renderCards();
