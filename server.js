import express from "express";
const app = express();
import cors from "cors";

app.use(cors());

app.use(express.json());



// 1. Define Intents (Can be moved to a database or config file later)
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
];

app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format." });
    }

    const lowerMsg = message.toLowerCase();

    const match = INTENTS.find(intent =>
      intent.keywords.some(keyword => lowerMsg.includes(keyword))
    );

    const reply = match
      ? match.reply
      : "I'm sorry, I couldn't find a specific answer. Please contact the ZAS Support Desk at support@zas.be.";

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(3000);