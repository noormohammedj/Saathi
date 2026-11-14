#!/usr/bin/env bash
# One-time Mac toolchain setup for Kindred (iOS + Android + web).
# Run it yourself in Terminal: it installs Homebrew, which asks for your Mac password.
set -euo pipefail

say() { printf "\n\033[1;35m==> %s\033[0m\n" "$1"; }

# 1. Homebrew
if ! command -v brew >/dev/null 2>&1; then
  say "Installing Homebrew"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
eval "$(/opt/homebrew/bin/brew shellenv)"
grep -q 'brew shellenv' ~/.zprofile 2>/dev/null || echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile

# 2. Core CLI tools
say "Installing Node, Watchman, CocoaPods, JDK 17, Android tools"
brew install node@22 watchman cocoapods git-lfs
brew link --overwrite --force node@22
brew install --cask zulu@17 android-studio

# 3. Environment variables for Android builds
ZSHRC=~/.zshrc
if ! grep -q 'ANDROID_HOME' "$ZSHRC" 2>/dev/null; then
  cat >> "$ZSHRC" <<'EOF'

# --- Kindred mobile toolchain ---
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
EOF
fi
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk

# 4. Global JS tooling
say "Installing EAS CLI (Expo builds / store submission)"
npm install -g eas-cli

# 5. Xcode
say "Accepting Xcode licence and installing iOS platform (needs password)"
sudo xcodebuild -license accept || true
xcodebuild -runFirstLaunch || true

cat <<'EOF'

==> Almost done. One manual step for Android:
   1. Open Android Studio once and finish the setup wizard (installs the SDK to ~/Library/Android/sdk).
   2. Device Manager -> Create a Pixel device with the latest Google Play system image.
   3. Open a new Terminal tab and tell Claude "toolchain is ready".

EOF
node -v && npm -v && pod --version && java -version 2>&1 | head -1
