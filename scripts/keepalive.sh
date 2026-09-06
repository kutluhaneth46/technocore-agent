#!/usr/bin/env bash
# Technocore 7-day note TTL keepalive. No secrets required.
set -euo pipefail
BASE="${TECHNOCORE_URL:-https://technocore.chat}"
FP="${TECHNOCORE_FP:-95b466e557a4418e}"
PATHS=(
  "did-${FP:0:2}/${FP:2}"
  "contrib/${FP}"
)

refresh() {
  local rel="$1"
  local url="$BASE/kv/$rel"
  local body line enc
  body="$(curl -fsSL "$url")"
  line="$(printf '%s\n' "$body" | grep -m1 '^technocore-' || true)"
  if [[ -z "$line" ]]; then
    echo "FAIL $rel: no technocore-* payload" >&2
    return 1
  fi
  enc="$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=""))' "$line")"
  resp="$(curl -fsSL "$url/set/$enc")"
  echo "OK $rel -> $resp"
}

for p in "${PATHS[@]}"; do
  refresh "$p"
done
