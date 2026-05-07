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

const INTENTS = [
  // ── Reports ──
  {
    keywords: ["patient report", "daily report", "daily summary"],
    reply: "To generate a patient daily report, go to the 'Reports' module and select 'Daily Patient Summary'. Enter the patient ID or name and choose the date range."
  },
  {
    keywords: ["shift handover", "handover report", "end of shift"],
    reply: "For shift handover notes, open the 'Reports' module → 'Shift Handover'. Fill in the ward name, list critical patients, and add any pending tasks before submitting."
  },
  {
    keywords: ["ward stats", "ward statistics", "occupancy", "kpi"],
    reply: "Ward statistics are available in 'Reports' → 'Ward Dashboard'. You can filter by ward and date range to view bed occupancy, average length of stay, and admission/discharge counts."
  },
  {
    keywords: ["incident", "incident report", "log event", "log an event"],
    reply: "To file an incident report, go to 'Reports' → 'Incident Reporting'. Describe the event, time, persons involved, actions taken, and required follow-up steps."
  },

  // ── Patient ──
  {
    keywords: ["admit", "admission", "new patient", "register"],
    reply: "To register a new patient, navigate to the 'Admission' module and select 'Register New Patient'. You will need their full name, date of birth, and reason for admission."
  },
  {
    keywords: ["schedule exam", "book appointment", "appointment", "examination"],
    reply: "To schedule an exam, open 'Patient' → 'Appointments' and click 'New Booking'. Select the exam type, preferred date, and link it to the patient ID."
  },
  {
    keywords: ["care plan", "care objective", "intervention"],
    reply: "Care plans are managed in 'Patient' → 'Care Plan'. Search by patient ID or name to view the current plan, or click 'Add Objective' to update it."
  },
  {
    keywords: ["discharge", "discharge summary", "discharge patient"],
    reply: "To discharge a patient, go to 'Patient' → 'Discharge'. The system will compile the diagnosis, treatments, medications prescribed, and follow-up instructions automatically."
  },

  // ── Medications ──
  {
    keywords: ["medication round", "medication", "administration", "pending meds"],
    reply: "Pending medication rounds are listed in 'Meds' → 'Administration Schedule'. Filter by ward or patient to see due times and exact doses."
  },
  {
    keywords: ["drug", "dosage", "interaction", "contraindication"],
    reply: "Use the drug lookup in 'Meds' → 'Drug Reference'. Enter the drug name to view standard dosages, contraindications, and interactions with common medications."
  },
  {
    keywords: ["overdue", "missed dose", "late medication"],
    reply: "Overdue doses are flagged in 'Meds' → 'Alerts'. Select your ward to filter the list. Critical missed doses are highlighted in red."
  },
  {
    keywords: ["prescription", "prescribe", "renew prescription"],
    reply: "To write or renew a prescription, go to 'Meds' → 'Prescriptions' and click 'New Prescription'. Enter the drug name, indication, dosage, and frequency."
  },

  // ── Admin ──
  {
    keywords: ["staff schedule", "rota", "shift", "who is working"],
    reply: "The staff schedule is available in 'Admin' → 'Rota'. You can filter by ward or role (nurses, doctors) and switch between daily and weekly views."
  },
  {
    keywords: ["bed", "available bed", "bed availability", "capacity"],
    reply: "Current bed availability is shown in 'Admin' → 'Bed Management'. Beds pending cleaning or maintenance are flagged separately."
  },
  {
    keywords: ["billing", "billing code", "icd", "ccam", "procedure code"],
    reply: "To find billing codes, open 'Admin' → 'Billing Codes'. Search by diagnosis or procedure name to get the matching ICD-10 or CCAM code."
  },
  {
    keywords: ["protocol", "guideline", "clinical protocol", "procedure guideline"],
    reply: "Clinical protocols are stored in 'Admin' → 'Guidelines'. Search by condition or procedure name to retrieve the relevant steps and contraindications."
  },

  // ── IT / Access ──
  {
    keywords: ["password", "login", "access", "account"],
    reply: "Password resets must be requested via the ZAS IT Portal or by calling the internal helpdesk at ext. 555."
  },
  {
    keywords: ["medical record", "emr", "ehr", "electronic record"],
    reply: "Electronic Medical Records (EMR) can be accessed via the 'Medical Records' tab. Ensure you have the correct authorization level before accessing patient files."
  },

  // ── Updates ──
  {
    keywords: ["what's new", "new features", "latest update", "recent update", "new in"],
    reply: "To see the latest features, open 'Updates' → 'What's New'. Each release is summarised with a short description and a link to the full details."
  },
  {
    keywords: ["how to", "how do i", "walkthrough", "guide", "tutorial", "how to use"],
    reply: "Step-by-step how-to guides are available in 'Updates' → 'How-To Guides'. Search by feature name or browse by category to find the walkthrough you need."
  },
  {
    keywords: ["release notes", "changelog", "version history", "patch notes"],
    reply: "The full changelog is in 'Updates' → 'Release Notes'. Each entry lists the version number, date, new features, improvements, and bug fixes."
  },
  {
    keywords: ["tips", "shortcuts", "productivity", "tricks", "hidden features"],
    reply: "Useful tips and keyboard shortcuts are listed in 'Updates' → 'Tips & Shortcuts'. They are grouped by module so you can quickly find relevant ones for your workflow."
  },
];

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
  updates: [
    { icon: '🆕', label: "What's new",      sub: 'Latest features',
      msg: "What's new in the latest update?",
      tip: { title: "What's new", body: "I'll walk you through the most recent features and improvements added to the platform." }},
    { icon: '📖', label: 'How-to guide',    sub: 'Feature walkthroughs',
      msg: 'Show me how to use a feature',
      tip: { title: 'How-to guide', body: "Tell me which feature you'd like to learn and I'll give you a step-by-step walkthrough." }},
    { icon: '📜', label: 'Release notes',   sub: 'Full changelog',
      msg: 'Show the full release notes',
      tip: { title: 'Release notes', body: "I'll display the complete changelog with version history, bug fixes, and improvements." }},
    { icon: '💡', label: 'Tips & shortcuts', sub: 'Work faster',
      msg: 'Show me tips and shortcuts',
      tip: { title: 'Tips & shortcuts', body: "I'll share the most useful shortcuts and hidden features to help you get the most out of the platform." }},
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

function sendMsg(text) { // No longer needs to be async
  if (!text.trim()) return;
  clearTip();
  const chat = document.getElementById('chat');
  document.getElementById('input').value = '';

  chat.innerHTML += `<div class="msg-user">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
  
  // Add a "thinking" indicator
  const thinkingBubble = document.createElement('div');
  thinkingBubble.className = 'msg-bot';
  thinkingBubble.innerHTML = '...';
  chat.appendChild(thinkingBubble);
  chat.scrollTop = chat.scrollHeight;

  // Simulate a server delay and process the logic locally
  setTimeout(() => {
    const lowerMsg = text.toLowerCase();

    const match = INTENTS.find(intent =>
        intent.keywords.some(keyword => lowerMsg.includes(keyword))
    );

    const reply = match
        ? match.reply
        : "I'm sorry, I couldn't find a specific answer. Please contact the ZAS Support Desk at support@zas.be.";

    // Update the "thinking" bubble with the actual reply
    thinkingBubble.innerHTML = reply;
    chat.scrollTop = chat.scrollHeight;
  }, 600); // 600ms delay for a more realistic feel
}

function send() {
  const text = document.getElementById('input').value.trim();
  if (text) sendMsg(text);
}

renderGrid('reports');