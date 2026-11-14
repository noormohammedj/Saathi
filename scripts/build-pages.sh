#!/usr/bin/env bash
# Builds the GitHub Pages site into ./pages-dist:
#   /            pitch site (apps/web, Next.js static export, basePath /Saathi)
#   /app/        the Saathi app (apps/mobile, Expo web export, baseUrl /Saathi/app)
#   /media/      walkthrough video and poster (media/*, if present)
set -euo pipefail
cd "$(dirname "$0")/.."

(cd apps/mobile && npx expo export -p web --output-dir dist-web && cp dist-web/index.html dist-web/404.html)
(cd apps/web && npm run build)

rm -rf pages-dist
cp -R apps/web/out pages-dist
cp -R apps/mobile/dist-web pages-dist/app
if [ -d media ]; then
  mkdir -p pages-dist/media
  cp media/*.mp4 media/*.jpg pages-dist/media/ 2>/dev/null || true
fi
touch pages-dist/.nojekyll
echo "Pages site ready in pages-dist/"
