const fs = require('fs');
const sharp = require('sharp');

// 1. Horizontal SVG for Header (transparent background, perfectly proportioned, tight crop)
const horizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 6 242 54" width="242" height="54" fill="none">
  <defs>
    <linearGradient id="dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="45%" stop-color="#059669"/>
      <stop offset="78%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="plusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
  </defs>

  <!-- Somatic 'D' Monogram Icon -->
  <g transform="translate(6, 6) scale(0.105)">
    <!-- Fluid back spine curve -->
    <path d="M 50 30 C 25 110, 15 220, 32 300 C 45 360, 65 390, 52 450 C 46 475, 30 495, 24 505 C 38 490, 60 450, 64 400 C 72 330, 42 260, 50 170 C 56 115, 62 70, 50 30 Z" fill="url(#dGrad)" opacity="0.95"/>
    <!-- Fluid arch forming the 'D' loop -->
    <path d="M 52 50 C 115 35, 215 80, 215 200 C 215 320, 125 370, 75 390 C 60 375, 70 345, 98 325 C 150 295, 175 235, 165 185 C 155 125, 100 85, 52 50 Z" fill="url(#dGrad)"/>
    <!-- Subtle inner shimmer -->
    <path d="M 68 85 C 105 75, 160 115, 150 185 C 142 245, 98 280, 78 300 C 70 270, 85 220, 100 180 C 110 150, 95 115, 68 85 Z" fill="#ffffff" opacity="0.3"/>
  </g>

  <!-- Typography -->
  <g transform="translate(64, 43)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" font-size="28" letter-spacing="-1">
      <tspan fill="#1E293B" font-weight="800">destrava</tspan><tspan fill="#64748B" font-weight="400">leve</tspan><tspan fill="url(#plusGrad)" font-weight="900" dx="3">+</tspan>
    </text>
  </g>
</svg>`;

// 2. Square SVG for Checkout/Avatar (1:1 with white background)
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <linearGradient id="dGradSq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="45%" stop-color="#059669"/>
      <stop offset="78%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="plusGradSq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
  </defs>

  <!-- Solid white background -->
  <rect width="1000" height="1000" fill="#ffffff"/>

  <!-- Centered container -->
  <g transform="translate(100, 310)">
    <!-- Somatic 'D' Monogram Icon -->
    <g transform="translate(0, 0)">
      <path d="M 50 30 C 25 110, 15 220, 32 300 C 45 360, 65 390, 52 450 C 46 475, 30 495, 24 505 C 38 490, 60 450, 64 400 C 72 330, 42 260, 50 170 C 56 115, 62 70, 50 30 Z" fill="url(#dGradSq)" opacity="0.95"/>
      <path d="M 52 50 C 115 35, 215 80, 215 200 C 215 320, 125 370, 75 390 C 60 375, 70 345, 98 325 C 150 295, 175 235, 165 185 C 155 125, 100 85, 52 50 Z" fill="url(#dGradSq)"/>
      <path d="M 68 85 C 105 75, 160 115, 150 185 C 142 245, 98 280, 78 300 C 70 270, 85 220, 100 180 C 110 150, 95 115, 68 85 Z" fill="#ffffff" opacity="0.3"/>
    </g>

    <!-- Typography -->
    <g transform="translate(245, 255)">
      <text font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" font-size="96" letter-spacing="-3">
        <tspan fill="#1E293B" font-weight="800">destrava</tspan><tspan fill="#64748B" font-weight="400">leve</tspan><tspan fill="url(#plusGradSq)" font-weight="900" dx="8">+</tspan>
      </text>
    </g>
  </g>
</svg>`;

// 3. Favicon SVG (icon only)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="85%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#ffffff"/>
  <g transform="translate(8, 7) scale(0.105)">
    <path d="M 50 30 C 25 110, 15 220, 32 300 C 45 360, 65 390, 52 450 C 46 475, 30 495, 24 505 C 38 490, 60 450, 64 400 C 72 330, 42 260, 50 170 C 56 115, 62 70, 50 30 Z" fill="url(#favGrad)" opacity="0.95"/>
    <path d="M 52 50 C 115 35, 215 80, 215 200 C 215 320, 125 370, 75 390 C 60 375, 70 345, 98 325 C 150 295, 175 235, 165 185 C 155 125, 100 85, 52 50 Z" fill="url(#favGrad)"/>
  </g>
</svg>`;

async function main() {
  // Save SVGs
  fs.writeFileSync('public/logo-destrava-horizontal.svg', horizontalSvg);
  fs.writeFileSync('public/logo-destrava-vetorial.svg', squareSvg);
  fs.writeFileSync('public/favicon.svg', faviconSvg);

  // Render High-Res PNGs with sharp
  // Horizontal logo (2x for retina)
  await sharp(Buffer.from(horizontalSvg), { density: 300 })
    .resize(560, 128)
    .png()
    .toFile('public/logo-destrava-horizontal.png');

  // Square logo (1000x1000)
  await sharp(Buffer.from(squareSvg))
    .png()
    .toFile('public/logo-destrava-vetorial.png');

  console.log('All brand logos generated successfully!');
}

main().catch(console.error);
