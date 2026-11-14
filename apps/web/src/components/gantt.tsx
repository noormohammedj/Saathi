import { PHASES } from "@/lib/pitch";

const START = new Date("2026-11-16").getTime();
const END = new Date("2027-12-31").getTime();
const pct = (d: string) => ((new Date(d).getTime() - START) / (END - START)) * 100;
const COLORS = ["#8C7A6B", "#D9577E", "#C9952B", "#E8761C", "#0B6B78", "#3D7A4C", "#074954", "#B85410"];
const MONTHS = ["2026-12-01", "2027-02-01", "2027-04-01", "2027-06-01", "2027-08-01", "2027-10-01", "2027-12-01"];
const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** Programme timeline: one bar per phase across Nov 2026 – Dec 2027. */
export function Gantt() {
  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-white p-5">
      <div className="min-w-[760px]">
        <div className="relative ml-48 h-6 text-xs font-semibold text-muted">
          {MONTHS.map((m) => (
            <span key={m} className="absolute -translate-x-1/2" style={{ left: `${pct(m)}%` }}>
              {new Date(m).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
            </span>
          ))}
        </div>
        {PHASES.map((p, i) => (
          <div key={p.name} className="flex items-center border-t border-line py-2.5">
            <div className="w-48 shrink-0 pr-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted">{p.phase}</div>
              <div className="text-sm font-semibold text-ink">{p.name}</div>
            </div>
            <div className="relative h-8 flex-1">
              <div
                className="absolute top-1 flex h-6 items-center overflow-hidden whitespace-nowrap rounded-full px-2.5 text-[11px] font-bold text-white"
                style={{ left: `${pct(p.start)}%`, width: `max(${pct(p.end) - pct(p.start)}%, 10px)`, background: COLORS[i] }}
                title={`${fmt(p.start)} – ${fmt(p.end)}`}>
                {pct(p.end) - pct(p.start) > 7 ? `${fmt(p.start).replace(/ 20\d\d/, "")} – ${fmt(p.end).replace(/ 20\d\d/, "")}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
