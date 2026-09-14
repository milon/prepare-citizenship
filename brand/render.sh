#!/usr/bin/env bash
# Regenerates the social card and profile banners from the templates in brand/src.
# Edit the copy in the templates, run this, and upload the PNGs to each platform.
set -euo pipefail

CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
root=$(cd "$(dirname "$0")/.." && pwd)
src="file://$root/brand/src"

# Renders at 2x then downsamples, which keeps the type crisp.
render() {
  local out=$1 url=$2 w=$3 h=$4
  "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size="$w,$h" --virtual-time-budget=6000 --screenshot="$out" "$url" >/dev/null 2>&1
  sips -z "$h" "$w" "$out" >/dev/null
  echo "  $out (${w}x${h})"
}

echo "Rendering brand images..."
render "$root/public/og.png"                          "$src/og-card.html"          1200 630
render "$root/brand/linkedin-banner-1584x396.png"     "$src/banners.html?size=li"  1584 396
render "$root/brand/facebook-cover-851x315.png"       "$src/banners.html?size=fb"   851 315
render "$root/brand/x-header-1500x500.png"            "$src/banners.html?size=x"   1500 500

# Add ?guides=1 to a banner URL to overlay each platform's avatar and crop zones,
# or ?measure=1 to dump element geometry into the page title.
