// ============================================
// ZYZIRE v0.0.5 — js/hobbies.js
// Hobbies module — movies, shows, comics, games, anime, books
// ============================================

let hobbiesView = 'grid'; // 'grid' | 'list'
let hobbiesType = 'All';
let hobbiesStatus = 'All';
let editingHobbyId = null;
let viewingHobby = null;

const HOBBY_TYPES    = ['Movie','Show','Comic','Book','Game','Anime','Music'];
const HOBBY_STATUSES = ['Watchlist','Watching','Watched','Owned','Want','Reading','Read','Playing','Played','Listening'];
const HOBBY_ICONS    = {Movie:'🎬',Show:'📺',Comic:'📚',Book:'📖',Game:'🎮',Anime:'⛩️',Music:'🎵'};
const HOBBY_COVERS   = {
  Movie:'linear-gradient(135deg,#1a1a2e,#16213e)',
  Show:'linear-gradient(135deg,#0f3460,#533483)',
  Comic:'linear-gradient(135deg,#1a0a00,#4a1c00)',
  Book:'linear-gradient(135deg,#0a1628,#1a3a5c)',
  Game:'linear-gradient(135deg,#0d0d0d,#1a0a2e)',
  Anime:'linear-gradient(135deg,#1a0a1a,#2e0a3a)',
  Music:'linear-gradient(135deg,#0a1a0a,#0a2e1a)',
};

function render_hobbies() {
  const c = document.getElementById('hobbies-content');
  if (viewingHobby) { renderHobbyDetail(c); return; }

  const types    = ['All',...HOBBY_TYPES];
  const statuses = ['All','Watched','Watching','Watchlist','Owned','Want','Read','Reading','Played','Playing'];

  const filtered = media.filter(m =>
    (hobbiesType   === 'All' || m.type   === hobbiesType) &&
    (hobbiesStatus === 'All' || m.status === hobbiesStatus)
  );

  // Stats
  const watched  = media.filter(m=>['Watched','Read','Played'].includes(m.status)).length;
  const watching = media.filter(m=>['Watching','Reading','Playing'].includes(m.status)).length;
  const want     = media.filter(m=>['Watchlist','Want'].includes(m.status)).length;

  c.innerHTML = `
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div><h2>Hobbies</h2><div class="page-subtitle">${media.length} items tracked</div></div>
      <button class="btn btn-sm" onclick="openAddHobby()">+ Add</button>
    </div>

    <!-- Stats row -->
    <div style="display:flex;gap:10px;margin-bottom:18px;overflow-x:auto;padding-bottom:4px">
      ${[
        {label:'Completed',val:watched,color:'var(--v)'},
        {label:'In Progress',val:watching,color:'var(--blue)'},
        {label:'Wishlist',val:want,color:'var(--muted)'},
        {label:'Total',val:media.length,color:'var(--text)'},
      ].map(s=>`<div style="flex-shrink:0;background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:10px 16px;text-align:center">
        <div style="font-size:20px;font-weight:800;color:${s.color};font-family:'JetBrains Mono'">${s.val}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">${s.label}</div>
      </div>`).join('')}
    </div>

    <!-- Type filters -->
    <div class="filter-row" style="margin-bottom:10px">
      ${types.map(t=>`<button class="filter-pill${hobbiesType===t?' active':''}" onclick="setHobbiesType('${t}')">${HOBBY_ICONS[t]||''} ${t}</button>`).join('')}
    </div>

    <!-- Status filters -->
    <div class="filter-row" style="margin-bottom:16px">
      ${statuses.map(s=>`<button class="filter-pill${hobbiesStatus===s?' active':''}" onclick="setHobbiesStatus('${s}')">${s}</button>`).join('')}
    </div>

    <!-- View toggle -->
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:14px">
      <button class="btn-ghost btn-sm ${hobbiesView==='grid'?'active':''}" onclick="setHobbiesView('grid')" style="${hobbiesView==='grid'?'border-color:var(--v);color:var(--vg)':''}">⊞ Grid</button>
      <button class="btn-ghost btn-sm ${hobbiesView==='list'?'active':''}" onclick="setHobbiesView('list')" style="${hobbiesView==='list'?'border-color:var(--v);color:var(--vg)':''}">☰ List</button>
    </div>

    <!-- Content -->
    ${filtered.length === 0
      ? `<div class="empty"><div class="empty-icon">${HOBBY_ICONS[hobbiesType]||'🎬'}</div><p>Nothing here yet.<br>Add something!</p></div>`
      : hobbiesView === 'grid'
        ? renderHobbiesGrid(filtered)
        : renderHobbiesList(filtered)
    }`;
}

function renderHobbiesGrid(items) {
  return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
    ${items.map(m => {
      const sc = statusDotColor(m.status);
      return `<div onclick="openHobbyDetail(${m.id})" style="cursor:pointer;border-radius:12px;overflow:hidden;background:var(--card2);border:1px solid var(--border);transition:transform .2s,border-color .2s" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='var(--v)'" onmouseout="this.style.transform='none';this.style.borderColor='var(--border)'">
        <!-- Cover -->
        <div style="aspect-ratio:2/3;background:${HOBBY_COVERS[m.type]||HOBBY_COVERS.Movie};display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;padding:8px">
          <div style="font-size:28px;margin-bottom:6px">${HOBBY_ICONS[m.type]||'🎬'}</div>
          <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.5);text-align:center;line-height:1.3;word-break:break-word;max-width:100%">${m.title}</div>
          <div style="position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:${sc}"></div>
          ${m.rating>0?`<div style="position:absolute;bottom:6px;left:6px;font-size:10px;color:#fbbf24">${'★'.repeat(m.rating)}</div>`:''}
        </div>
        <!-- Info -->
        <div style="padding:8px">
          <div style="font-size:11px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.title}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">${m.status}</div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderHobbiesList(items) {
  return items.map(m => `
    <div class="media-row" onclick="openHobbyDetail(${m.id})" style="cursor:pointer">
      <div style="width:46px;height:60px;border-radius:8px;background:${HOBBY_COVERS[m.type]||HOBBY_COVERS.Movie};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${HOBBY_ICONS[m.type]||'🎬'}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.title}</div>
        <div style="display:flex;gap:6px;margin-top:4px;align-items:center;flex-wrap:wrap">
          <span class="tag" style="font-size:10px">${m.type}</span>
          ${m.genre?`<span style="font-size:11px;color:var(--muted)">${m.genre}</span>`:''}
          <span style="font-size:11px;color:${statusDotColor(m.status)};font-weight:600">${m.status}</span>
        </div>
        ${m.rating>0?`<div style="margin-top:4px;font-size:12px;color:#fbbf24">${'★'.repeat(m.rating)}${'☆'.repeat(5-m.rating)}</div>`:''}
      </div>
      <button class="btn-ghost btn-sm btn-icon" onclick="event.stopPropagation();openEditHobby(${m.id})">✏️</button>
    </div>`).join('');
}

function statusDotColor(s) {
  if (['Watched','Read','Played'].includes(s)) return 'var(--v)';
  if (['Watching','Reading','Playing'].includes(s)) return 'var(--blue)';
  if (['Watchlist','Want'].includes(s)) return 'var(--muted)';
  return 'var(--muted)';
}

function renderHobbyDetail(c) {
  const m = viewingHobby;
  const related = posts.filter(p => p.mediaRef && p.mediaRef.id === m.id);
  c.innerHTML = `
    <!-- Cover hero -->
    <div style="background:${HOBBY_COVERS[m.type]||HOBBY_COVERS.Movie};border-radius:16px;padding:24px;margin-bottom:20px;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.7));border-radius:16px"></div>
      <button onclick="backHobbies()" style="background:rgba(255,255,255,.15);border:none;border-radius:8px;color:#fff;padding:6px 12px;cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;font-size:12px;margin-bottom:60px;position:relative;z-index:1">← Back</button>
      <div style="position:relative;z-index:1">
        <div style="font-size:40px;margin-bottom:8px">${HOBBY_ICONS[m.type]||'🎬'}</div>
        <div style="font-weight:800;font-size:22px;color:#fff">${m.title}</div>
        <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">${m.type}${m.genre?' · '+m.genre:''}</div>
      </div>
    </div>

    <!-- Details -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="section-title">Status</div>
          <span class="tag" style="color:${statusDotColor(m.status)};background:${statusDotColor(m.status)}22;font-size:13px">${m.status}</span>
        </div>
        <div style="text-align:center">
          <div class="section-title">Rating</div>
          <div style="font-size:18px;color:#fbbf24">${m.rating>0?'★'.repeat(m.rating)+'☆'.repeat(5-m.rating):'Not rated'}</div>
        </div>
        <button class="btn btn-sm" onclick="openEditHobby(${m.id})">✏️ Edit</button>
      </div>
      ${m.note?`<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);font-size:13px;color:var(--muted);line-height:1.6">"${m.note}"</div>`:''}
    </div>

    <!-- Related posts -->
    <div class="section-title">Your Posts About This</div>
    ${related.length===0
      ? `<div style="color:var(--muted);font-size:13px;margin-bottom:16px">No posts yet. <span style="color:var(--v);cursor:pointer" onclick="openNewPostWithMedia(${m.id})">Write something →</span></div>`
      : related.map(p=>`<div class="card2" style="margin-bottom:10px">
          <div style="font-size:12px;color:var(--muted);margin-bottom:6px">${p.date}</div>
          <div style="font-size:14px;line-height:1.6">${p.text}</div>
        </div>`).join('')}`;
}

function openHobbyDetail(id) { viewingHobby = media.find(m=>m.id===id); render_hobbies(); }
function backHobbies() { viewingHobby = null; render_hobbies(); }
function setHobbiesType(t)   { hobbiesType=t;   render_hobbies(); }
function setHobbiesStatus(s) { hobbiesStatus=s; render_hobbies(); }
function setHobbiesView(v)   { hobbiesView=v;   render_hobbies(); }

function openAddHobby() {
  editingHobbyId = null;
  document.getElementById('hobby-modal-title').textContent = 'Add to Hobbies';
  document.getElementById('hobby-input-title').value  = '';
  document.getElementById('hobby-input-type').value   = 'Movie';
  document.getElementById('hobby-input-genre').value  = '';
  document.getElementById('hobby-input-status').value = 'Watchlist';
  document.getElementById('hobby-input-rating').value = '0';
  document.getElementById('hobby-input-note').value   = '';
  document.getElementById('hobby-delete-btn').style.display = 'none';
  openModal('hobby-modal');
}

function openEditHobby(id) {
  const m = media.find(x=>x.id===id);
  if (!m) return;
  editingHobbyId = id;
  document.getElementById('hobby-modal-title').textContent = 'Edit';
  document.getElementById('hobby-input-title').value  = m.title;
  document.getElementById('hobby-input-type').value   = m.type;
  document.getElementById('hobby-input-genre').value  = m.genre||'';
  document.getElementById('hobby-input-status').value = m.status;
  document.getElementById('hobby-input-rating').value = m.rating||0;
  document.getElementById('hobby-input-note').value   = m.note||'';
  document.getElementById('hobby-delete-btn').style.display = 'block';
  openModal('hobby-modal');
}

function saveHobby() {
  const title  = document.getElementById('hobby-input-title').value.trim();
  const type   = document.getElementById('hobby-input-type').value;
  const genre  = document.getElementById('hobby-input-genre').value.trim();
  const status = document.getElementById('hobby-input-status').value;
  const rating = parseInt(document.getElementById('hobby-input-rating').value)||0;
  const note   = document.getElementById('hobby-input-note').value.trim();
  if (!title) { alert('Please enter a title'); return; }
  if (editingHobbyId) {
    media = media.map(m => m.id===editingHobbyId ? {...m,title,type,genre,status,rating,note} : m);
    if (viewingHobby && viewingHobby.id===editingHobbyId) viewingHobby = media.find(m=>m.id===editingHobbyId);
    toast('Updated!');
  } else {
    media.push({id:nextId(media),title,type,genre,status,rating,note});
    toast('Added to Hobbies!');
  }
  save(); closeModal('hobby-modal'); render_hobbies();
}

function deleteHobby() {
  confirm('Remove from Hobbies?', () => {
    media = media.filter(m=>m.id!==editingHobbyId);
    if (viewingHobby && viewingHobby.id===editingHobbyId) viewingHobby=null;
    save(); closeModal('hobby-modal'); render_hobbies(); toast('Removed');
  });
}

function openNewPostWithMedia(mid) {
  const m = media.find(x=>x.id===mid);
  if (!m) return;
  goTab('hub');
  setTimeout(()=>openNewPost(m),100);
}
