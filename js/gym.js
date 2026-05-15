// ============================================
// ZYZIRE 0.0.3 — js/gym.js
// ============================================

let viewingSession = null;

function render_gym() {
  const c = document.getElementById('gym-content');
  if (viewingSession) { renderSessionView(c); return; }

  const totalSessions = gym.length;
  const totalVolume   = gym.reduce((s,sess)=>s+sess.exercises.reduce((sv,ex)=>sv+ex.sets.reduce((ss2,set)=>ss2+(set.reps*(set.kg||0)),0),0),0);
  const thisWeek      = gym.filter(s=>{const d=new Date('2025 '+s.date);return (today-d)<7*86400000;}).length;

  c.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><h2>Gym Tracker</h2><div class="page-subtitle">${totalSessions} sessions logged</div></div>
        <button class="btn btn-sm" onclick="openAddSession()">+ Session</button>
      </div>
    </div>
    <div class="g3" style="margin-bottom:20px">
      <div class="card2" style="text-align:center">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">This Week</div>
        <div style="font-size:24px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${thisWeek}</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Sessions</div>
        <div style="font-size:24px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${totalSessions}</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Total kg</div>
        <div style="font-size:24px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${(totalVolume/1000).toFixed(1)}k</div>
      </div>
    </div>
    <div class="section-title">Sessions</div>
    ${gym.length===0?'<div class="empty"><div class="empty-icon">💪</div><p>No sessions yet.<br>Log your first workout!</p></div>':''}
    ${[...gym].reverse().map(s=>`
      <div class="card-row" onclick="viewSession(${s.id})">
        <div style="width:42px;height:42px;border-radius:10px;background:#22c55e22;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">💪</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${s.type} Day</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${s.date} · ${s.exercises.length} exercises</div>
        </div>
        <div style="font-size:12px;color:var(--vg);font-family:'JetBrains Mono'">${s.exercises.reduce((n,e)=>n+e.sets.length,0)} sets</div>
      </div>`).join('')}`;
}

function renderSessionView(c) {
  const s = viewingSession;
  const vol = s.exercises.reduce((sv,ex)=>sv+ex.sets.reduce((ss,set)=>ss+(set.reps*(set.kg||0)),0),0);
  c.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <button class="btn-ghost btn-sm" onclick="backGym()">← Back</button>
      <div>
        <div style="font-weight:800;font-size:18px">${s.type} Day</div>
        <div style="font-size:12px;color:var(--muted)">${s.date}</div>
      </div>
      <button class="btn-ghost btn-sm btn-danger" style="margin-left:auto" onclick="deleteSession(${s.id})">🗑 Delete</button>
    </div>
    <div class="g3" style="margin-bottom:20px">
      <div class="card2" style="text-align:center"><div style="font-size:10px;color:var(--muted)">Exercises</div><div style="font-size:20px;font-weight:800;color:var(--vg)">${s.exercises.length}</div></div>
      <div class="card2" style="text-align:center"><div style="font-size:10px;color:var(--muted)">Sets</div><div style="font-size:20px;font-weight:800;color:var(--vg)">${s.exercises.reduce((n,e)=>n+e.sets.length,0)}</div></div>
      <div class="card2" style="text-align:center"><div style="font-size:10px;color:var(--muted)">Volume</div><div style="font-size:20px;font-weight:800;color:var(--vg)">${vol.toLocaleString()}kg</div></div>
    </div>
    ${s.exercises.map(ex=>`
      <div class="card" style="margin-bottom:12px">
        <div style="font-weight:700;font-size:15px;margin-bottom:10px">${ex.name}</div>
        <div style="display:flex;gap:8px;font-size:11px;color:var(--muted);margin-bottom:6px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">
          <span style="flex:0 0 30px">#</span><span style="flex:1">Reps</span><span style="flex:1">Weight</span><span style="flex:1">Vol</span>
        </div>
        ${ex.sets.map((set,i)=>`
          <div class="gym-set">
            <span style="flex:0 0 30px;font-size:12px;color:var(--muted);font-family:'JetBrains Mono'">${i+1}</span>
            <span style="flex:1;font-weight:700">${set.reps} reps</span>
            <span style="flex:1;color:var(--vg);font-family:'JetBrains Mono'">${set.kg||0} kg</span>
            <span style="flex:1;font-size:12px;color:var(--muted)">${set.reps*(set.kg||0)} kg</span>
          </div>`).join('')}
      </div>`).join('')}`;
}

function viewSession(id) { viewingSession=gym.find(s=>s.id===id); render_gym(); }
function backGym()       { viewingSession=null; render_gym(); }

function openAddSession() {
  document.getElementById('gym-modal-type').value = 'Push';
  document.getElementById('gym-modal-date').value = `${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`;
  document.getElementById('gym-exercises').innerHTML = '';
  addGymExercise();
  openModal('gym-modal');
}

function addGymExercise() {
  const c = document.getElementById('gym-exercises');
  const idx = c.children.length;
  const div = document.createElement('div');
  div.className = 'card2';
  div.style.marginBottom = '12px';
  div.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
      <input class="input" placeholder="Exercise name (e.g. Bench Press)" id="ex-name-${idx}" style="flex:1">
      <button class="btn-ghost btn-sm btn-danger" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
    <div id="ex-sets-${idx}"></div>
    <button class="btn-ghost btn-sm" style="width:100%;margin-top:6px" onclick="addSet(${idx})">+ Set</button>`;
  c.appendChild(div);
  addSet(idx);
}

function addSet(idx) {
  const c = document.getElementById(`ex-sets-${idx}`);
  if (!c) return;
  const si = c.children.length;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;margin-bottom:6px;align-items:center';
  div.innerHTML = `
    <span style="font-size:12px;color:var(--muted);width:20px;text-align:center;font-family:'JetBrains Mono'">${si+1}</span>
    <input class="input" type="number" placeholder="Reps" id="ex-${idx}-reps-${si}" style="flex:1">
    <input class="input" type="number" placeholder="kg" id="ex-${idx}-kg-${si}" style="flex:1">
    <button class="btn-ghost btn-sm" style="padding:6px 8px" onclick="this.parentElement.remove()">✕</button>`;
  c.appendChild(div);
}

function saveSession() {
  const type = document.getElementById('gym-modal-type').value;
  const date = document.getElementById('gym-modal-date').value.trim();
  if (!date) { alert('Enter a date'); return; }
  const exDivs = document.getElementById('gym-exercises').children;
  const exercises = [];
  for (let i = 0; i < exDivs.length; i++) {
    const nameEl = document.getElementById(`ex-name-${i}`);
    if (!nameEl) continue;
    const name = nameEl.value.trim();
    if (!name) continue;
    const setsContainer = document.getElementById(`ex-sets-${i}`);
    const sets = [];
    if (setsContainer) {
      for (let j = 0; j < setsContainer.children.length; j++) {
        const repsEl = document.getElementById(`ex-${i}-reps-${j}`);
        const kgEl   = document.getElementById(`ex-${i}-kg-${j}`);
        if (repsEl && kgEl && repsEl.value) {
          sets.push({reps:parseInt(repsEl.value)||0, kg:parseFloat(kgEl.value)||0});
        }
      }
    }
    if (sets.length) exercises.push({name, sets});
  }
  if (!exercises.length) { alert('Add at least one exercise with sets'); return; }
  gym.unshift({id:nextId(gym), type, date, exercises});
  save(); closeModal('gym-modal'); render_gym(); toast('Session logged!');
}

function deleteSession(id) {
  confirm('Delete this session?', () => {
    gym = gym.filter(s=>s.id!==id);
    viewingSession=null;
    save(); render_gym(); toast('Session deleted');
  });
}
