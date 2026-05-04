/* ─────────────────────────────────────────────────────────────────────────────
   Group 19 — Admin Panel JS
   Backend base URL — change if your server runs on a different port
───────────────────────────────────────────────────────────────────────────── */
const API = 'https://lecture-hall-management.onrender.com/api';

// ══════════════════════════════════════════════════════════════════════════════
// Dark Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.innerHTML = '☀️ Light Mode';
}
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.innerHTML = '☀️ Light Mode';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggleBtn.innerHTML = '🌙 Dark Mode';
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// Utility helpers
// ══════════════════════════════════════════════════════════════════════════════

let toastTimer = null;
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = isError ? 'error' : '';
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.display = 'none'; }, 3000);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ══════════════════════════════════════════════════════════════════════════════
// Tab switching
// ══════════════════════════════════════════════════════════════════════════════
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.id === `tab-${name}`);
    b.setAttribute('aria-selected', b.id === `tab-${name}`);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tab-content-${name}`);
  });
  if (name === 'bookings') loadBookings();
  if (name === 'halls') loadHalls();
}

// ══════════════════════════════════════════════════════════════════════════════
// HALLS — fetch & render
// ══════════════════════════════════════════════════════════════════════════════
let hallsCache = [];   // used to populate hall dropdowns

async function loadHalls() {
  const tbody = document.getElementById('halls-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="loader">Loading…</td></tr>';
  try {
    const res = await fetch(`${API}/halls`);
    const halls = await res.json();
    hallsCache = halls;
    populateHallDropdowns(halls);

    if (!halls.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No halls added yet.</td></tr>';
      return;
    }

    tbody.innerHTML = halls.map(h => `
      <tr>
        <td>${h.hallCode}</td>
        <td>${h.name}</td>
        <td>${h.capacity}</td>
        <td>${h.location || '—'}</td>
        <td>${(h.facilities || []).join(', ') || '—'}</td>
        <td>
          <span class="badge ${h.isAvailable ? 'badge-available' : 'badge-unavailable'}">
            ${h.isAvailable ? 'Yes' : 'No'}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openEditHall('${h._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteHall('${h._id}', '${h.name}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Could not connect to server.</td></tr>';
  }
}

function populateHallDropdowns(halls) {
  const selects = [
    document.getElementById('alloc-hall'),
    document.getElementById('edit-hall'),
  ];
  selects.forEach(sel => {
    const current = sel.value;
    sel.innerHTML = '<option value="">— Select Hall —</option>';
    halls.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h._id;
      opt.dataset.name = h.name;
      opt.textContent = `${h.hallCode} — ${h.name} (cap: ${h.capacity})`;
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  });
}

async function submitAddHall(e) {
  e.preventDefault();
  const body = {
    hallCode: document.getElementById('hall-code').value.trim(),
    name: document.getElementById('hall-name').value.trim(),
    capacity: parseInt(document.getElementById('hall-capacity').value),
    location: document.getElementById('hall-location').value.trim(),
    facilities: document.getElementById('hall-facilities').value.split(',').map(f => f.trim()).filter(Boolean),
  };
  try {
    const res = await fetch(`${API}/halls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Error adding hall', true); return; }
    showToast('Hall added successfully');
    document.getElementById('add-hall-form').reset();
    loadHalls();
  } catch {
    showToast('Could not connect to server', true);
  }
}

function openEditHall(id) {
  const hall = hallsCache.find(h => h._id === id);
  if (!hall) return;
  document.getElementById('edit-hall-id').value = hall._id;
  document.getElementById('edit-hall-name').value = hall.name;
  document.getElementById('edit-hall-capacity').value = hall.capacity;
  document.getElementById('edit-hall-location').value = hall.location || '';
  document.getElementById('edit-hall-facilities').value = (hall.facilities || []).join(', ');
  document.getElementById('edit-hall-available').value = String(hall.isAvailable);
  openModal('hall-modal');
}

async function submitUpdateHall(e) {
  e.preventDefault();
  const id = document.getElementById('edit-hall-id').value;
  const body = {
    name: document.getElementById('edit-hall-name').value.trim(),
    capacity: parseInt(document.getElementById('edit-hall-capacity').value),
    location: document.getElementById('edit-hall-location').value.trim(),
    facilities: document.getElementById('edit-hall-facilities').value.split(',').map(f => f.trim()).filter(Boolean),
    isAvailable: document.getElementById('edit-hall-available').value === 'true',
  };
  try {
    const res = await fetch(`${API}/halls/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Error updating hall', true); return; }
    showToast('Hall updated');
    closeModal('hall-modal');
    loadHalls();
  } catch {
    showToast('Could not connect to server', true);
  }
}

async function deleteHall(id, name) {
  if (!confirm(`Delete hall "${name}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`${API}/halls/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Error deleting hall', true); return; }
    showToast('Hall deleted');
    loadHalls();
  } catch {
    showToast('Could not connect to server', true);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// BOOKINGS — fetch & render
// ══════════════════════════════════════════════════════════════════════════════
let bookingsCache = [];

async function loadBookings() {
  const tbody = document.getElementById('bookings-tbody');
  tbody.innerHTML = '<tr><td colspan="8" class="loader">Loading…</td></tr>';
  try {
    const res = await fetch(`${API}/bookings`);
    const bookings = await res.json();
    bookingsCache = bookings;

    if (!bookings.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No bookings yet.</td></tr>';
      return;
    }

    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>${b.eventName}</td>
        <td>${b.hallName}</td>
        <td>${formatDate(b.date)}</td>
        <td>${b.startTime} – ${b.endTime}</td>
        <td>${b.bookedBy}</td>
        <td>${b.purpose || '—'}</td>
        <td>
          <span class="badge badge-${b.status}">${b.status}</span>
        </td>
        <td style="display:flex; gap:6px; flex-wrap:wrap;">
          ${b.status !== 'cancelled' ? `
            <button class="btn btn-secondary btn-sm" onclick="openEditBooking('${b._id}')">Update</button>
            <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b._id}', '${b.eventName}')">Cancel</button>
          ` : '<span style="color:#94a3b8; font-size:12px;">Cancelled</span>'}
        </td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Could not connect to server.</td></tr>';
  }
}

// ── Allocate hall (create booking) ───────────────────────────────────────────
async function submitAllocate(e) {
  e.preventDefault();
  const hallSel = document.getElementById('alloc-hall');
  const hallId = hallSel.value;
  const hallName = hallSel.options[hallSel.selectedIndex]?.dataset.name || '';

  const body = {
    hallId,
    hallName,
    eventName: document.getElementById('alloc-event').value.trim(),
    bookedBy: document.getElementById('alloc-by').value.trim(),
    date: document.getElementById('alloc-date').value,
    startTime: document.getElementById('alloc-start').value,
    endTime: document.getElementById('alloc-end').value,
    purpose: document.getElementById('alloc-purpose').value.trim(),
  };

  const btn = document.getElementById('allocate-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Creating…';

  try {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Error creating booking', true); return; }
    showToast('Booking created successfully!');
    document.getElementById('allocate-form').reset();
  } catch {
    showToast('Could not connect to server', true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Booking';
  }
}

// ── Cancel booking (soft delete) ─────────────────────────────────────────────
async function cancelBooking(id, name) {
  if (!confirm(`Cancel booking for "${name}"?`)) return;
  try {
    const res = await fetch(`${API}/bookings/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Error cancelling booking', true); return; }
    showToast('Booking cancelled');
    loadBookings();
  } catch {
    showToast('Could not connect to server', true);
  }
}

// ── Open update booking modal ─────────────────────────────────────────────────
function openEditBooking(id) {
  const b = bookingsCache.find(x => x._id === id);
  if (!b) return;
  document.getElementById('edit-booking-id').value = b._id;
  document.getElementById('edit-event').value = b.eventName;
  document.getElementById('edit-by').value = b.bookedBy;
  document.getElementById('edit-date').value = b.date ? b.date.split('T')[0] : '';
  document.getElementById('edit-start').value = b.startTime;
  document.getElementById('edit-end').value = b.endTime;
  document.getElementById('edit-purpose').value = b.purpose || '';

  // Pre-select hall in modal dropdown
  const editHall = document.getElementById('edit-hall');
  editHall.value = b.hallId;
  // If not found (hallId is a string, not ObjectId match), add a temporary option
  if (!editHall.value) {
    const opt = document.createElement('option');
    opt.value = b.hallId;
    opt.dataset.name = b.hallName;
    opt.textContent = b.hallName;
    editHall.appendChild(opt);
    editHall.value = b.hallId;
  }
  openModal('booking-modal');
}

async function submitUpdateBooking(e) {
  e.preventDefault();
  const id = document.getElementById('edit-booking-id').value;
  const hallSel = document.getElementById('edit-hall');
  const hallId = hallSel.value;
  const hallName = hallSel.options[hallSel.selectedIndex]?.dataset.name
    || hallSel.options[hallSel.selectedIndex]?.textContent
    || '';

  const body = {
    hallId,
    hallName,
    eventName: document.getElementById('edit-event').value.trim(),
    bookedBy: document.getElementById('edit-by').value.trim(),
    date: document.getElementById('edit-date').value,
    startTime: document.getElementById('edit-start').value,
    endTime: document.getElementById('edit-end').value,
    purpose: document.getElementById('edit-purpose').value.trim(),
  };

  try {
    const res = await fetch(`${API}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || 'Error updating booking', true); return; }
    showToast('Booking updated');
    closeModal('booking-modal');
    loadBookings();
  } catch {
    showToast('Could not connect to server', true);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Init — load halls on page load (needed for "Allocate Hall" dropdown)
// ══════════════════════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  loadHalls();
});
