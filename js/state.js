// ============================================
// ZYZIRE v0.0.5 — js/state.js
// ============================================

let tasks    = [];
let habits   = [];
let media    = [];
let diary    = [];
let books    = [];
let subs     = [];
let gym      = [];
let finance  = {};
let goals    = [];
let posts    = [];
let isPro    = false;
let currentUser = null;

// UI state
let mediaTypeFilter   = 'All';
let mediaStatusFilter = 'All';
let activeDiaryEdit   = null;
let viewingBook       = null;
let activeModal       = null;

function save() {
  try {
    localStorage.setItem('vos_data', JSON.stringify({tasks,habits,media,diary,books,subs,gym,finance,goals,posts,isPro}));
  } catch(e) { console.warn('Save error',e); }
}

function load() {
  try {
    const raw = localStorage.getItem('vos_data');
    if (!raw) { resetToDefaults(); return; }
    const d = JSON.parse(raw);
    tasks   = d.tasks   || JSON.parse(JSON.stringify(DEFAULT_TASKS));
    habits  = d.habits  || JSON.parse(JSON.stringify(DEFAULT_HABITS));
    media   = d.media   || JSON.parse(JSON.stringify(DEFAULT_MEDIA));
    diary   = d.diary   || JSON.parse(JSON.stringify(DEFAULT_DIARY));
    books   = d.books   || JSON.parse(JSON.stringify(DEFAULT_BOOKS));
    subs    = d.subs    || JSON.parse(JSON.stringify(DEFAULT_SUBS));
    gym     = d.gym     || JSON.parse(JSON.stringify(DEFAULT_GYM));
    finance = d.finance || JSON.parse(JSON.stringify(DEFAULT_FINANCE));
    goals   = d.goals   || JSON.parse(JSON.stringify(DEFAULT_GOALS));
    posts   = d.posts   || [];
    isPro   = d.isPro   || false;
  } catch(e) { console.warn('Load error',e); resetToDefaults(); }
}

function resetToDefaults() {
  tasks   = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  habits  = JSON.parse(JSON.stringify(DEFAULT_HABITS));
  media   = JSON.parse(JSON.stringify(DEFAULT_MEDIA));
  diary   = JSON.parse(JSON.stringify(DEFAULT_DIARY));
  books   = JSON.parse(JSON.stringify(DEFAULT_BOOKS));
  subs    = JSON.parse(JSON.stringify(DEFAULT_SUBS));
  gym     = JSON.parse(JSON.stringify(DEFAULT_GYM));
  finance = JSON.parse(JSON.stringify(DEFAULT_FINANCE));
  goals   = JSON.parse(JSON.stringify(DEFAULT_GOALS));
  posts   = [];
  isPro   = false;
}

function nextId(arr) {
  return arr && arr.length ? Math.max(...arr.map(x=>x.id||0))+1 : 1;
}
