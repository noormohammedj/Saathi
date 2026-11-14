#!/usr/bin/env bash
# Generates the apps (Expo mobile + Next.js web) and installs every library.
# Safe to re-run: skips apps that already exist.
set -euo pipefail
cd "$(dirname "$0")/.."

# ---------- Mobile: Expo (iOS + Android, native builds) ----------
if [ ! -d apps/mobile ]; then
  npx --yes create-expo-app@latest apps/mobile --template default --no-install
fi
(
  cd apps/mobile
  npm install
  # Native modules, version-matched to the Expo SDK
  npx expo install \
    expo-dev-client expo-router expo-image expo-linear-gradient expo-blur expo-haptics \
    expo-camera expo-image-picker expo-image-manipulator expo-video expo-audio \
    expo-location expo-notifications expo-secure-store expo-localization \
    expo-local-authentication expo-apple-authentication expo-auth-session expo-crypto \
    expo-font expo-splash-screen expo-system-ui expo-updates expo-device expo-constants \
    react-native-reanimated react-native-gesture-handler react-native-safe-area-context \
    react-native-screens react-native-svg react-native-maps \
    @shopify/react-native-skia @shopify/flash-list lottie-react-native \
    @react-native-async-storage/async-storage @gorhom/bottom-sheet
  # Pure-JS libraries
  npm install \
    nativewind tailwindcss@^3 zustand @tanstack/react-query @supabase/supabase-js \
    zod react-hook-form date-fns i18next react-i18next moti \
    @expo-google-fonts/inter @expo-google-fonts/fraunces
  npm install -D prettier-plugin-tailwindcss @types/react
)

# ---------- Web: Next.js (marketing site + admin/moderation console) ----------
if [ ! -d apps/web ]; then
  npx --yes create-next-app@latest apps/web --ts --tailwind --eslint --app --src-dir \
    --import-alias "@/*" --use-npm --turbopack --yes
fi
(
  cd apps/web
  npm install motion lucide-react zustand @tanstack/react-query @supabase/supabase-js zod \
    react-hook-form clsx tailwind-merge class-variance-authority
)

echo "Scaffold complete."
