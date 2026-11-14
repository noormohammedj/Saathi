export type SkillId =
  | 'tech'
  | 'digital'
  | 'yoga'
  | 'music'
  | 'art'
  | 'gita'
  | 'story'
  | 'cooking'
  | 'photo'
  | 'medical'
  | 'teaching'
  | 'finance'
  | 'chanting'
  | 'decor'
  | 'logistics';

export interface Skill {
  id: SkillId;
  label: string;
  /** Lucide icon name, resolved in components/skill-icon.tsx */
  icon: string;
  tone: 'saffron' | 'peacock' | 'tulasi' | 'lotus' | 'gold';
}

/** Public profile: everything here is visible to every signed-in devotee. */
export interface Devotee {
  id: string;
  name: string;
  initiatedName?: string;
  sinceYear: number;
  headline: string;
  skills: SkillId[];
  area: string;
  languages: string[];
  availability: string[];
  roundsPerDay: number;
  streakDays: number;
  sevaHours: number;
  bio: string;
  prompts: { q: string; a: string }[];
  circles: string[];
  gradient: [string, string];
  /** Optional profile photo (require() asset). */
  photo?: number;
  verified: boolean;
  /** Has this devotee already offered to connect with the current user? */
  likesYou?: boolean;
}

/** Private contact: only readable by temple admins (RLS-enforced in production). */
export interface PrivateContact {
  devoteeId: string;
  mobile: string;
  email: string;
}

export interface EventRole {
  id: string;
  title: string;
  skill: SkillId;
  needed: number;
  filled: number;
  credits: number;
}

export interface TempleEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string; // ISO
  time: string;
  venue: string;
  kind: 'festival' | 'weekly' | 'seva' | 'outreach';
  gradient: [string, string];
  description: string;
  roles: EventRole[];
  attendCredits: number;
  going: number;
}

export interface Circle {
  id: string;
  name: string;
  tagline: string;
  skill: SkillId;
  members: number;
  leadId: string;
  nextMeet: string;
  gradient: [string, string];
  openToAll: boolean;
}

export interface SevaTier {
  id: string;
  label: string;
  amount: number | null; // null = any amount
  note?: string;
}

export interface SevaFund {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: [string, string];
  tiers: SevaTier[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'prasadam' | 'darshan' | 'puja' | 'gift';
  limited?: string;
}

export interface LedgerEntry {
  id: string;
  label: string;
  points: number;
  at: string;
  kind: 'visit' | 'program' | 'japa' | 'gita' | 'lecture' | 'seva' | 'donation' | 'streak' | 'redeem';
}

export interface Message {
  id: string;
  from: string; // devotee id
  text: string;
  at: string;
  kind?: 'text' | 'seva-invite' | 'system';
  eventId?: string;
}

export interface Thread {
  id: string;
  kind: 'direct' | 'team';
  title?: string;
  members: string[];
  eventId?: string;
  createdAt: string;
  messages: Message[];
}
