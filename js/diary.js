// ============================================
// ZYZIRE 0.0.3 — js/diary.js
// ============================================

let diaryMood = '';
let diaryRating = 7;

function render_diary() {
  const c = document.getElementById('diary-content');
  const todayStr = `${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`;
  const todayEntry = diary.find(d => d.date === todayStr);

  if (activeDiaryEdit === 'new' || (activeDiaryEdit && activeDiaryEdit !== 'new')) {
    const entry = activeDiaryEdit === 'new' ? null : diary.find(d=>d.id===activeDiaryEdit);
    c.innerHTML = diaryEditorHTML(entry, activeDiaryEdit === 'new');
    return;
  }

  const banner = !todayEntry ? `
    <div class="banner" style="margin-bottom:20px">
      <span style="font-size:22px">✍️</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:14px">No entry for today</div>
        <div style="font-size:12px;color:var(--muted)">How was ${DAYS[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()}?</div>
      </div>
      <button class="btn btn-sm" onclick="startNewDiary()">Write</button>
    </div>` : `
    <div class="diary-card" onclick="editDiary(${todayEntry.id})" style="border-color:var(--v);margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:22px">${todayEntry.mood}</span>
          <div>
            <div style="font-weight:700;font-size:14px">Today · ${todayEntry.date}</div>
            <span class="tag" style="font-size:9px">tap to edit</span>
          </div>
        </div>
        <div style="width:34px;height:34px;border-radius:8px;background:${rateColor(todayEntry.rating)}22;border:2px solid ${rateColor(todayEntry.rating)}55;display:flex;align-items:center;justify-content:center;font-weight:800;color:${rateColor(todayEntry.rating)};font-family:'JetBrains Mono';font-size:14px">${todayEntry.rating}</div>
      </div>
      <div style="font-size:13px;color:var(--muted);line-height:1.6">${todayEntry.summary||'No note.'}</div>
    </div>`;

  const past = diary.filter(d => d.date !== todayStr);

  c.innerHTML = banner + `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div class="section-title" style="margin:0">Past Entries (${past.length})</div>
      ${!todayEntry?'':'<button class="btn btn-sm" onclick="startNewDiary()">+ New</button>'}
    </div>
    ${past.length === 0 ? '<div class="empty"><div class="empty-icon">📔</div><p>No past entries yet.</p></div>' :
      past.map(e => `
        <div class="diary-card" onclick="editDiary(${e.id})">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px">${e.mood}</span>
              <div>
                <div style="font-weight:700;font-size:14px">${e.date}</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px">
                  ${e.tags.map(t=>`<span class="tag" style="font-size:10px">${t}</span>`).join('')}
                </div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:10px;color:var(--muted)">edit</span>
              <div style="width:34px;height:34px;border-radius:8px;background:${rateColor(e.rating)}22;border:2px solid ${rateColor(e.rating)}55;display:flex;align-items:center;justify-content:center;font-weight:800;color:${rateColor(e.rating)};font-family:'JetBrains Mono';font-size:14px">${e.rating}</div>
            </div>
          </div>
          <div style="font-size:13px;color:var(--muted);line-height:1.6">${e.summary||''}</div>
        </div>`).join('')}`;
}

function diaryEditorHTML(e, isNew) {
  const moods = ['😊','😐','😴','😤','🔥','😔','🤒','😎'];
  diaryMood   = e ? e.mood   : '';
  diaryRating = e ? e.rating : 7;
  const title = isNew ? `${DAYS[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()}` : `Editing — ${e.date}`;

  return `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <button class="btn-ghost btn-sm" onclick="cancelDiary()">← Back</button>
      <div style="font-weight:700;font-size:16px;color:var(--vg)">${title}</div>
      ${!isNew?`<button class="btn-ghost btn-sm btn-danger" style="margin-left:auto" onclick="deleteDiary(${e?e.id:0})">🗑</button>`:''}
    </div>

    <div class="section-title">Mood</div>
    <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap" id="diary-mood-row">
      ${moods.map(m=>`<button class="mood-btn${m===diaryMood?' sel':''}" onclick="selectMood('${m}')">${m}</button>`).join('')}
    </div>

    <div class="section-title">Rate your day</div>
    <div style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap" id="diary-rate-row">
      ${Array.from({length:10},(_,i)=>i+1).map(n=>`
        <div class="rate-btn" onclick="selectRate(${n})" style="
          background:${diaryRating===n?rateColor(n):'transparent'};
          color:${diaryRating===n?'#fff':'var(--muted)'};
          border-color:${diaryRating===n?rateColor(n):'var(--border)'}">${n}</div>`).join('')}
    </div>

    <div class="section-title">What happened?</div>
    <textarea class="input" id="diary-text" placeholder="Write freely about your day..." style="margin-bottom:16px">${e?e.summary:''}</textarea>

    <div class="section-title">Tags (comma separated)</div>
    <input class="input" id="diary-tags" placeholder="e.g. gym, uni, productive" value="${e&&e.tags?e.tags.join(', '):''}" style="margin-bottom:20px">

    <div style="display:flex;gap:10px">
      <button class="btn" style="flex:1" onclick="saveDiary(${e?e.id:'null'},${isNew})">Save Entry</button>
      <button class="btn-ghost" onclick="cancelDiary()">Cancel</button>
    </div>`;
}

function selectMood(m) {
  diaryMood = m;
  document.querySelectorAll('#diary-mood-row .mood-btn').forEach(b => b.classList.toggle('sel', b.textContent===m));
}

function selectRate(n) {
  diaryRating = n;
  document.querySelectorAll('#diary-rate-row .rate-btn').forEach(b => {
    const isN = parseInt(b.textContent)===n;
    const c   = rateColor(n);
    b.style.background  = isN ? c : 'transparent';
    b.style.color       = isN ? '#fff' : 'var(--muted)';
    b.style.borderColor = isN ? c : 'var(--border)';
  });
}

function startNewDiary() { activeDiaryEdit = 'new'; render_diary(); }
function editDiary(id)    { activeDiaryEdit = id;    render_diary(); }
function cancelDiary()    { activeDiaryEdit = null;  render_diary(); }

function saveDiary(id, isNew) {
  const summary = document.getElementById('diary-text').value.trim();
  const tagsRaw = document.getElementById('diary-tags').value.trim();
  const tags    = tagsRaw ? tagsRaw.split(',').map(t=>t.trim()).filter(Boolean) : [];
  const mood    = diaryMood || '😐';
  const rating  = diaryRating;

  if (isNew) {
    diary.unshift({
      id: nextId(diary),
      date: `${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`,
      mood, rating, summary, tags
    });
    toast('Entry saved!');
  } else {
    diary = diary.map(e => e.id===id ? {...e,mood,rating,summary,tags} : e);
    toast('Entry updated!');
  }
  activeDiaryEdit = null;
  save(); render_diary();
}

function deleteDiary(id) {
  confirm('Delete this diary entry?', () => {
    diary = diary.filter(e => e.id !== id);
    activeDiaryEdit = null;
    save(); render_diary(); toast('Entry deleted');
  });
}
