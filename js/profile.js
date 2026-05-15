// ============================================
// ZYZIRE v0.0.5 — js/profile.js
// User profile & collection stats
// ============================================

function render_profile() {
  const c = document.getElementById('profile-content');
  const TYPE_COLORS = {Movie:'#e85d4a',Show:'#4a90e2',Comic:'#f5a623',Book:'#7b68ee',Game:'#50c878',Anime:'#ff6eb4'};
  const MEDIA_ICONS = {Movie:'🎬',Show:'📺',Comic:'📚',Book:'📖',Game:'🎮',Anime:'⛩️'};

  const name = currentUser?.name || 'Guest';
  const email = currentUser?.email || '';
  const totalMedia = media.length;
  const watched = media.filter(m=>['Watched','Read','Played'].includes(m.status)).length;
  const watching = media.filter(m=>['Watching','Reading','Playing'].includes(m.status)).length;
  const watchlist = media.filter(m=>['Watchlist','Want'].includes(m.status)).length;
  const avgRating = media.filter(m=>m.rating>0).length
    ? (media.filter(m=>m.rating>0).reduce((s,m)=>s+m.rating,0)/media.filter(m=>m.rating>0).length).toFixed(1)
    : '—';
  const tasksDone = tasks.filter(t=>t.done).length;
  const habitStreak = habits.length ? Math.max(...habits.map(h=>h.streak)) : 0;
  const diaryCount = diary.length;
  const gymCount = gym.length;

  // Recent activity from media
  const recent = [...media].filter(m=>m.date).sort((a,b)=>b.id-a.id).slice(0,6);

  // Top rated
  const topRated = [...media].filter(m=>m.rating===5).slice(0,4);

  // By type breakdown
  const byType = MEDIA_TYPES.map(t=>({
    type:t, count:media.filter(m=>m.type===t).length, icon:MEDIA_ICONS[t], color:TYPE_COLORS[t]
  })).filter(x=>x.count>0);

  c.innerHTML = `
    <!-- Profile header -->
    <div class="card" style="margin-bottom:16px;text-align:center;padding:24px">
      <div style="width:72px;height:72px;border-radius:20px;background:var(--v);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:28px;color:#000;margin:0 auto 14px;box-shadow:0 0 20px #22c55e44">Z</div>
      <div style="font-weight:800;font-size:20px;margin-bottom:4px">${name}</div>
      ${email&&email!=='guest'?`<div style="font-size:12px;color:var(--muted);margin-bottom:14px">${email}</div>`:''}
      <div style="display:flex;justify-content:center;gap:4px;flex-wrap:wrap">
        <span class="pill" style="font-size:11px">📚 ${totalMedia} media</span>
        <span class="pill" style="font-size:11px">✅ ${tasksDone} tasks done</span>
        <span class="pill" style="font-size:11px">🔥 ${habitStreak} streak</span>
        ${isPro?'<span class="pill" style="background:#22c55e22;font-size:11px">⚡ Zyzire+</span>':''}
      </div>
    </div>

    <!-- Stats grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <div class="card2" style="text-align:center">
        <div style="font-size:28px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${watched}</div>
        <div style="font-size:11px;color:var(--muted)">Completed</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:28px;font-weight:800;color:#60a5fa;font-family:'JetBrains Mono'">${watching}</div>
        <div style="font-size:11px;color:var(--muted)">In Progress</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:28px;font-weight:800;color:var(--gold);font-family:'JetBrains Mono'">${watchlist}</div>
        <div style="font-size:11px;color:var(--muted)">Watchlist</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:28px;font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${avgRating}★</div>
        <div style="font-size:11px;color:var(--muted)">Avg Rating</div>
      </div>
    </div>

    <!-- More stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
      <div class="card2" style="text-align:center">
        <div style="font-size:22px;font-weight:800;color:var(--text);font-family:'JetBrains Mono'">${gymCount}</div>
        <div style="font-size:10px;color:var(--muted)">Gym Sessions</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:22px;font-weight:800;color:var(--text);font-family:'JetBrains Mono'">${diaryCount}</div>
        <div style="font-size:10px;color:var(--muted)">Diary Entries</div>
      </div>
      <div class="card2" style="text-align:center">
        <div style="font-size:22px;font-weight:800;color:var(--text);font-family:'JetBrains Mono'">${posts.length}</div>
        <div style="font-size:10px;color:var(--muted)">Posts</div>
      </div>
    </div>

    <!-- Media breakdown by type -->
    ${byType.length?`
    <div class="section-title">By Type</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      ${byType.map(t=>`<div class="card2" style="flex:1;min-width:70px;text-align:center;border-color:${t.color}33">
        <div style="font-size:22px">${t.icon}</div>
        <div style="font-size:16px;font-weight:800;color:${t.color}">${t.count}</div>
        <div style="font-size:10px;color:var(--muted)">${t.type}</div>
      </div>`).join('')}
    </div>`:''}

    <!-- Top Rated -->
    ${topRated.length?`
    <div class="section-title">Top Rated ★★★★★</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
      ${topRated.map(m=>{
        const col=TYPE_COLORS[m.type]||'var(--v)';
        return `<div onclick="goTab('media')" style="cursor:pointer;border-radius:10px;background:${col}18;border:1px solid ${col}33;aspect-ratio:2/3;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;text-align:center">
          <div style="font-size:24px;margin-bottom:4px">${MEDIA_ICONS[m.type]||'🎬'}</div>
          <div style="font-size:9px;font-weight:700;line-height:1.3;color:var(--text)">${m.title}</div>
        </div>`;
      }).join('')}
    </div>`:''}

    <!-- Recent Activity -->
    ${recent.length?`
    <div class="section-title">Recent Activity</div>
    ${recent.map(m=>{
      const col=TYPE_COLORS[m.type]||'var(--v)';
      return `<div class="card-row" style="margin-bottom:8px" onclick="goTab('media')">
        <div style="width:38px;height:54px;border-radius:8px;background:${col}18;border:1px solid ${col}33;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${MEDIA_ICONS[m.type]||'🎬'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.title}</div>
          <div style="font-size:11px;color:${col};margin-top:2px">${m.status}${m.rating>0?' · '+'★'.repeat(m.rating):''}</div>
          ${m.date?`<div style="font-size:10px;color:var(--muted)">${m.date}</div>`:''}
        </div>
      </div>`;
    }).join('')}`:''}
  `;
}
