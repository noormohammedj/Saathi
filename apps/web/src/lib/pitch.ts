export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE}${path}`;

/** Profiles shown in the animated hero deck (sample data, contacts never shown). */
export const HERO_PROFILES = [
  { name: "Rupika", role: "Yoga coach · since 2000", match: 88, photo: "/people/rupika.jpg", gradient: ["#D9577E", "#E8761C"], skills: ["Yoga", "Digital outreach"], reason: "Gita Jayanti needs you both" },
  { name: "Govind Raman", role: "Mridanga player · since 2015", match: 84, gradient: ["#E8761C", "#C9952B"], skills: ["Kirtan", "Teaching"], reason: "Sunday feast kirtan band" },
  { name: "Hari Prasad", role: "Bhagavad Gita coach · since 2009", match: 80, gradient: ["#C9952B", "#B85410"], skills: ["Gita", "Storytelling"], reason: "700-verse recitation lead" },
  { name: "Meera Subramaniam", role: "Rangoli artist · since 2018", match: 76, gradient: ["#D9577E", "#7B4BA8"], skills: ["Art", "Décor"], reason: "Festival kolam crew" },
  { name: "Lalitha Devi", role: "Storyteller · since 2012", match: 74, gradient: ["#0B6B78", "#D9577E"], skills: ["Stories", "Kids"], reason: "Folk kids' story corner" },
  { name: "Priya Natarajan", role: "Govinda's kitchen · since 2016", match: 72, gradient: ["#E8761C", "#D9577E"], skills: ["Cooking", "Logistics"], reason: "Annadaan Saturday" },
];

export const SCREENS = [
  { file: "00-welcome", title: "Welcome", text: "A warm, devotional first impression that explains the three promises: find Saathis, offer seva, grow in bhakti." },
  { file: "01-skills", title: "Pick your seva skills", text: "15 skills from App & Tech to Prasadam cooking. No special skill? Chanting & Japa is a first-class choice." },
  { file: "02-discover", title: "Skill-matched Saathis", text: "Swipe right to connect, left for later, up to invite to seva. Every card explains its seva-match score." },
  { file: "04-match", title: "It's a Saathi match", text: "When both connect, the app shows which upcoming festival needs them together and offers to form a seva team." },
  { file: "05-team-chat", title: "Seva team chat", text: "In-app chat only. Mobile numbers and emails are never shared; temple coordinators are notified when teams form." },
  { file: "06-sadhana", title: "Daily sadhana", text: "108-bead japa counter, streaks, 30-day bonus, Gita and lecture tracking, and today's arati schedule." },
  { file: "07-seva", title: "Offer your seva", text: "Featured festivals, roles that need your skills, credits per role and every upcoming programme." },
  { file: "08-event", title: "Festival roles", text: "Each event lists roles by skill with live staffing. Volunteer in one tap or form a team with matched devotees." },
  { file: "09-donate", title: "Donate & sevas", text: "Annadaan, Kovai Chandra temple, Gau Seva, Vidya Daan and Vaishnav Bhojan, with the temple's real tiers." },
  { file: "10-annadaan", title: "Choose an offering", text: "Exact amounts from iskconcoimbatore.com. Production adds UPI and automatic 80G receipts." },
  { file: "11-sangha", title: "Micro-communities", text: "Circles like Japa Sunrise Club, Kirtan Mandali and Seva Tech Guild, plus find-a-devotee-by-skill." },
  { file: "12-rewards", title: "Credits & rewards", text: "Redeem for laddu prasadam, Govinda's thali, archana, Gita books and priority festival darshan passes." },
  { file: "13-me", title: "Profile & privacy", text: "Your skills, streak and credits. Contacts are visible to temple admins only." },
  { file: "14-admin", title: "Temple console", text: "Active devotees, check-ins, seva hours, the visitor-to-devotee funnel and festival staffing at a glance." },
  { file: "15-admin-contacts", title: "Admin-only contacts", text: "Only admins see contact details (masked in this public demo); production enforces this in the database." },
];

export const PROBLEM_MAP = [
  { ask: "Visitors come and go – how do we make them visit regularly?", answer: "Geo + QR temple check-in, daily streaks with a 30-day bonus, and reminders before aratis and programmes." },
  { ask: "Help them adopt the bhakti process", answer: "A 108-bead japa counter, Gita chapter tracker, lecture hearing log and a five-week sadhana heatmap." },
  { ask: "Let them offer services based on their skills", answer: "Skill profiles, festival roles tagged by skill, and a 'needs your skills' feed for every devotee." },
  { ask: "Visitors can club together for meaningful seva", answer: "Swipe-to-connect matching, seva teams with group chat, and circles as micro-communities." },
  { ask: "Credits for visits, programmes, Gita, lectures and seva", answer: "An auditable credit ledger with configurable rules and daily caps, verified by geo, QR or a coordinator." },
  { ask: "Redeem for gifts, prasadam, priority passes, archana", answer: "A rewards catalogue that issues a code to show at the temple counter." },
];

export const FEATURES = [
  { title: "Skill-based Saathi matching", text: "A seva-match score weighs complementary skills for open festival roles, shared circles, availability, language and sadhana streak." },
  { title: "Swipe, connect, invite", text: "Right to connect, left for later, up to send a seva invite. Mutual connections get 24 hours to send the first Hare Krishna." },
  { title: "Seva teams", text: "Form a team for any event in one tap; a group chat opens and coordinators are notified." },
  { title: "Private in-app chat", text: "Devotees never see each other's phone numbers or emails. Messages are moderated by the temple." },
  { title: "Festival & programme roles", text: "Every event lists roles by skill with live staffing, credits per role and one-tap volunteering." },
  { title: "Daily sadhana tracker", text: "Japa counter (108 beads × 16 rounds), Gita chapters, lectures and temple visits build streaks." },
  { title: "Verified temple check-in", text: "Location within 150 m of the mandir plus a rotating QR at the entrance stops credits from home." },
  { title: "Credits & rewards", text: "Earn for visits, programmes, japa, Gita, lectures and verified seva. Redeem for prasadam, archana and passes." },
  { title: "Donations & sevas", text: "Annadaan, Kovai Chandra, Gau Seva, Vidya Daan and Vaishnav Bhojan with the temple's real tiers and 80G receipts." },
  { title: "Circles", text: "Micro-communities by skill or practice – Japa Sunrise Club, Kirtan Mandali, Gita Circle, Seva Tech Guild." },
  { title: "No-skill seva paths", text: "Chanting, serving, welcoming and kitchen roles at every event so every visitor has a place." },
  { title: "Temple admin console", text: "Member directory with admin-only contacts, engagement funnel, festival staffing, redemptions and credit rules." },
];

export const BENEFITS = {
  devotees: [
    "Find people who complete their skills and serve together, not alone",
    "A simple daily practice with visible progress and streaks",
    "Meaningful recognition: prasadam, archana and festival priority",
    "Privacy by design – contact details stay with the temple",
  ],
  temple: [
    "Turns one-time visitors into weekly regulars, measured on a funnel",
    "Festivals staffed by skill weeks in advance, not on the day",
    "A living directory of skills across the Coimbatore community",
    "More regular, transparent donations with automatic 80G receipts",
  ],
};

export const PHASES = [
  { phase: "Phase 0", name: "Discovery & approvals", start: "2026-11-16", end: "2026-11-28", items: ["Workshop with ISKCON Coimbatore: credit rules, rewards, admin roles", "Start Apple organisation enrolment (D-U-N-S), Google Play, SMS DLT and WhatsApp Business verification", "Brief and onboard the UI/UX designer"] },
  { phase: "Phase 1", name: "Design", start: "2026-11-23", end: "2026-12-18", items: ["~25 app screens + admin console in the Saathi design language", "Brand kit, icon, store listing artwork", "Usability test with 5 devotees"] },
  { phase: "Quick win", name: "Gita Jayanti showcase", start: "2026-12-20", end: "2026-12-20", items: ["Kiosk demo of the prototype at the festival", "Collect volunteer pre-registrations with skills"] },
  { phase: "Phase 2", name: "MVP build", start: "2026-12-07", end: "2027-01-29", items: ["Phone OTP sign-in, profiles & skills, Saathi matching, chat", "Events & seva roles, sadhana tracker, geo + QR check-in", "Credits ledger, rewards with counter codes, admin console", "Donations link to the temple's existing donation page"] },
  { phase: "Phase 3", name: "Closed beta", start: "2027-02-01", end: "2027-02-28", items: ["50 core volunteers on TestFlight and Play internal testing", "Fix, tune credit rules, App Store & Play Store review"] },
  { phase: "Phase 4", name: "Public launch v1.0", start: "2027-03-08", end: "2027-03-22", items: ["Launch around Gaura Purnima, March 2027 (exact date to be confirmed with the temple calendar)", "Announcement at the Sunday Love Feast and on WhatsApp"] },
  { phase: "Phase 5", name: "v1.5", start: "2027-04-01", end: "2027-06-30", items: ["WhatsApp reminders and festival broadcasts", "In-app UPI donations with automatic 80G receipts", "Tamil language, circle group chats, leaderboards"] },
  { phase: "Phase 6", name: "v2 & expansion", start: "2027-07-01", end: "2027-12-31", items: ["Janmashtami priority passes, lecture audio library", "Bhakti Vriksha & youth (Spark, Vrinda, Folk) groups", "Onboard other ISKCON centres on the same platform"] },
];

export const MVP_SCOPE = {
  in: ["Phone OTP sign-in", "Profiles with skills & photo", "Saathi matching (swipe, connect, invite)", "1:1 and team chat", "Events, roles and volunteering", "Japa, Gita, lecture tracking", "Geo + QR temple check-in", "Credits ledger & rewards with counter codes", "Admin console: members, contacts, events, redemptions"],
  later: ["In-app UPI donations & 80G automation (v1.5)", "WhatsApp notifications (v1.5)", "Tamil / Hindi (v1.5)", "Audio lecture library (v2)", "Multi-temple rollout (v2)"],
};

export const LIMITATIONS = [
  "Uses sample data on the device – there is no live server yet, so devotees on different phones don't see each other.",
  "Chat replies are simulated to show the experience.",
  "Temple check-in simulates location; production uses GPS + a rotating QR code at the entrance.",
  "No payments are taken; donation tiers are real but the UPI step is a placeholder.",
  "Admin mode is a switch for the demo; production grants the role on the server.",
  "Contact details are masked in this public demo.",
  "Festival dates and role counts are samples to be confirmed with the temple calendar.",
  "The web version runs the same code as the phone app, but haptics and some native polish only appear on a real device.",
];

export const GROWTH = [
  { title: "Coimbatore first", text: "Pilot with 50 core volunteers, then the whole Sunday feast community. Prove the visitor-to-regular funnel." },
  { title: "Every programme", text: "Bhakti Vriksha groups, youth programmes (Spark, Vrinda, Folk) and Gita Life for corporates run their circles in Saathi." },
  { title: "Languages", text: "Tamil and Hindi so every devotee, including elders, can take part." },
  { title: "Smarter matching", text: "AI suggestions for teams and mentors – pairing new devotees with experienced Saathis." },
  { title: "Other ISKCON centres", text: "The platform is multi-temple from day one: each centre adds its own sevas, rewards and credit rules." },
  { title: "Sustainable", text: "Running costs stay low and can be covered by a tiny share of the extra donations it brings in." },
];

export const COSTS_ONE_TIME = [
  { item: "UI/UX designer (freelance, ~4 weeks: app + admin console)", cost: "₹1,50,000 – ₹3,00,000", note: "Agencies quote ₹3L–₹10L for an MVP" },
  { item: "Brand & illustration pack (optional)", cost: "₹25,000 – ₹50,000", note: "Icon, splash, store artwork" },
  { item: "Google Play developer registration", cost: "≈ ₹2,200", note: "$25 one-time" },
  { item: "SMS DLT entity registration (TRAI)", cost: "≈ ₹6,000", note: "Needed to send OTP SMS in India" },
  { item: "Entrance QR check-in kiosk (tablet + stand)", cost: "₹12,000 – ₹20,000", note: "Shows the rotating QR code" },
  { item: "Privacy policy & DPDP Act review", cost: "₹10,000 – ₹25,000", note: "Personal data of devotees" },
  { item: "Contingency", cost: "10%", note: "" },
];

export const COSTS_YEARLY = [
  { item: "Apple Developer Program (organisation)", cost: "≈ ₹8,700 / year", note: "$99; needs a free D-U-N-S number" },
  { item: "Domain (or free subdomain of iskconcoimbatore.com)", cost: "₹0 – ₹1,500 / year", note: "" },
];

export const COSTS_MONTHLY = [
  { item: "Supabase Pro (database, auth, chat, storage)", cost: "≈ ₹3,500", note: "$25 + small compute" },
  { item: "Admin console hosting", cost: "₹0 – ₹1,800", note: "Free tier or Vercel Pro $20" },
  { item: "Expo EAS builds (only while shipping)", cost: "₹0 – ₹1,700", note: "Starter $19" },
  { item: "SMS OTP (~3,000 / month)", cost: "≈ ₹600", note: "₹0.15–0.25 per SMS" },
  { item: "WhatsApp Business messages", cost: "≈ ₹8,700 + GST", note: "16k reminders @ ₹0.115 + 8k broadcasts @ ₹0.8631" },
  { item: "WhatsApp provider (BSP) fee", cost: "₹0 – ₹2,500", note: "₹0 using Meta Cloud API directly" },
  { item: "AI chat moderation (optional)", cost: "₹500 – ₹1,300", note: "Flags shared phone numbers & abuse" },
  { item: "Push notifications, email, crash reports, maps", cost: "₹0", note: "Free tiers" },
  { item: "Payment gateway (v1.5 donations)", cost: "2% + GST per donation", note: "Razorpay standard" },
];

export const SOURCES = [
  { label: "WhatsApp Business API pricing India 2026", href: "https://dev.to/xreach51/whatsapp-business-api-pricing-in-india-2026-every-layer-of-the-bill-12i7" },
  { label: "WhatsApp India rates (chatmaxima)", href: "https://chatmaxima.com/whatsapp-api-pricing/india/" },
  { label: "MSG91 pricing", href: "https://getpulsesignal.com/pricing/msg91" },
  { label: "Supabase pricing 2026", href: "https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/" },
  { label: "Expo pricing", href: "https://expo.dev/pricing" },
  { label: "UI/UX design cost in India", href: "https://www.aufaitux.com/blog/ui-ux-design-cost-in-india/" },
  { label: "Apple developer fee", href: "https://magora-systems.com/apple-developer-fee/" },
  { label: "Razorpay pricing", href: "https://razorpay.com/blog/cheapest-payment-gateway-for-businesses-in-india/" },
  { label: "ISKCON Coimbatore donations", href: "https://www.iskconcoimbatore.com/donate" },
];
