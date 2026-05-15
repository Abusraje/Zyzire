// ============================================
// ZYZIRE 0.0.3 — js/habits.js
// ============================================

let editingHabitId = null;

function render_habits() {
  const done  = habits.filter(h=>h.done).length;
  const total = habits.length;
  document.getElementById('habits-subtitle').textContent    = `${done}/${total} today`;
  document.getElementById('ring-habits2').innerHTML         = ring(total?Math.round(done/total*100):0, 60, '#4ade80');
  document.getElementById('habits-today-label').textContent = `Today — ${MONTHS[today.getMonth()]} ${today.getDate()}`;

  document.getElementById('habits-list').innerHTML = habits.map(h => `
    <div class="habit-row${h.done?' done':''}" onclick="toggleHabit(${h.id})">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="chk${h.done?' done':''}">${h.done?'<span style="font-size:11px;color:#fff">✓</span>':''}</div>
        <div>
          <div style="font-size:14px;font-weight:600">${h.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Streak: ${h.streak} days · Total: ${h.total}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;color:var(--vg);font-family:'JetBrains Mono'">🔥${h.streak}</span>
        <button class="btn-ghost btn-sm btn-icon" onclick="event.stopPropagation();openEditHabit(${h.id})">✏️</button>
      </div>
    </div>`).join('');

  // Week overview
  const scores = [60,80,100,50,Math.round(done/total*100)||0,0,0];
  document.getElementById('habits-week').innerHTML = DAYS.map((d,i) => {
    const isPast = i <= today.getDay(), isT = i === today.getDay();
    const sc = isPast ? scores[i] : 0;
    const bg = sc>=80?'var(--v)':sc>=50?'var(--vd)':'var(--border)';
    return `<div class="wday">
      <div style="font-size:9px;color:${isT?'var(--vg)':'var(--muted)'};margin-bottom:4px;font-weight:700">${d}</div>
      <div class="rate-btn" style="margin:0 auto;background:${isPast?bg:'transparent'};color:${isT?'#fff':isPast?'var(--text)':'var(--muted)'};border-color:${isT?'var(--v)':'var(--border)'};width:34px;height:34px;font-size:10px">
        ${isPast?sc:''}
      </div>
    </div>`;
  }).join('');
}

function toggleHabit(id) {
  habits = habits.map(h => {
    if (h.id !== id) return h;
    const done = !h.done;
    return {...h, done, streak: done ? h.streak+1 : Math.max(0,h.streak-1), total: done ? h.total+1 : h.total};
  });
  save(); render_habits();
}

function openAddHabit() {
  editingHabitId = null;
  document.getElementById('habit-modal-title').textContent = 'New Habit';
  document.getElementById('habit-input-name').value = '';
  openModal('habit-modal');
}

function openEditHabit(id) {
  const h = habits.find(x=>x.id===id);
  if (!h) return;
  editingHabitId = id;
  document.getElementById('habit-modal-title').textContent = 'Edit Habit';
  document.getElementById('habit-input-name').value = h.name;
  openModal('habit-modal');
}

function saveHabit() {
  const name = document.getElementById('habit-input-name').value.trim();
  if (!name) { alert('Please enter a habit name'); return; }
  if (editingHabitId) {
    habits = habits.map(h => h.id===editingHabitId ? {...h,name} : h);
    toast('Habit updated');
  } else {
    habits.push({id:nextId(habits), name, done:false, streak:0, total:0});
    toast('Habit added');
  }
  save(); closeModal('habit-modal'); render_habits();
}

function deleteHabit(id) {
  confirm('Delete this habit?', () => {
    habits = habits.filter(h => h.id !== (id||editingHabitId));
    save(); closeModal('habit-modal'); render_habits(); toast('Habit deleted');
  });
}
