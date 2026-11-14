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
# GitHub Pages only serves the root 404.html, so send unknown /app/* deep links
# back to the app entry, which restores the route from saved state.
python3 - <<'EOF'
p = "pages-dist/404.html"
html = open(p).read()
redirect = "<script>if(location.pathname.indexOf('/Saathi/app/')===0)location.replace('/Saathi/app/');</script>"
open(p, "w").write(html.replace("<head>", "<head>" + redirect, 1))
EOF
touch pages-dist/.nojekyll
echo "Pages site ready in pages-dist/"
