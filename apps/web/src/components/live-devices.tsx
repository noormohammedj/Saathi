"use client";

import { BatteryFull, RotateCcw, Signal, Wifi } from "lucide-react";
import { useState } from "react";

import { asset } from "@/lib/pitch";

function StatusBar({ time, className }: { time: string; className: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-between text-[13px] font-semibold text-ink ${className}`} aria-hidden="true">
      <span>{time}</span>
      <span className="flex items-center gap-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <BatteryFull size={18} />
      </span>
    </div>
  );
}

function Iphone({ src }: { src: string }) {
  return (
    <div className="relative h-[760px] w-[360px] shrink-0 rounded-[58px] bg-[#1b1b1d] p-3 shadow-[0_40px_80px_-30px_rgba(43,27,16,0.6)] ring-1 ring-black/40">
      <div className="flex h-full flex-col overflow-hidden rounded-[46px] bg-sand">
        <StatusBar time="9:41" className="h-12 px-8 pt-1" />
        <iframe title="Saathi on iPhone" src={src} className="w-full flex-1" />
      </div>
      <div className="absolute left-1/2 top-5 z-10 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}

function Android({ src }: { src: string }) {
  return (
    <div className="relative h-[760px] w-[356px] shrink-0 rounded-[40px] bg-[#2a2d33] p-2.5 shadow-[0_40px_80px_-30px_rgba(43,27,16,0.6)] ring-1 ring-black/40">
      <div className="flex h-full flex-col overflow-hidden rounded-[32px] bg-sand">
        <StatusBar time="09:41" className="h-9 px-6" />
        <iframe title="Saathi on Android" src={src} className="w-full flex-1" />
      </div>
      <div className="absolute left-1/2 top-[22px] z-10 size-[14px] -translate-x-1/2 rounded-full bg-black ring-2 ring-[#2a2d33]" />
    </div>
  );
}

/** The real Saathi app (Expo web build) running inside an iPhone and an Android frame. */
export function LiveDevices() {
  const [round, setRound] = useState(0);
  const src = `${asset("/app/")}?v=${round}`;
  return (
    <div>
      <div className="flex flex-wrap items-start justify-center gap-10">
        <figure className="flex flex-col items-center gap-3">
          <Iphone key={`i${round}`} src={src} />
          <figcaption className="text-sm font-semibold text-ink-soft">iOS</figcaption>
        </figure>
        <figure className="flex flex-col items-center gap-3">
          <Android key={`a${round}`} src={src} />
          <figcaption className="text-sm font-semibold text-ink-soft">Android</figcaption>
        </figure>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem("saathi-v2");
            } catch {}
            setRound((r) => r + 1);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-saffron-soft">
          <RotateCcw size={16} /> Restart the demo
        </button>
      </div>
    </div>
  );
}
