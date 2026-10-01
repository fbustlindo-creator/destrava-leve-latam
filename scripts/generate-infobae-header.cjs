const fs = require('fs');
const sharp = require('sharp');

// Infobae Mobile/Web Header SVG: 1024 x 100
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 100" width="1024" height="100">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#141414"/>
    </linearGradient>
  </defs>

  <!-- Deep dark header bar -->
  <rect width="1024" height="100" fill="url(#headerGrad)"/>

  <!-- Left: Hamburger Menu Icon -->
  <g transform="translate(36, 34)">
    <rect width="32" height="4.5" rx="2.25" fill="#ffffff"/>
    <rect y="13" width="32" height="4.5" rx="2.25" fill="#ffffff"/>
    <rect y="26" width="32" height="4.5" rx="2.25" fill="#ffffff"/>
  </g>

  <!-- Left-Center: Infobae Logo -->
  <g transform="translate(100, 68)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" font-size="52" font-weight="900" letter-spacing="-1.5">
      <tspan fill="#F26522">i</tspan><tspan fill="#ffffff">nfobae</tspan>
    </text>
  </g>

  <!-- Section divider & Section Name: SALUD -->
  <g transform="translate(340, 68)">
    <line x1="0" y1="-38" x2="0" y2="4" stroke="#444444" stroke-width="2.5"/>
    <text x="22" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="800" fill="#F26522" letter-spacing="3">
      SALUD
    </text>
  </g>

  <!-- Right: Edition Pill (AMÉRICA) and Search -->
  <g transform="translate(860, 50)">
    <!-- Edition pill -->
    <rect x="-110" y="-18" width="130" height="36" rx="18" fill="#222222" stroke="#333333" stroke-width="1.5"/>
    <circle cx="-92" cy="0" r="5" fill="#10B981"/>
    <text x="-40" y="6" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="16" font-weight="700" fill="#E2E8F0" text-anchor="middle" letter-spacing="1.5">AMÉRICA</text>
    
    <!-- Search Magnifying Glass Icon -->
    <g transform="translate(54, -13)">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#ffffff" stroke-width="3"/>
      <line x1="20" y1="20" x2="28" y2="28" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Bottom Accent Line (Orange) -->
  <rect y="96" width="1024" height="4" fill="#F26522"/>
</svg>`;

async function main() {
  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/infobae-header-ref.png');

  await sharp(Buffer.from(svg))
    .webp({ quality: 95 })
    .toFile('public/infobae-header-ref.webp');

  console.log('Infobae header assets generated successfully!');
}

main();
