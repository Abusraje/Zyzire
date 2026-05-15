// ============================================
// ZYZIRE 0.0.3 — js/bookshelf.js
// ============================================

const BOOK_COLORS = ['#22c55e','#15803d','#052e16','#14532d','#4ade80','#16a34a','#15803d','#22c55e'];;
let editingBookId = null;

function render_bookshelf() {
  const c = document.getElementById('bookshelf-content');
  if (viewingBook) { renderBookView(c); return; }

  c.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><h2>Bookshelf</h2><div class="page-subtitle">${books.length} books</div></div>
        <button class="btn btn-sm" onclick="openAddBook()">+ Book</button>
      </div>
    </div>
    <div class="book-grid">
      ${books.map(b=>`
        <div class="book-card" onclick="openBook(${b.id})" style="background:${b.color};box-shadow:0 4px 20px ${b.color}44">
          <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:rgba(0,0,0,.2);border-radius:16px 0 0 16px"></div>
          <div style="position:absolute;right:-15px;bottom:-15px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
          <button onclick="event.stopPropagation();openEditBook(${b.id})" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.25);border:none;border-radius:6px;color:#fff;font-size:11px;padding:3px 8px;cursor:pointer">✏️</button>
          <div style="font-weight:800;font-size:15px;color:#fff;margin-bottom:4px;padding-left:10px;padding-right:30px">${b.title}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.65);padding-left:10px;margin-bottom:10px">${b.sub}</div>
          <div style="padding-left:10px">
            ${b.pages.slice(0,3).map(p=>`<div style="font-size:10px;color:rgba(255,255,255,.5);margin-bottom:2px">${p.type==='note'?'📝':p.type==='pdf'?'📄':'🎨'} ${p.title}</div>`).join('')}
            ${b.pages.length===0?'<div style="font-size:10px;color:rgba(255,255,255,.4)">No pages yet</div>':''}
          </div>
          <div style="position:absolute;bottom:10px;right:14px;background:rgba(0,0,0,.25);border-radius:6px;padding:3px 8px;font-size:10px;color:rgba(255,255,255,.7);font-family:'JetBrains Mono'">${b.pages.length}p</div>
        </div>`).join('')}
    </div>`;
}

function openBook(id) { viewingBook = books.find(b=>b.id===id); render_bookshelf(); }

function renderBookView(c) {
  const b = viewingBook;
  c.innerHTML = `
    <div style="background:${b.color};border-radius:16px;padding:20px;margin-bottom:20px;position:relative;overflow:hidden">
      <div style="position:absolute;right:-20px;top:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <button onclick="backShelf()" style="background:rgba(255,255,255,.15);border:none;border-radius:8px;color:#fff;padding:6px 12px;cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;font-size:12px">← Shelf</button>
        <button onclick="openEditBook(${b.id})" style="background:rgba(255,255,255,.15);border:none;border-radius:8px;color:#fff;padding:6px 12px;cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;font-size:12px">✏️ Edit</button>
      </div>
      <div style="font-weight:800;font-size:22px;color:#fff">${b.title}</div>
      <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">${b.sub}</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:6px">${b.pages.length} pages</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div class="section-title" style="margin:0">Pages</div>
      <button class="btn btn-sm" onclick="openAddPage()">+ Page</button>
    </div>
    ${b.pages.length===0?'<div class="empty"><div class="empty-icon">📝</div><p>No pages yet.<br>Add your first page!</p></div>':''}
    <div id="book-page-list">
      ${b.pages.map(p=>`
        <div class="task-row" style="padding:14px" onclick="${p.type==='canvas'?'openCanvas()':p.type==='note'?`openNoteEditor(${p.id})`:''}">
          <div style="width:42px;height:42px;border-radius:10px;background:${b.color}22;border:1px solid ${b.color}44;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${p.type==='note'?'📝':p.type==='pdf'?'📄':'🎨'}</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:14px">${p.title}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:3px">${p.type==='note'?'Note Pad':p.type==='pdf'?'PDF / Slides':'Free Canvas'}</div>
          </div>
          <button class="btn-ghost btn-sm btn-icon" onclick="event.stopPropagation();deletePage(${p.id})">🗑</button>
        </div>`).join('')}
    </div>`;
}

function backShelf() { viewingBook=null; render_bookshelf(); }

function openAddBook() {
  editingBookId = null;
  document.getElementById('book-modal-title').textContent = 'New Book';
  document.getElementById('book-input-title').value = '';
  document.getElementById('book-input-sub').value   = '';
  setBookColor(BOOK_COLORS[0]);
  document.getElementById('book-delete-btn').style.display = 'none';
  openModal('book-modal');
}

function openEditBook(id) {
  const b = books.find(x=>x.id===id);
  if (!b) return;
  editingBookId = id;
  document.getElementById('book-modal-title').textContent = 'Edit Book';
  document.getElementById('book-input-title').value = b.title;
  document.getElementById('book-input-sub').value   = b.sub||'';
  setBookColor(b.color);
  document.getElementById('book-delete-btn').style.display = 'block';
  openModal('book-modal');
}

function setBookColor(c) {
  document.querySelectorAll('.book-color-opt').forEach(el => {
    el.style.border = el.dataset.color===c ? '3px solid #fff' : '3px solid transparent';
  });
  document.getElementById('book-modal').dataset.color = c;
}

function saveBook() {
  const title = document.getElementById('book-input-title').value.trim();
  const sub   = document.getElementById('book-input-sub').value.trim();
  const color = document.getElementById('book-modal').dataset.color || BOOK_COLORS[0];
  if (!title) { alert('Please enter a title'); return; }
  if (editingBookId) {
    books = books.map(b => b.id===editingBookId ? {...b,title,sub,color} : b);
    if (viewingBook && viewingBook.id===editingBookId) viewingBook = books.find(b=>b.id===editingBookId);
    toast('Book updated');
  } else {
    books.push({id:nextId(books),title,sub,color,pages:[]});
    toast('Book created!');
  }
  save(); closeModal('book-modal'); render_bookshelf();
}

function deleteBook() {
  confirm('Delete this book and all its pages?', () => {
    books = books.filter(b => b.id!==editingBookId);
    if (viewingBook && viewingBook.id===editingBookId) viewingBook=null;
    save(); closeModal('book-modal'); render_bookshelf(); toast('Book deleted');
  });
}

let addingPageBookId = null;
function openAddPage() {
  document.getElementById('page-input-title').value = '';
  document.getElementById('page-input-type').value  = 'note';
  openModal('page-modal');
}

function savePage() {
  const title = document.getElementById('page-input-title').value.trim();
  const type  = document.getElementById('page-input-type').value;
  if (!title) { alert('Please enter a page title'); return; }
  if (!viewingBook) return;
  viewingBook.pages.push({id:nextId(viewingBook.pages), type, title, content:''});
  books = books.map(b => b.id===viewingBook.id ? viewingBook : b);
  save(); closeModal('page-modal'); renderBookView(document.getElementById('bookshelf-content')); toast('Page added');
}

function deletePage(pid) {
  confirm('Delete this page?', () => {
    viewingBook.pages = viewingBook.pages.filter(p=>p.id!==pid);
    books = books.map(b => b.id===viewingBook.id ? viewingBook : b);
    save(); renderBookView(document.getElementById('bookshelf-content')); toast('Page deleted');
  });
}
