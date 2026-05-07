document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');

            // Update Sidebar UI
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Switch Pages
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                }
            });

            const badge = document.getElementById(`badge-${targetPage}`);
            if (badge && badge.style.display !== 'none') {
                badge.style.display = 'none';
                
                // Hide all guide sections first
                ['directory', 'records', 'messages'].forEach(g => {
                    const el = document.getElementById(`modal-guide-${g}`);
                    if (el) el.style.display = 'none';
                });
                
                // Show the specific feature guide
                const specificGuide = document.getElementById(`modal-guide-${targetPage}`);
                if (specificGuide) {
                    specificGuide.style.display = 'block';
                    
                    // Reset checkbox and button
                    document.getElementById('quick-guide-checkbox').checked = false;
                    document.getElementById('quick-guide-close-btn').disabled = true;
                    
                    // Hide acknowledgement until last slide
                    const quickAck = document.getElementById('quick-guide-acknowledgement');
                    if (quickAck) quickAck.style.display = 'none';
                    
                    document.getElementById('quick-guide-modal').style.display = 'flex';
                    
                    // Initialize carousel for this specific feature guide
                    showSlides(0, `modal-guide-${targetPage}`);
                }
            }

            console.log(`Navigated to: ${targetPage}`);
        });
    });
});

const newMsgBtn = document.getElementById('new-msg-btn');
const modal = document.getElementById('compose-modal');
const cancelBtn = document.getElementById('cancel-btn');
const sendBtn = document.getElementById('send-btn');
const messageList = document.getElementById('message-list');
const emptyNote = document.getElementById('empty-note');

// Open modal
newMsgBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal
cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    clearForm();
});

// Send message
sendBtn.addEventListener('click', () => {
    const to = document.getElementById('msg-to').value.trim();
    const subject = document.getElementById('msg-subject').value.trim();
    const body = document.getElementById('msg-body').value.trim();

    if (!to || !subject || !body) {
        alert('Please fill in all fields.');
        return;
    }

    // Build message card
    const now = new Date().toLocaleString();
    const card = document.createElement('div');
    card.className = 'message-card';
    card.innerHTML = `
        <div class="meta">To: ${to} &nbsp;·&nbsp; ${now}</div>
        <div class="subject">${subject}</div>
        <div class="preview">${body}</div>
    `;

    messageList.prepend(card);
    emptyNote.style.display = 'none'; // Hide empty state
    modal.style.display = 'none';
    clearForm();
});

function clearForm() {
    document.getElementById('msg-to').value = '';
    document.getElementById('msg-subject').value = '';
    document.getElementById('msg-body').value = '';
}


const addRecordBtn = document.getElementById('add-record-btn');
const recordModal = document.getElementById('record-modal');
const recCancel = document.getElementById('rec-cancel');
const recSave = document.getElementById('rec-save');
const recordsTbody = document.querySelector('#records .data-table tbody');

// Open modal
addRecordBtn.addEventListener('click', () => {
    recordModal.style.display = 'flex';
});

// Close modal
recCancel.addEventListener('click', () => {
    recordModal.style.display = 'none';
    clearRecordForm();
});

// Save record
recSave.addEventListener('click', () => {
    const patientId = document.getElementById('rec-patient-id').value.trim();
    const date     = document.getElementById('rec-date').value;
    const hour = document.getElementById('rec-hour').value;
    const type     = document.getElementById('rec-type').value;
    const notes     = document.getElementById('rec-notes').value.trim();

    if (!patientId || !date || !type || !hour) {
        alert('Please fill in all fields.');
        return;
    }

    const [y, m, d] = date.split('-');
    const formatted = `${d}/${m}/${y}`;
    const [h, min, s] = hour.split(':')
    const hourFormatted = `${h}:${min}`;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatted}</td>
        <td>${hourFormatted}</td>
        <td>${patientId}</td>
        <td>${type}</td>
        <td>You</td>
        <td><button class="btn-sm">View</button></td>
    `;

   const recordsTbody = document.getElementById('records-tbody');

    if (!recordsTbody) {
        console.error('Table body not found — make sure #records section is visible in the DOM.');
        return;
    }

    recordsTbody.prepend(row);

    recordModal.style.display = 'none';
    clearRecordForm();
});

function clearRecordForm() {
    document.getElementById('rec-patient-id').value = '';
    document.getElementById('rec-date').value = '';
    document.getElementById('rec-type').value = '';
    document.getElementById('rec-notes').value = '';
}

function toggleChat() {
        const chatWindow = document.getElementById("chatbot");
        if (chatWindow.style.display !== "flex") {
            chatWindow.style.display = "flex";
        } else {
            chatWindow.style.display = "none";
        }
    }

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Close sidebar if user clicks outside of it on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.menu-toggle');
    toggleBtn.style.display = "none";
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove('open');
            toggleBtn.style.display = "block";
        }
    }
});

// --- Login & What's New Carousel ---
function handleLogin() {
    // Hide login screen
    document.getElementById('login-screen').style.display = 'none';
    
    // Reset popup constraints
    document.getElementById('read-checkbox').checked = false;
    document.getElementById('continue-btn').disabled = true;
    document.getElementById('read-acknowledgement').style.display = 'none';

    // Show What's New modal
    document.getElementById('whats-new-modal').style.display = 'flex';
    showSlides(0); // Initialize carousel on first slide
}

function closeWhatsNew() {
    document.getElementById('whats-new-modal').style.display = 'none';
}

let slideIndexMap = {};
let activeCarouselId = 'whats-new-modal';

function moveSlide(n) {
    let currentIndex = slideIndexMap[activeCarouselId] || 0;
    showSlides(currentIndex + n, activeCarouselId);
}

function setSlide(n) {
    showSlides(n, activeCarouselId);
}

function showSlides(n, carouselId = 'whats-new-modal') {
    activeCarouselId = carouselId;
    if (slideIndexMap[carouselId] === undefined) {
        slideIndexMap[carouselId] = 0;
    }
    
    const container = document.getElementById(carouselId);
    if (!container) return;

    const slides = container.getElementsByClassName("slide");
    const dots = container.getElementsByClassName("dot");
    
    if (slides.length === 0) return;
    
    if (n >= slides.length) { 
        slideIndexMap[carouselId] = 0; 
    } else if (n < 0) { 
        slideIndexMap[carouselId] = slides.length - 1; 
    } else {
        slideIndexMap[carouselId] = n;
    }
    
    for (let i = 0; i < slides.length; i++) { slides[i].classList.remove("active"); }
    for (let i = 0; i < dots.length; i++) { dots[i].classList.remove("active"); }
    
    slides[slideIndexMap[carouselId]].classList.add("active");  
    if (dots.length > 0 && dots[slideIndexMap[carouselId]]) {
        dots[slideIndexMap[carouselId]].classList.add("active");
    }
    
    // Require user to reach the last slide before showing the checkbox
    if (slideIndexMap[carouselId] === slides.length - 1) {
        if (carouselId === 'whats-new-modal') {
            const ack = document.getElementById('read-acknowledgement');
            if (ack) ack.style.display = 'block';
        } else {
            const ack = document.getElementById('quick-guide-acknowledgement');
            if (ack) ack.style.display = 'block';
        }
    }
}

function toggleContinueBtn() {
    const checkbox = document.getElementById('read-checkbox');
    const btn = document.getElementById('continue-btn');
    btn.disabled = !checkbox.checked;
}

function toggleQuickGuideBtn() {
    const checkbox = document.getElementById('quick-guide-checkbox');
    const btn = document.getElementById('quick-guide-close-btn');
    btn.disabled = !checkbox.checked;
}

function toggleGuideSteps(guideId) {
    const card = document.getElementById(guideId);
    if (!card) return;
    
    const stepsDiv = card.querySelector('.guide-steps');
    const btn = card.querySelector('.btn.secondary');
    if (!stepsDiv) return;
    
    if (stepsDiv.style.display !== 'block') {
        stepsDiv.style.display = 'block';
        if (btn) btn.innerText = 'Hide Steps';
    } else {
        stepsDiv.style.display = 'none';
        if (btn) btn.innerText = 'Show Steps';
    }
}

function openGuide(guideId) {
    closeWhatsNew();
    
    // Hide the specific feature badge if the user viewed its guide
    const targetPage = guideId.replace('guide-', '');
    const badge = document.getElementById(`badge-${targetPage}`);
    if (badge) badge.style.display = 'none';
    
    // Switch to the guides page by simulating a click on the navigation item
    const guidesNav = document.querySelector('[data-page="guides"]');
    if (guidesNav) guidesNav.click();
    
    // Scroll to and highlight the specific guide temporarily
    setTimeout(() => {
        const card = document.getElementById(guideId);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlight');
            setTimeout(() => card.classList.remove('highlight'), 3000); // Remove highlight after 3 seconds
            
            // Auto-expand the steps if they are hidden
            const stepsDiv = card.querySelector('.guide-steps');
            const btn = card.querySelector('.btn.secondary');
            if (stepsDiv && stepsDiv.style.display !== 'block') {
                stepsDiv.style.display = 'block';
                if (btn) btn.innerText = 'Hide Steps';
            }
        }
    }, 100);
}

const ACTIONS = {
  reports: [
    { icon: '📋', label: 'Patient report',   sub: 'Daily summary',
      msg: 'Generate a patient daily report',
      tip: { title: 'Patient report', body: "Tell me the patient's name or ID and I'll generate a complete daily summary including vitals, medications, and care notes." }},
    { icon: '🔄', label: 'Shift handover',  sub: 'End-of-shift notes',
      msg: 'Create a shift handover report',
      tip: { title: 'Shift handover', body: "Give me the ward name, critical patients, and pending tasks. I'll structure your handover notes." }},
    { icon: '📊', label: 'Ward stats',      sub: 'Occupancy & KPIs',
      msg: 'Show ward statistics',
      tip: { title: 'Ward statistics', body: 'Specify the ward and date range. I can show bed occupancy, average stay length, and admission counts.' }},
    { icon: '⚠️', label: 'Incident report', sub: 'Log an event',
      msg: 'Help me fill an incident report',
      tip: { title: 'Incident report', body: "Describe what happened and when. I'll help structure the event, actions taken, and follow-up steps." }},
  ],
  patient: [
    { icon: '🏥', label: 'Admit patient',  sub: 'New admission',
      msg: 'Start a new patient admission',
      tip: { title: 'New admission', body: "Provide the patient's name, date of birth, and reason for admission. I'll pre-fill the intake form." }},
    { icon: '📅', label: 'Schedule exam',  sub: 'Book appointment',
      msg: 'Schedule a patient examination',
      tip: { title: 'Schedule exam', body: "Tell me the exam type, preferred date, and patient ID. I'll check availability and book the slot." }},
    { icon: '📝', label: 'Care plan',      sub: 'View or update',
      msg: 'Show the care plan for a patient',
      tip: { title: 'Care plan', body: "Enter the patient ID or name. I can display the current plan or help add objectives and interventions." }},
    { icon: '🚪', label: 'Discharge',      sub: 'Discharge summary',
      msg: 'Generate a discharge summary',
      tip: { title: 'Discharge summary', body: "Give me the patient ID and I'll compile diagnosis, treatments received, medications, and follow-up instructions." }},
  ],
  meds: [
    { icon: '💊', label: 'Medication round', sub: 'Check administration',
      msg: 'Show pending medication rounds',
      tip: { title: 'Medication round', body: "Tell me the ward or patient name. I'll list all pending administrations with due times and exact doses." }},
    { icon: '🔍', label: 'Drug lookup',    sub: 'Dosage & interactions',
      msg: 'Look up a drug dosage and interactions',
      tip: { title: 'Drug lookup', body: "Enter the drug name and I'll show standard dosages, contraindications, and potential interactions." }},
    { icon: '⏰', label: 'Overdue doses',  sub: 'Alert list',
      msg: 'List overdue medication doses for my ward',
      tip: { title: 'Overdue doses', body: "Specify the ward to narrow the list. I'll pull all missed administrations and flag the most critical." }},
    { icon: '🗒️', label: 'Prescription',   sub: 'New or renew',
      msg: 'Help me write a prescription',
      tip: { title: 'Prescription', body: "Tell me the drug, patient weight if relevant, and indication. I'll draft the prescription with dosage and frequency." }},
  ],
  admin: [
    { icon: '👥', label: 'Staff schedule',   sub: 'Shifts & rota',
      msg: "Show today's staff schedule",
      tip: { title: 'Staff schedule', body: "Specify a ward or role (nurses, doctors) to filter. I can show today's rota or the full week." }},
    { icon: '🛏️', label: 'Bed availability', sub: 'Current capacity',
      msg: 'What beds are available right now?',
      tip: { title: 'Bed availability', body: "I'll show current occupancy by ward and flag beds pending cleaning or maintenance." }},
    { icon: '🧾', label: 'Billing codes',    sub: 'ICD / procedure',
      msg: 'Help me find the right billing code',
      tip: { title: 'Billing codes', body: "Describe the diagnosis or procedure and I'll suggest the matching ICD-10 or CCAM code." }},
    { icon: '📄', label: 'Protocol',         sub: 'Clinical guidelines',
      msg: 'Show the clinical protocol',
      tip: { title: 'Clinical protocol', body: "Name the procedure or condition and I'll retrieve the relevant guideline, steps, and contraindications." }},
  ],
};

function renderGrid(tab) {
  document.getElementById('q-grid').innerHTML = ACTIONS[tab].map((a, i) => `
    <button class="q-btn" id="qb-${i}" onclick="selectAction('${tab}', ${i})">
      <span style="font-size:18px">${a.icon}</span>
      <div>
        <div class="ql">${a.label}</div>
        <div class="qs">${a.sub}</div>
      </div>
    </button>
  `).join('');
}

function switchTab(tab, el) {
  document.querySelectorAll('.q-tab').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  clearTip();
  renderGrid(tab);
}

function clearTip() {
  document.getElementById('tip-bubble')?.remove();
  document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('active'));
}

function selectAction(tab, i) {
  const a = ACTIONS[tab][i];
  clearTip();
  document.getElementById(`qb-${i}`).classList.add('active');

  const chat = document.getElementById('chat');
  const tip = document.createElement('div');
  tip.className = 'bubble-tip';
  tip.id = 'tip-bubble';
  tip.innerHTML = `
    <strong>${a.tip.title}</strong>
    ${a.tip.body}
    <span class="tip-send" onclick="sendMsg('${a.msg.replace(/'/g,"\\'")}')">Send this request →</span>
  `;
  chat.appendChild(tip);
  chat.scrollTop = chat.scrollHeight;
  document.getElementById('input').value = a.msg;
}

async function sendMsg(text) {
  if (!text.trim()) return;
  clearTip();
  const chat = document.getElementById('chat');
  document.getElementById('input').value = '';

  chat.innerHTML += `<div class="msg-user">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    chat.innerHTML += `<div class="msg-bot">${data.reply}</div>`;
  } catch {
    chat.innerHTML += `<div class="msg-bot" style="color:#c0392b">Server unavailable. Please try again.</div>`;
  }
  chat.scrollTop = chat.scrollHeight;
}

function send() {
  const text = document.getElementById('input').value.trim();
  if (text) sendMsg(text);
}

renderGrid('reports');