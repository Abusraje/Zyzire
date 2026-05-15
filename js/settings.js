// ============================================
// ZYZIRE v0.0.6 — js/settings.js
// Settings + Layout merged
// ============================================

const THEMES=[
  {id:'default',label:'Zyzire Dark', ar:'زيزير داكن',  bg:'#111211',card:'#181a18',v:'#22c55e',vg:'#4ade80'},
  {id:'midnight',label:'Midnight',   ar:'منتصف الليل', bg:'#080810',card:'#0d0d1a',v:'#818cf8',vg:'#a5b4fc'},
  {id:'carbon',  label:'Carbon',     ar:'كربون',        bg:'#0a0a0a',card:'#141414',v:'#e5e7eb',vg:'#f9fafb'},
  {id:'sunset',  label:'Sunset',     ar:'غروب',         bg:'#12080a',card:'#1c0e10',v:'#f97316',vg:'#fb923c'},
];
const ACCENTS=[
  {c:'#22c55e',n:'Zyzire',  na:'زيزير'},
  {c:'#60a5fa',n:'Ocean',   na:'أزرق'},
  {c:'#a78bfa',n:'Violet',  na:'بنفسجي'},
  {c:'#fbbf24',n:'Gold',    na:'ذهبي'},
  {c:'#f87171',n:'Red',     na:'أحمر'},
  {c:'#f97316',n:'Orange',  na:'برتقالي'},
  {c:'#ec4899',n:'Pink',    na:'وردي'},
  {c:'#e5e7eb',n:'Mono',    na:'رمادي'},
];
const WIDGET_META={
  tasks:{label:'Tasks',ar:'المهام'},habits:{label:'Habits',ar:'العادات'},
  finance:{label:'Finance',ar:'المالية'},diary:{label:'Diary',ar:'اليوميات'},
  hobbies:{label:'Hobbies',ar:'الهوايات'},goals:{label:'Goals',ar:'الأهداف'},
  gym:{label:'Gym',ar:'الجيم'},subs:{label:'Subs',ar:'الاشتراكات'},
};
const ALL_TABS=[
  {id:'tasks',l:'Tasks',ar:'المهام'},{id:'habits',l:'Habits',ar:'العادات'},
  {id:'diary',l:'Diary',ar:'اليوميات'},{id:'hobbies',l:'Hobbies',ar:'الهوايات'},
  {id:'bookshelf',l:'Books',ar:'الكتب'},{id:'gym',l:'Gym',ar:'الجيم'},
  {id:'finance',l:'Finance',ar:'المالية'},{id:'goals',l:'Goals',ar:'الأهداف'},
  {id:'subscriptions',l:'Subs',ar:'الاشتراكات'},{id:'hub',l:'Hub',ar:'المحور'},
  {id:'friends',l:'Friends',ar:'الأصدقاء'},
];

let activeTheme='default', activeAccent='#22c55e';

function render_settings() {
  const L = (en,ar) => appLang==='ar' ? ar : en;
  const set=(id,fn)=>{const el=document.getElementById(id);if(el)fn(el);};

  set('settings-username',  el=>el.textContent=currentUser?(currentUser.name||currentUser.email):'Guest');
  set('settings-plan-label',el=>el.textContent=isPro?L('Zyzire+ · Unlocked ⚡','زيزير+ · مفعّل ⚡'):L('Free plan','مجاني'));
  set('settings-upgrade-btn',el=>el.style.display=isPro?'none':'block');
  set('settings-pro-badge', el=>el.style.display=isPro?'flex':'none');

  // Themes
  set('settings-themes',el=>{
    el.innerHTML=THEMES.map(t=>`
      <div onclick="${isPro?`applyTheme('${t.id}')`:'showPaywall()'}" style="padding:12px;border-radius:10px;background:${t.bg};border:2px solid ${activeTheme===t.id?'var(--v)':'var(--border)'};cursor:pointer;position:relative;transition:border-color .2s">
        <div style="width:18px;height:18px;border-radius:4px;background:${t.v};margin-bottom:5px"></div>
        <div style="font-size:11px;font-weight:700;color:#fff">${appLang==='ar'?t.ar:t.label}</div>
        ${!isPro?'<div style="position:absolute;top:6px;right:6px;font-size:9px;color:var(--gold);font-weight:700">+</div>':''}
      </div>`).join('');
  });

  // Accents
  set('settings-accents',el=>{
    el.innerHTML=ACCENTS.map(a=>`
      <div onclick="${isPro?`applyAccent('${a.c}')`:'showPaywall()'}" style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer">
        <div style="width:32px;height:32px;border-radius:9px;background:${a.c};border:3px solid ${activeAccent===a.c?'#fff':'transparent'};transition:all .15s;${isPro?'':'opacity:.5'}"></div>
        <div style="font-size:9px;color:var(--muted);font-weight:600">${appLang==='ar'?a.na:a.n}</div>
      </div>`).join('');
  });

  // Language
  set('settings-lang-en',el=>{el.classList.toggle('active',appLang==='en');});
  set('settings-lang-ar',el=>{el.classList.toggle('active',appLang==='ar');});

  // Density
  ['compact','comfortable','spacious'].forEach(d=>{
    set('density-'+d,el=>{
      el.className=(d===layoutDensity?'btn':'btn-ghost')+' btn-sm';
      el.style.flex='1';el.style.textTransform='capitalize';
    });
  });

  // Widget toggles
  Object.entries(WIDGET_META).forEach(([id,meta])=>{
    set('widget-toggle-'+id,el=>{
      const on=dashWidgets.includes(id);
      el.className='toggle-wrap '+(on?'on':'off');
      el.querySelector('.toggle-knob').style.left=on?'21px':'3px';
    });
  });

  // Tab toggles
  ALL_TABS.forEach(t=>{
    set('tab-toggle-'+t.id,el=>{
      const on=!hiddenTabs.includes(t.id);
      el.className='toggle-wrap '+(on?'on':'off');
      el.querySelector('.toggle-knob').style.left=on?'21px':'3px';
    });
  });

  if (isPro) removeProlocks();
}

function removeProlocks(){
  document.querySelectorAll('.pro-lock').forEach(el=>el.style.display='none');
  document.querySelectorAll('.pro-gate').forEach(el=>{el.onclick=null;el.style.cursor='default';});
}
function applyTheme(id){
  if(!isPro){showPaywall();return;}
  const t=THEMES.find(x=>x.id===id); if(!t)return;
  activeTheme=id;
  const r=document.documentElement;
  r.style.setProperty('--bg',t.bg);r.style.setProperty('--card',t.card);
  r.style.setProperty('--card2',t.card);r.style.setProperty('--v',t.v);r.style.setProperty('--vg',t.vg);
  render_settings();toast((appLang==='ar'?'المظهر: ':'Theme: ')+( appLang==='ar'?t.ar:t.label));
}
function applyAccent(c){
  if(!isPro){showPaywall();return;}
  activeAccent=c;
  document.documentElement.style.setProperty('--v',c);
  document.documentElement.style.setProperty('--vg',c+'cc');
  render_settings();toast(appLang==='ar'?'تم تغيير اللون':'Accent updated!');
}
function showPaywall(){document.getElementById('paywall-overlay').classList.add('open');}
function closePaywall(){document.getElementById('paywall-overlay').classList.remove('open');}
function unlockPro(){
  isPro=true;save();closePaywall();removeProlocks();render_settings();
  toast(appLang==='ar'?'مرحباً بك في زيزير+! 🎉':'Welcome to Zyzire+! 🎉');
}
function exportData(){
  if(!isPro){showPaywall();return;}
  const blob=new Blob([JSON.stringify({tasks,habits,media,diary,books,subs,gym,finance,goals,posts},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='zyzire-export.json';a.click();
  toast(appLang==='ar'?'تم التصدير!':'Exported!');
}
function clearAllData(){
  if(!confirm(appLang==='ar'?'حذف كل البيانات؟':'Delete ALL data?'))return;
  if(!confirm(appLang==='ar'?'تأكيد؟ لا يمكن التراجع.':'Really? Cannot be undone.'))return;
  localStorage.removeItem('vos_data');resetToDefaults();save();goTab('dashboard');
  toast(appLang==='ar'?'تم مسح البيانات':'Data cleared');
}
function setDensity(d){
  layoutDensity=d;saveLayout();applyDensity();render_settings();
  toast((appLang==='ar'?'الكثافة: ':'')+d);
}
function toggleWidget(id){
  if(dashWidgets.includes(id)){
    if(dashWidgets.length<=2){toast(appLang==='ar'?'ابقِ على أداتين على الأقل!':'Keep at least 2!');return;}
    dashWidgets=dashWidgets.filter(w=>w!==id);
  } else {
    dashWidgets.push(id);
  }
  saveLayout();render_settings();
  if(document.getElementById('dash-widget-grid')){renderWidgetGrid();setTimeout(animateAll,100);}
}
function toggleTabVisibility(id){
  if(hiddenTabs.includes(id)){hiddenTabs=hiddenTabs.filter(t=>t!==id);}
  else{hiddenTabs.push(id);}
  saveLayout();applyHiddenTabs();render_settings();
}
function resetLayout(){
  if(!confirm(appLang==='ar'?'إعادة ضبط التخطيط؟':'Reset layout?'))return;
  dashWidgets=['tasks','habits','finance','diary','hobbies','goals','gym','subs'];
  hiddenTabs=[];layoutDensity='comfortable';
  saveLayout();applyDensity();applyHiddenTabs();
  if(document.getElementById('dash-widget-grid')){renderWidgetGrid();setTimeout(animateAll,100);}
  render_settings();toast(appLang==='ar'?'تم الإعادة':'Reset!');
}
