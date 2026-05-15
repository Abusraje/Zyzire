// ============================================
// ZYZIRE 0.0.3 — js/goals.js
// ============================================

let editingGoalId = null;

function render_goals() {
  document.getElementById('goals-list').innerHTML = goals.map(g => {
    const done = g.milestones.filter(m=>m.done).length;
    const total = g.milestones.length;
    const pct = total ? Math.round(done/total*100) : g.progress||0;
    const catColors = {Academic:'var(--blue)',Project:'var(--vg)',Fitness:'var(--red)',Personal:'var(--purple)',Finance:'var(--gold)'};
    const c = catColors[g.category]||'var(--vg)';
    return `
      <div class="card" style="margin-bottom:14px;border-color:${c}33">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div style="flex:1">
            <div style="font-weight:800;font-size:16px;margin-bottom:4px">${g.title}</div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span class="tag" style="background:${c}22;color:${c}">${g.category}</span>
              ${g.deadline?`<span style="font-size:11px;color:var(--muted)">📅 ${g.deadline}</span>`:''}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            ${ring(pct,50,c)}
            <button class="btn-ghost btn-sm btn-icon" onclick="openEditGoal(${g.id})">✏️</button>
          </div>
        </div>
        <div style="height:6px;background:var(--border);border-radius:3px;margin-bottom:12px;overflow:hidden">
          <div style="height:100%;background:${c};width:${pct}%;border-radius:3px;transition:width .4s"></div>
        </div>
        <div class="section-title" style="font-size:10px">Milestones</div>
        ${g.milestones.map((m,i)=>`
          <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--border)" onclick="toggleMilestone(${g.id},${i})">
            <div class="chk${m.done?' done':''}" style="cursor:pointer">${m.done?'<span style="font-size:10px;color:#fff">✓</span>':''}</div>
            <span style="font-size:13px;${m.done?'text-decoration:line-through;color:var(--muted)':''}">${m.text}</span>
          </div>`).join('')}
      </div>`;
  }).join('') || '<div class="empty"><div class="empty-icon">🎯</div><p>No goals yet.<br>Set your first goal!</p></div>';
}

function toggleMilestone(gid, idx) {
  goals = goals.map(g => {
    if (g.id !== gid) return g;
    const milestones = g.milestones.map((m,i) => i===idx ? {...m,done:!m.done} : m);
    const done = milestones.filter(m=>m.done).length;
    const progress = milestones.length ? Math.round(done/milestones.length*100) : g.progress;
    return {...g, milestones, progress};
  });
  save(); render_goals();
}

function openAddGoal() {
  editingGoalId = null;
  document.getElementById('goal-modal-title').textContent = 'New Goal';
  document.getElementById('goal-input-title').value     = '';
  document.getElementById('goal-input-category').value  = 'Personal';
  document.getElementById('goal-input-deadline').value  = '';
  document.getElementById('goal-milestones').innerHTML  = '';
  addMilestoneField();
  document.getElementById('goal-delete-btn').style.display = 'none';
  openModal('goal-modal');
}

function openEditGoal(id) {
  const g = goals.find(x=>x.id===id);
  if (!g) return;
  editingGoalId = id;
  document.getElementById('goal-modal-title').textContent = 'Edit Goal';
  document.getElementById('goal-input-title').value     = g.title;
  document.getElementById('goal-input-category').value  = g.category;
  document.getElementById('goal-input-deadline').value  = g.deadline||'';
  const mc = document.getElementById('goal-milestones');
  mc.innerHTML = '';
  g.milestones.forEach(m => addMilestoneField(m.text));
  document.getElementById('goal-delete-btn').style.display = 'block';
  openModal('goal-modal');
}

function addMilestoneField(value='') {
  const c   = document.getElementById('goal-milestones');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px';
  div.innerHTML = `<input class="input milestone-input" placeholder="Milestone..." value="${value}" style="flex:1"><button class="btn-ghost btn-sm" onclick="this.parentElement.remove()">✕</button>`;
  c.appendChild(div);
}

function saveGoal() {
  const title    = document.getElementById('goal-input-title').value.trim();
  const category = document.getElementById('goal-input-category').value;
  const deadline = document.getElementById('goal-input-deadline').value.trim();
  if (!title) { alert('Please enter a goal title'); return; }
  const milestones = [...document.querySelectorAll('.milestone-input')]
    .map(el=>el.value.trim()).filter(Boolean)
    .map(text=>({text,done:false}));
  if (editingGoalId) {
    goals = goals.map(g => g.id===editingGoalId ? {...g,title,category,deadline,milestones} : g);
    toast('Goal updated');
  } else {
    goals.push({id:nextId(goals), title, category, deadline, progress:0, milestones});
    toast('Goal added!');
  }
  save(); closeModal('goal-modal'); render_goals();
}

function deleteGoal() {
  confirm('Delete this goal?', () => {
    goals = goals.filter(g=>g.id!==editingGoalId);
    save(); closeModal('goal-modal'); render_goals(); toast('Deleted');
  });
}
