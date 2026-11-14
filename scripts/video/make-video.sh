#!/usr/bin/env bash
# Builds media/saathi-walkthrough.mp4: renders slides (Swift), narrates them
# with the macOS "Aman" (en_IN) voice, and joins everything with ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/../.."

ROOT=$PWD
WORK=$(mktemp -d)
SCREENS=$ROOT/apps/web/public/screens
FONTS=$ROOT/node_modules/@expo-google-fonts
mkdir -p "$WORK/fonts" media
cp "$FONTS/fraunces/600SemiBold/Fraunces_600SemiBold.ttf" "$FONTS/inter/500Medium/Inter_500Medium.ttf" "$FONTS/inter/700Bold/Inter_700Bold.ttf" "$WORK/fonts/"

# Resolve screenshot paths into a working copy of the slide list.
python3 - "$ROOT/scripts/video/slides.json" "$SCREENS" "$WORK/slides.json" <<'EOF'
import json, sys
slides = json.load(open(sys.argv[1]))
for s in slides:
    if s.get("image"):
        s["image"] = f"{sys.argv[2]}/{s['image']}"
json.dump(slides, open(sys.argv[3], "w"))
EOF

swift "$ROOT/scripts/video/render-slides.swift" "$WORK/slides.json" "$WORK/fonts" "$WORK"

: > "$WORK/list.txt"
for id in $(python3 -c "import json,sys; print(' '.join(s['id'] for s in json.load(open(sys.argv[1]))))" "$WORK/slides.json"); do
  python3 -c "import json,sys; print(next(s['say'] for s in json.load(open(sys.argv[1])) if s['id']==sys.argv[2]))" "$WORK/slides.json" "$id" > "$WORK/$id.txt"
  say -v Aman -r 168 -f "$WORK/$id.txt" -o "$WORK/$id.aiff"
  # Each segment: still slide for the narration plus 0.8 s of breathing room.
  ffmpeg -y -loglevel error -loop 1 -i "$WORK/$id.png" -i "$WORK/$id.aiff" \
    -af "apad=pad_dur=0.8" -c:v libx264 -tune stillimage -pix_fmt yuv420p -r 30 \
    -vf "scale=1920:1080,fade=t=in:st=0:d=0.35" -c:a aac -b:a 160k -ar 44100 -shortest "$WORK/$id.mp4"
  echo "file '$WORK/$id.mp4'" >> "$WORK/list.txt"
done

ffmpeg -y -loglevel error -f concat -safe 0 -i "$WORK/list.txt" -c copy -movflags +faststart media/saathi-walkthrough.mp4
sips -s format jpeg -s formatOptions 80 -Z 1280 "$WORK/00.png" --out media/poster.jpg >/dev/null
echo "Video ready: media/saathi-walkthrough.mp4 ($(du -h media/saathi-walkthrough.mp4 | cut -f1))"
