import { useColorScheme } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { tokens } = require('../../../packages/shared/tokens.js') as {
  tokens: { color: Record<string, string>; radius: Record<string, number> };
};

export const C = tokens.color as {
  saffron: string; saffronDeep: string; saffronSoft: string;
  peacock: string; peacockDeep: string; peacockSoft: string;
  tulasi: string; tulasiSoft: string; lotus: string; lotusSoft: string;
  gold: string; goldSoft: string; ink: string; inkSoft: string; muted: string;
  line: string; sand: string; card: string; night: string; nightCard: string; nightLine: string;
};

export const TONE = {
  saffron: { fg: C.saffronDeep, bg: C.saffronSoft, solid: C.saffron },
  peacock: { fg: C.peacockDeep, bg: C.peacockSoft, solid: C.peacock },
  tulasi: { fg: C.tulasi, bg: C.tulasiSoft, solid: C.tulasi },
  lotus: { fg: '#A8355A', bg: C.lotusSoft, solid: C.lotus },
  gold: { fg: '#8A6314', bg: C.goldSoft, solid: C.gold },
} as const;

/** Colours that must be passed as props (icons, gradients) rather than classes. */
export function usePalette() {
  const dark = useColorScheme() === 'dark';
  return {
    dark,
    bg: dark ? C.night : C.sand,
    card: dark ? C.nightCard : C.card,
    text: dark ? '#FBEFE2' : C.ink,
    textSoft: dark ? '#CDBBA8' : C.inkSoft,
    muted: dark ? '#A8927E' : C.muted,
    line: dark ? C.nightLine : C.line,
  };
}
