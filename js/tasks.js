// ============================================
// ZYZIRE 0.0.3 — js/tasks.js
// ============================================

let editingTaskId = null;

function render_tasks() {
  const done  = tasks.filter(t=>t.done).length;
  const total = tasks.length;
  document.getElementById('tasks-subtitle').textContent = `${done} of ${total} complete`;
  document.getElementById('ring-tasks2').innerHTML = ring(total?Math.round(done/total*100):0, 52);
  document.getElementById('tasks-pending-label').textContent = `Pending (${tasks.filter(t=>!t.done).length})`;
  document.getElementById('tasks-done-label').style.display  = done > 0 ? 'block' : 'none';

  document.getElementById('tasks-pending').innerHTML = tasks.filter(t=>!t.done).map(taskHTML).join('');
  document.getElementById('tasks-done').innerHTML    = tasks.filter(t=>t.done).map(taskHTML).join('');
}

function taskHTML(t) {
  return `<div class="task-row${t.done?' done':''}" onclick="toggleTask(${t.id})">
    <div class="chk${t.done?' done':''}" style="margin-top:2px;flex-shrink:0">${t.done?'<span style="font-size:11px;color:#fff">✓</span>':''}</div>
    <div style="flex:1">
      <div class="t-title" style="font-size:14px;font-weight:600">${t.title}</div>
      <div style="display:flex;gap:6px;margin-top:5px;flex-wrap:wrap">
        <span class="tag">${t.cat}</span>
        ${t.pri==='high'?'<span class="tag tag-red">High</span>':t.pri==='medium'?'<span class="tag tag-blue">Med</span>':'<span class="tag" style="background:#052e16;color:var(--muted)">Low</span>'}
      </div>
    </div>
    <button class="btn-ghost btn-sm btn-icon" style="flex-shrink:0" onclick="event.stopPropagation();openEditTask(${t.id})">✏️</button>
  </div>`;
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id===id ? {...t,done:!t.done} : t);
  save(); render_tasks();
}

function openAddTask() {
  editingTaskId = null;
  document.getElementById('task-modal-title').textContent = 'New Task';
  document.getElementById('task-input-title').value = '';
  document.getElementById('task-input-cat').value = 'Personal';
  document.getElementById('task-input-pri').value = 'medium';
  openModal('task-modal');
}

function openEditTask(id) {
  const t = tasks.find(x=>x.id===id);
  if (!t) return;
  editingTaskId = id;
  document.getElementById('task-modal-title').textContent = 'Edit Task';
  document.getElementById('task-input-title').value = t.title;
  document.getElementById('task-input-cat').value   = t.cat;
  document.getElementById('task-input-pri').value   = t.pri;
  openModal('task-modal');
}

function saveTask() {
  const title = document.getElementById('task-input-title').value.trim();
  const cat   = document.getElementById('task-input-cat').value;
  const pri   = document.getElementById('task-input-pri').value;
  if (!title) { alert('Please enter a task title'); return; }
  if (editingTaskId) {
    tasks = tasks.map(t => t.id===editingTaskId ? {...t,title,cat,pri} : t);
    toast('Task updated');
  } else {
    tasks.push({id:nextId(tasks), title, cat, pri, done:false});
    toast('Task added');
  }
  save(); closeModal('task-modal'); render_tasks();
}

function deleteTask(id) {
  confirm('Delete this task?', () => {
    tasks = tasks.filter(t => t.id!==id);
    save(); closeModal('task-modal'); render_tasks(); toast('Task deleted');
  });
}
