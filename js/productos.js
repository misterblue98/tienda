/* ══════════════════════════════════════════════
   Shopteria — productos.js
   Firebase Realtime Database via REST API.
   URL: https://tienda-89292-default-rtdb.firebaseio.com
   ══════════════════════════════════════════════ */

const FIREBASE_URL = 'https://tienda-89292-default-rtdb.firebaseio.com';

// ── DATOS DE PRODUCTOS ────────────────────────
const PRODUCTOS = [
  {
    id: 'prod-1',
    name: 'Producto de Prueba A',
    category: 'General',
    emoji: '📦',
    img: '',
    price: 15000,
    stock: 5,
    desc: 'Descripción corta del producto. Puedes contar materiales, medidas, estado, etc.',
  },
  {
    id: 'prod-2',
    name: 'Producto de Prueba B',
    category: 'General',
    emoji: '🎁',
    img: '',
    price: 28000,
    stock: 2,
    desc: 'Otro producto de ejemplo. Edita o elimina estos datos cuando tengas los reales.',
  },
  {
    id: 'prod-3',
    name: 'Producto de Prueba C',
    category: 'Especial',
    emoji: '⭐',
    img: '',
    price: 9900,
    stock: 10,
    desc: 'Un tercer ejemplo con categoría distinta.',
  },
];

// ── RENDER GRID ───────────────────────────────
function renderProductos(lista) {
  const grid = document.getElementById('productosGrid');
  if (!grid) return;
  if (!lista || lista.length === 0) {
    grid.innerHTML = '<p class="empty-msg">No hay productos disponibles.</p>';
    return;
  }
  grid.innerHTML = lista.map(p => `
    <div class="prod-card" onclick='abrirProducto(${JSON.stringify(p)})'>
      <div class="prod-img-wrap">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
          : `<span class="prod-emoji">${p.emoji}</span>`}
      </div>
      <div class="prod-info">
        <span class="prod-category">${p.category}</span>
        <div class="prod-name">${p.name}</div>
        <div class="prod-footer">
          <span class="prod-price">$${p.price.toLocaleString('es-CL')}</span>
          <button class="btn-buy">Ver</button>
        </div>
      </div>
      ${p.stock <= 3 ? `<span class="prod-stock-badge">Últimas ${p.stock}!</span>` : ''}
    </div>
  `).join('');
}

// ── MODAL ─────────────────────────────────────
let _productoActual = null;

function abrirProducto(p) {
  _productoActual = p;
  document.getElementById('modalEmoji').textContent  = p.emoji || '📦';
  document.getElementById('modalName').textContent   = p.name;
  document.getElementById('modalType').textContent   = p.category;
  document.getElementById('modalPrice').textContent  = '$' + p.price.toLocaleString('es-CL') + ' CLP';
  document.getElementById('modalDesc').textContent   = p.desc || '';

  // Reset formulario
  document.getElementById('buyForm').reset();
  document.getElementById('buyComuna').disabled = true;
  document.getElementById('formPanel').style.display    = '';
  document.getElementById('successPanel').style.display = 'none';
  document.getElementById('buyError').textContent = '';

  // Poblar regiones y conectar comunas
  poblarRegiones('buyRegion');
  poblarComunas('buyRegion', 'buyComuna');

  // Actualizar link de WhatsApp directo
  const msg = encodeURIComponent(
    `Hola! Me interesa "${p.name}" por $${p.price.toLocaleString('es-CL')} CLP 🛒`
  );
  document.getElementById('modalWspBtn').href =
    `https://wa.me/${CONFIG.WHATSAPP}?text=${msg}`;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── GUARDAR VENTA EN REALTIME DATABASE ────────
async function confirmarCompra(e) {
  e.preventDefault();

  const nombre    = document.getElementById('buyNombre').value.trim();
  const region    = document.getElementById('buyRegion').value.trim();
  const comuna    = document.getElementById('buyComuna').value.trim();
  const direccion = document.getElementById('buyDireccion').value.trim();
  const errorEl   = document.getElementById('buyError');
  const btnEl     = document.getElementById('buySubmit');

  if (!nombre || !region || !comuna || !direccion) {
    errorEl.textContent = 'Por favor completa todos los campos.';
    return;
  }

  btnEl.disabled    = true;
  btnEl.textContent = 'Enviando…';
  errorEl.textContent = '';

  const venta = {
    productoId:       _productoActual.id,
    productoNombre:   _productoActual.name,
    categoria:        _productoActual.category,
    precio:           _productoActual.price,
    emoji:            _productoActual.emoji || '📦',
    clienteNombre:    nombre,
    region:           region,
    comuna:           comuna,
    direccionExacta:  direccion,
    direccionCompleta: `${direccion}, ${comuna}, ${region}`,
    estado:           'pendiente',
    fechaCreacion:    new Date().toISOString(),
  };

  try {
    // POST a /ventas.json — Firebase genera ID único automáticamente
    const res = await fetch(`${FIREBASE_URL}/ventas.json`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(venta),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const pedidoId = data.name; // Firebase retorna el ID en "name"

    // Mensaje WhatsApp con todos los datos
    const msg = encodeURIComponent(
      `Hola! Hice un pedido en Shopteria 🛒\n` +
      `Producto: ${_productoActual.name}\n` +
      `Precio: $${_productoActual.price.toLocaleString('es-CL')} CLP\n` +
      `Nombre: ${nombre}\n` +
      `Dirección: ${direccion}, ${comuna}, ${region}\n` +
      `ID pedido: ${pedidoId}`
    );
    document.getElementById('wspConfirmBtn').href =
      `https://wa.me/${CONFIG.WHATSAPP}?text=${msg}`;
    document.getElementById('pedidoId').textContent = pedidoId;

    document.getElementById('formPanel').style.display    = 'none';
    document.getElementById('successPanel').style.display = '';

  } catch (err) {
    console.error('Error al guardar venta:', err);
    errorEl.textContent = 'Error al enviar el pedido. Intenta por WhatsApp directamente.';
  } finally {
    btnEl.disabled    = false;
    btnEl.textContent = 'Confirmar pedido';
  }
}

// ── INIT ─────────────────────────────────────
function loadProducts() { renderProductos(PRODUCTOS); }
loadProducts();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('buyForm');
  if (form) form.addEventListener('submit', confirmarCompra);
});