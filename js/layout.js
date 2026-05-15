// ============================================
// ZYZIRE v0.0.6 — js/layout.js
// Wiggle mode, drag & drop, responsive sidebar
// ============================================

let wiggleMode    = false;
let dashWidgets   = ['tasks','habits','finance','diary','hobbies','goals','gym','subs'];
let hiddenTabs    = [];
let layoutDensity = 'comfortable';
let appLang       = 'en';
let dragging      = null;
let dragTarget    = null;

// ---- INIT ----
function initLayout() {
  try {
    const s = JSON.parse(localStorage.getItem('zyzire_layout')||'{}');
    if (s.dashWidgets)   dashWidgets   = s.dashWidgets;
    if (s.hiddenTabs)    hiddenTabs    = s.hiddenTabs;
    if (s.density)       layoutDensity = s.density;
    if (s.lang)          appLang       = s.lang;
  } catch(e) {}
  applyDensity();
  applyLang();
  buildSidebar();
  applyHiddenTabs();
}

function saveLayout() {
  localStorage.setItem('zyzire_layout', JSON.stringify({
    dashWidgets, hiddenTabs, density:layoutDensity, lang:appLang
  }));
}

function applyDensity() {
  document.body.classList.remove('density-compact','density-comfortable','density-spacious');
  document.body.classList.add('density-'+layoutDensity);
}

function applyLang() {
  document.documentElement.lang = appLang;
  document.documentElement.dir  = appLang === 'ar' ? 'rtl' : 'ltr';
}

function applyHiddenTabs() {
  document.querySelectorAll('.nav-item').forEach(el => {
    const id = el.id?.replace('nav-','');
    if (id) el.style.display = hiddenTabs.includes(id) ? 'none' : '';
  });
  if (document.querySelector('.sidebar')) buildSidebar();
}

// ---- SIDEBAR ----
const SB_TABS = [
  {id:'dashboard', label:'Home',        ar:'الرئيسية',   icon:'⌂', g:'main'},
  {id:'tasks',     label:'Tasks',       ar:'المهام',      icon:'✓', g:'main'},
  {id:'habits',    label:'Habits',      ar:'العادات',     icon:'◎', g:'main'},
  {id:'diary',     label:'Diary',       ar:'اليوميات',    icon:'✎', g:'main'},
  {id:'hobbies',   label:'Hobbies',     ar:'الهوايات',    icon:'🎨',g:'media'},
  {id:'bookshelf', label:'Books',       ar:'الكتب',       icon:'📚',g:'media'},
  {id:'gym',       label:'Gym',         ar:'الجيم',       icon:'💪',g:'life'},
  {id:'finance',   label:'Finance',     ar:'المالية',     icon:'💰',g:'life'},
  {id:'goals',     label:'Goals',       ar:'الأهداف',     icon:'🎯',g:'life'},
  {id:'subscriptions',label:'Subs',     ar:'الاشتراكات',  icon:'$', g:'life'},
  {id:'hub',       label:'Hub',         ar:'المحور',      icon:'🌐',g:'social'},
  {id:'friends',   label:'Friends',     ar:'الأصدقاء',    icon:'👥',g:'social'},
  {id:'settings',  label:'Settings',    ar:'الإعدادات',   icon:'⚙', g:'system'},
];
const SB_GROUPS = {main:{en:'MAIN',ar:'الرئيسية'},media:{en:'MEDIA',ar:'الوسائط'},life:{en:'LIFE',ar:'الحياة'},social:{en:'SOCIAL',ar:'التواصل'},system:{en:'SYSTEM',ar:'النظام'}};

function buildSidebar() {
  const sb = document.getElementById('sidebar-nav');
  if (!sb) return;
  let lastG = '', html = '';
  SB_TABS.forEach(t => {
    if (hiddenTabs.includes(t.id)) return;
    if (t.g !== lastG) {
      const glabel = SB_GROUPS[t.g]?.[appLang] || SB_GROUPS[t.g]?.en || '';
      html += `<div class="sb-label">${glabel}</div>`;
      lastG = t.g;
    }
    const active = document.getElementById('nav-'+t.id)?.classList.contains('active') ? ' active' : '';
    const label  = appLang==='ar' ? t.ar : t.label;
    html += `<div class="sb-item${active}" onclick="goTab('${t.id}')" id="sb-${t.id}">
      <span class="sb-icon">${t.icon}</span><span>${label}</span>
    </div>`;
  });
  sb.innerHTML = html;

  const uname = document.getElementById('sb-username');
  const uplan = document.getElementById('sb-plan');
  if (uname && currentUser) uname.textContent = currentUser.name || currentUser.email || 'Guest';
  if (uplan) uplan.textContent = isPro ? 'Zyzire+' : (appLang==='ar'?'مجاني':'Free plan');
}

function updateSidebarActive(id) {
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('sb-'+id);
  if (el) el.classList.add('active');
}

// ---- RIGHT PANEL ----
function updateRightPanel() {
  const rp = document.getElementById('right-panel');
  if (!rp || rp.offsetParent === null) return;

  const tDone  = tasks.filter(t=>t.done).length,  tTotal = tasks.length;
  const hDone  = habits.filter(h=>h.done).length, hTotal = habits.length;
  const income = (finance.income||[]).reduce((s,i)=>s+i.amount,0);
  const spent  = (finance.expenses||[]).reduce((s,e)=>s+e.amount,0);
  const streak = habits.length ? Math.max(...habits.map(h=>h.streak||0)) : 0;
  const upcoming = tasks.filter(t=>!t.done).slice(0,6);
  const activity = posts.slice(0,4);

  rp.innerHTML = `
    <div style="font-size:14px;font-weight:800;color:var(--vg);margin-bottom:18px">
      ${appLang==='ar'?'نظرة عامة':'Overview'}
    </div>

    <div class="rp-stat">
      <div class="rp-stat-label">
        <span>${appLang==='ar'?'المهام':'Tasks'}</span>
        <span style="color:var(--v)">${tDone}/${tTotal}</span>
      </div>
      <div class="bar-track"><div class="bar-fill bar-glow-green" style="width:${tTotal?Math.round(tDone/tTotal*100):0}%"></div></div>
    </div>
    <div class="rp-stat">
      <div class="rp-stat-label">
        <span>${appLang==='ar'?'العادات':'Habits'}</span>
        <span style="color:#60a5fa">${hDone}/${hTotal}</span>
      </div>
      <div class="bar-track"><div class="bar-fill bar-glow-blue" style="width:${hTotal?Math.round(hDone/hTotal*100):0}%"></div></div>
    </div>
    <div class="rp-stat">
      <div class="rp-stat-label">
        <span>${appLang==='ar'?'الميزانية':'Budget'}</span>
        <span style="color:var(--gold)">${spent}/${finance.budget||3000} SAR</span>
      </div>
      <div class="bar-track"><div class="bar-fill bar-glow-gold" style="width:${Math.min(100,Math.round(spent/(finance.budget||3000)*100))}%"></div></div>
    </div>

    <div style="padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
      <span style="font-size:12px;color:var(--muted);font-weight:600">${appLang==='ar'?'أفضل سلسلة':'Best Streak'}</span>
      <span style="font-size:16px;font-weight:800;color:var(--gold);font-family:'JetBrains Mono'">🔥 ${streak}</span>
    </div>

    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">${appLang==='ar'?'قادم':'Up Next'}</div>
    ${upcoming.length===0
      ? `<div style="font-size:12px;color:var(--v)">✓ ${appLang==='ar'?'كل شيء منجز!':'All done!'}</div>`
      : upcoming.map(t=>`
        <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="goTab('tasks')">
          <div style="width:7px;height:7px;border-radius:50%;flex-shrink:0;background:${t.pri==='high'?'var(--red)':t.pri==='medium'?'var(--gold)':'var(--muted)'}"></div>
          <div style="font-size:12px;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div>
        </div>`).join('')}

    ${activity.length>0?`
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:16px 0 10px">${appLang==='ar'?'النشاط':'Activity'}</div>
    ${activity.map(p=>`
      <div style="padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted);margin-bottom:3px">${p.date} ${p.vibe||''}</div>
        <div style="font-size:12px;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${p.text}</div>
      </div>`).join('')}`:''}`;
}

// ---- WIGGLE / DRAG MODE ----
function toggleWiggle() {
  wiggleMode = !wiggleMode;
  const btn = document.getElementById('edit-layout-btn');
  const grid = document.getElementById('dash-widget-grid');
  if (btn)  btn.classList.toggle('active', wiggleMode);
  if (grid) grid.classList.toggle('wiggle-mode', wiggleMode);
  if (wiggleMode) {
    toast(appLang==='ar'?'اسحب الأدوات لإعادة ترتيبها 🎨':'Drag widgets to reorder 🎨');
    attachDragListeners();
  } else {
    toast(appLang==='ar'?'تم الحفظ ✓':'Layout saved ✓');
  }
}

function attachDragListeners() {
  const cards = document.querySelectorAll('#dash-widget-grid .widget-card');
  cards.forEach(card => {
    card.setAttribute('draggable','true');
    card.addEventListener('dragstart', onDragStart);
    card.addEventListener('dragover',  onDragOver);
    card.addEventListener('drop',      onDrop);
    card.addEventListener('dragend',   onDragEnd);
    // Touch
    card.addEventListener('touchstart', onTouchStart, {passive:false});
    card.addEventListener('touchmove',  onTouchMove,  {passive:false});
    card.addEventListener('touchend',   onTouchEnd);
  });
}

function onDragStart(e) {
  dragging = e.currentTarget.dataset.widget;
  setTimeout(()=>e.currentTarget.style.opacity='0.4',0);
}
function onDragOver(e) {
  e.preventDefault();
  const w = e.currentTarget.dataset.widget;
  if (w!==dragging) {
    document.querySelectorAll('.widget-card').forEach(c=>c.classList.remove('drag-over-widget'));
    e.currentTarget.classList.add('drag-over-widget');
    dragTarget = w;
  }
}
function onDrop(e) {
  e.preventDefault();
  if (dragging && dragTarget && dragging!==dragTarget) swapWidgets(dragging,dragTarget);
}
function onDragEnd(e) {
  e.currentTarget.style.opacity='1';
  document.querySelectorAll('.widget-card').forEach(c=>{c.classList.remove('drag-over-widget');});
  dragging=null; dragTarget=null;
}

// Touch drag
let touchEl=null, touchClone=null, touchOX=0, touchOY=0;
function onTouchStart(e) {
  if (!wiggleMode) return;
  e.preventDefault();
  touchEl = e.currentTarget;
  dragging = touchEl.dataset.widget;
  const r = touchEl.getBoundingClientRect();
  touchOX = e.touches[0].clientX - r.left;
  touchOY = e.touches[0].clientY - r.top;
  touchClone = touchEl.cloneNode(true);
  touchClone.style.cssText=`position:fixed;z-index:9999;width:${r.width}px;left:${r.left}px;top:${r.top}px;opacity:.85;transform:scale(1.04) rotate(1deg);pointer-events:none;transition:none;box-shadow:0 12px 40px #00000077`;
  document.body.appendChild(touchClone);
  touchEl.style.opacity='0.3';
}
function onTouchMove(e) {
  if (!touchClone) return;
  e.preventDefault();
  const x=e.touches[0].clientX-touchOX, y=e.touches[0].clientY-touchOY;
  touchClone.style.left=x+'px'; touchClone.style.top=y+'px';
  touchClone.style.display='none';
  const under = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  touchClone.style.display='';
  const target = under?.closest('.widget-card');
  document.querySelectorAll('.widget-card').forEach(c=>c.classList.remove('drag-over-widget'));
  if (target && target!==touchEl) { target.classList.add('drag-over-widget'); dragTarget=target.dataset.widget; }
  else dragTarget=null;
}
function onTouchEnd() {
  if (touchClone) { touchClone.remove(); touchClone=null; }
  if (touchEl) touchEl.style.opacity='1';
  document.querySelectorAll('.widget-card').forEach(c=>c.classList.remove('drag-over-widget'));
  if (dragging && dragTarget && dragging!==dragTarget) swapWidgets(dragging,dragTarget);
  dragging=null; dragTarget=null; touchEl=null;
}

function swapWidgets(a,b) {
  const ai=dashWidgets.indexOf(a), bi=dashWidgets.indexOf(b);
  if (ai!==-1&&bi!==-1) { [dashWidgets[ai],dashWidgets[bi]]=[dashWidgets[bi],dashWidgets[ai]]; }
  saveLayout(); renderWidgetGrid(); attachDragListeners();
}

// ---- WIDGET GRID ----
function renderWidgetGrid() {
  const grid = document.getElementById('dash-widget-grid');
  if (!grid) return;
  grid.innerHTML = dashWidgets.filter(w=>!hiddenWidgets().includes(w)).map(w=>`
    <div class="widget-card" data-widget="${w}" onclick="${wiggleMode?'':''}" ondblclick="if(wiggleMode){}">
      ${getWidgetHTML(w)}
    </div>`).join('');
  if (wiggleMode) { grid.classList.add('wiggle-mode'); attachDragListeners(); }
  setTimeout(animateRings, 80);
}

function hiddenWidgets() { return []; }

function getWidgetHTML(w) {
  switch(w) {
    case 'tasks':    return wTasks();
    case 'habits':   return wHabits();
    case 'finance':  return wFinance();
    case 'diary':    return wDiary();
    case 'hobbies':  return wHobbies();
    case 'goals':    return wGoals();
    case 'gym':      return wGym();
    case 'subs':     return wSubs();
    default: return '';
  }
}

// ---- ANIMATED RING ----
function svgRing(pct, size, color, id) {
  const r=Math.floor((size-7)/2), circ=+(2*Math.PI*r).toFixed(1);
  const offset=+(circ-(pct/100)*circ).toFixed(1);
  return `<svg width="${size}" height="${size}" style="flex-shrink:0">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--border)" stroke-width="6"/>
    <circle class="ring-circle" id="ring-${id}" cx="${size/2}" cy="${size/2}" r="${r}" fill="none"
      stroke="${color}" stroke-width="6" stroke-linecap="round"
      stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
      data-offset="${offset}"
      transform="rotate(-90 ${size/2} ${size/2})"
      style="stroke:${color};filter:drop-shadow(0 0 4px ${color})"/>
    <text x="${size/2}" y="${size/2+5}" text-anchor="middle"
      style="font-size:${Math.floor(size*.2)}px;font-family:'JetBrains Mono';font-weight:700;fill:${color}">${pct}%</text>
  </svg>`;
}
function animateRings() {
  document.querySelectorAll('.ring-circle[data-offset]').forEach(el=>{
    setTimeout(()=>{ el.style.strokeDashoffset=el.dataset.offset; },100);
  });
}

function bar(pct, cls, h=8) {
  return `<div class="bar-track" style="height:${h}px"><div class="bar-fill ${cls}" style="width:0%" data-w="${pct}%"></div></div>`;
}
function animateBars() {
  document.querySelectorAll('.bar-fill[data-w]').forEach(el=>{
    setTimeout(()=>{ el.style.width=el.dataset.w; },120);
  });
}

// Kick off both animations
function animateAll() { animateRings(); animateBars(); }

// ---- WIDGETS ----
function wTasks() {
  const done=tasks.filter(t=>t.done).length, tot=tasks.length;
  const pct=tot?Math.round(done/tot*100):0;
  const hi=tasks.filter(t=>!t.done&&t.pri==='high').length;
  const md=tasks.filter(t=>!t.done&&t.pri==='medium').length;
  const lo=tasks.filter(t=>!t.done&&t.pri==='low').length;
  return `<div onclick="goTab('tasks')" style="height:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em">${appLang==='ar'?'المهام':'Tasks'}</div>
        <div style="font-size:28px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono';line-height:1.1">${done}<span style="font-size:13px;color:var(--muted)">/${tot}</span></div>
      </div>
      ${svgRing(pct,54,'#22c55e','tasks')}
    </div>
    ${bar(pct,'bar-glow-green')}
    <div style="display:flex;gap:5px;margin-top:10px">
      ${[['H',hi,'var(--red)'],['M',md,'var(--gold)'],['L',lo,'var(--muted)']].map(([l,v,c])=>`
        <div style="flex:1;padding:5px;background:${c}18;border-radius:8px;border:1px solid ${c}33;text-align:center">
          <div style="font-size:13px;font-weight:800;color:${c};font-family:'JetBrains Mono'">${v}</div>
          <div style="font-size:9px;color:${c};font-weight:700">${l}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

function wHabits() {
  const done=habits.filter(h=>h.done).length, tot=habits.length;
  const pct=tot?Math.round(done/tot*100):0;
  return `<div onclick="goTab('habits')" style="height:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em">${appLang==='ar'?'العادات':'Habits'}</div>
        <div style="font-size:28px;font-weight:800;color:#60a5fa;font-family:'JetBrains Mono';line-height:1.1">${done}<span style="font-size:13px;color:var(--muted)">/${tot}</span></div>
      </div>
      ${svgRing(pct,54,'#60a5fa','habits')}
    </div>
    ${bar(pct,'bar-glow-blue')}
    <div style="display:flex;gap:3px;margin-top:10px;flex-wrap:wrap">
      ${habits.map(h=>`
        <div title="${h.name}" style="width:28px;height:28px;border-radius:6px;background:${h.done?'#60a5fa':'var(--border)'};transition:background .3s;${h.done?'box-shadow:0 0 6px #60a5fa66':''}display:flex;align-items:center;justify-content:center;font-size:13px">
          ${h.done?'✓':''}
        </div>`).join('')}
    </div>
  </div>`;
}

function wFinance() {
  const inc=(finance.income||[]).reduce((s,i)=>s+i.amount,0);
  const exp=(finance.expenses||[]).reduce((s,e)=>s+e.amount,0);
  const bal=inc-exp, budg=finance.budget||3000;
  const bPct=Math.min(100,Math.round(exp/budg*100));
  const bCol=bPct>90?'bar-glow-red':bPct>70?'bar-glow-gold':'bar-glow-green';
  const bTxt=bPct>90?'var(--red)':bPct>70?'var(--gold)':'var(--v)';
  return `<div onclick="goTab('finance')" style="height:100%">
    <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">${appLang==='ar'?'المالية':'Finance'}</div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      ${[['↑',inc,'var(--vg)',(appLang==='ar'?'دخل':'In')],['↓',exp,'var(--red)',(appLang==='ar'?'مصروف':'Out')],['=',bal,bal>=0?'var(--vg)':'var(--red)',(appLang==='ar'?'رصيد':'Net')]].map(([s,v,c,l])=>`
        <div style="flex:1;padding:8px 6px;background:var(--card2);border-radius:8px;border:1px solid ${c}22;text-align:center">
          <div style="font-size:9px;color:var(--muted);margin-bottom:2px">${l}</div>
          <div style="font-size:14px;font-weight:800;color:${c};font-family:'JetBrains Mono'">${v}</div>
        </div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
      <span style="font-size:10px;color:var(--muted)">${appLang==='ar'?'الميزانية':'Budget'} ${bPct}%</span>
      <span style="font-size:10px;font-weight:700;color:${bTxt}">${exp}/${budg}</span>
    </div>
    ${bar(bPct, bCol)}
  </div>`;
}

function wDiary() {
  const recent=diary.slice(0,5);
  const avg=recent.length?Math.round(recent.reduce((s,e)=>s+(e.rating||0),0)/recent.length):0;
  const MOOD_COL={'😊':'#4ade80','😐':'#fbbf24','😴':'#60a5fa','😤':'#f87171','🔥':'#f97316','😔':'#a78bfa'};
  return `<div onclick="goTab('diary')" style="height:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em">${appLang==='ar'?'اليوميات':'Diary'}</div>
        <div style="font-size:28px;font-weight:800;color:var(--purple);font-family:'JetBrains Mono';line-height:1.1">${avg}<span style="font-size:13px;color:var(--muted)">/10</span></div>
      </div>
      <div style="font-size:34px">${recent[0]?.mood||'📔'}</div>
    </div>
    ${bar(avg*10,'bar-glow-purple')}
    <div style="display:flex;gap:4px;margin-top:10px">
      ${recent.map(e=>`
        <div style="flex:1;height:28px;border-radius:6px;background:${MOOD_COL[e.mood]||'var(--border)'}22;border:1px solid ${MOOD_COL[e.mood]||'var(--border)'}44;display:flex;align-items:center;justify-content:center;font-size:14px">${e.mood}</div>`).join('')}
    </div>
  </div>`;
}

function wHobbies() {
  const watched=media.filter(m=>['Watched','Read','Played'].includes(m.status)).length;
  const watching=media.filter(m=>['Watching','Reading','Playing'].includes(m.status)).length;
  const want=media.filter(m=>['Watchlist','Want'].includes(m.status)).length;
  const tot=media.length||1;
  return `<div onclick="goTab('hobbies')" style="height:100%">
    <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">${appLang==='ar'?'الهوايات':'Hobbies'}</div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      ${[[watched,'var(--v)',(appLang==='ar'?'منتهي':'Done')],[watching,'#60a5fa',(appLang==='ar'?'جاري':'Active')],[want,'var(--muted)',(appLang==='ar'?'قائمة':'List')]].map(([v,c,l])=>`
        <div style="flex:1;text-align:center">
          <div style="font-size:22px;font-weight:800;color:${c};font-family:'JetBrains Mono'">${v}</div>
          <div style="font-size:10px;color:var(--muted)">${l}</div>
        </div>`).join('')}
    </div>
    <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;display:flex;gap:1px">
      <div class="bar-fill bar-glow-green" data-w="${Math.round(watched/tot*100)}%" style="border-radius:5px 0 0 5px;width:0%"></div>
      <div class="bar-fill bar-glow-blue"  data-w="${Math.round(watching/tot*100)}%" style="border-radius:0;width:0%"></div>
      <div style="flex:1;background:var(--border)"></div>
    </div>
  </div>`;
}

function wGoals() {
  const tot=goals.length;
  const avg=tot?Math.round(goals.reduce((s,g)=>s+(g.progress||0),0)/tot):0;
  const CAT_C={Academic:'var(--blue)',Project:'var(--v)',Fitness:'var(--red)',Personal:'var(--purple)',Finance:'var(--gold)'};
  return `<div onclick="goTab('goals')" style="height:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em">${appLang==='ar'?'الأهداف':'Goals'}</div>
        <div style="font-size:28px;font-weight:800;color:var(--gold);font-family:'JetBrains Mono';line-height:1.1">${avg}<span style="font-size:13px;color:var(--muted)">%</span></div>
      </div>
      ${svgRing(avg,54,'var(--gold)','goals')}
    </div>
    ${goals.slice(0,3).map(g=>{
      const c=CAT_C[g.category]||'var(--v)', p=g.progress||0;
      return `<div style="margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
          <span style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:75%">${g.title}</span>
          <span style="font-size:11px;color:${c};font-family:'JetBrains Mono';font-weight:700">${p}%</span>
        </div>
        <div class="bar-track" style="height:5px"><div class="bar-fill" style="background:${c};box-shadow:0 0 5px ${c}55;width:0%" data-w="${p}%"></div></div>
      </div>`;
    }).join('')}
  </div>`;
}

function wGym() {
  const sess=gym.length;
  const week=gym.filter(s=>{try{return Date.now()-new Date('2025 '+s.date)<7*864e5;}catch(e){return false;}}).length;
  const vol=gym.reduce((s,se)=>s+se.exercises.reduce((sv,ex)=>sv+ex.sets.reduce((ss,st)=>ss+(st.reps*(st.kg||0)),0),0),0);
  const types=['Push','Pull','Legs','Full'];
  const counts=types.map(t=>gym.filter(s=>s.type.startsWith(t[0])).length);
  const mx=Math.max(...counts,1);
  return `<div onclick="goTab('gym')" style="height:100%">
    <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">${appLang==='ar'?'الجيم':'Gym'}</div>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      ${[[week,'var(--red)',(appLang==='ar'?'الأسبوع':'Week')],[sess,'var(--vg)',(appLang==='ar'?'الكل':'Total')],[(vol/1000).toFixed(1)+'k','var(--blue)',(appLang==='ar'?'حجم':'Vol')]].map(([v,c,l])=>`
        <div style="flex:1;padding:7px 5px;background:var(--card2);border-radius:8px;text-align:center">
          <div style="font-size:14px;font-weight:800;color:${c};font-family:'JetBrains Mono'">${v}</div>
          <div style="font-size:9px;color:var(--muted)">${l}</div>
        </div>`).join('')}
    </div>
    <div style="display:flex;align-items:flex-end;gap:4px;height:36px">
      ${types.map((t,i)=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
          <div class="bar-fill bar-glow-red" data-w="${Math.round(counts[i]/mx*100)}%" style="width:100%;height:0%;border-radius:3px 3px 0 0;transition:height .8s;width:auto" data-h="${Math.round(counts[i]/mx*28)}px"></div>
          <div style="font-size:8px;color:var(--muted)">${t[0]}</div>
        </div>`).join('')}
    </div>
  </div>`;
}

function wSubs() {
  const tot=subs.reduce((s,x)=>s+x.amount,0);
  const next=[...subs].sort((a,b)=>new Date('2025 '+a.next)-new Date('2025 '+b.next))[0];
  return `<div onclick="goTab('subscriptions')" style="height:100%">
    <div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">${appLang==='ar'?'الاشتراكات':'Subscriptions'}</div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <div style="flex:1;padding:10px;background:var(--card2);border-radius:10px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:2px">${appLang==='ar'?'شهري':'Monthly'}</div>
        <div style="font-size:18px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${tot}</div>
        <div style="font-size:10px;color:var(--muted)">SAR</div>
      </div>
      <div style="flex:1;padding:10px;background:var(--card2);border-radius:10px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:2px">${appLang==='ar'?'سنوي':'Yearly'}</div>
        <div style="font-size:18px;font-weight:800;color:var(--red);font-family:'JetBrains Mono'">${tot*12}</div>
        <div style="font-size:10px;color:var(--muted)">SAR</div>
      </div>
    </div>
    ${next?`
    <div style="padding:8px 12px;background:var(--gold)11;border:1px solid var(--gold)33;border-radius:10px;display:flex;align-items:center;gap:8px">
      <span style="font-size:18px">${next.icon}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:700">${next.name}</div><div style="font-size:10px;color:var(--muted)">${next.next}</div></div>
      <span style="font-size:12px;font-weight:700;color:var(--gold);font-family:'JetBrains Mono'">${next.amount}</span>
    </div>`:''}
  </div>`;
}

// ---- LANGUAGE ----
function setLanguage(lang) {
  appLang = lang;
  saveLayout();
  applyLang();
  buildSidebar();
  render_settings();
  toast(lang==='ar'?'تم تغيير اللغة 🌐':'Language changed 🌐');
}
