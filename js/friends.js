// ============================================
// ZYZIRE v0.0.5 — js/friends.js
// Friends timeline
// ============================================

// Simulated friends data for prototype
const DEMO_FRIENDS = [
  {
    id:1, name:'Bassam', handle:'@bassam', avatar:'🎬',
    bio:'Movies. Comics. Coffee.',
    posts:[
      {id:1,text:'Just finished Project Hail Mary — easily one of the best sci-fi books I\'ve read.',vibe:'🔥',date:'15 May',mediaRef:{type:'Book',title:'Project Hail Mary',rating:5}},
      {id:2,text:'Severance S2 is absolutely insane. Can\'t believe that ending.',vibe:'😤',date:'13 May',mediaRef:{type:'Show',title:'Severance',rating:5}},
      {id:3,text:'Been going to the gym consistently for 3 weeks now. Small wins.',vibe:'💪',date:'11 May'},
    ],
    stats:{completed:124,posts:18,streak:21},
  },
  {
    id:2, name:'Sanshiro', handle:'@sanshiro', avatar:'📚',
    bio:'Code. Read. Repeat.',
    posts:[
      {id:4,text:'Reading Saga Vol 4 right now and this story just keeps getting better and better.',vibe:'✨',date:'14 May',mediaRef:{type:'Comic',title:'Saga Vol. 4',rating:4}},
      {id:5,text:'Finally hit my deadlift PR. 130kg. The grind is real.',vibe:'💪',date:'12 May'},
    ],
    stats:{completed:89,posts:12,streak:7},
  },
  {
    id:3, name:'OhoudH', handle:'@ohoudh', avatar:'🎵',
    bio:'Music. Anime. Vibes.',
    posts:[
      {id:6,text:'Listening to this album on repeat. Some albums just hit different at 2am.',vibe:'🎵',date:'15 May',mediaRef:{type:'Music',title:'Random Access Memories',rating:5}},
      {id:7,text:'Attack on Titan rewatch hits so different when you know the ending.',vibe:'😤',date:'10 May',mediaRef:{type:'Anime',title:'Attack on Titan',rating:5}},
    ],
    stats:{completed:203,posts:41,streak:14},
  },
];

let followedFriends = [1,2]; // IDs of followed friends
let friendsView = 'feed'; // 'feed' | 'discover' | 'profile'
let viewingFriend = null;

function render_friends() {
  const c = document.getElementById('friends-content');
  if (viewingFriend) { renderFriendProfile(c); return; }
  if (friendsView === 'discover') { renderDiscover(c); return; }
  renderFriendsFeed(c);
}

function renderFriendsFeed(c) {
  const followed = DEMO_FRIENDS.filter(f=>followedFriends.includes(f.id));
  // Merge all posts from followed friends
  const allPosts = [];
  followed.forEach(f => f.posts.forEach(p => allPosts.push({...p, _friend:f})));
  allPosts.sort((a,b)=>b.id-a.id);

  c.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div><h2>Friends</h2><div class="page-subtitle">Following ${followed.length} people</div></div>
      <button class="btn-ghost btn-sm" onclick="friendsView='discover';render_friends()">Discover</button>
    </div>

    <!-- Following pills -->
    ${followed.length>0?`
    <div style="display:flex;gap:10px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px">
      ${followed.map(f=>`
        <div onclick="viewingFriend=DEMO_FRIENDS.find(x=>x.id===${f.id});render_friends()" style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
          <div style="width:48px;height:48px;border-radius:14px;background:var(--v)22;border:2px solid var(--v)44;display:flex;align-items:center;justify-content:center;font-size:22px;transition:border-color .2s" onmouseover="this.style.borderColor='var(--v)'" onmouseout="this.style.borderColor='var(--v)44'">${f.avatar}</div>
          <div style="font-size:10px;color:var(--muted);font-weight:600">${f.name}</div>
        </div>`).join('')}
    </div>`:''}

    ${allPosts.length===0
      ? `<div class="empty"><div class="empty-icon">👥</div><p>No posts from friends yet.<br><span style="color:var(--v);cursor:pointer" onclick="friendsView='discover';render_friends()">Find people to follow →</span></p></div>`
      : allPosts.map(p => renderFriendPost(p)).join('')}`;
}

function renderFriendPost(p) {
  const f = p._friend;
  return `<div class="card" style="margin-bottom:12px;padding:16px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer" onclick="viewingFriend=DEMO_FRIENDS.find(x=>x.id===${f.id});render_friends()">
      <div style="width:36px;height:36px;border-radius:10px;background:var(--v)22;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;border:1px solid var(--v)33">${f.avatar}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px">${f.name} <span style="color:var(--muted);font-weight:400">${f.handle}</span></div>
        <div style="font-size:11px;color:var(--muted)">${p.date}</div>
      </div>
      ${p.vibe?`<span style="font-size:20px">${p.vibe}</span>`:''}
    </div>
    <div style="font-size:14px;line-height:1.7;color:var(--text)">${p.text}</div>
    ${p.mediaRef?`
      <div style="margin-top:10px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">${HOBBY_ICONS[p.mediaRef.type]||'🎬'}</span>
        <div>
          <div style="font-size:13px;font-weight:700">${p.mediaRef.title}</div>
          <div style="font-size:11px;color:var(--muted)">${p.mediaRef.type}${p.mediaRef.rating>0?' · '+'★'.repeat(p.mediaRef.rating):''}</div>
        </div>
      </div>`:''}
    <div style="display:flex;gap:14px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
      <button class="btn-ghost btn-sm" style="font-size:12px;padding:4px 10px">❤️ Like</button>
      <button class="btn-ghost btn-sm" style="font-size:12px;padding:4px 10px">💬 Reply</button>
    </div>
  </div>`;
}

function renderDiscover(c) {
  c.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <button class="btn-ghost btn-sm" onclick="friendsView='feed';render_friends()">← Back</button>
      <div><h2>Discover</h2><div class="page-subtitle">Find people to follow</div></div>
    </div>
    ${DEMO_FRIENDS.map(f=>`
      <div class="card" style="margin-bottom:12px;padding:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:48px;height:48px;border-radius:14px;background:var(--v)22;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:1px solid var(--v)33">${f.avatar}</div>
          <div style="flex:1;cursor:pointer" onclick="viewingFriend=DEMO_FRIENDS.find(x=>x.id===${f.id});render_friends()">
            <div style="font-weight:700;font-size:15px">${f.name}</div>
            <div style="font-size:12px;color:var(--muted)">${f.handle} · ${f.bio}</div>
            <div style="display:flex;gap:12px;margin-top:6px">
              <span style="font-size:11px;color:var(--muted)">${f.stats.completed} completed</span>
              <span style="font-size:11px;color:var(--muted)">${f.stats.posts} posts</span>
              <span style="font-size:11px;color:var(--muted)">🔥${f.stats.streak} streak</span>
            </div>
          </div>
          <button class="${followedFriends.includes(f.id)?'btn-ghost':'btn'} btn-sm" onclick="toggleFollow(${f.id})">
            ${followedFriends.includes(f.id)?'Following':'Follow'}
          </button>
        </div>
      </div>`).join('')}
    <div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">
      Real friend connections coming in v2.0 with Supabase 🔜
    </div>`;
}

function renderFriendProfile(c) {
  const f = viewingFriend;
  c.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <button class="btn-ghost btn-sm" onclick="viewingFriend=null;render_friends()">← Back</button>
    </div>
    <div style="background:linear-gradient(135deg,var(--card2),var(--card));border:1px solid var(--border);border-radius:20px;padding:24px;margin-bottom:20px;text-align:center">
      <div style="width:64px;height:64px;border-radius:16px;background:var(--v)22;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 12px;border:2px solid var(--v)44">${f.avatar}</div>
      <div style="font-weight:800;font-size:20px">${f.name}</div>
      <div style="font-size:13px;color:var(--muted);margin-top:4px">${f.handle}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px;font-style:italic">${f.bio}</div>
      <div style="display:flex;justify-content:center;gap:20px;margin-top:14px">
        <div style="text-align:center"><div style="font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${f.stats.completed}</div><div style="font-size:10px;color:var(--muted)">Completed</div></div>
        <div style="text-align:center"><div style="font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">${f.stats.posts}</div><div style="font-size:10px;color:var(--muted)">Posts</div></div>
        <div style="text-align:center"><div style="font-weight:800;color:var(--vg);font-family:'JetBrains Mono'">🔥${f.stats.streak}</div><div style="font-size:10px;color:var(--muted)">Streak</div></div>
      </div>
      <button class="${followedFriends.includes(f.id)?'btn-ghost':'btn'} btn-sm" style="margin-top:14px;min-width:100px" onclick="toggleFollow(${f.id})">
        ${followedFriends.includes(f.id)?'Following':'Follow'}
      </button>
    </div>
    <div class="section-title">Posts</div>
    ${f.posts.map(p=>renderFriendPost({...p,_friend:f})).join('')}`;
}

function toggleFollow(id) {
  if (followedFriends.includes(id)) {
    followedFriends = followedFriends.filter(x=>x!==id);
    toast('Unfollowed');
  } else {
    followedFriends.push(id);
    toast('Following!');
  }
  render_friends();
}
