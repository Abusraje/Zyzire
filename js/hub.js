// ============================================
// ZYZIRE v0.0.5 — js/hub.js
// Zyzire Hub — personal timeline + profile
// ============================================

let hubView = 'feed'; // 'feed' | 'profile'
let newPostMediaRef = null;
let editingPostId = null;

const VIBES = ['💭','🔥','😊','😤','😴','🎯','💡','❤️','🎮','🎬','🎵','📚','💪','✨'];

function render_hub() {
  const c = document.getElementById('hub-content');
  if (hubView === 'profile') { renderProfile(c); return; }
  renderFeed(c);
}

function renderFeed(c) {
  // Build activity from all modules
  const activity = buildActivity();
  const allFeed = [...posts, ...activity].sort((a,b) => (b.ts||0) - (a.ts||0));

  c.innerHTML = `
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div>
        <h2>Zyzire Hub</h2>
        <div class="page-subtitle">Your personal timeline</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <div onclick="hubView='profile';render_hub()" style="cursor:pointer">
          <div style="width:36px;height:36px;border-radius:10px;overflow:hidden;border:2px solid var(--border);transition:border-color .2s" onmouseover="this.style.borderColor='var(--v)'" onmouseout="this.style.borderColor='var(--border)'">
            <img src="data:image/jpeg;base64,${getLogoB64()}" style="width:100%;height:100%;object-fit:cover">
          </div>
        </div>
      </div>
    </div>

    <!-- Compose box -->
    <div class="card" style="margin-bottom:20px;padding:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="width:36px;height:36px;border-radius:10px;overflow:hidden;flex-shrink:0;border:1px solid var(--border)">
          <img src="data:image/jpeg;base64,${getLogoB64()}" style="width:100%;height:100%;object-fit:cover">
        </div>
        <div style="flex:1">
          <textarea id="hub-compose-text" class="input" placeholder="What's on your mind?" style="min-height:70px;border:none;background:var(--card2);resize:none;font-size:14px" onclick="this.style.minHeight='90px'"></textarea>
          ${newPostMediaRef?`
            <div style="display:flex;align-items:center;gap:8px;margin-top:8px;padding:8px;background:var(--vdim);border-radius:8px;border:1px solid var(--v)33">
              <span style="font-size:16px">${HOBBY_ICONS[newPostMediaRef.type]||'🎬'}</span>
              <span style="font-size:13px;font-weight:600;flex:1">${newPostMediaRef.title}</span>
              <button onclick="newPostMediaRef=null;render_hub()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px">✕</button>
            </div>`:
            `<div style="font-size:11px;color:var(--muted);margin-top:6px">Tag a movie, show, comic... <span style="color:var(--v);cursor:pointer" onclick="openTagMedia()">+ Tag media</span></div>`
          }
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
            <div style="display:flex;gap:6px;flex-wrap:wrap" id="vibe-row">
              ${VIBES.slice(0,7).map(v=>`<span onclick="toggleVibe('${v}')" style="cursor:pointer;font-size:18px;padding:2px;border-radius:6px;transition:background .15s" class="vibe-opt" data-vibe="${v}">${v}</span>`).join('')}
            </div>
            <button class="btn btn-sm" onclick="submitPost()">Post</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Feed -->
    <div id="hub-feed">
      ${allFeed.length===0
        ? `<div class="empty"><div class="empty-icon">✨</div><p>Your timeline is empty.<br>Post something or log your day!</p></div>`
        : allFeed.map(item => item._type==='activity' ? renderActivityCard(item) : renderPostCard(item)).join('')}
    </div>`;
}

function getLogoB64() {
  // Return stored logo or empty
  return window._logoB64 || '';
}

function buildActivity() {
  const items = [];
  const now = Date.now();
  // Recent diary entries
  diary.slice(0,3).forEach((d,i) => {
    items.push({
      _type:'activity', _sub:'diary', id:'d'+d.id,
      ts: now - i*86400000,
      mood: d.mood, rating: d.rating, date: d.date,
      text: d.summary || 'Logged a diary entry',
    });
  });
  // Recently completed tasks
  tasks.filter(t=>t.done).slice(0,2).forEach((t,i) => {
    items.push({ _type:'activity', _sub:'task', id:'t'+t.id, ts: now - (i+3)*3600000, title:t.title });
  });
  // Recent media logged
  media.filter(m=>['Watched','Read','Played'].includes(m.status)).slice(0,2).forEach((m,i) => {
    items.push({ _type:'activity', _sub:'hobby', id:'m'+m.id, ts: now - (i+2)*86400000, hobby:m });
  });
  return items;
}

function renderPostCard(p) {
  return `<div class="card" style="margin-bottom:12px;padding:16px" id="post-${p.id}">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:32px;height:32px;border-radius:8px;overflow:hidden;flex-shrink:0">
        <img src="data:image/jpeg;base64,${getLogoB64()}" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px">${currentUser?.name||'You'}</div>
        <div style="font-size:11px;color:var(--muted)">${p.date}</div>
      </div>
      ${p.vibe?`<span style="font-size:20px">${p.vibe}</span>`:''}
      <button class="btn-ghost btn-sm btn-icon" onclick="deletePost(${p.id})" style="font-size:12px">✕</button>
    </div>
    <div style="font-size:14px;line-height:1.7;color:var(--text)">${p.text}</div>
    ${p.mediaRef?`
      <div style="margin-top:10px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:10px;cursor:pointer" onclick="goTab('hobbies');openHobbyDetail(${p.mediaRef.id})">
        <span style="font-size:20px">${HOBBY_ICONS[p.mediaRef.type]||'🎬'}</span>
        <div>
          <div style="font-size:13px;font-weight:700">${p.mediaRef.title}</div>
          <div style="font-size:11px;color:var(--muted)">${p.mediaRef.type}${p.mediaRef.rating>0?' · '+'★'.repeat(p.mediaRef.rating):''}</div>
        </div>
      </div>`:''}
  </div>`;
}

function renderActivityCard(item) {
  let content = '';
  if (item._sub==='diary') {
    content = `<div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:22px">${item.mood}</span>
      <div>
        <div style="font-size:13px;font-weight:600">Diary — ${item.date} <span style="color:#fbbf24">${item.rating}/10</span></div>
        <div style="font-size:13px;color:var(--muted);margin-top:3px;line-height:1.5">${item.text}</div>
      </div>
    </div>`;
  } else if (item._sub==='task') {
    content = `<div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:18px;color:var(--v)">✓</span>
      <div style="font-size:13px">Completed: <strong>${item.title}</strong></div>
    </div>`;
  } else if (item._sub==='hobby') {
    content = `<div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:20px">${HOBBY_ICONS[item.hobby.type]||'🎬'}</span>
      <div>
        <div style="font-size:13px;font-weight:600">Logged: ${item.hobby.title}</div>
        <div style="font-size:11px;color:var(--muted)">${item.hobby.status}${item.hobby.rating>0?' · '+'★'.repeat(item.hobby.rating):''}</div>
      </div>
    </div>`;
  }
  return `<div style="margin-bottom:10px;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--card2);border-left:3px solid var(--v)33">
    <div style="font-size:10px;color:var(--muted);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Activity</div>
    ${content}
  </div>`;
}

let selectedVibe = '';
function toggleVibe(v) {
  selectedVibe = selectedVibe === v ? '' : v;
  document.querySelectorAll('.vibe-opt').forEach(el => {
    el.style.background = el.dataset.vibe === selectedVibe ? 'var(--v)33' : 'transparent';
  });
}

function submitPost() {
  const text = document.getElementById('hub-compose-text')?.value?.trim();
  if (!text) { toast('Write something first!'); return; }
  const now = new Date();
  posts.unshift({
    id: nextId(posts),
    text,
    vibe: selectedVibe || '',
    mediaRef: newPostMediaRef ? {...newPostMediaRef} : null,
    date: `${now.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()]}`,
    ts: Date.now(),
  });
  newPostMediaRef = null;
  selectedVibe = '';
  save();
  toast('Posted!');
  render_hub();
}

function deletePost(id) {
  confirm('Delete this post?', () => {
    posts = posts.filter(p=>p.id!==id);
    save(); render_hub(); toast('Deleted');
  });
}

function openTagMedia() {
  // Build media select in modal
  document.getElementById('tag-media-list').innerHTML = media.map(m=>`
    <div class="card-row" onclick="selectTagMedia(${m.id})" style="cursor:pointer">
      <span style="font-size:20px">${HOBBY_ICONS[m.type]||'🎬'}</span>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px">${m.title}</div>
        <div style="font-size:12px;color:var(--muted)">${m.type} · ${m.status}</div>
      </div>
    </div>`).join('') || '<div class="empty" style="padding:20px"><p>No hobbies yet. Add some first!</p></div>';
  openModal('tag-media-modal');
}

function selectTagMedia(id) {
  newPostMediaRef = media.find(m=>m.id===id);
  closeModal('tag-media-modal');
  render_hub();
}

function openNewPost(mediaItem) {
  newPostMediaRef = mediaItem || null;
  hubView = 'feed';
  render_hub();
  setTimeout(()=>{
    const el = document.getElementById('hub-compose-text');
    if (el) el.focus();
  },200);
}

// ---- PROFILE ----
function renderProfile(c) {
  const totalWatched = media.filter(m=>['Watched','Read','Played'].includes(m.status)).length;
  const totalDiary   = diary.length;
  const totalTasks   = tasks.filter(t=>t.done).length;
  const bestStreak   = habits.length ? Math.max(...habits.map(h=>h.streak)) : 0;
  const totalPosts   = posts.length;
  const favs         = media.filter(m=>m.rating===5).slice(0,4);
  const recentMedia  = [...media].filter(m=>['Watched','Read','Played'].includes(m.status)).slice(0,8);

  c.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <button class="btn-ghost btn-sm" onclick="hubView='feed';render_hub()">← Feed</button>
    </div>

    <!-- Profile hero -->
    <div style="background:linear-gradient(135deg,var(--card2),var(--card));border:1px solid var(--border);border-radius:20px;padding:24px;margin-bottom:20px;text-align:center">
      <div style="width:72px;height:72px;border-radius:18px;overflow:hidden;margin:0 auto 14px;border:3px solid var(--v)44;box-shadow:0 0 20px var(--v)33">
        <img src="data:image/jpeg;base64,${getLogoB64()}" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div style="font-weight:800;font-size:20px">${currentUser?.name||'Guest'}</div>
      <div style="font-size:13px;color:var(--muted);margin-top:4px">${currentUser?.email||'Local account'}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px;font-style:italic">Code. Couch. Cinema.</div>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
      ${[
        {val:totalWatched,label:'Completed'},
        {val:totalDiary,label:'Diary entries'},
        {val:totalTasks,label:'Tasks done'},
        {val:bestStreak,label:'Best streak'},
        {val:totalPosts,label:'Posts'},
        {val:media.length,label:'In collection'},
      ].map(s=>`<div style="background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center">
        <div style="font-size:22px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${s.val}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
      </div>`).join('')}
    </div>

    <!-- Favorites (5-star) -->
    ${favs.length>0?`
    <div class="section-title">⭐ Favorites</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">
      ${favs.map(m=>`<div style="aspect-ratio:2/3;background:${HOBBY_COVERS[m.type]||HOBBY_COVERS.Movie};border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;cursor:pointer;border:1px solid var(--border)" onclick="goTab('hobbies');openHobbyDetail(${m.id})">
        <div style="font-size:22px">${HOBBY_ICONS[m.type]||'🎬'}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.6);text-align:center;margin-top:4px;line-height:1.3">${m.title}</div>
      </div>`).join('')}
    </div>`:''}

    <!-- Collection -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div class="section-title" style="margin:0">Collection (${recentMedia.length})</div>
      <span style="font-size:12px;color:var(--v);cursor:pointer" onclick="hubView='feed';goTab('hobbies')">See all →</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">
      ${recentMedia.map(m=>`<div style="aspect-ratio:2/3;background:${HOBBY_COVERS[m.type]||HOBBY_COVERS.Movie};border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;cursor:pointer;border:1px solid var(--border)" onclick="goTab('hobbies');openHobbyDetail(${m.id})">
        <div style="font-size:20px">${HOBBY_ICONS[m.type]||'🎬'}</div>
        ${m.rating>0?`<div style="font-size:9px;color:#fbbf24;margin-top:3px">${'★'.repeat(m.rating)}</div>`:''}
        <div style="font-size:9px;color:rgba(255,255,255,.5);text-align:center;margin-top:3px;line-height:1.2">${m.title}</div>
      </div>`).join('')}
    </div>

    <!-- Recent posts -->
    ${posts.length>0?`
    <div class="section-title">Recent Posts</div>
    ${posts.slice(0,3).map(p=>`<div class="card2" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <div style="font-size:11px;color:var(--muted)">${p.date}</div>
        ${p.vibe?`<span style="font-size:16px">${p.vibe}</span>`:''}
      </div>
      <div style="font-size:13px;line-height:1.6">${p.text}</div>
    </div>`).join('')}`:''}`;
}
