// ============================================
// ZYZIRE 0.0.3 — js/finance.js
// ============================================

let financeTab = 'overview';

function render_finance() {
  const c = document.getElementById('finance-content');
  const income   = (finance.income   || []).reduce((s,i)=>s+i.amount, 0);
  const expenses = (finance.expenses || []).reduce((s,e)=>s+e.amount, 0);
  const balance  = income - expenses;
  const savings  = finance.savings  || [];
  const budget   = finance.budget   || 3000;
  const budgetPct= Math.min(100, Math.round(expenses/budget*100));

  c.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><h2>Finance</h2><div class="page-subtitle">May 2025</div></div>
        <button class="btn btn-sm" onclick="openAddTransaction()">+ Add</button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="g3" style="margin-bottom:20px">
      <div class="card2" style="text-align:center">
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px;font-weight:700;text-transform:uppercase">Income</div>
        <div style="font-size:18px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${income}</div>
        <div style="font-size:10px;color:var(--muted)">SAR</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px;font-weight:700;text-transform:uppercase">Spent</div>
        <div style="font-size:18px;font-weight:800;color:var(--red);font-family:'JetBrains Mono'">${expenses}</div>
        <div style="font-size:10px;color:var(--muted)">SAR</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px;font-weight:700;text-transform:uppercase">Balance</div>
        <div style="font-size:18px;font-weight:800;color:${balance>=0?'var(--vg)':'var(--red)'};font-family:'JetBrains Mono'">${balance}</div>
        <div style="font-size:10px;color:var(--muted)">SAR</div>
      </div>
    </div>

    <!-- Budget bar -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-weight:700">Monthly Budget</div>
        <div style="font-size:13px;color:${budgetPct>90?'var(--red)':budgetPct>70?'var(--gold)':'var(--vg)'};font-family:'JetBrains Mono'">${expenses} / ${budget} SAR</div>
      </div>
      <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden">
        <div style="height:100%;background:${budgetPct>90?'var(--red)':budgetPct>70?'var(--gold)':'var(--v)'};width:${budgetPct}%;border-radius:5px;transition:width .4s"></div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:6px">${budgetPct}% of budget used</div>
    </div>

    <!-- Savings goals -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div class="section-title" style="margin:0">Savings Goals</div>
      <button class="btn-ghost btn-sm" onclick="openAddSavings()">+ Goal</button>
    </div>
    ${savings.map(g => {
      const pct = Math.min(100, Math.round(g.current/g.target*100));
      return `<div class="card2" style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:700;font-size:14px">${g.goal}</div>
          <div style="font-size:12px;color:var(--vg);font-family:'JetBrains Mono'">${g.current} / ${g.target} SAR</div>
        </div>
        <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
          <div style="height:100%;background:var(--v);width:${pct}%;border-radius:4px;transition:width .4s"></div>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px">${pct}% · ${g.target-g.current} SAR to go</div>
      </div>`;
    }).join('')}

    <!-- Transactions -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0 12px">
      <div class="section-title" style="margin:0">Transactions</div>
    </div>
    <div class="filter-row">
      <button class="filter-pill${financeTab==='all'?' active':''}" onclick="financeTab='all';render_finance()">All</button>
      <button class="filter-pill${financeTab==='income'?' active':''}" onclick="financeTab='income';render_finance()">Income</button>
      <button class="filter-pill${financeTab==='expenses'?' active':''}" onclick="financeTab='expenses';render_finance()">Expenses</button>
    </div>
    ${buildTransactionList()}`;
}

function buildTransactionList() {
  const all = [
    ...(finance.income||[]).map(i=>({...i,_type:'income'})),
    ...(finance.expenses||[]).map(e=>({...e,_type:'expense'})),
  ].filter(t=>financeTab==='all'||(financeTab==='income'&&t._type==='income')||(financeTab==='expenses'&&t._type==='expense'))
   .sort((a,b)=>b.id-a.id);

  if (!all.length) return '<div class="empty"><div class="empty-icon">💰</div><p>No transactions yet.</p></div>';

  return all.map(t=>`
    <div class="card-row" onclick="openEditTransaction(${t.id},'${t._type}')">
      <div style="width:38px;height:38px;border-radius:10px;background:${t._type==='income'?'#22c55e22':'#f8717122'};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${t._type==='income'?'💚':'🔴'}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px">${t.source||t.name}</div>
        <div style="font-size:12px;color:var(--muted)">${t.date} · ${t.category}</div>
      </div>
      <div style="font-weight:700;font-family:'JetBrains Mono';color:${t._type==='income'?'var(--vg)':'var(--red)'}">${t._type==='income'?'+':'−'}${t.amount} SAR</div>
    </div>`).join('');
}

let editingTransactionId = null, editingTransactionType = null;

function openAddTransaction() {
  editingTransactionId = null;
  document.getElementById('txn-modal-title').textContent = 'Add Transaction';
  document.getElementById('txn-input-type').value = 'expense';
  document.getElementById('txn-input-name').value = '';
  document.getElementById('txn-input-amount').value = '';
  document.getElementById('txn-input-date').value = `${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`;
  document.getElementById('txn-input-category').value = '';
  document.getElementById('txn-delete-btn').style.display = 'none';
  openModal('txn-modal');
}

function openEditTransaction(id, type) {
  const arr = type==='income' ? finance.income : finance.expenses;
  const t   = (arr||[]).find(x=>x.id===id);
  if (!t) return;
  editingTransactionId = id; editingTransactionType = type;
  document.getElementById('txn-modal-title').textContent = 'Edit Transaction';
  document.getElementById('txn-input-type').value     = type==='income'?'income':'expense';
  document.getElementById('txn-input-name').value     = t.source||t.name||'';
  document.getElementById('txn-input-amount').value   = t.amount;
  document.getElementById('txn-input-date').value     = t.date;
  document.getElementById('txn-input-category').value = t.category||'';
  document.getElementById('txn-delete-btn').style.display = 'block';
  openModal('txn-modal');
}

function saveTransaction() {
  const type     = document.getElementById('txn-input-type').value;
  const name     = document.getElementById('txn-input-name').value.trim();
  const amount   = parseFloat(document.getElementById('txn-input-amount').value)||0;
  const date     = document.getElementById('txn-input-date').value.trim();
  const category = document.getElementById('txn-input-category').value.trim()||'Other';
  if (!name||!amount) { alert('Fill in name and amount'); return; }
  if (!finance.income)   finance.income   = [];
  if (!finance.expenses) finance.expenses = [];
  if (editingTransactionId) {
    const arr = editingTransactionType==='income' ? finance.income : finance.expenses;
    const idx = arr.findIndex(x=>x.id===editingTransactionId);
    if (idx>-1) { arr[idx] = {...arr[idx], source:name, name, amount, date, category}; }
    toast('Updated');
  } else {
    const arr = type==='income' ? finance.income : finance.expenses;
    arr.push({id:nextId(arr), source:name, name, amount, date, category});
    toast('Added!');
  }
  save(); closeModal('txn-modal'); render_finance();
}

function deleteTransaction() {
  confirm('Delete this transaction?', () => {
    if (editingTransactionType==='income') {
      finance.income = (finance.income||[]).filter(x=>x.id!==editingTransactionId);
    } else {
      finance.expenses = (finance.expenses||[]).filter(x=>x.id!==editingTransactionId);
    }
    save(); closeModal('txn-modal'); render_finance(); toast('Deleted');
  });
}

function openAddSavings() {
  document.getElementById('savings-input-goal').value    = '';
  document.getElementById('savings-input-target').value  = '';
  document.getElementById('savings-input-current').value = '0';
  openModal('savings-modal');
}

function saveSavingsGoal() {
  const goal    = document.getElementById('savings-input-goal').value.trim();
  const target  = parseFloat(document.getElementById('savings-input-target').value)||0;
  const current = parseFloat(document.getElementById('savings-input-current').value)||0;
  if (!goal||!target) { alert('Fill in goal and target'); return; }
  if (!finance.savings) finance.savings = [];
  finance.savings.push({id:nextId(finance.savings), goal, target, current});
  save(); closeModal('savings-modal'); render_finance(); toast('Savings goal added!');
}
