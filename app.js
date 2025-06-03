// Tennis Court Booking Portal JavaScript

// Application data
const appData = {
  sampleBookings: [
    {
      id: 1,
      courtName: "Victoria Park Tennis Court 1",
      address: "Victoria Park, Causeway Bay, Hong Kong",
      date: "2025-06-08",
      time: "14:00",
      playStyle: "開SET",
      maxPlayers: 4,
      joinedPlayers: [
        {"name": "Alex Chan"},
        {"name": "Jenny Wong"}
      ],
      creator: "Alex Chan",
      notes: "Casual doubles game, all levels welcome!"
    },
    {
      id: 2,
      courtName: "Happy Valley Recreation Ground",
      address: "Happy Valley, Hong Kong",
      date: "2025-06-09",
      time: "10:00",
      playStyle: "搓波",
      maxPlayers: 2,
      joinedPlayers: [
        {"name": "Michael Li"}
      ],
      creator: "Michael Li",
      notes: "練習技巧，輕鬆打球"
    },
    {
      id: 3,
      courtName: "Bowen Road Tennis Courts",
      address: "Bowen Road, Mid-Levels, Hong Kong",
      date: "2025-06-10",
      time: "18:30",
      playStyle: "其他",
      maxPlayers: 6,
      joinedPlayers: [
        {"name": "Sarah Kim"},
        {"name": "David Liu"},
        {"name": "Emma Chen"},
        {"name": "Ryan Ho"}
      ],
      creator: "Sarah Kim",
      notes: "Mixed doubles tournament practice"
    },
    {
      id: 4,
      courtName: "Kowloon Park Tennis Courts",
      address: "Kowloon Park, Tsim Sha Tsui, Hong Kong", 
      date: "2025-06-11",
      time: "16:00",
      playStyle: "開SET",
      maxPlayers: 4,
      joinedPlayers: [
        {"name": "Tony Wong"},
        {"name": "Lisa Zhang"},
        {"name": "Kevin Ng"},
        {"name": "Amy Lau"}
      ],
      creator: "Tony Wong",
      notes: "Court fully booked - competitive doubles"
    }
  ],
  playStyles: [
    {"value": "搓波", "label_en": "Rally Play", "label_zh": "搓波", "color": "#4CAF50"},
    {"value": "開SET", "label_en": "Set Match", "label_zh": "開SET", "color": "#2196F3"},
    {"value": "其他", "label_en": "Other", "label_zh": "其他", "color": "#FF9800"}
  ],
  translations: {
    "en": {
      "title": "LoL Tennis Chill Club",
      "subtitle": "Tennis Court Booking Portal",
      "welcome": "Welcome to our tennis community! Share court bookings and find playing partners.",
      "activeBookings": "Active Bookings",
      "availableSpots": "Available Spots", 
      "createBooking": "Create Booking",
      "browseBookings": "Browse Bookings",
      "courtName": "Court Name",
      "address": "Address",
      "date": "Date",
      "time": "Time",
      "playStyle": "Play Style",
      "maxPlayers": "Max Players",
      "notes": "Notes",
      "creator": "Created by",
      "creatorName": "Creator Name",
      "join": "Join",
      "full": "Full",
      "filterByStyle": "Filter by Style",
      "allStyles": "All Styles",
      "createNewBooking": "Create New Booking",
      "submit": "Submit",
      "cancel": "Cancel",
      "joinBooking": "Join Booking",
      "enterName": "Enter your name",
      "confirm": "Confirm",
      "viewOnMaps": "View on Google Maps",
      "spotsAvailable": "spots available",
      "spotAvailable": "spot available",
      "players": "Players",
      "addressPlaceholder": "Hong Kong locations only"
    },
    "zh": {
      "title": "LoL Tennis Chill Club",
      "subtitle": "網球場預訂平台",
      "welcome": "歡迎來到我們的網球社群！分享場地預訂，尋找球友。",
      "activeBookings": "活躍預訂",
      "availableSpots": "可用名額",
      "createBooking": "建立預訂",
      "browseBookings": "瀏覽預訂",
      "courtName": "場地名稱",
      "address": "地址",
      "date": "日期",
      "time": "時間", 
      "playStyle": "打球風格",
      "maxPlayers": "最大人數",
      "notes": "備註",
      "creator": "建立者",
      "creatorName": "建立者姓名",
      "join": "加入",
      "full": "已滿",
      "filterByStyle": "按風格篩選",
      "allStyles": "所有風格",
      "createNewBooking": "建立新預訂",
      "submit": "提交",
      "cancel": "取消",
      "joinBooking": "加入預訂",
      "enterName": "輸入您的姓名",
      "confirm": "確認",
      "viewOnMaps": "在Google地圖查看",
      "spotsAvailable": "個名額可用",
      "spotAvailable": "個名額可用",
      "players": "球員",
      "addressPlaceholder": "僅限香港地點"
    }
  }
};

// Application state
let currentLanguage = 'en';
let bookings = [...appData.sampleBookings];
let nextBookingId = 5;
let currentFilter = '';
let selectedBookingForJoin = null;

// DOM Elements
const languageSwitcher = document.getElementById('languageSwitcher');
const bookingsList = document.getElementById('bookingsList');
const styleFilter = document.getElementById('styleFilter');
const createBookingBtn = document.getElementById('createBookingBtn');
const browseBookingsBtn = document.getElementById('browseBookingsBtn');
const createBookingModal = document.getElementById('createBookingModal');
const joinBookingModal = document.getElementById('joinBookingModal');
const createBookingForm = document.getElementById('createBookingForm');
const joinBookingForm = document.getElementById('joinBookingForm');
const activeBookingsCount = document.getElementById('activeBookingsCount');
const availableSpotsCount = document.getElementById('availableSpotsCount');

// Utility Functions
function getTranslation(key) {
  return appData.translations[currentLanguage][key] || key;
}

function updateAllTranslations() {
  // Update all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getTranslation(key);
    
    if (element.tagName === 'INPUT' && element.type === 'submit') {
      element.value = translation;
    } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
      if (key === 'address') {
        element.placeholder = getTranslation('addressPlaceholder');
      }
    } else if (element.tagName === 'OPTION') {
      element.textContent = translation;
    } else {
      element.textContent = translation;
    }
  });

  // Update select options specifically
  updateSelectOptions();
}

function updateSelectOptions() {
  // Update style filter options
  const styleFilterOptions = styleFilter.querySelectorAll('option');
  styleFilterOptions[0].textContent = getTranslation('allStyles');
  
  // Update create booking form play style options
  const playStyleSelect = document.getElementById('playStyle');
  if (playStyleSelect) {
    const options = playStyleSelect.querySelectorAll('option');
    appData.playStyles.forEach((style, index) => {
      if (options[index]) {
        const label = currentLanguage === 'zh' ? style.label_zh : style.label_en;
        options[index].textContent = `${style.value} (${label})`;
      }
    });
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    month: 'short', 
    day: 'numeric',
    weekday: 'short'
  };
  return date.toLocaleDateString(currentLanguage === 'zh' ? 'zh-HK' : 'en-US', options);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString(currentLanguage === 'zh' ? 'zh-HK' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function getPlayStyleBadge(playStyle) {
  const style = appData.playStyles.find(s => s.value === playStyle);
  if (!style) return playStyle;
  
  let className = 'play-style-badge';
  if (playStyle === '搓波') className += ' play-style-badge--rally';
  else if (playStyle === '開SET') className += ' play-style-badge--set';
  else className += ' play-style-badge--other';
  
  const label = currentLanguage === 'zh' ? style.label_zh : style.label_en;
  return `<span class="${className}">${label}</span>`;
}

function generateGoogleMapsUrl(address) {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

function updateStats() {
  const totalBookings = bookings.length;
  const totalAvailableSpots = bookings.reduce((acc, booking) => {
    return acc + Math.max(0, booking.maxPlayers - booking.joinedPlayers.length);
  }, 0);
  
  activeBookingsCount.textContent = totalBookings;
  availableSpotsCount.textContent = totalAvailableSpots;
}

// Booking Management
function renderBookings() {
  const filteredBookings = currentFilter 
    ? bookings.filter(booking => booking.playStyle === currentFilter)
    : bookings;
  
  if (filteredBookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="empty-state">
        <h3>No bookings found</h3>
        <p>Create a new booking to get started!</p>
      </div>
    `;
    return;
  }
  
  bookingsList.innerHTML = filteredBookings.map(booking => {
    const availableSpots = booking.maxPlayers - booking.joinedPlayers.length;
    const isFull = availableSpots <= 0;
    const mapsUrl = generateGoogleMapsUrl(booking.address);
    
    const spotsText = availableSpots === 1 
      ? `1 ${getTranslation('spotAvailable')}` 
      : `${availableSpots} ${getTranslation('spotsAvailable')}`;
    
    return `
      <div class="booking-card card">
        <div class="card__body">
          <div class="booking-card__header">
            <div>
              <h3 class="booking-card__title">${booking.courtName}</h3>
              <p class="booking-card__address">${booking.address}</p>
            </div>
            <a href="${mapsUrl}" target="_blank" class="booking-card__maps-link" title="${getTranslation('viewOnMaps')}">
              📍
            </a>
          </div>
          
          <div class="booking-card__info">
            <div class="booking-card__info-item">
              <span class="booking-card__info-label">${getTranslation('date')}</span>
              <span class="booking-card__info-value">${formatDate(booking.date)}</span>
            </div>
            <div class="booking-card__info-item">
              <span class="booking-card__info-label">${getTranslation('time')}</span>
              <span class="booking-card__info-value">${formatTime(booking.time)}</span>
            </div>
            <div class="booking-card__info-item">
              <span class="booking-card__info-label">${getTranslation('playStyle')}</span>
              <div class="booking-card__info-value">${getPlayStyleBadge(booking.playStyle)}</div>
            </div>
            <div class="booking-card__info-item">
              <span class="booking-card__info-label">${getTranslation('players')}</span>
              <span class="booking-card__info-value">${booking.joinedPlayers.length}/${booking.maxPlayers}</span>
            </div>
          </div>
          
          <div class="booking-card__players">
            <div class="booking-card__players-header">
              <span class="booking-card__players-count">
                ${isFull ? getTranslation('full') : spotsText}
              </span>
            </div>
            <div class="booking-card__players-list">
              ${booking.joinedPlayers.map(player => 
                `<span class="player-badge">${player.name}</span>`
              ).join('')}
            </div>
          </div>
          
          ${booking.notes ? `<div class="booking-card__notes">"${booking.notes}"</div>` : ''}
          
          <div class="booking-card__footer">
            <span class="booking-card__creator">${getTranslation('creator')}: ${booking.creator}</span>
            ${isFull 
              ? `<span class="status status--full">${getTranslation('full')}</span>`
              : `<button class="btn btn--primary btn--sm join-btn" data-booking-id="${booking.id}">${getTranslation('join')}</button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners to join buttons
  document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookingId = parseInt(e.target.getAttribute('data-booking-id'));
      openJoinModal(bookingId);
    });
  });
}

function openJoinModal(bookingId) {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  selectedBookingForJoin = booking;
  
  const joinBookingDetails = document.getElementById('joinBookingDetails');
  const availableSpots = booking.maxPlayers - booking.joinedPlayers.length;
  
  joinBookingDetails.innerHTML = `
    <div class="join-booking-details">
      <h4>${booking.courtName}</h4>
      <p><strong>${getTranslation('date')}:</strong> ${formatDate(booking.date)}</p>
      <p><strong>${getTranslation('time')}:</strong> ${formatTime(booking.time)}</p>
      <p><strong>${getTranslation('playStyle')}:</strong> ${getPlayStyleBadge(booking.playStyle)}</p>
      <p><strong>Available spots:</strong> ${availableSpots}</p>
    </div>
  `;
  
  joinBookingModal.classList.add('active');
  document.getElementById('playerName').focus();
}

function closeJoinModal() {
  joinBookingModal.classList.remove('active');
  selectedBookingForJoin = null;
  joinBookingForm.reset();
}

function openCreateModal() {
  createBookingModal.classList.add('active');
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').min = today;
  document.getElementById('date').value = today;
  
  document.getElementById('courtName').focus();
}

function closeCreateModal() {
  createBookingModal.classList.remove('active');
  createBookingForm.reset();
}

// Event Listeners
languageSwitcher.addEventListener('change', (e) => {
  currentLanguage = e.target.value;
  updateAllTranslations();
  renderBookings();
  updateStats();
});

styleFilter.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  renderBookings();
});

createBookingBtn.addEventListener('click', openCreateModal);
browseBookingsBtn.addEventListener('click', () => {
  document.querySelector('.bookings').scrollIntoView({ behavior: 'smooth' });
});

// Modal event listeners
document.getElementById('createModalClose').addEventListener('click', closeCreateModal);
document.getElementById('createModalBackdrop').addEventListener('click', closeCreateModal);
document.getElementById('cancelCreate').addEventListener('click', closeCreateModal);

document.getElementById('joinModalClose').addEventListener('click', closeJoinModal);
document.getElementById('joinModalBackdrop').addEventListener('click', closeJoinModal);
document.getElementById('cancelJoin').addEventListener('click', closeJoinModal);

// Form submissions
createBookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const courtName = document.getElementById('courtName').value.trim();
  const address = document.getElementById('address').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const playStyle = document.getElementById('playStyle').value;
  const maxPlayers = parseInt(document.getElementById('maxPlayers').value);
  const creatorName = document.getElementById('creatorName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  
  if (!courtName || !address || !date || !time || !playStyle || !maxPlayers || !creatorName) {
    alert('Please fill in all required fields');
    return;
  }
  
  const newBooking = {
    id: nextBookingId++,
    courtName: courtName,
    address: address,
    date: date,
    time: time,
    playStyle: playStyle,
    maxPlayers: maxPlayers,
    creator: creatorName,
    notes: notes,
    joinedPlayers: [{ name: creatorName }]
  };
  
  bookings.unshift(newBooking);
  closeCreateModal();
  renderBookings();
  updateStats();
  
  alert('Booking created successfully!');
});

joinBookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!selectedBookingForJoin) return;
  
  const playerName = document.getElementById('playerName').value.trim();
  if (!playerName) {
    alert('Please enter your name');
    return;
  }
  
  // Check if player already joined
  const alreadyJoined = selectedBookingForJoin.joinedPlayers.some(player => 
    player.name.toLowerCase() === playerName.toLowerCase()
  );
  
  if (alreadyJoined) {
    alert('You have already joined this booking!');
    return;
  }
  
  // Check if booking is full
  if (selectedBookingForJoin.joinedPlayers.length >= selectedBookingForJoin.maxPlayers) {
    alert('This booking is already full!');
    closeJoinModal();
    return;
  }
  
  // Add player to booking
  selectedBookingForJoin.joinedPlayers.push({ name: playerName });
  
  closeJoinModal();
  renderBookings();
  updateStats();
  
  alert(`Successfully joined ${selectedBookingForJoin.courtName}!`);
});

// Keyboard event listeners for modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (createBookingModal.classList.contains('active')) {
      closeCreateModal();
    }
    if (joinBookingModal.classList.contains('active')) {
      closeJoinModal();
    }
  }
});

// Initialize application
function initApp() {
  updateAllTranslations();
  renderBookings();
  updateStats();
  
  // Set default language
  languageSwitcher.value = currentLanguage;
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}