/**
 * Fetch all Web Platform Baseline features and IDs at build-time
 * Writes normalized JSON files under src/data for Astro to import.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchFeatures } from '../src/api/webstatus'
import { WEB_FEATURES } from '../src/constants/web-features'

async function main() {
  const now = new Date().toISOString()
  console.log(`[data] Fetching all feature IDs…`)
  const allIds = WEB_FEATURES

  console.log(`[data] Fetching full feature dataset…`)
  const allFeatures = await fetchFeatures(allIds)
  console.log(`[data] Normalized ${allFeatures.length} features`)

  const rootDir = dirname(fileURLToPath(import.meta.url))
  const dataDir = resolve(rootDir, '../src/data')
  mkdirSync(dataDir, { recursive: true })

  writeFileSync(
    resolve(dataDir, 'feature-ids.json'),
    JSON.stringify({ ids: allIds, buildTimestamp: now }, null, 2),
    'utf-8',
  )

  writeFileSync(
    resolve(dataDir, 'features.json'),
    JSON.stringify({ features: allFeatures, buildTimestamp: now }, null, 2),
    'utf-8',
  )

  console.log(`[data] Wrote src/data/features.json and feature-ids.json`)
}

main().catch(err => {
  console.error('[data] Failed to fetch data:', err)
  process.exitCode = 1
})
