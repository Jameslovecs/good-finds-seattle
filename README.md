# 好找 · Good Finds Seattle

A public community map for hard-to-find ingredients. Search `牛肝菌` or `porcini`, find nearby reports, and share what you personally found in Seattle stores.

**Website:** https://good-finds-seattle.jajamjamjamijamiejamie.chatgpt.site

## What works

- Public browsing without login; contributors sign in with ChatGPT.
- Chinese/English aliases for selected ingredients, free-text store search, form and freshness filters.
- Neighborhood or opt-in device-location distance sorting (straight-line miles, not driving distance).
- Interactive Leaflet / OpenStreetMap map; place a store pin by clicking or entering coordinates.
- Shared D1 reports with observed date, optional price and notes.
- Idempotent availability confirmations, missing-item reports, and flags for manual review.
- Server validation, authenticated writes, same-origin checks, duplicate-report rejection and a 20-report daily account limit.
- Mobile list/map views. Clearly labeled fictional examples are opt-in and never stored in the database.

Production starts empty on purpose. No fictional inventory is presented as real. Test fixtures live only in the local database.

## Run locally

Node.js 22.13+ and npm are required.

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_equal_raza.sql
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173. The starter provides **local-only mock sign-in** for development. Click Sign in to use its test identity. Production authentication is provided by Sites; the mock flow is not deployed.

Apply each migration once to each database. New migrations: edit `db/schema.ts`, run `npm run db:generate`, inspect SQL, then apply locally. Do not edit applied migrations.

## Tests

```sh
node --experimental-strip-types --test tests/core.test.ts
npx tsc --noEmit
# With the local dev server running:
node tests/api-smoke.mjs
npm run build
```

The API smoke test deliberately creates local test reports. It refuses non-loopback targets. It tests auth rejection, same-origin checks, malformed reports, shared persistence, private-field exclusion, duplicates, repeat feedback, changed availability and flags.

## Hosting and cost

This release uses the connected Sites hosting service with its provisioned Cloudflare Worker and D1 database. No paid Google Maps API, billing account, paid subscription, or paid upgrade was enabled. Sites account availability/quotas are controlled by the host; this repository does not promise unlimited free hosting.

Maps use the community OpenStreetMap raster tile service, which has no usage SLA and must not be bulk-downloaded or prefetched. Normal browser caching and visible attribution are preserved. Read https://operations.osmfoundation.org/policies/tiles/ before scaling. Map requests go directly to OSM; fonts load from Google Fonts. The list remains usable independently of map tiles. A custom domain, larger hosting plan or alternate map service may cost money; do not enable them without the owner's approval.

## Publishing through Sites

`.openai/hosting.json` identifies this deployment and declares the `DB` binding. No credentials belong in this file. The Sites source repository is a separate deployment remote; GitHub is the public source mirror.

From Codex with the Sites plugin:
1. Reuse the existing project ID, obtain a fresh source-write credential, and open/synchronize source with the Sites workflow helper.
2. Run tests and build; package `dist` and hosting metadata with the Sites workflow helper. The built archive must match the pushed source commit.
3. Save the version and deploy it, preserving public access. Sites applies pending D1 migrations.
4. Verify the deployment and anonymous `/api/finds` response. Push the same source to this GitHub repository.

Do not use the repository's project ID for an unrelated fork. Create your own Site and replace the manifest ID. This app relies on Sites authentication headers, so deploying the Worker directly behind an unrelated host requires implementing trusted authentication first. Never trust client-supplied identity headers on a standalone deployment.

## Moderation and operations

Flags are stored, not emailed and not automatically acted on. The owner must periodically inspect the hosted database through the hosting provider's authorized database tools. There is no admin dashboard in this release.

Review queue (read-only):
```sql
SELECT f.id, f.item, f.store, COUNT(*) AS flags
FROM feedback b JOIN finds f ON f.id=b.find_id
WHERE b.kind='flag' AND f.hidden=0
GROUP BY f.id ORDER BY flags DESC;
```

To hide an incorrect listing, execute a parameterized `UPDATE finds SET hidden=1 WHERE id=?` through an authorized operator connection. Restore with `hidden=0`. Never put administrative database credentials in browser code. Backups/export and an admin UI should be established before a broad promotional launch.

## Privacy and limits

- The database stores a Site-scoped contributor ID, not their email or display name. Public APIs omit the contributor ID.
- Device location is optional, stays in browser state and is not saved; map providers can infer the map area viewed. Store pins and report contents are public.
- Reports are observations, not live inventory guarantees. `Found it` is a current confirmation; the original observation date remains visible in details.
- Up to 500 newest visible reports are returned. Pagination is a future scaling task.
- Basic duplicate checks and per-account limits are suitable for a small pilot, not a complete anti-abuse system. Concurrent requests may race at the daily limit. Account creation, automated abuse and flag review require ongoing oversight.
- No photo uploads, automated store lookup/geocoding, editing/deleting your own reports, checkout/delivery, notifications, admin dashboard, or verified seed inventory yet.
- Alias matching is a curated starter list, not machine translation. Geographic submissions are limited to the Seattle metro bounding box.

## Structure

- `app/page.tsx`: search, results, contribution and detail UI
- `app/Map.tsx`: client-only Leaflet map
- `app/api/`: authenticated writes and public reads
- `lib/search.ts`: aliases, distance and validation
- `db/schema.ts`, `drizzle/`: database schema and migrations
- `scripts/`: Sites starter runtime/build integrations

No application API keys are required. `.env*`, `.dev.vars*`, dependencies, builds, local databases, temporary archives and runtime credentials are ignored. Never commit secrets.
