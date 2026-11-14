import { ArrowRight, BadgeIndianRupee, Check, ExternalLink, Flame, HandHeart, HeartHandshake, MessageCircleHeart, Smartphone, Sparkles, Target, TriangleAlert, UsersRound } from "lucide-react";

import { Gantt } from "@/components/gantt";
import { HeroDeck } from "@/components/hero-deck";
import { LiveDevices } from "@/components/live-devices";
import { Mandala } from "@/components/mandala";
import {
  asset, BENEFITS, COSTS_MONTHLY, COSTS_ONE_TIME, COSTS_YEARLY, FEATURES, GROWTH, LIMITATIONS, MVP_SCOPE, PHASES, PROBLEM_MAP, SCREENS, SOURCES,
} from "@/lib/pitch";

const NAV = [
  ["Problem", "#problem"],
  ["Live prototype", "#prototype"],
  ["Video", "#video"],
  ["Features", "#features"],
  ["Plan", "#plan"],
  ["Costs", "#costs"],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-deep">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{children}</h2>;
}

function CostTable({ title, rows }: { title: string; rows: { item: string; cost: string; note: string }[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <div className="border-b border-line bg-sand px-5 py-3 text-sm font-bold text-ink">{title}</div>
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-b border-line last:border-0">
              <td className="px-5 py-3 align-top">
                <div className="font-semibold text-ink">{r.item}</div>
                {r.note && <div className="text-xs text-muted">{r.note}</div>}
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-right align-top font-bold text-saffron-deep">{r.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-x-clip">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-sand/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-saffron-deep font-display text-lg font-bold text-white">S</span>
            <span className="font-display text-2xl font-semibold">Saathi</span>
          </a>
          <div className="hidden gap-6 text-sm font-semibold text-ink-soft md:flex">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="hover:text-saffron-deep">{l}</a>
            ))}
          </div>
          <a href="#prototype" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-deep">Try it</a>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 text-saffron">
          <Mandala size={720} color="#E8761C" opacity={0.12} />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <Eyebrow>A proposal for ISKCON Coimbatore · Sri Jagannath Mandir</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Every visitor has a gift.
              <span className="block italic text-saffron-deep">Saathi finds who to offer it with.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              A mobile app that matches devotees by skill, forms seva teams for every festival, keeps a daily sadhana streak, and rewards
              visits, japa, Gita and seva with credits for prasadam, archana and priority darshan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#prototype" className="inline-flex items-center gap-2 rounded-full bg-saffron-deep px-6 py-3.5 font-semibold text-white shadow-lg shadow-saffron/30 hover:bg-ink">
                Try the live prototype <ArrowRight size={18} />
              </a>
              <a href="#video" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 font-semibold text-ink hover:bg-saffron-soft">
                Watch the 3-minute tour
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["iOS + Android", "one codebase"],
                ["Mar 2027", "target v1.0 launch"],
                ["₹0", "development fee"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-semibold text-ink">{v}</dt>
                  <dd className="text-sm text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroDeck />
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>The ask</Eyebrow>
          <H2>From occasional visitor to committed devotee</H2>
          <p className="mt-4 max-w-3xl text-lg text-ink-soft">
            ISKCON Coimbatore asked for a platform that helps visitors return regularly, adopt the bhakti process and offer their skills
            in seva, with credits they can redeem. Here is how each part of that ask is answered.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PROBLEM_MAP.map((r) => (
              <div key={r.ask} className="rounded-3xl border border-line bg-sand p-6">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 shrink-0 text-saffron-deep" size={20} />
                  <p className="font-semibold text-ink">{r.ask}</p>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <Check className="mt-0.5 shrink-0 text-tulasi" size={20} />
                  <p className="text-ink-soft">{r.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-5">
            {[
              [UsersRound, "Visit", "Check in at the mandir"],
              [Sparkles, "Connect", "Meet skill-matched Saathis"],
              [HandHeart, "Serve", "Join a seva team"],
              [Flame, "Grow", "Japa, Gita, streaks"],
              [BadgeIndianRupee, "Redeem", "Prasadam, archana, passes"],
            ].map(([Icon, t, s], i) => {
              const I = Icon as typeof Flame;
              return (
                <div key={t as string} className="relative rounded-3xl bg-ink p-5 text-white">
                  <I size={22} className="text-saffron" />
                  <div className="mt-3 font-display text-xl">{`${i + 1}. ${t}`}</div>
                  <div className="text-sm text-white/75">{s as string}</div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-sm text-muted">The loop that turns a single visit into a weekly habit.</p>
        </div>
      </section>

      {/* Prototype */}
      <section id="prototype" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <Eyebrow>Working prototype</Eyebrow>
            <H2>Try Saathi right here</H2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
              This is the real app, the same code that runs on iPhone and Android, running in your browser. Drag Rupika&apos;s card to the
              right, form a seva team, chant a round, check in at the temple, redeem a reward. Turn on admin mode from the profile picture.
            </p>
          </div>
          <div className="mt-12">
            <LiveDevices />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted">
            <Smartphone className="mr-1 inline" size={14} /> Prototype uses sample data stored in your browser. Contact details are masked in this public demo.{" "}
            <a className="font-semibold text-peacock underline" href={asset("/app/")} target="_blank" rel="noreferrer">
              Open full screen <ExternalLink className="inline" size={12} />
            </a>
          </p>
        </div>
      </section>

      {/* Video */}
      <section id="video" className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">Guided tour</p>
          <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Saathi in three minutes</h2>
          <p className="mt-3 max-w-2xl text-white/75">A narrated walkthrough of every screen, recorded from the app running on an iPhone simulator.</p>
          <video className="mt-8 aspect-video w-full rounded-3xl bg-black shadow-2xl" controls preload="metadata" poster={asset("/media/poster.jpg")}>
            <source src={asset("/media/saathi-walkthrough.mp4")} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Screens */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>App screens</Eyebrow>
          <H2>Every screen, explained</H2>
        </div>
        <div className="mt-10 flex snap-x gap-6 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          {SCREENS.map((s) => (
            <figure key={s.file} className="w-[260px] shrink-0 snap-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(`/screens/${s.file}.jpg`)} alt={s.title} loading="lazy" className="w-full rounded-[34px] border-[6px] border-[#1b1b1d] shadow-xl" />
              <figcaption className="mt-4">
                <div className="font-display text-xl font-semibold">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>Functionality</Eyebrow>
          <H2>What Saathi does</H2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="rounded-3xl border border-line bg-sand p-6">
                <div className="font-display text-lg text-saffron-deep">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 text-lg font-bold text-ink">{f.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {([
              ["For devotees", BENEFITS.devotees, HeartHandshake, "bg-lotus-soft", "text-lotus"],
              ["For the temple", BENEFITS.temple, MessageCircleHeart, "bg-peacock-soft", "text-peacock"],
            ] as const).map(([t, list, Icon, bg, fg]) => (
              <div key={t} className={`rounded-3xl p-8 ${bg}`}>
                <Icon className={fg} size={28} />
                <h3 className="mt-3 font-display text-3xl font-semibold">{t}</h3>
                <ul className="mt-4 space-y-3">
                  {list.map((b) => (
                    <li key={b} className="flex gap-3 text-ink">
                      <Check className={`mt-0.5 shrink-0 ${fg}`} size={18} /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan */}
      <section id="plan" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>Programme plan</Eyebrow>
          <H2>Phase-wise delivery, with dates</H2>
          <p className="mt-4 max-w-3xl text-lg text-ink-soft">
            Version 1.0 targets <strong>Gaura Purnima, March 2027</strong>, after a closed beta in February with 50 core volunteers.
            The prototype is shown at Gita Jayanti on 20 December 2026 to gather volunteers early.
          </p>
          <div className="mt-10">
            <Gantt />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PHASES.map((p) => (
              <div key={p.name} className="rounded-3xl border border-line bg-white p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-display text-xl font-semibold">{p.phase} · {p.name}</div>
                  <div className="whitespace-nowrap text-xs font-bold text-saffron-deep">
                    {new Date(p.start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                    {new Date(p.end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-tulasi-soft p-8">
              <h3 className="font-display text-2xl font-semibold text-tulasi">In version 1.0</h3>
              <ul className="mt-4 space-y-2">
                {MVP_SCOPE.in.map((s) => (
                  <li key={s} className="flex gap-2 text-ink"><Check className="mt-0.5 shrink-0 text-tulasi" size={18} /> {s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gold-soft p-8">
              <h3 className="font-display text-2xl font-semibold text-[#8A6314]">Coming next</h3>
              <ul className="mt-4 space-y-2">
                {MVP_SCOPE.later.map((s) => (
                  <li key={s} className="flex gap-2 text-ink"><ArrowRight className="mt-0.5 shrink-0 text-[#8A6314]" size={18} /> {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & growth */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Honest limits</Eyebrow>
            <H2>What the prototype doesn&apos;t do yet</H2>
            <ul className="mt-6 space-y-3">
              {LIMITATIONS.map((l) => (
                <li key={l} className="flex gap-3 text-ink-soft">
                  <TriangleAlert className="mt-0.5 shrink-0 text-gold" size={18} /> {l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Growth path</Eyebrow>
            <H2>Where Saathi goes next</H2>
            <div className="mt-6 space-y-4">
              {GROWTH.map((g, i) => (
                <div key={g.title} className="flex gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-saffron-soft font-display font-semibold text-saffron-deep">{i + 1}</div>
                  <div>
                    <div className="font-bold text-ink">{g.title}</div>
                    <p className="text-sm leading-relaxed text-ink-soft">{g.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Costs */}
      <section id="costs" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow>Investment</Eyebrow>
          <H2>What it costs to run for real</H2>
          <div className="mt-6 rounded-3xl bg-ink p-8 text-white">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              Noor is developing Saathi as seva, at <span className="text-saffron">no development charge</span>.
            </p>
            <p className="mt-3 max-w-3xl text-white/80">
              Noor is a developer, not a designer. Funding is requested only for the system requirements below (stores, servers,
              messaging) and for a professional UI/UX designer.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["₹2.0 – 3.9 lakh", "one-time (mostly design)"],
                ["₹8k – 20k / month", "to run at ~2,000 devotees"],
                ["₹0", "development fee"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white/10 p-4">
                  <div className="font-display text-2xl font-semibold text-saffron">{v}</div>
                  <div className="text-sm text-white/75">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CostTable title="One-time" rows={COSTS_ONE_TIME} />
            <div className="space-y-6">
              <CostTable title="Yearly" rows={COSTS_YEARLY} />
              <CostTable title="Monthly (pilot scale, ~2,000 devotees)" rows={COSTS_MONTHLY} />
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            Prices researched in November 2026 at 1 USD ≈ ₹88, before GST unless stated; confirm on each provider&apos;s rate card before
            budgeting. Sources:{" "}
            {SOURCES.map((s, i) => (
              <span key={s.href}>
                <a href={s.href} className="underline hover:text-saffron-deep" target="_blank" rel="noreferrer">{s.label}</a>
                {i < SOURCES.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <footer className="border-t border-line bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/people/noor.jpg")} alt="" className="size-9 rounded-full object-cover" />
            <span>Prototype by Noor for ISKCON Coimbatore · Hare Krishna</span>
          </div>
          <a href="https://github.com/noormohammedj/Saathi" className="font-semibold text-peacock hover:underline">Source on GitHub</a>
        </div>
      </footer>
    </main>
  );
}
