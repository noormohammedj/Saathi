// Saathi design tokens (CommonJS so tailwind.config.js can require them).
// Palette: saffron (seva), peacock teal (Krishna), tulasi green (sadhana),
// lotus pink (sangha), temple gold (rewards) on warm sandalwood neutrals.
const tokens = {
  color: {
    saffron: "#E8761C",
    saffronDeep: "#B85410",
    saffronSoft: "#FDE9D4",
    peacock: "#0B6B78",
    peacockDeep: "#074954",
    peacockSoft: "#D6EEF0",
    tulasi: "#3D7A4C",
    tulasiSoft: "#DCEFD9",
    lotus: "#D9577E",
    lotusSoft: "#FADDE6",
    gold: "#C9952B",
    goldSoft: "#F8ECCB",
    ink: "#2B1B10",
    inkSoft: "#5E4A3B",
    muted: "#8C7A6B",
    line: "#EADFD2",
    sand: "#FFF6EA",
    card: "#FFFFFF",
    night: "#140D08",
    nightCard: "#22170F",
    nightLine: "#3A2B1F",
  },
  radius: { sm: 10, md: 16, lg: 24, card: 32, pill: 999 },
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 56],
};

module.exports = { tokens };
