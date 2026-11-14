# Saathi pitch: working notes (to finish the web pitch page)

## Status
- Pitch site: `apps/web` (Next.js static export, `basePath: '/Saathi'`).
- Live app: the Expo web export of `apps/mobile`, served at `/Saathi/app/`.
- Walkthrough video: `media/saathi-walkthrough.mp4`, built by `scripts/video/make-video.sh`.
- Build the full GitHub Pages site with `scripts/build-pages.sh`; the output goes to `pages-dist/`.
- Contact details are masked in the source because the repository and the site are public.

## Proposed delivery plan (today: Sat 14 Nov 2026)
| Phase | Dates | Output |
|---|---|---|
| 0 Discovery and approvals | 16–28 Nov 2026 | Workshop with ISKCON Coimbatore; agree credit rules and rewards. Start Apple org enrolment (needs a D-U-N-S number, which can take 2–4 weeks), Google Play, DLT, WhatsApp Business verification. |
| 1 Design | 23 Nov – 18 Dec 2026 | Designer delivers about 25 app screens, the admin console and the brand kit. |
| Quick win | 20 Dec 2026 (Gita Jayanti) | Kiosk demo of the web prototype plus volunteer pre-registration. |
| 2 MVP build | 7 Dec 2026 – 29 Jan 2027 | Phone OTP sign-in, profiles and skills, connect and match, chat, events and volunteering, sadhana (japa, Gita, QR + geo check-in), credits and redemption codes, admin console. Donations link to the existing temple donation page. |
| 3 Closed beta | 1–28 Feb 2027 | About 50 core volunteers on TestFlight and Play internal testing; store review in parallel. |
| 4 Public launch v1.0 | Target Gaura Purnima, March 2027 (confirm the exact date) | App Store and Play Store release. |
| 5 v1.5 | Apr–Jun 2027 | WhatsApp reminders, in-app donations (Razorpay with 80G receipts), Tamil, circle group chats. |
| 6 v2 | Jul–Dec 2027 | Janmashtami passes, lecture audio library, Bhakti Vriksha groups, rollout to other ISKCON centres. |

## Costs (researched Nov 2026, assumes 1 USD ≈ ₹88)
Noor contributes all development free of charge. Funding is needed only for system requirements and the designer.

**One-time**

| Item | Cost |
|---|---|
| UI/UX designer (freelance, about 4 weeks) | ₹1.5L–3L (agencies quote ₹3L–10L for an MVP) |
| Brand and illustration pack (optional) | ₹25k–50k |
| Google Play registration ($25) | ≈ ₹2,200 |
| DLT SMS entity registration | ≈ ₹6k |
| Entrance QR kiosk tablet + stand | ₹12k–20k |
| Privacy policy / DPDP legal review | ₹10k–25k |
| Contingency | 10% |

**Yearly**

| Item | Cost |
|---|---|
| Apple Developer Program ($99/yr) | ≈ ₹8,700 |
| Domain (or a free subdomain of iskconcoimbatore.com) | ≈ ₹1–1.5k |

**Monthly, at pilot scale (about 2,000 devotees)**

| Item | Cost |
|---|---|
| Supabase Pro ($25 + compute) | ≈ ₹3.5k |
| Admin console hosting (Vercel Pro $20, or free tier) | ₹0–1.8k |
| Expo EAS Starter ($19, only while shipping) | ₹0–1.7k |
| SMS OTP (₹0.15–0.25/SMS; about 3k/mo) | ≈ ₹600 |
| WhatsApp, Meta rates before 18% GST | see below |
| WhatsApp BSP platform fee (₹0 if using Meta Cloud API directly) | ₹0–2.5k |
| Expo push notifications, email (free tier), Sentry (free tier), location | ₹0 |
| AI chat moderation (optional) | ≈ ₹500–1.3k |
| Razorpay (when in-app donations launch) | 2% + GST per transaction |

WhatsApp rates: utility ₹0.115 and marketing ₹0.8631 per message. Example: 16k reminders + 8k festival broadcasts ≈ ₹8.7k, plus GST.

**Estimated totals:** about ₹2–3.9L one-time, and about ₹8k–20k a month to run.

Sources: dev.to and chatmaxima.com (WhatsApp India 2026), getpulsesignal.com (MSG91), jetadmin.io and toolradar.com (Supabase), expo.dev/pricing, aufaitux.com and freelanceratesindia (design), magora-systems.com (store fees), razorpay.com/blog, temps.sh (Vercel).
