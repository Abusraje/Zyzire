// ============================================
// ZYZIRE v0.0.6 — js/dashboard.js
// ============================================
function render_dashboard() {
  buildWeekStrip();
  if (typeof updateRightPanel==='function') updateRightPanel();

  const pending=tasks.filter(t=>!t.done).length;
  const todayStr=`${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`;
  const todayDiary=diary.find(d=>d.date===todayStr);
  const hr=today.getHours();
  const L=(en,ar)=>typeof appLang!=='undefined'&&appLang==='ar'?ar:en;
  const greet=hr<12?L('Good morning ☀️','صباح الخير ☀️'):hr<17?L('Good afternoon 🌤','مساء الخير 🌤'):hr<21?L('Good evening 🌙','مساء النور 🌙'):L('Night owl 🦉','بومة الليل 🦉');

  const bG=document.getElementById('banner-greeting');
  const bT=document.getElementById('banner-text');
  if (bG) bG.textContent=greet;
  if (bT) bT.innerHTML=`${L('You have','لديك')} <strong>${pending}</strong> ${L('pending tasks','مهام معلقة')}${!todayDiary?` · <span style="color:var(--gold)">${L('No diary entry yet','لا يوجد تسجيل يومي')}</span>`:''}`;

  if (typeof renderWidgetGrid==='function') {
    renderWidgetGrid();
    setTimeout(()=>{ if(typeof animateAll==='function') animateAll(); },120);
  }

  const nextSub=subs.length?[...subs].sort((a,b)=>new Date('2025 '+a.next)-new Date('2025 '+b.next))[0]:null;
  const sa=document.getElementById('dash-sub-alert');
  if (sa) {
    if (nextSub) {
      sa.style.display='flex';
      sa.innerHTML=`<span style="font-size:22px">${nextSub.icon}</span><div style="flex:1"><div style="font-size:13px;font-weight:700">${nextSub.name}</div><div style="font-size:12px;color:var(--muted)">${nextSub.amount} SAR · ${nextSub.next}</div></div><span style="color:var(--muted);font-size:18px">›</span>`;
    } else sa.style.display='none';
  }
}
