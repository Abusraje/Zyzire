// ============================================
// ZYZIRE v0.0.5 — js/posts.js
// Personal feed / post section
// ============================================

let posts = [];
let composing = false;

// Called by media/diary auto-post
function addAutoPost(opts) {
  posts.unshift({
    id: nextId(posts),
    text: opts.text || '',
    type: opts.type || 'text',
    mediaRef: opts.mediaRef || null,
    timestamp: new Date().toISOString(),
    date: `${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`,
    liked: false,
  });
  save();
}

function render_posts() {
  const c = document.getElementById('posts-content');
  const TYPE_COLORS = {Movie:'#e85d4a',Show:'#4a90e2',Comic:'#f5a623',Book:'#7b68ee',Game:'#50c878',Anime:'#ff6eb4'};
  const MEDIA_ICONS = {Movie:'🎬',Show:'📺',Comic:'📚',Book:'📖',Game:'🎮',Anime:'⛩️'};

  const composeHTML = composing ? `
    <div class="card" style="margin-bottom:20px;border-color:var(--v)">
      <div style="display:flex;gap:10px;margin-bottom:12px">
        <div style="width:36px;height:36px;border-radius:10px;background:var(--v);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#000;flex-shrink:0">Z</div>
        <textarea class="input" id="post-compose-text" placeholder="What's on your mind? Share a thought, a movie you watched, something you're listening to..." style="flex:1;min-height:80px;resize:none"></textarea>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button class="btn-ghost btn-sm" onclick="attachMediaToPost()">🎬 Tag Media</button>
        <button class="btn-ghost btn-sm" onclick="attachMoodToPost()">😊 Mood</button>
        <div style="flex:1"></div>
        <button class="btn-ghost btn-sm" onclick="composing=false;render_posts()">Cancel</button>
        <button class="btn btn-sm" onclick="submitPost()">Post</button>
      </div>
      <div id="post-attach-preview"></div>
    </div>` : `
    <div class="card2" onclick="composing=true;render_posts()" style="margin-bottom:20px;cursor:pointer;display:flex;gap:12px;align-items:center">
      <div style="width:36px;height:36px;border-radius:10px;background:var(--v);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#000;flex-shrink:0">Z</div>
      <div style="color:var(--muted);font-size:14px">What's on your mind?</div>
    </div>`;

  const postItems = posts.length === 0
    ? `<div class="empty"><div class="empty-icon">✍️</div><p>No posts yet.<br>Share what you're up to!</p></div>`
    : posts.map(p => {
        const col = p.mediaRef ? (TYPE_COLORS[p.mediaRef.type]||'var(--v)') : 'var(--v)';
        const icon = p.mediaRef ? (MEDIA_ICONS[p.mediaRef.type]||'🎬') : null;
        // Bold markdown **text**
        const formatted = (p.text||'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
        return `<div class="card" style="margin-bottom:12px">
          <div style="display:flex;gap:10px;margin-bottom:10px">
            <div style="width:34px;height:34px;border-radius:9px;background:var(--v);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#000;flex-shrink:0">Z</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px">${currentUser?.name||'You'}</div>
              <div style="font-size:11px;color:var(--muted)">${p.date||''}</div>
            </div>
            <button class="btn-ghost btn-sm" onclick="deletePost(${p.id})" style="padding:4px 8px;font-size:11px;color:var(--muted)">✕</button>
          </div>
          <div style="font-size:14px;line-height:1.7;color:var(--text);white-space:pre-wrap">${formatted}</div>
          ${p.mediaRef ? `
          <div onclick="goTab('media')" style="margin-top:10px;background:${col}11;border:1px solid ${col}33;border-radius:10px;padding:10px 12px;display:flex;gap:10px;align-items:center;cursor:pointer">
            <span style="font-size:20px">${icon}</span>
            <div>
              <div style="font-weight:700;font-size:13px">${p.mediaRef.title}</div>
              <div style="font-size:11px;color:${col}">${p.mediaRef.type}${p.mediaRef.rating>0?' · '+'★'.repeat(p.mediaRef.rating):''}</div>
            </div>
          </div>` : ''}
          <div style="display:flex;gap:12px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <button onclick="toggleLike(${p.id})" style="background:none;border:none;cursor:pointer;font-size:13px;color:${p.liked?'#f87171':'var(--muted)'};font-family:'Syne',sans-serif;font-weight:600;display:flex;align-items:center;gap:4px">${p.liked?'❤️':'🤍'} Like</button>
          </div>
        </div>`;
      }).join('');

  c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <div><h2>Feed</h2><div class="page-subtitle">${posts.length} posts</div></div>
    </div>
    ${composeHTML}
    ${postItems}`;
}

let pendingMediaAttach = null;
let pendingMood = null;

function attachMediaToPost() {
  // Pick from recent media
  if (!media.length) { toast('No media tracked yet'); return; }
  const recent = media.slice(0,5);
  const preview = document.getElementById('post-attach-preview');
  preview.innerHTML = `<div style="margin-top:10px">
    <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Tag recent media:</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${recent.map(m=>`<button class="filter-pill" onclick="selectMediaAttach(${m.id})" style="font-size:11px">${m.title}</button>`).join('')}
    </div>
  </div>`;
}

function selectMediaAttach(id) {
  const m = media.find(x=>x.id===id);
  if (!m) return;
  pendingMediaAttach = m;
  document.getElementById('post-attach-preview').innerHTML = `
    <div style="margin-top:10px;background:var(--card2);border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px">
      <span>${({Movie:'🎬',Show:'📺',Comic:'📚',Book:'📖',Game:'🎮',Anime:'⛩️'})[m.type]||'🎬'}</span>
      <span style="font-size:13px;font-weight:600">${m.title}</span>
      <button onclick="pendingMediaAttach=null;document.getElementById('post-attach-preview').innerHTML=''" style="background:none;border:none;cursor:pointer;color:var(--muted);margin-left:auto">✕</button>
    </div>`;
}

function attachMoodToPost() {
  const moods = ['😊','😐','😴','😤','🔥','😔','🎉','💪','🎮','🎬','🎵'];
  const preview = document.getElementById('post-attach-preview');
  preview.innerHTML = `<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
    ${moods.map(m=>`<button onclick="selectMood2('${m}')" style="background:var(--card2);border:1px solid var(--border);border-radius:8px;padding:6px 8px;font-size:18px;cursor:pointer">${m}</button>`).join('')}
  </div>`;
}

function selectMood2(m) {
  pendingMood = m;
  const t = document.getElementById('post-compose-text');
  t.value = (t.value ? t.value + ' ' : '') + m + ' ';
  document.getElementById('post-attach-preview').innerHTML='';
  t.focus();
}

function submitPost() {
  const text = document.getElementById('post-compose-text').value.trim();
  if (!text) { toast('Write something first!'); return; }
  posts.unshift({
    id: nextId(posts),
    text,
    type: pendingMediaAttach ? 'media' : 'text',
    mediaRef: pendingMediaAttach || null,
    timestamp: new Date().toISOString(),
    date: `${MONTHS[today.getMonth()].slice(0,3)} ${today.getDate()}`,
    liked: false,
  });
  pendingMediaAttach = null;
  pendingMood = null;
  composing = false;
  save();
  render_posts();
  toast('Posted!');
}

function toggleLike(id) {
  posts = posts.map(p => p.id===id ? {...p,liked:!p.liked} : p);
  save(); render_posts();
}

function deletePost(id) {
  if (!window.confirm('Delete this post?')) return;
  posts = posts.filter(p=>p.id!==id);
  save(); render_posts(); toast('Deleted');
}
