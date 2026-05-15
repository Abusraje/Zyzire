// ============================================
// ZYZIRE 0.0.3 — js/canvas.js
// Drawing canvas + note editor
// ============================================

let drawTool='pen', drawColor='#22c55e', drawSize=3, isDrawing=false, lastX=0, lastY=0;

function openCanvas() {
  document.getElementById('canvas-full').classList.add('open');
  const cv = document.getElementById('draw-canvas');
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight - 64;
  buildLines('canvas-lines', cv.height, 0);
  buildCanvasTools();
  cv.onmousedown  = startDraw; cv.onmousemove = drawMove;
  cv.onmouseup    = stopDraw;  cv.onmouseleave = stopDraw;
  cv.ontouchstart = startDraw; cv.ontouchmove = drawMove; cv.ontouchend = stopDraw;
}

function closeCanvas() { document.getElementById('canvas-full').classList.remove('open'); }
function clearCanvas()  { const c=document.getElementById('draw-canvas'); c.getContext('2d').clearRect(0,0,c.width,c.height); }

function buildLines(svgId, h, offset) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  let html = Array.from({length:Math.ceil((h-offset)/32)},(_,i)=>
    `<line x1="0" y1="${offset+40+i*32}" x2="100%" y2="${offset+40+i*32}" stroke="#d0f0e8" stroke-width="1"/>`
  ).join('');
  html += `<line x1="60" y1="0" x2="60" y2="100%" stroke="#f0b8b8" stroke-width="1" opacity="0.5"/>`;
  svg.innerHTML = html;
}

function buildCanvasTools() {
  const colors = ['#22c55e','#4ade80','#000','#fbbf24','#f87171','#60a5fa','#a78bfa','#fff'];
  document.getElementById('canvas-colors').innerHTML = colors.map(c=>
    `<div class="cdot${drawColor===c?' active':''}" style="background:${c};border:2px solid ${drawColor===c?'#fff':'transparent'}"
      onclick="setDrawColor('${c}',this)"></div>`).join('');
  const sizes = [2,4,7,14];
  document.getElementById('canvas-sizes').innerHTML = sizes.map(s=>
    `<div class="sdot${drawSize===s?' active':''}" style="width:${s*2+6}px;height:${s*2+6}px;background:${drawSize===s?'var(--v)':'var(--muted)'}"
      onclick="setDrawSize(${s},this)"></div>`).join('');
}

function setDrawTool(t) {
  drawTool = t;
  ['pen','hl','er'].forEach(x=>document.getElementById('dtool-'+x).classList.toggle('active',x===t));
}
function setDrawColor(c,el) {
  drawColor=c;
  document.querySelectorAll('#canvas-colors .cdot').forEach(d=>{d.classList.remove('active');d.style.borderColor='transparent';});
  el.classList.add('active'); el.style.borderColor='#fff';
}
function setDrawSize(s,el) {
  drawSize=s;
  document.querySelectorAll('#canvas-sizes .sdot').forEach(d=>{d.classList.remove('active');d.style.background='var(--muted)';});
  el.classList.add('active'); el.style.background='var(--v)';
}

function getPos(e,c) { const r=c.getBoundingClientRect(),s=e.touches?e.touches[0]:e; return{x:s.clientX-r.left,y:s.clientY-r.top}; }
function startDraw(e) { e.preventDefault(); isDrawing=true; const p=getPos(e,this); lastX=p.x; lastY=p.y; }
function drawMove(e)  {
  e.preventDefault(); if(!isDrawing)return;
  const ctx=this.getContext('2d'), p=getPos(e,this);
  ctx.lineWidth=drawTool==='er'?24:drawSize; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.strokeStyle=drawTool==='er'?'#e8ede8':drawColor;
  ctx.globalAlpha=drawTool==='hl'?0.35:1;
  ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(p.x,p.y); ctx.stroke();
  lastX=p.x; lastY=p.y;
}
function stopDraw(e) { if(e)e.preventDefault(); isDrawing=false; }

// Note editor
let currentNotePageId = null;

function openNoteEditor(pid) {
  if (!viewingBook) return;
  const page = viewingBook.pages.find(p=>p.id===pid);
  if (!page) return;
  currentNotePageId = pid;
  document.getElementById('note-title-label').textContent = page.title;
  document.getElementById('note-content').value = page.content||'';
  document.getElementById('note-full').classList.add('open');
  buildLines('note-lines', window.innerHeight, 0);
}

function closeNoteEditor() {
  // Save content
  if (viewingBook && currentNotePageId) {
    const content = document.getElementById('note-content').value;
    viewingBook.pages = viewingBook.pages.map(p => p.id===currentNotePageId ? {...p,content} : p);
    books = books.map(b => b.id===viewingBook.id ? viewingBook : b);
    save();
  }
  document.getElementById('note-full').classList.remove('open');
  currentNotePageId = null;
}
