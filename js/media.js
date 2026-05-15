// ============================================
// ZYZIRE v0.0.5 — js/media.js
// Letterboxd-style media tracker
// ============================================

let editingMediaId  = null;
let mediaView       = 'grid';
let mediaActiveTab  = 'collection';

const MEDIA_TYPES   = ['Movie','Show','Comic','Book','Game','Anime'];
const MEDIA_ICONS   = {Movie:'🎬',Show:'📺',Comic:'📚',Book:'📖',Game:'🎮',Anime:'⛩️'};
const STATUS_DONE   = ['Watched','Read','Played','Owned'];
const STATUS_DOING  = ['Watching','Reading','Playing'];
const STATUS_WANT   = ['Watchlist','Want'];
const TYPE_COLORS   = {Movie:'#e85d4a',Show:'#4a90e2',Comic:'#f5a623',Book:'#7b68ee',Game:'#50c878',Anime:'#ff6eb4'};

function render_media() {
  const c = document.getElementById('media-screen-content');

  const tabs = [
    {id:'collection',label:'Collection',count:media.filter(m=>STATUS_DONE.includes(m.status)||STATUS_DOING.includes(m.status)).length},
    {id:'watchlist', label:'Watchlist', count:media.filter(m=>STATUS_WANT.includes(m.status)).length},
    {id:'log',       label:'All',       count:media.length},
  ];

  const tabHTML = `<div style="display:flex;gap:4px;margin-bottom:20px;background:var(--card2);border-radius:12px;padding:4px">
    ${tabs.map(t=>`<button onclick="setMediaTab('${t.id}')" style="flex:1;padding:8px;border-radius:8px;border:none;font-family:'Syne',sans-serif;font-weight:700;font-size:12px;cursor:pointer;transition:all .2s;background:${mediaActiveTab===t.id?'var(--v)':'transparent'};color:${mediaActiveTab===t.id?'#000':'var(--muted)'}">${t.label} <span style="opacity:.7">${t.count}</span></button>`).join('')}
  </div>`;

  let filtered = media.filter(m=>{
    const typeOk = mediaTypeFilter==='All'||m.type===mediaTypeFilter;
    const statusOk = mediaStatusFilter==='All'||m.status===mediaStatusFilter;
    let tabOk = true;
    if (mediaActiveTab==='collection') tabOk=STATUS_DONE.includes(m.status)||STATUS_DOING.includes(m.status);
    else if (mediaActiveTab==='watchlist') tabOk=STATUS_WANT.includes(m.status);
    return typeOk&&statusOk&&tabOk;
  });

  const typeFilter = `<div class="filter-row">
    ${['All',...MEDIA_TYPES].map(t=>`<button class="filter-pill${mediaTypeFilter===t?' active':''}" onclick="setMediaType('${t}')">${t}</button>`).join('')}
  </div>`;

  let statusOpts = mediaActiveTab==='collection'?['All',...STATUS_DONE,...STATUS_DOING]:mediaActiveTab==='watchlist'?['All',...STATUS_WANT]:['All','Watched','Watching','Watchlist','Owned','Want','Read','Reading','Played','Playing'];
  const statusFilter = `<div class="filter-row" style="margin-bottom:16px">
    ${statusOpts.map(s=>`<button class="filter-pill${mediaStatusFilter===s?' active':''}" onclick="setMediaStatus('${s}')">${s}</button>`).join('')}
  </div>`;

  const empty = `<div class="empty"><div class="empty-icon">${MEDIA_ICONS[mediaTypeFilter]||'🎬'}</div><p>Nothing here yet.<br>Start tracking!</p></div>`;

  const gridHTML = filtered.length===0 ? empty : `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
    ${filtered.map(m=>{
      const col=TYPE_COLORS[m.type]||'var(--v)';
      const doing=STATUS_DOING.includes(m.status);
      return `<div onclick="openMediaDetail(${m.id})" style="cursor:pointer;position:relative;border-radius:12px;overflow:hidden;aspect-ratio:2/3;background:${col}18;border:1px solid ${col}33;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .2s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 16px ${col}33'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
        <div style="font-size:30px;margin-bottom:6px">${MEDIA_ICONS[m.type]||'🎬'}</div>
        <div style="font-size:10px;font-weight:700;text-align:center;padding:0 6px;line-height:1.3;color:var(--text)">${m.title}</div>
        ${m.rating>0?`<div style="font-size:9px;color:${col};margin-top:3px">${'★'.repeat(m.rating)}</div>`:''}
        <div style="position:absolute;top:6px;right:6px;background:${STATUS_DONE.includes(m.status)?col:doing?'#60a5fa':'var(--border)'};border-radius:50%;width:8px;height:8px"></div>
        ${doing?`<div style="position:absolute;top:6px;left:6px;background:#60a5fa22;border:1px solid #60a5fa55;border-radius:5px;padding:2px 5px;font-size:8px;color:#60a5fa;font-weight:700">NOW</div>`:''}
      </div>`;
    }).join('')}
  </div>`;

  const listHTML = filtered.length===0 ? empty : filtered.map(m=>{
    const col=TYPE_COLORS[m.type]||'var(--v)';
    const doing=STATUS_DOING.includes(m.status);
    return `<div class="media-row" onclick="openMediaDetail(${m.id})" style="cursor:pointer">
      <div style="width:44px;height:62px;border-radius:8px;background:${col}18;border:1px solid ${col}33;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${MEDIA_ICONS[m.type]||'🎬'}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.title}</div>
        <div style="display:flex;gap:5px;margin-top:4px;flex-wrap:wrap;align-items:center">
          <span class="tag" style="background:${col}22;color:${col};font-size:10px">${m.type}</span>
          ${m.genre?`<span class="tag" style="font-size:10px">${m.genre}</span>`:''}
          <span style="font-size:11px;color:${STATUS_DONE.includes(m.status)?col:doing?'#60a5fa':'var(--muted)'};font-weight:600">${m.status}</span>
        </div>
        ${m.rating>0?`<div style="color:${col};font-size:12px;margin-top:3px">${'★'.repeat(m.rating)}${'☆'.repeat(5-m.rating)}</div>`:''}
        ${m.note?`<div style="font-size:11px;color:var(--muted);margin-top:3px;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">"${m.note}"</div>`:''}
        ${m.date?`<div style="font-size:10px;color:var(--muted);margin-top:2px">${m.date}</div>`:''}
      </div>
      <button class="btn-ghost btn-sm btn-icon" onclick="event.stopPropagation();openEditMedia(${m.id})">✏️</button>
    </div>`;
  }).join('');

  c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div><h2>Media</h2><div class="page-subtitle">${media.length} items · ${media.filter(m=>STATUS_DONE.includes(m.status)).length} completed</div></div>
      <div style="display:flex;gap:8px">
        <button class="btn-ghost btn-sm btn-icon" onclick="toggleMediaView()" title="Toggle view">${mediaView==='grid'?'☰':'⊞'}</button>
        <button class="btn btn-sm" onclick="openAddMedia()">+ Log</button>
      </div>
    </div>
    ${tabHTML}${typeFilter}${statusFilter}
    ${mediaView==='grid'?gridHTML:listHTML}`;
}

function openMediaDetail(id) {
  const m = media.find(x=>x.id===id);
  if (!m) return;
  const col=TYPE_COLORS[m.type]||'var(--v)';
  document.getElementById('media-detail-content').innerHTML = `
    <div style="text-align:center;padding:10px 0 16px">
      <div style="width:80px;height:112px;border-radius:12px;background:${col}22;border:2px solid ${col}44;display:flex;align-items:center;justify-content:center;font-size:44px;margin:0 auto 14px">${MEDIA_ICONS[m.type]||'🎬'}</div>
      <div style="font-weight:800;font-size:20px;margin-bottom:6px">${m.title}</div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:10px">
        <span class="tag" style="background:${col}22;color:${col}">${m.type}</span>
        ${m.genre?`<span class="tag">${m.genre}</span>`:''}
        <span style="font-size:12px;color:${STATUS_DONE.includes(m.status)?col:STATUS_DOING.includes(m.status)?'#60a5fa':'var(--muted)'};font-weight:700">${m.status}</span>
      </div>
      ${m.rating>0?`<div style="font-size:22px;color:${col};margin-bottom:10px">${'★'.repeat(m.rating)}${'☆'.repeat(5-m.rating)}</div>`:'<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Not rated</div>'}
      ${m.date?`<div style="font-size:12px;color:var(--muted);margin-bottom:10px">📅 ${m.date}</div>`:''}
      ${m.note?`<div style="background:var(--card2);border-radius:10px;padding:12px 14px;font-size:13px;color:var(--muted);line-height:1.6;font-style:italic;text-align:left">"${m.note}"</div>`:''}
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn" style="flex:1" onclick="closeModal('media-detail-modal');openEditMedia(${m.id})">✏️ Edit</button>
      <button class="btn-ghost" onclick="closeModal('media-detail-modal')">Close</button>
    </div>`;
  openModal('media-detail-modal');
}

function setMediaTab(t)    { mediaActiveTab=t; mediaStatusFilter='All'; render_media(); }
function setMediaType(t)   { mediaTypeFilter=t; render_media(); }
function setMediaStatus(s) { mediaStatusFilter=s; render_media(); }
function toggleMediaView()  { mediaView=mediaView==='grid'?'list':'grid'; render_media(); }

function openAddMedia() {
  editingMediaId=null;
  document.getElementById('media-modal-title').textContent='Log Media';
  document.getElementById('media-input-title').value='';
  document.getElementById('media-input-type').value='Movie';
  document.getElementById('media-input-genre').value='';
  document.getElementById('media-input-status').value='Watched';
  document.getElementById('media-input-rating').value='0';
  document.getElementById('media-input-note').value='';
  document.getElementById('media-input-date').value=`${today.getDate()} ${MONTHS[today.getMonth()].slice(0,3)} ${today.getFullYear()}`;
  document.getElementById('media-delete-btn').style.display='none';
  openModal('media-modal');
}

function openEditMedia(id) {
  const m=media.find(x=>x.id===id);
  if (!m) return;
  editingMediaId=id;
  document.getElementById('media-modal-title').textContent='Edit Entry';
  document.getElementById('media-input-title').value=m.title;
  document.getElementById('media-input-type').value=m.type;
  document.getElementById('media-input-genre').value=m.genre||'';
  document.getElementById('media-input-status').value=m.status;
  document.getElementById('media-input-rating').value=m.rating||0;
  document.getElementById('media-input-note').value=m.note||'';
  document.getElementById('media-input-date').value=m.date||'';
  document.getElementById('media-delete-btn').style.display='block';
  openModal('media-modal');
}

function saveMedia() {
  const title=document.getElementById('media-input-title').value.trim();
  const type=document.getElementById('media-input-type').value;
  const genre=document.getElementById('media-input-genre').value.trim();
  const status=document.getElementById('media-input-status').value;
  const rating=parseInt(document.getElementById('media-input-rating').value)||0;
  const note=document.getElementById('media-input-note').value.trim();
  const date=document.getElementById('media-input-date').value.trim();
  if (!title) { alert('Please enter a title'); return; }
  if (editingMediaId) {
    media=media.map(m=>m.id===editingMediaId?{...m,title,type,genre,status,rating,note,date}:m);
    toast('Updated!');
  } else {
    media.unshift({id:nextId(media),title,type,genre,status,rating,note,date});
    toast('Logged!');
    // Auto-create post when logging completed media
    if (STATUS_DONE.includes(status)) {
      addAutoPost({text:`${type==='Movie'?'🎬':type==='Show'?'📺':type==='Comic'?'📚':type==='Book'?'📖':type==='Game'?'🎮':'⛩️'} ${status} **${title}**${rating>0?' — '+'★'.repeat(rating):''}${note?'\n"'+note+'"':''}`,mediaRef:{title,type,rating,genre},type:'media'});
    }
  }
  save(); closeModal('media-modal'); render_media();
}

function deleteMedia() {
  if (!window.confirm('Delete this item?')) return;
  media=media.filter(m=>m.id!==editingMediaId);
  save(); closeModal('media-modal'); render_media(); toast('Deleted');
}
