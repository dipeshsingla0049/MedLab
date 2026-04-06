const API_URL = 'https://69c16e00085e1a9fae410108.mockapi.io/api/v1/Hospitals';
let allHospitals = [];

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('hospital-grid')) {
    initBedsPage();
  }

  if (document.getElementById('favorites-grid')) {
    initFavoritesPage();
  }

  if (document.getElementById('hero-search')) {
    initHeroSearch();
  }
});

function initHeroSearch() {
  const input = document.getElementById('hero-search');
  const btn = document.getElementById('btn-hero-search');

  if (!btn || !input) {
    return;
  }

  const handleSearch = function() {
    const query = input.value.trim();
    if (query) {
      window.location.href = 'beds.html?q=' + encodeURIComponent(query);
    } else {
      window.location.href = 'beds.html';
    }
  };

  btn.addEventListener('click', handleSearch);
}

function initBedsPage() {
  const spinner = document.getElementById('spinner');
  const grid = document.getElementById('hospital-grid');
  const emptyState = document.getElementById('beds-empty');
  const countEl = document.getElementById('results-count');
  const searchInput = document.getElementById('search-input');
  const citySelect = document.getElementById('city-filter');
  const bedSelect = document.getElementById('bed-filter');
  const sortSelect = document.getElementById('sort-select');
  const clearBtn = document.getElementById('btn-clear-filters');

  spinner.style.display = 'flex';
  emptyState.style.display = 'none';

  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q') || '';
  const urlFilter = params.get('filter') || '';
  const urlBedType = params.get('bedType') || '';

  if (urlQuery && searchInput) {
    searchInput.value = urlQuery;
  }

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allHospitals = data;
      spinner.style.display = 'none';
      grid.style.display = 'grid';
      buildCityFilter(allHospitals, citySelect);

      if (urlFilter === 'icu' && bedSelect) {
        bedSelect.value = 'icu';
      }

      if (urlBedType === 'ICU Only' && bedSelect) {
        bedSelect.value = 'icu';
      }

      renderCards(allHospitals, grid, countEl, emptyState);

      if (urlFilter || urlBedType || urlQuery) {
        applyFilters(allHospitals, grid, countEl, emptyState, searchInput, citySelect, bedSelect, sortSelect);
      }
    })
    .catch(function(err) {
      console.error('Failed to fetch hospitals:', err);
      spinner.style.display = 'none';
      emptyState.style.display = 'block';
      emptyState.querySelector('p').innerText = 'Failed to load hospitals. Please try again.';
    });

  const handleFilterChange = function() {
    applyFilters(allHospitals, grid, countEl, emptyState, searchInput, citySelect, bedSelect, sortSelect);
  };

  if (searchInput) {
    searchInput.addEventListener('input', handleFilterChange);
  }

  if (citySelect) {
    citySelect.addEventListener('change', handleFilterChange);
  }

  if (bedSelect) {
    bedSelect.addEventListener('change', handleFilterChange);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', handleFilterChange);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      if (citySelect) citySelect.value = '';
      if (bedSelect) bedSelect.value = '';
      if (sortSelect) sortSelect.value = '';
      renderCards(allHospitals, grid, countEl, emptyState);
    });
  }

  initModal();
}

function buildCityFilter(hospitals, citySelect) {
  if (!citySelect) return;

  const cities = hospitals
    .map(function(h) { return h.city; })
    .filter(function(city, index, array) { return array.indexOf(city) === index; })
    .sort();

  cities.forEach(function(city) {
    const option = document.createElement('option');
    option.value = city;
    option.text = city;
    citySelect.appendChild(option);
  });
}

function applyFilters(hospitals, grid, countEl, emptyState, searchInput, citySelect, bedSelect, sortSelect) {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const city = citySelect ? citySelect.value : '';
  const bedType = bedSelect ? bedSelect.value : '';
  const sortBy = sortSelect ? sortSelect.value : '';

  const filtered = hospitals
    .filter(function(h) {
      const matchesSearch = !query ||
        h.name.toLowerCase().includes(query) ||
        h.city.toLowerCase().includes(query);

      const matchesCity = !city || h.city === city;

      const matchesBedType = !bedType ||
        (bedType === 'icu' && h.icuBeds > 0) ||
        (bedType === 'general' && h.generalBeds > 0);

      return matchesSearch && matchesCity && matchesBedType;
    });

  const sorted = filtered.sort(function(a, b) {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'beds') {
      return b.availBeds - a.availBeds;
    }
    return 0;
  });

  renderCards(sorted, grid, countEl, emptyState);
}

function renderCards(hospitals, grid, countEl, emptyState) {
  grid.innerHTML = '';

  if (countEl) {
    countEl.innerText = 'Showing ' + hospitals.length + ' hospital' +
      (hospitals.length === 1 ? '' : 's');
  }

  if (hospitals.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  hospitals.forEach(function(hospital) {
    const card = buildCard(hospital);
    grid.appendChild(card);
  });
}

function buildCard(h) {
  let badgeClass = 'badge-green';
  let badgeText = 'Available';

  if (h.availBeds === 0) {
    badgeClass = 'badge-red';
    badgeText = 'Full';
  } else if (h.availBeds <= 10) {
    badgeClass = 'badge-yellow';
    badgeText = 'Limited';
  }

  let bedsClass = 'beds-green';
  if (h.availBeds === 0) {
    bedsClass = 'beds-red';
  } else if (h.availBeds <= 10) {
    bedsClass = 'beds-yellow';
  }

  const card = document.createElement('div');
  card.className = 'hospital-card';
  card.setAttribute('data-id', h.id);

  const cardImage = document.createElement('div');
  cardImage.className = 'card-image';

  const img = document.createElement('img');
  img.src = h.image;
  img.alt = h.name;

  const badge = document.createElement('span');
  badge.className = 'badge badge-avail ' + badgeClass;
  badge.innerText = badgeText;

  cardImage.appendChild(img);
  cardImage.appendChild(badge);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const name = document.createElement('h3');
  name.className = 'card-name';
  name.innerText = h.name;

  const location = document.createElement('div');
  location.className = 'card-location';
  location.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
    h.city;

  const divider = document.createElement('div');
  divider.className = 'card-beds-divider';

  const beds = document.createElement('div');
  beds.className = 'card-beds';
  beds.innerHTML =
    '<span>General: <span class="' + bedsClass + '">' + h.generalBeds + '</span></span>' +
    '<span>ICU: <span class="' + bedsClass + '">' + h.icuBeds + '</span></span>' +
    '<span>Avail: <span class="' + bedsClass + '">' + h.availBeds + '</span></span>';

  const contact = document.createElement('div');
  contact.className = 'card-contact';
  contact.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
    h.phone;

  const buttons = document.createElement('div');
  buttons.className = 'card-buttons';

  const detailsBtn = document.createElement('button');
  detailsBtn.className = 'btn-details';
  detailsBtn.innerText = 'View Details';
  detailsBtn.addEventListener('click', function() {
    openModal(h);
  });

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn-save';
  saveBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' +
    'Save';

  if (isSaved(h.id)) {
    saveBtn.classList.add('saved');
  }

  saveBtn.addEventListener('click', function() {
    toggleSave(h, saveBtn);
  });

  buttons.appendChild(detailsBtn);
  buttons.appendChild(saveBtn);

  cardBody.appendChild(name);
  cardBody.appendChild(location);
  cardBody.appendChild(divider);
  cardBody.appendChild(beds);
  cardBody.appendChild(contact);
  cardBody.appendChild(buttons);

  card.appendChild(cardImage);
  card.appendChild(cardBody);

  return card;
}

function initModal() {
  const modal = document.getElementById('hospital-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function openModal(h) {
  const modal = document.getElementById('hospital-modal');
  if (!modal) return;

  modal.querySelector('.modal-image').src = h.image;
  modal.querySelector('.modal-image').alt = h.name;
  modal.querySelector('.modal-name').innerText = h.name;
  modal.querySelector('.modal-location-text').innerText = h.city;
  modal.querySelector('.modal-general-beds').innerText = h.generalBeds;
  modal.querySelector('.modal-icu-beds').innerText = h.icuBeds;
  modal.querySelector('.modal-phone').innerText = h.phone;

  const availBadge = modal.querySelector('.modal-avail-beds');
  availBadge.innerText = h.availBeds + ' available';
  availBadge.className = 'modal-avail-beds status-badge';

  if (h.availBeds === 0) {
    availBadge.classList.add('badge-red');
  } else if (h.availBeds <= 10) {
    availBadge.classList.add('badge-yellow');
  } else {
    availBadge.classList.add('badge-green');
  }

  const icuBadge = modal.querySelector('.modal-icu-avail');
  icuBadge.innerText = h.icuBeds + ' total';
  icuBadge.className = 'modal-icu-avail status-badge badge-green';

  const directionsBtn = modal.querySelector('.modal-directions-btn');
  if (directionsBtn) {
    directionsBtn.onclick = function() {
      const query = encodeURIComponent(h.name + ' ' + h.city);
      window.open('https://www.google.com/maps/search/?api=1&query=' + query, '_blank');
    };
  }

  const saveBtn = modal.querySelector('.modal-save-btn');
  if (saveBtn) {
    if (isSaved(h.id)) {
      saveBtn.classList.add('saved');
      saveBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' +
        'Saved';
    } else {
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' +
        'Save Hospital';
    }

    saveBtn.onclick = function() {
      toggleSave(h, saveBtn);
    };
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('hospital-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function saveToLocalStorage(key, data) {
  const jsonString = JSON.stringify(data);
  localStorage.setItem(key, jsonString);
}

function getFromLocalStorage(key) {
  const jsonString = localStorage.getItem(key);
  return jsonString ? JSON.parse(jsonString) : [];
}

function getSaved() {
  return getFromLocalStorage('medlab-favorites');
}

function isSaved(id) {
  return getSaved().some(function(h) { return h.id === id; });
}

function toggleSave(h, btn) {
  const saved = getSaved();

  if (isSaved(h.id)) {
    const updated = saved.filter(function(item) { return item.id !== h.id; });
    saveToLocalStorage('medlab-favorites', updated);
    btn.classList.remove('saved');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>Save';
  } else {
    saved.push(h);
    saveToLocalStorage('medlab-favorites', saved);
    btn.classList.add('saved');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>Saved';
  }
}

function initFavoritesPage() {
  const grid = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('favorites-empty');
  const countEl = document.getElementById('fav-count');
  const saved = getSaved();

  if (saved.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (grid) grid.style.display = 'none';
    if (countEl) countEl.innerText = '0 saved';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (grid) grid.style.display = 'grid';
  if (countEl) countEl.innerText = saved.length + ' saved';

  saved.forEach(function(hospital) {
    const card = buildCard(hospital);
    grid.appendChild(card);
  });

  initModal();
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .feature-card');
  elements.forEach(function(el) {
    el.classList.add('visible');
  });
}