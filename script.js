// ─── DATA ────────────────────────────────────────────────
const subjects = [];

const weekDays = [
  {name:'จ',full:'จันทร์',subjects:[],pills:[]},
  {name:'อ',full:'อังคาร',subjects:[],pills:[]},
  {name:'พ',full:'พุธ',subjects:[],pills:[]},
  {name:'พฤ',full:'พฤหัส',subjects:[],pills:[]},
  {name:'ศ',full:'ศุกร์',subjects:[],pills:[]},
  {name:'ส',full:'เสาร์',subjects:[],pills:[]},
  {name:'อา',full:'อาทิตย์',subjects:[],pills:[]},
];

const revisionData = [];

const notesData = [];

// ─── SIDEBAR ─────────────────────────────────────────────
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ─── PANEL ───────────────────────────────────────────────
function openPanel(content) {
  document.getElementById('panel-content').innerHTML = content;
  document.getElementById('slide-panel').classList.add('open');
  document.getElementById('panel-overlay').classList.add('show');
}
function closePanel() {
  document.getElementById('slide-panel').classList.remove('open');
  document.getElementById('panel-overlay').classList.remove('show');
}

// ─── NAVIGATION ──────────────────────────────────────────
function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  if(el) el.classList.add('active');
  if(page==='stats') initCharts();
  closeSidebar();
}

// ─── CLOCK ───────────────────────────────────────────────
function updateClock(){
  const now=new Date();
  const h=String(now.getHours()).padStart(2,'0');
  const m=String(now.getMinutes()).padStart(2,'0');
  const s=String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent=`⏰ ${h}:${m}:${s}`;
}
setInterval(updateClock,1000);
updateClock();

// ─── COUNT UP ────────────────────────────────────────────
function animateCount(el){
  const target=parseInt(el.dataset.target);
  let start=0;
  const timer=setInterval(()=>{
    start=Math.min(start+Math.ceil(target/60),target);
    el.textContent=start;
    if(start>=target)clearInterval(timer);
  },1400/target);
}
setTimeout(()=>{document.querySelectorAll('.count-up').forEach(animateCount)},300);

// ─── TASK TOGGLE ─────────────────────────────────────────
function toggleTask(el){
  el.classList.toggle('done');
}

// ─── SUBJECTS GRID ───────────────────────────────────────
function buildSubjects(){
  const grid=document.getElementById('subjectsGrid');
  grid.innerHTML=subjects.map(s=>`
    <div class="subject-card">
         onclick="showSubject('${s.code}')">
      <div class="subject-glow" style="background:${s.color}"></div>
      <div class="subject-icon-wrap" style="background:${s.bg};">${s.icon}</div>
      <div class="subject-name">${s.name}</div>
      <div class="subject-code">${s.code}</div>
      <div class="subject-prog-label"><span>ความคืบหน้า</span><span style="color:${s.color};font-weight:700">${s.progress}%</span></div>
      <div class="subject-prog"><div class="subject-prog-fill" style="width:${s.progress}%;background:linear-gradient(90deg,${s.color},${s.color}88)"></div></div>
      <div class="subject-meta">
        <div class="subject-meta-item"><strong>${s.hours} ชม.</strong>เรียนแล้ว</div>
        <div class="subject-meta-item"><strong>${s.lastReview}</strong>อ่านล่าสุด</div>
      </div>
      <button class="subject-open-btn" onclick="event.stopPropagation();navigate('focus',document.querySelector('[onclick*=focus]'))">🎯 เริ่มเรียน</button>
    </div>
  `).join('');
}
buildSubjects();

// ─── WEEK GRID ───────────────────────────────────────────
function buildWeekGrid(){
  const grid=document.getElementById('weekGrid');
  const now=new Date();
  const mon=new Date(now);
  mon.setDate(now.getDate()-((now.getDay()+6)%7));
  grid.innerHTML=weekDays.map((d,i)=>{
    const date=new Date(mon);date.setDate(mon.getDate()+i);
    const isToday=date.toDateString()===now.toDateString();
    const pills=d.subjects.map((s,j)=>`<div class="day-pill ${d.pills[j]||''}">${s}</div>`).join('');
    return `<div class="day-card ${isToday?'day-today':''}">
      <div class="day-name">${d.name}</div>
      <div class="day-date">${date.getDate()}</div>
      <div class="day-subject-pills">${pills}</div>
    </div>`;
  }).join('');
}
buildWeekGrid();

// ─── PLANNER TASKS ───────────────────────────────────────
let plannerTasks=[
  {text:'ทำแบบฝึกหัด Neural Network',subject:'🤖 AI',done:false},
  {text:'อ่าน Hypothesis Testing',subject:'📊 Statistics',done:true},
  {text:'วาด DFD Level 1',subject:'🧠 System Analysis',done:false},
];
function renderPlannerTasks(){
  const list=document.getElementById('plannerTaskList');
  list.innerHTML=plannerTasks.map((t,i)=>`
    <div class="task-item ${t.done?'done':''}" onclick="togglePlannerTask(${i})">
      <div class="task-check">${t.done?'✓':''}</div>
      <div class="task-text">${t.text}</div>
      <span class="task-badge" style="background:rgba(255,255,255,0.05);color:var(--sub)">${t.subject}</span>
      <span onclick="event.stopPropagation();deletePlannerTask(${i})" style="cursor:pointer;color:var(--sub);padding:0 4px;font-size:1rem" title="ลบ">×</span>
    </div>
  `).join('');
}
function addPlannerTask(){
  const input=document.getElementById('plannerInput');
  const sub=document.getElementById('plannerSubject').value;
  if(!input.value.trim())return;
  plannerTasks.push({text:input.value.trim(),subject:sub||'📚 ทั่วไป',done:false});
  input.value='';renderPlannerTasks();
}
function togglePlannerTask(i){plannerTasks[i].done=!plannerTasks[i].done;renderPlannerTasks();}
function deletePlannerTask(i){plannerTasks.splice(i,1);renderPlannerTasks();}
renderPlannerTasks();

// ─── REVISION TABLE ──────────────────────────────────────
function buildRevision(){
  const icons={done:'✓',miss:'✗',soon:'◷',empty:'–'};
  const body=document.getElementById('revisionBody');
  body.innerHTML=revisionData.map(r=>`
    <tr>
      <td><span class="subject-chip"><span class="chip-dot" style="background:${r.color}"></span>${r.subject}</span></td>
      <td style="color:var(--sub);font-size:.8rem">${r.read}</td>
      <td><span class="rev-check ${r.d1}">${icons[r.d1]}</span></td>
      <td><span class="rev-check ${r.d3}">${icons[r.d3]}</span></td>
      <td><span class="rev-check ${r.d7}">${icons[r.d7]}</span></td>
      <td><span class="rev-check ${r.d14}">${icons[r.d14]}</span></td>
      <td><span style="font-size:.75rem;padding:4px 10px;border-radius:7px;font-weight:600;${r.d7==='done'?'background:var(--success-soft);color:var(--success)':r.d7==='miss'?'background:rgba(239,68,68,0.1);color:#EF4444':'background:rgba(245,158,11,0.1);color:#F59E0B'}">${r.d7==='done'?'✅ On Track':r.d7==='miss'?'⚠️ ค้างทบทวน':'⏰ Due Soon'}</span></td>
    </tr>
  `).join('');
}
function markAllRevision(){
  revisionData.forEach(r=>r.d1='done');buildRevision();
}
buildRevision();

// ─── NOTES ───────────────────────────────────────────────
let notes=[...notesData];
let activeNoteSubject = 'all';
let activeNoteID = null;

function buildNotes(filter=''){
  buildNotesFilterTabs();

  let filtered = notes.filter(n => {
    const matchSubject = activeNoteSubject === 'all' || n.subject === activeNoteSubject;
    const matchSearch  = !filter ||
      n.title.toLowerCase().includes(filter.toLowerCase()) ||
      n.subject.toLowerCase().includes(filter.toLowerCase());
    return matchSubject && matchSearch;
  });

  const grid = document.getElementById('notesGrid');
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--sub)">ยังไม่มีโน้ต</div>`;
    return;
  }

  grid.innerHTML = filtered.map((n) => `
    <div class="note-card" onclick="openNoteDetail(${notes.indexOf(n)})">
      <div class="note-card-header">
        <div class="note-subject-icon" style="background:${n.color}22">${n.icon || '📄'}</div>
        <button class="note-fav-btn ${n.fav ? 'active' : ''}"
          onclick="event.stopPropagation(); toggleNoteFav(${notes.indexOf(n)})">★</button>
      </div>
      <div class="note-title">${n.title}</div>
      <div class="note-subject" style="color:${n.color}">${n.subject}</div>
      <div class="note-excerpt">${n.excerpt}</div>
      <div class="note-footer">
        <div>${(n.tags||[]).map(t => `<span class="note-tag">${t}</span>`).join('')}</div>
        <span class="note-date">${n.date}</span>
      </div>
    </div>
  `).join('');

  document.getElementById('noteCountTotal').textContent = notes.length;
  document.getElementById('noteCountFav').textContent   = notes.filter(n => n.fav).length;
}

function buildNotesFilterTabs() {
  const bar = document.getElementById('notesFilterTabs');
  if (!bar) return;
  const uniqueSubjects = [...new Set(notes.map(n => n.subject))];
  bar.innerHTML = `
    <button class="tab-pill ${activeNoteSubject === 'all' ? 'active' : ''}"
      onclick="setNoteSubject('all', this)">All Notes</button>
    ${uniqueSubjects.map(s => `
      <button class="tab-pill ${activeNoteSubject === s ? 'active' : ''}"
        onclick="setNoteSubject('${s}', this)">${s}</button>
    `).join('')}
  `;
}

function setNoteSubject(s, el) {
  activeNoteSubject = s;
  document.querySelectorAll('#notesFilterTabs .tab-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  buildNotes(document.getElementById('noteSearchInput')?.value || '');
}

function filterNotes(v) { buildNotes(v); }

function toggleNoteFav(i) {
  notes[i].fav = !notes[i].fav;
  buildNotes();
}

function openNoteDetail(i) {
  const n = notes[i];
  activeNoteId = i;
  document.getElementById('detailCourse').textContent  = n.subject;
  document.getElementById('detailCourse').style.color  = n.color;
  document.getElementById('detailTitle').textContent   = n.title;
  document.getElementById('detailMeta').textContent    = `Last edited: ${n.date}`;
  document.getElementById('detailPinBtn').textContent  = n.fav ? '📌' : '🔖';
  document.getElementById('detailContent').innerHTML   = renderNoteContent(n.body || n.excerpt || '');
  document.getElementById('noteDetailPanel').classList.add('open');
}

function closeNoteDetail() {
  document.getElementById('noteDetailPanel').classList.remove('open');
  activeNoteId = null;
}

function toggleDetailPin() {
  if (activeNoteId === null) return;
  notes[activeNoteId].fav = !notes[activeNoteId].fav;
  document.getElementById('detailPinBtn').textContent = notes[activeNoteId].fav ? '📌' : '🔖';
  buildNotes();
}

function renderNoteContent(text) {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => `
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">${lang || 'code'}</span>
          <button class="copy-btn" onclick="copyCode(this)">📋</button>
        </div>
        <pre><code>${escapeHtml(code.trim())}</code></pre>
      </div>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.+)/gm, '<div class="note-h2">$1</div>')
    .replace(/^- (.+)/gm, '<div class="note-li">• $1</div>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function copyCode(btn) {
  navigator.clipboard.writeText(btn.closest('.code-block').querySelector('code').textContent);
  btn.textContent = '✓';
  setTimeout(() => btn.textContent = '📋', 1500);
}

function saveQuickNote() {
  const el = document.getElementById('quickNoteInput');
  if (!el || !el.value.trim()) return;
  notes.unshift({
    subject: '⚡ Quick', color: '#94A3B8', icon: '⚡',
    title: 'Quick Note', excerpt: el.value.trim(),
    body: el.value.trim(), tags: ['quick'], date: 'วันนี้', fav: false
  });
  el.value = '';
  buildNotes();
}

function createNote() {
  const title = prompt('ชื่อ Note:');
  if (!title) return;
  notes.unshift({
    subject: '📝 Note', color: '#94A3B8', icon: '📝',
    title, excerpt: 'คลิกเพื่อแก้ไข...', body: '',
    tags: ['New'], date: 'วันนี้', fav: false
  });
  buildNotes();
}

buildNotes();

// ─── CHARTS ──────────────────────────────────────────────
let chartsInit=false;
function initCharts(){
  if(chartsInit)return;chartsInit=true;
  const gridOpts={color:'rgba(255,255,255,0.05)'};
  const tickOpts={color:'#94A3B8',font:{family:'Inter',size:11}};
  const tooltipStyle={backgroundColor:'rgba(15,17,25,0.95)',borderColor:'rgba(255,255,255,0.12)',borderWidth:1,titleColor:'#fff',bodyColor:'#94A3B8',padding:10,cornerRadius:10,titleFont:{family:'Inter',weight:'700'},bodyFont:{family:'Inter'}};

  new Chart(document.getElementById('weeklyChart'),{type:'bar',data:{
    labels:['จ','อ','พ','พฤ','ศ','ส','อา'],
    datasets:[{label:'ชั่วโมง',data:[3.5,2,4,3,4.5,2.5,3],backgroundColor:ctx=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,200);g.addColorStop(0,'rgba(91,140,255,0.8)');g.addColorStop(1,'rgba(139,92,246,0.3)');return g},borderRadius:8,borderSkipped:false}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tooltipStyle},scales:{x:{grid:{display:false},ticks:tickOpts},y:{grid:gridOpts,ticks:{...tickOpts,callback:v=>v+'h'},border:{display:false}}}}});

  new Chart(document.getElementById('subjectChart'),{type:'doughnut',data:{
    labels:subjects.map(s=>s.icon+' '+s.name.split(' ')[0]),
    datasets:[{data:subjects.map(s=>s.progress),backgroundColor:subjects.map(s=>s.color+'CC'),borderColor:'transparent',borderWidth:0,hoverOffset:8}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#94A3B8',font:{family:'Inter',size:11},padding:12,boxWidth:12,borderRadius:4}},tooltip:tooltipStyle},cutout:'65%'}});

  new Chart(document.getElementById('monthlyChart'),{type:'line',data:{
    labels:['มี.ค.','เม.ย.','พ.ค.','มิ.ย.'],
    datasets:[{label:'ชั่วโมง/เดือน',data:[38,52,46,62],borderColor:'#5B8CFF',backgroundColor:'rgba(91,140,255,0.1)',fill:true,tension:0.4,pointBackgroundColor:'#5B8CFF',pointBorderColor:'transparent',pointRadius:5,pointHoverRadius:7}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tooltipStyle},scales:{x:{grid:{display:false},ticks:tickOpts},y:{grid:gridOpts,ticks:tickOpts,border:{display:false}}}}});

  const streakData=Array.from({length:28},()=>Math.random()>0.15?Math.floor(Math.random()*4+1):0);
  const streakLabels=streakData.map((_,i)=>{const d=new Date();d.setDate(d.getDate()-27+i);return d.getDate()+'';});
  new Chart(document.getElementById('streakChart'),{type:'bar',data:{
    labels:streakLabels,
    datasets:[{label:'ชั่วโมง',data:streakData,backgroundColor:streakData.map(v=>v===0?'rgba(255,255,255,0.05)':v>=3?'rgba(34,197,94,0.8)':v>=2?'rgba(91,140,255,0.7)':'rgba(91,140,255,0.35)'),borderRadius:4,borderSkipped:false}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tooltipStyle},scales:{x:{grid:{display:false},ticks:{...tickOpts,maxTicksLimit:14}},y:{display:false}}}});
}

// ─── POMODORO TIMER ──────────────────────────────────────
let timerSeconds=25*60,timerRunning=false,timerInterval=null;
let pomoCurrent=0,pomoTotal=4,pomoPhase='work';
const totalWork=25*60,totalBreak=5*60;

function updateTimerDisplay(){
  const m=Math.floor(timerSeconds/60),s=timerSeconds%60;
  document.getElementById('timerDisplay').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const total=pomoPhase==='work'?totalWork:totalBreak;
  document.getElementById('timerProg').style.width=((total-timerSeconds)/total)*100+'%';
}
function toggleTimer(){
  if(timerRunning){
    clearInterval(timerInterval);timerRunning=false;
    document.getElementById('timerStartBtn').textContent='▶ ต่อ';
  }else{
    timerRunning=true;
    document.getElementById('timerStartBtn').textContent='⏸ หยุด';
    timerInterval=setInterval(()=>{
      timerSeconds--;updateTimerDisplay();
      if(timerSeconds<=0){
        clearInterval(timerInterval);timerRunning=false;
        if(pomoPhase==='work'){
          pomoCurrent++;updatePomoDots();
          if(pomoCurrent>=pomoTotal){pomoCurrent=0;alert('🎉 ครบ 4 Pomodoro! พัก 15 นาที');}
          else{pomoPhase='break';timerSeconds=totalBreak;document.getElementById('focusInfo').textContent='☕ พัก 5 นาที · Pomodoro '+(pomoCurrent+1)+' จาก 4';}
        }else{
          pomoPhase='work';timerSeconds=totalWork;
          document.getElementById('focusInfo').textContent='Pomodoro '+(pomoCurrent+1)+' จาก 4 · พัก 5 นาทีหลังเสร็จ';
        }
        updateTimerDisplay();
        document.getElementById('timerStartBtn').textContent='▶ เริ่ม';
      }
    },1000);
  }
}
function resetTimer(){
  clearInterval(timerInterval);timerRunning=false;
  pomoCurrent=0;pomoPhase='work';timerSeconds=totalWork;
  updateTimerDisplay();updatePomoDots();
  document.getElementById('timerStartBtn').textContent='▶ เริ่ม';
  document.getElementById('focusInfo').textContent='Pomodoro 1 จาก 4 · พัก 5 นาทีหลังเสร็จ';
}
function updatePomoDots(){
  document.querySelectorAll('#pomoDots .pomo-dot').forEach((d,i)=>{
    d.classList.remove('done','active');
    if(i<pomoCurrent)d.classList.add('done');
    else if(i===pomoCurrent)d.classList.add('active');
  });
}
document.getElementById('focusSubjectSelect').addEventListener('change',function(){
  document.getElementById('focusSubjectName').textContent=this.value;
});
updateTimerDisplay();

// ─── ANIMATE PROGRESS BARS ───────────────────────────────
setTimeout(()=>{
  document.querySelectorAll('.subject-prog-fill').forEach(el=>{
    const w=el.style.width;el.style.width='0%';
    setTimeout(()=>el.style.transition='width 1.2s cubic-bezier(.4,0,.2,1)',50);
    setTimeout(()=>el.style.width=w,100);
  });
},200);

function showSubject(code){

  const subject = subjects.find(
    s => s.code === code
  );

  if(!subject) return;

  document.getElementById('subjectDetail').innerHTML = `

    <h2>${subject.icon} ${subject.name}</h2>

    <p style="color:var(--sub)">
      ${subject.code}
    </p>

    <div class="subject-progress">
      ${subject.progress}%
    </div>

    <div class="subject-meta">

      <div class="subject-meta-item">
        <span>เรียนแล้ว</span>
        <strong>${subject.hours} ชม.</strong>
      </div>

      <div class="subject-meta-item">
        <span>อ่านล่าสุด</span>
        <strong>${subject.lastReview}</strong>
      </div>

      <div class="subject-meta-item">
        <span>ความคืบหน้า</span>
        <strong>${subject.progress}%</strong>
      </div>

    </div>

  `;
}