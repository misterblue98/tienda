/* ══════════════════════════════════════════════
   Shopteria — main.js
   Modal + Mercado Pago. Se usa en todas las páginas.
   ══════════════════════════════════════════════ */

// ── MODAL ────────────────────────────────────────
let currentItem = null;

function openModal(item) {
  currentItem = item;
  document.getElementById('modalEmoji').textContent  = item.emoji  || '🛒';
  document.getElementById('modalName').textContent   = item.name;
  document.getElementById('modalType').textContent   = (item.type || item.tag || 'Producto').charAt(0).toUpperCase() + (item.type || item.tag || 'Producto').slice(1);
  document.getElementById('modalPrice').textContent  = '$' + item.price.toLocaleString('es-CL') + ' CLP';
  document.getElementById('modalDesc').textContent   = item.desc || '';
  document.getElementById('wallet_container').innerHTML = '';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  initPayment(item);
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModalDirect();
});

// ── PAYMENT ──────────────────────────────────────
function initPayment(item) {
  const container = document.getElementById('wallet_container');
  container.innerHTML = '<p class="payment-loading">Cargando pago seguro…</p>';

  fetch(`${CONFIG.SERVER_URL}/crear-preferencia?title=${encodeURIComponent(item.name)}&price=${item.price}`, {
    headers: { 'ngrok-skip-browser-warning': 'true' }
  })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
      if (!data.id) throw new Error('Sin preferenceId: ' + JSON.stringify(data));
      const mp = new MercadoPago(CONFIG.MP_PUBLIC_KEY);
      mp.bricks().create('wallet', 'wallet_container', {
        initialization: { preferenceId: data.id }
      });
    })
    .catch(err => {
      console.error('MP Error:', err);
      container.innerHTML = `
        <p class="payment-error">
          ❌ Error al cargar el pago.<br>
          <small>${err.message}</small>
        </p>`;
    });
}