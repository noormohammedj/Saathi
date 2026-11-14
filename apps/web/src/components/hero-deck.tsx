"use client";

import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Mandala } from "@/components/mandala";
import { asset, HERO_PROFILES } from "@/lib/pitch";

type Profile = (typeof HERO_PROFILES)[number];

function Card({ p }: { p: Profile }) {
  const initials = p.name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_-20px_rgba(43,27,16,0.45)]">
      <div className="relative flex-1 overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}>
        {p.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(p.photo)} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        ) : (
          <>
            <Mandala size={300} className="absolute -right-16 -top-10" opacity={0.22} />
            <div className="absolute right-5 top-16 grid size-20 place-items-center rounded-full border-2 border-white/50 bg-white/15 font-display text-3xl text-white">{initials}</div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-bold text-saffron-deep">
          <Sparkles size={14} /> {p.match}% seva match
        </div>
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="font-display text-[30px] font-semibold leading-tight">{p.name}</div>
          <div className="text-sm font-semibold opacity-95">{p.role}</div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="rounded-2xl bg-saffron-soft px-3 py-2 text-[13px] font-bold text-saffron-deep">{p.reason}</div>
        <div className="flex gap-2">
          {p.skills.map((s) => (
            <span key={s} className="rounded-full bg-peacock-soft px-3 py-1 text-xs font-semibold text-peacock-deep">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Self-playing swipe deck: each card is connected (swiped right) in turn. */
export function HeroDeck() {
  const [i, setI] = useState(0);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setI((n) => n + 1), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (HERO_PROFILES[(i - 1 + HERO_PROFILES.length) % HERO_PROFILES.length].photo && i > 0) {
      setToast(true);
      const t = setTimeout(() => setToast(false), 2200);
      return () => clearTimeout(t);
    }
  }, [i]);

  const at = (k: number) => HERO_PROFILES[(i + k) % HERO_PROFILES.length];

  return (
    <div className="relative mx-auto h-[540px] w-full max-w-[340px]" aria-label="Animated preview of Saathi profile cards being matched">
      <div className="absolute inset-0 translate-y-5 scale-[0.92] opacity-60">
        <Card p={at(2)} />
      </div>
      <div className="absolute inset-0 translate-y-2.5 scale-[0.96]">
        <Card p={at(1)} />
      </div>
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ scale: 0.96, y: 10 }}
          animate={{ scale: 1, y: 0, x: 0, rotate: 0 }}
          exit={{ x: 520, rotate: 18, opacity: 0, transition: { duration: 0.55, ease: "easeIn" } }}
          transition={{ type: "spring", damping: 20, stiffness: 180 }}>
          <Card p={at(0)} />
          <motion.div
            className="absolute left-6 top-[52%] -rotate-12 rounded-xl border-[3px] border-tulasi bg-white/95 px-4 py-1.5 text-xl font-extrabold tracking-[0.2em] text-tulasi"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ duration: 2.4, times: [0, 0.75, 1] }}>
            CONNECT
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="absolute -left-6 top-1/2 z-10 flex items-center gap-3 rounded-full bg-peacock-deep py-2 pl-2 pr-5 text-white shadow-2xl sm:-left-20"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}>
            <span className="flex -space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/people/noor.jpg")} alt="Noor" className="size-11 rounded-full border-2 border-white object-cover" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/people/rupika.jpg")} alt="Rupika" className="size-11 rounded-full border-2 border-white object-cover" />
            </span>
            <span>
              <span className="block font-display text-lg leading-none">You&apos;re Saathis!</span>
              <span className="text-xs opacity-90">Form a seva team for Gita Jayanti</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
