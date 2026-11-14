import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CURRENT_USER_ID, devoteeById, PRIVATE_CONTACTS } from '@/data/devotees';
import { EVENTS, REWARDS, SEVA_FUNDS } from '@/data/temple';
import type { LedgerEntry, Message, SkillId, Thread } from '@/data/types';

export const BEADS_PER_ROUND = 108;
export const ROUNDS_GOAL = 16;

type Role = 'devotee' | 'admin';

interface DaySadhana {
  rounds: number;
  beads: number;
  gitaChapters: number;
  lectureMins: number;
  visited: boolean;
}

interface Redemption {
  id: string;
  rewardId: string;
  code: string;
  at: string;
  status: 'ready' | 'collected';
}

interface AppState {
  role: Role;
  onboarded: boolean;
  mySkills: SkillId[];
  credits: number;
  ledger: LedgerEntry[];
  today: DaySadhana;
  streakDays: number;
  /** Last 35 days of sadhana intensity, 0–4 (oldest first, today last). */
  history: number[];
  gitaChapter: number;
  swipes: Record<string, 'connect' | 'later'>;
  matches: { profileId: string; at: string }[];
  threads: Thread[];
  volunteered: Record<string, true>; // `${eventId}:${roleId}`
  rsvps: Record<string, true>;
  joinedCircles: string[];
  redemptions: Redemption[];
  donations: { fundId: string; tierLabel: string; amount: number; at: string }[];

  completeOnboarding: (skills: SkillId[]) => void;
  setRole: (role: Role) => void;
  tapBead: () => { roundDone: boolean; goalDone: boolean };
  checkIn: () => boolean;
  logGita: () => void;
  logLecture: () => void;
  swipe: (profileId: string, dir: 'connect' | 'later') => boolean;
  sendMessage: (threadId: string, text: string, kind?: Message['kind'], eventId?: string) => void;
  openDirectThread: (profileId: string) => string;
  formTeam: (eventId: string, memberIds: string[]) => string;
  volunteer: (eventId: string, roleId: string) => void;
  rsvp: (eventId: string) => void;
  toggleCircle: (circleId: string) => void;
  redeem: (rewardId: string) => Redemption | null;
  donate: (fundId: string, tierLabel: string, amount: number) => number;
  contactFor: (devoteeId: string) => { mobile: string; email: string } | null;
  reset: () => void;
}

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

const seedLedger: LedgerEntry[] = [
  { id: 'l1', label: 'Sunday Love Feast attended', points: 20, at: hoursAgo(150), kind: 'program' },
  { id: 'l2', label: 'Temple visit · check-in', points: 10, at: hoursAgo(150), kind: 'visit' },
  { id: 'l3', label: 'Seva · Prasadam serving', points: 30, at: hoursAgo(149), kind: 'seva' },
  { id: 'l4', label: '7-day sadhana streak', points: 50, at: hoursAgo(96), kind: 'streak' },
  { id: 'l5', label: 'Gita · Chapter 2 read', points: 8, at: hoursAgo(30), kind: 'gita' },
  { id: 'l6', label: 'Japa · 8 rounds', points: 8, at: hoursAgo(22), kind: 'japa' },
];

const seedThreads: Thread[] = [
  {
    id: 't-govind',
    kind: 'direct',
    members: [CURRENT_USER_ID, 'govind'],
    createdAt: hoursAgo(50),
    messages: [
      { id: 'm1', from: 'govind', text: 'Hare Krishna prabhu! Saw you in the Seva Tech Guild. Could we put the kirtan schedule in the app?', at: hoursAgo(50) },
      { id: 'm2', from: CURRENT_USER_ID, text: 'Hare Krishna! Yes – send me the Saturday slots and I will wire it up.', at: hoursAgo(49) },
      { id: 'm3', from: 'govind', text: 'Wonderful. Also, we need 2 more for Sunday feast kirtan. Do you play kartals?', at: hoursAgo(5) },
    ],
  },
];

const initial = {
  role: 'devotee' as Role,
  onboarded: false,
  mySkills: devoteeById(CURRENT_USER_ID).skills,
  credits: 1186,
  ledger: seedLedger,
  today: { rounds: 5, beads: 42, gitaChapters: 0, lectureMins: 0, visited: false },
  streakDays: 23,
  history: [0, 1, 2, 1, 0, 2, 3, 2, 1, 0, 0, 2, 3, 3, 2, 3, 4, 3, 2, 3, 4, 4, 3, 2, 3, 4, 3, 2, 3, 4, 4, 3, 4, 3, 1],
  gitaChapter: 3,
  swipes: {},
  matches: [],
  threads: seedThreads,
  volunteered: {},
  rsvps: {},
  joinedCircles: devoteeById(CURRENT_USER_ID).circles,
  redemptions: [],
  donations: [],
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => {
      const earn = (label: string, points: number, kind: LedgerEntry['kind']) =>
        set((s) => ({
          credits: s.credits + points,
          ledger: [{ id: uid(), label, points, at: now(), kind }, ...s.ledger],
        }));

      return {
        ...initial,

        completeOnboarding: (skills) => set({ onboarded: true, mySkills: skills.length ? skills : ['chanting'] }),
        setRole: (role) => set({ role }),

        tapBead: () => {
          const { today } = get();
          const beads = today.beads + 1;
          if (beads < BEADS_PER_ROUND) {
            set({ today: { ...today, beads } });
            return { roundDone: false, goalDone: false };
          }
          const rounds = today.rounds + 1;
          set({ today: { ...today, beads: 0, rounds } });
          earn(`Japa · round ${rounds} complete`, 1, 'japa');
          const goalDone = rounds === ROUNDS_GOAL;
          if (goalDone) {
            earn('16 rounds today · bonus', 8, 'japa');
            set((s) => ({ history: [...s.history.slice(0, -1), 4] }));
          }
          return { roundDone: true, goalDone };
        },

        checkIn: () => {
          if (get().today.visited) return false;
          set((s) => ({ today: { ...s.today, visited: true }, streakDays: s.streakDays }));
          earn('Temple visit · check-in', 10, 'visit');
          return true;
        },

        logGita: () => {
          const chapter = get().gitaChapter;
          set((s) => ({ today: { ...s.today, gitaChapters: s.today.gitaChapters + 1 }, gitaChapter: Math.min(18, chapter + 1) }));
          earn(`Gita · Chapter ${chapter} read`, 8, 'gita');
        },

        logLecture: () => {
          set((s) => ({ today: { ...s.today, lectureMins: s.today.lectureMins + 30 } }));
          earn('Heard Srimad Bhagavatam class', 6, 'lecture');
        },

        swipe: (profileId, dir) => {
          set((s) => ({ swipes: { ...s.swipes, [profileId]: dir } }));
          const p = devoteeById(profileId);
          if (dir === 'connect' && p.likesYou) {
            set((s) => ({ matches: [{ profileId, at: now() }, ...s.matches] }));
            return true;
          }
          return false;
        },

        openDirectThread: (profileId) => {
          const existing = get().threads.find((t) => t.kind === 'direct' && t.members.includes(profileId));
          if (existing) return existing.id;
          const id = `t-${profileId}`;
          set((s) => ({
            threads: [
              { id, kind: 'direct', members: [CURRENT_USER_ID, profileId], createdAt: now(), messages: [] },
              ...s.threads,
            ],
          }));
          return id;
        },

        sendMessage: (threadId, text, kind = 'text', eventId) => {
          const msg: Message = { id: uid(), from: CURRENT_USER_ID, text, at: now(), kind, eventId };
          set((s) => ({
            threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t)),
          }));
          // Prototype: a warm auto-reply so the conversation feels alive.
          const thread = get().threads.find((t) => t.id === threadId);
          const other = thread?.members.find((m) => m !== CURRENT_USER_ID);
          if (!thread || !other) return;
          const reply =
            kind === 'seva-invite'
              ? 'Hare Krishna! Count me in – let’s serve together 🙏'
              : thread.kind === 'team'
                ? 'Jaya! I will bring my part ready by Thursday.'
                : 'Hare Krishna! That sounds wonderful.';
          setTimeout(() => {
            set((s) => ({
              threads: s.threads.map((t) =>
                t.id === threadId
                  ? { ...t, messages: [...t.messages, { id: uid(), from: other, text: reply, at: now() }] }
                  : t,
              ),
            }));
          }, 1400);
        },

        formTeam: (eventId, memberIds) => {
          const event = EVENTS.find((e) => e.id === eventId)!;
          const id = `team-${eventId}-${uid()}`;
          const names = memberIds.map((m) => devoteeById(m).name.split(' ')[0]).join(', ');
          set((s) => ({
            threads: [
              {
                id,
                kind: 'team',
                title: `${event.title} team`,
                members: [CURRENT_USER_ID, ...memberIds],
                eventId,
                createdAt: now(),
                messages: [
                  { id: uid(), from: 'system', kind: 'system', text: `Seva team formed with ${names}. Temple coordinators have been notified.`, at: now() },
                ],
              },
              ...s.threads,
            ],
          }));
          return id;
        },

        volunteer: (eventId, roleId) => {
          const key = `${eventId}:${roleId}`;
          if (get().volunteered[key]) return;
          const event = EVENTS.find((e) => e.id === eventId)!;
          const role = event.roles.find((r) => r.id === roleId)!;
          set((s) => ({ volunteered: { ...s.volunteered, [key]: true } }));
          earn(`Seva signup · ${role.title} (pending ${role.credits} on completion)`, 0, 'seva');
        },

        rsvp: (eventId) => set((s) => ({ rsvps: { ...s.rsvps, [eventId]: true } })),

        toggleCircle: (circleId) =>
          set((s) => ({
            joinedCircles: s.joinedCircles.includes(circleId)
              ? s.joinedCircles.filter((c) => c !== circleId)
              : [...s.joinedCircles, circleId],
          })),

        redeem: (rewardId) => {
          const reward = REWARDS.find((r) => r.id === rewardId)!;
          if (get().credits < reward.cost) return null;
          const redemption: Redemption = {
            id: uid(),
            rewardId,
            code: `SA-${Math.floor(100000 + Math.random() * 899999)}`,
            at: now(),
            status: 'ready',
          };
          set((s) => ({
            credits: s.credits - reward.cost,
            redemptions: [redemption, ...s.redemptions],
            ledger: [{ id: uid(), label: `Redeemed · ${reward.name}`, points: -reward.cost, at: now(), kind: 'redeem' }, ...s.ledger],
          }));
          return redemption;
        },

        donate: (fundId, tierLabel, amount) => {
          const fund = SEVA_FUNDS.find((f) => f.id === fundId)!;
          const points = Math.min(500, Math.floor(amount / 100));
          set((s) => ({ donations: [{ fundId, tierLabel, amount, at: now() }, ...s.donations] }));
          earn(`${fund.name} · ${tierLabel}`, points, 'donation');
          return points;
        },

        // Mirrors the production RLS rule: contacts resolve only for admins.
        contactFor: (devoteeId) => {
          if (get().role !== 'admin') return null;
          const c = PRIVATE_CONTACTS.find((p) => p.devoteeId === devoteeId);
          return c ? { mobile: c.mobile, email: c.email } : null;
        },

        reset: () => set({ ...initial }),
      };
    },
    {
      name: 'saathi-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => {
        // Functions are not persisted; everything else is.
        const { contactFor, ...rest } = s;
        void contactFor;
        return rest;
      },
    },
  ),
);
