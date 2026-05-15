// ============================================
// ZYZIRE 0.0.3 — js/subscriptions.js
// ============================================

let editingSubId = null;

function render_subscriptions() {
  const total  = subs.reduce((s,x)=>s+x.amount, 0);
  const yearly = total * 12;

  document.getElementById('subs-monthly').textContent = total + ' SAR';
  document.getElementById('subs-yearly').textContent  = yearly + ' SAR';
  document.getElementById('subs-count').textContent   = subs.length;

  document.getElementById('subs-list').innerHTML = subs.length===0
    ? '<div class="empty"><div class="empty-icon">💳</div><p>No subscriptions yet.</p></div>'
    : subs.map(s=>`
      <div class="card-row" onclick="openEditSub(${s.id})">
        <div style="width:42px;height:42px;border-radius:12px;background:${s.color||'var(--card2)'};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${s.icon}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${s.name}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">Renews ${s.next} · ${s.cycle}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;color:var(--vg);font-family:'JetBrains Mono'">${s.amount}</div>
          <div style="font-size:11px;color:var(--muted)">SAR</div>
        </div>
      </div>`).join('');
}

function openAddSub() {
  editingSubId = null;
  document.getElementById('sub-modal-title').textContent = 'New Subscription';
  document.getElementById('sub-input-name').value   = '';
  document.getElementById('sub-input-icon').value   = '💳';
  document.getElementById('sub-input-amount').value = '';
  document.getElementById('sub-input-cycle').value  = 'monthly';
  document.getElementById('sub-input-next').value   = '';
  document.getElementById('sub-delete-btn').style.display = 'none';
  openModal('sub-modal');
}

function openEditSub(id) {
  const s = subs.find(x=>x.id===id);
  if (!s) return;
  editingSubId = id;
  document.getElementById('sub-modal-title').textContent = 'Edit Subscription';
  document.getElementById('sub-input-name').value   = s.name;
  document.getElementById('sub-input-icon').value   = s.icon;
  document.getElementById('sub-input-amount').value = s.amount;
  document.getElementById('sub-input-cycle').value  = s.cycle;
  document.getElementById('sub-input-next').value   = s.next;
  document.getElementById('sub-delete-btn').style.display = 'block';
  openModal('sub-modal');
}

function saveSub() {
  const name   = document.getElementById('sub-input-name').value.trim();
  const icon   = document.getElementById('sub-input-icon').value.trim() || '💳';
  const amount = parseFloat(document.getElementById('sub-input-amount').value)||0;
  const cycle  = document.getElementById('sub-input-cycle').value;
  const next   = document.getElementById('sub-input-next').value.trim();
  if (!name||!amount) { alert('Fill in name and amount'); return; }
  if (editingSubId) {
    subs = subs.map(s => s.id===editingSubId ? {...s,name,icon,amount,cycle,next} : s);
    toast('Updated!');
  } else {
    subs.push({id:nextId(subs), name, icon, amount, cycle, next});
    toast('Subscription added!');
  }
  save(); closeModal('sub-modal'); render_subscriptions();
}

function deleteSub() {
  confirm('Delete this subscription?', () => {
    subs = subs.filter(s=>s.id!==editingSubId);
    save(); closeModal('sub-modal'); render_subscriptions(); toast('Deleted');
  });
}
