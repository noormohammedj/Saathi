import { CURRENT_USER_ID, devoteeById } from '@/data/devotees';
import { EVENTS } from '@/data/temple';
import type { Devotee, SkillId, TempleEvent } from '@/data/types';

export interface SevaMatch {
  score: number; // 0-100
  reasons: string[];
  event?: TempleEvent;
  /** Roles in `event` that the pair can cover together. */
  roleTitles: string[];
}

const overlap = <T,>(a: T[], b: T[]) => a.filter((x) => b.includes(x));

/** Open roles of an event that a devotee's skills can fill. */
export function rolesFor(event: TempleEvent, skills: SkillId[]) {
  return event.roles.filter((r) => r.filled < r.needed && (skills.includes(r.skill) || r.skill === 'chanting'));
}

/**
 * Seva match: how well two devotees can serve *together*.
 * Weighs complementary skills on an upcoming event (strongest signal),
 * shared circles, shared availability, language and neighbourhood.
 */
export function sevaMatch(other: Devotee, me: Devotee = devoteeById(CURRENT_USER_ID)): SevaMatch {
  const reasons: string[] = [];
  let score = 40;

  // Best upcoming event where both of us fill different, open, skilled roles.
  let best: { event: TempleEvent; roles: string[]; gain: number } | undefined;
  for (const event of EVENTS) {
    const mine = rolesFor(event, me.skills).filter((r) => r.skill !== 'chanting');
    const theirs = rolesFor(event, other.skills).filter((r) => r.skill !== 'chanting');
    if (!mine.length || !theirs.length) continue;
    const distinct = new Set([...mine, ...theirs].map((r) => r.id)).size;
    const gain = Math.min(30, distinct * 8);
    if (!best || gain > best.gain) {
      best = { event, gain, roles: [...new Set([...theirs, ...mine].map((r) => r.title))].slice(0, 3) };
    }
  }
  if (best) {
    score += best.gain;
    reasons.push(`${best.event.title} needs both of you`);
  }

  const sharedCircles = overlap(me.circles, other.circles);
  if (sharedCircles.length) {
    score += 8;
    reasons.push('You share a circle');
  }
  const sharedTime = overlap(me.availability, other.availability);
  if (sharedTime.length) {
    score += 8;
    reasons.push(`Both free ${sharedTime[0].toLowerCase()}`);
  }
  if (overlap(me.languages, other.languages).length > 1) score += 4;
  if (other.streakDays >= 30) {
    score += 4;
    reasons.push(`${other.streakDays}-day sadhana streak`);
  }

  return { score: Math.min(98, score), reasons, event: best?.event, roleTitles: best?.roles ?? [] };
}

export function yearsWithIskcon(sinceYear: number) {
  return Math.max(1, new Date().getFullYear() - sinceYear);
}
