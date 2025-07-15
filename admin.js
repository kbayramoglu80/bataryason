// Admin Panel - Sıfırdan Modern ve Hatasız
const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:3001/api"
  : "https://aaw-c886.onrender.com/api";
const ADMIN_PASSWORD = 'Ev2024!Batarya*';

// Giriş Modalı
const passwordModal = document.getElementById('admin-password-modal');
const adminContainer = document.querySelector('.admin-container');
const passwordForm = document.getElementById('admin-password-form');
const passwordInput = document.getElementById('admin-password-input');
const passwordError = document.getElementById('admin-password-error');

function isStrongPassword(pw) {
  return pw.length >= 10 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
}
passwordForm.onsubmit = function(e) {
  e.preventDefault();
  const input = passwordInput.value;
  if (!isStrongPassword(input)) {
    passwordError.textContent = 'Şifre yeterince güçlü değil!';
    passwordError.style.display = 'block';
    return;
  }
  if (input === ADMIN_PASSWORD) {
    passwordModal.style.display = 'none';
    adminContainer.style.display = 'block';
    document.body.style.overflow = '';
    loadAll();
  } else {
    passwordError.textContent = 'Şifre yanlış!';
    passwordError.style.display = 'block';
  }
};
window.addEventListener('DOMContentLoaded', function() {
  passwordModal.style.display = 'flex';
  adminContainer.style.display = 'none';
  document.body.style.overflow = 'hidden';
  passwordInput.focus();
});

// Sekme geçişi
function showSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
  document.getElementById(sectionId).style.display = 'block';
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (sectionId === 'haberler') document.querySelector('.nav-btn:nth-child(1)').classList.add('active');
  if (sectionId === 'modeller') document.getElementById('modeller-btn').classList.add('active');
}

// Modal aç/kapat
function openModal(type, data = null) {
  const modal = document.getElementById('content-modal');
  const formFields = document.getElementById('form-fields');
  modal.style.display = 'flex';
  if (type === 'haber') {
    document.getElementById('modal-title').textContent = data ? 'Haberi Düzenle' : 'Yeni Haber Ekle';
    formFields.innerHTML = `
      <label>Başlık:<input type="text" id="content-title" required></label>
      <label>Kısa Açıklama:<textarea id="content-summary" rows="2" required></textarea></label>
      <label>Detaylı İçerik:<textarea id="content-detail" rows="5" required></textarea></label>
      <label>Kategori:<select id="content-category"><option value="haber">Haber</option><option value="teknoloji">Teknoloji</option><option value="ekonomi">Ekonomi</option><option value="çevre">Çevre</option></select></label>
      <label>Tarih:<input type="date" id="content-date"></label>
      <label>Görsel Yükle:<input type="file" id="content-image-file" accept="image/*"><img id="content-image-preview" style="display:none;max-width:100%;margin-top:10px;border-radius:8px;" /></label>
    `;
    if (data) {
      document.getElementById('content-title').value = data.title || '';
      document.getElementById('content-summary').value = data.summary || '';
      document.getElementById('content-detail').value = data.content || '';
      document.getElementById('content-category').value = data.category || 'haber';
      document.getElementById('content-date').value = data.date || '';
      if (data.image) {
        document.getElementById('content-image-preview').src = data.image;
        document.getElementById('content-image-preview').style.display = 'block';
      }
    }
  }
  if (type === 'bilgi') {
    document.getElementById('modal-title').textContent = data ? 'Bilgiyi Düzenle' : 'Yeni Bilgi Ekle';
    formFields.innerHTML = `
      <label>Başlık:<input type="text" id="info-title" required></label>
      <label>Kısa Açıklama:<textarea id="info-summary" rows="2" required></textarea></label>
    `;
    if (data) {
      document.getElementById('info-title').value = data.title || '';
      document.getElementById('info-summary').value = data.summary || '';
    }
  }
  if (type === 'model') {
    document.getElementById('modal-title').textContent = data ? 'Modeli Düzenle' : 'Yeni Model Ekle';
    formFields.innerHTML = `
      <label>Marka:<input type="text" id="model-brand" required></label>
      <label>Model:<input type="text" id="model-model" required></label>
      <label>Açıklama:<textarea id="model-content" rows="4" required></textarea></label>
      <label>Görsel Yükle:<input type="file" id="model-image-file" accept="image/*"><img id="model-image-preview" style="display:none;max-width:100%;margin-top:10px;border-radius:8px;" /></label>
    `;
    if (data) {
      document.getElementById('model-brand').value = data.brand || '';
      document.getElementById('model-model').value = data.model || '';
      document.getElementById('model-content').value = data.content || '';
      if (data.image) {
        document.getElementById('model-image-preview').src = data.image;
        document.getElementById('model-image-preview').style.display = 'block';
      }
    }
  }
  modal.dataset.type = type;
  modal.dataset.editId = data && data.id ? data.id : '';
}
function closeModal() {
  const modal = document.getElementById('content-modal');
  modal.style.display = 'none';
  document.getElementById('form-fields').innerHTML = '';
  modal.dataset.type = '';
  modal.dataset.editId = '';
}
// Diğer işlevler: fetch, render, ekle, güncelle, sil, yedekle, geri yükle fonksiyonları burada olacak (kısa tutmak için şablon olarak bırakıldı)
async function fetchHaberler() {
  const res = await fetch(`${API_BASE}/news`);
  return await res.json();
}

function renderHaberler(haberler) {
  const list = document.getElementById('haberler-list');
  list.innerHTML = '';
  haberler.forEach(haber => {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
      <img src="${haber.image}" alt="${haber.title}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;">
      <h3>${haber.title}</h3>
      <p>${haber.summary}</p>
      <div class="card-actions">
        <button class="edit-btn">Düzenle</button>
        <button class="delete-btn">Sil</button>
      </div>
    `;
    card.querySelector('.edit-btn').onclick = () => openModal('haber', haber);
    list.appendChild(card);
  });
}

async function fetchBilgiler() {
  const res = await fetch(`${API_BASE}/infos`);
  return await res.json();
}

function renderBilgiler(bilgiler) {
  const list = document.getElementById('bilgiler-list');
  if (!list) return;
  list.innerHTML = '';
  bilgiler.forEach(bilgi => {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
      <h3>${bilgi.title}</h3>
      <p>${bilgi.summary}</p>
      <div class="card-actions">
        <button class="delete-btn">Sil</button>
      </div>
    `;
    list.appendChild(card);
  });
}

async function fetchModeller() {
  const res = await fetch(`${API_BASE}/models`);
  return await res.json();
}

function renderModeller(modeller) {
  const list = document.getElementById('modeller-list');
  list.innerHTML = '';
  modeller.slice(0, 6).forEach(model => {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.innerHTML = `
      <img src="${model.image || ''}" alt="${model.brand || ''} ${model.model || ''}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;">
      <h3>${model.brand || ''} ${model.model || ''}</h3>
      <p>${model.content || ''}</p>
      <div class="card-actions">
        <button class="edit-btn">Düzenle</button>
        <button class="delete-btn">Sil</button>
      </div>
    `;
    card.querySelector('.edit-btn').onclick = () => openModal('model', model);
    list.appendChild(card);
  });
}

// loadAll fonksiyonunu güncelle:
async function loadAll() {
  const haberler = await fetchHaberler();
  renderHaberler(haberler);
  const bilgiler = await fetchBilgiler();
  renderBilgiler(bilgiler);
  const modeller = await fetchModeller();
  renderModeller(modeller);
}

document.getElementById('content-form').onsubmit = async function(e) {
  e.preventDefault();
  const modal = document.getElementById('content-modal');
  const type = modal.dataset.type;
  const editId = modal.dataset.editId;

  if (type === 'haber') {
    const haber = {
      title: document.getElementById('content-title').value,
      summary: document.getElementById('content-summary').value,
      content: document.getElementById('content-detail').value,
      category: document.getElementById('content-category').value,
      date: document.getElementById('content-date').value
    };
    const file = document.getElementById('content-image-file').files[0];
    const formData = new FormData();
    for (const key in haber) formData.append(key, haber[key]);
    if (file) formData.append('image', file);

    let url = `${API_BASE}/news`;
    let method = 'POST';
    if (editId) {
      url += `/${editId}`;
      method = 'PUT';
    }
    const res = await fetch(url, {
      method,
      headers: { 'x-admin-password': ADMIN_PASSWORD },
      body: formData
    });
    if (!res.ok) return alert('Haber kaydedilemedi!');
    closeModal();
    await loadAll();
  }
  if (type === 'model') {
    const model = {
      brand: document.getElementById('model-brand').value,
      model: document.getElementById('model-model').value,
      content: document.getElementById('model-content').value
    };
    const file = document.getElementById('model-image-file').files[0];
    const formData = new FormData();
    for (const key in model) formData.append(key, model[key]);
    if (file) formData.append('image', file);

    let url = `${API_BASE}/models`;
    let method = 'POST';
    if (editId) {
      url += `/${editId}`;
      method = 'PUT';
    }
    const res = await fetch(url, {
      method,
      headers: { 'x-admin-password': ADMIN_PASSWORD },
      body: formData
    });
    if (!res.ok) return alert('Model kaydedilemedi!');
    closeModal();
    await loadAll();
  }
}; 