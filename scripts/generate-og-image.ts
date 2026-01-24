import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateOGImage() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2, // For retina display quality
  })

  const page = await context.newPage()

  console.log('Loading the application...')
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle',
  })

  // Wait a bit more for data to load
  await page.waitForTimeout(2000)

  const outputPath = join(__dirname, '..', 'public', 'og-image.jpg')
  console.log(`Taking screenshot at 1200×630px...`)
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 85,
  })

  await browser.close()
  console.log(`✓ OG image saved to: ${outputPath}`)
}

generateOGImage().catch(error => {
  console.error('Failed to generate OG image:', error)
  process.exit(1)
})
