#!/usr/bin/env bash
# ============================================================
# Deploy the weGAS Commerce Intelligence demo to the VPS.
# Mirrors the forex-demo workflow: rsync the static files up,
# then reset ownership to www-data so nginx can serve them.
#
#   ./deploy.sh
#   REMOTE_USER=deploy DEST=/var/www/wgas-commerce-demo ./deploy.sh
#
# Serves at: https://hub.w-gas.co.za/commerce-demo/
# ============================================================
set -euo pipefail

REMOTE="${REMOTE:-hub.w-gas.co.za}"           # ssh host (the VPS)
REMOTE_USER="${REMOTE_USER:-root}"            # ssh user (needs write + chown)
DEST="${DEST:-/var/www/wgas-commerce-demo}"   # served directory on the VPS
SUBPATH="commerce-demo"

cd "$(dirname "$0")"

echo "→ syncing static build to ${REMOTE_USER}@${REMOTE}:${DEST}/"
rsync -avz --delete \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude '.gstack' \
  --exclude '.DS_Store' \
  --exclude 'weGAS Intelligence.html' \
  --exclude 'app/tweaks-panel.jsx' \
  --exclude 'app/tweaks-app.jsx' \
  --exclude 'deploy.sh' \
  --exclude 'nginx-commerce-demo.conf' \
  --exclude 'README-DEPLOY.md' \
  ./ "${REMOTE_USER}@${REMOTE}:${DEST}/"

echo "→ resetting ownership to www-data"
ssh "${REMOTE_USER}@${REMOTE}" "chown -R www-data:www-data '${DEST}'"

echo "✓ deployed → https://${REMOTE}/${SUBPATH}/"
