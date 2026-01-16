# Generating the OG Image

This project includes an automated script to generate the Open Graph preview image (1200×630px).

## Usage

1. **Start the dev server** in one terminal:

   ```bash
   pnpm dev
   ```

2. **Run the screenshot script** in another terminal:

   ```bash
   pnpm generate:og
   ```

The script will:

- Launch a headless Chromium browser
- Navigate to `http://localhost:5173`
- Wait for the page to fully load
- Take a screenshot at 1200×630px with 2x resolution (for retina displays)
- Save it to `public/og-image.png`

## Requirements

- The dev server must be running on port 5173
- Playwright's Chromium browser must be installed (automatically done during `pnpm install`)

## Customization

To modify the screenshot behavior, edit `scripts/generate-og-image.ts`:

- Change the viewport size
- Adjust wait times for slower loading
- Change the output path
- Add custom page interactions before taking the screenshot
