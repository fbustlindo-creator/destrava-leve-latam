const fs = require('fs');
const sharp = require('sharp');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="45%" stop-color="#059669"/>
      <stop offset="75%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="plusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
  </defs>

  <!-- Clean solid white background -->
  <rect width="1000" height="1000" fill="#ffffff"/>

  <!-- Centered container -->
  <g transform="translate(100, 310)">
    <!-- Somatic 'D' & Body Flow Ribbon Monogram -->
    <g transform="translate(0, 0)">
      <!-- Fluid back spine curve -->
      <path d="M 50 30 C 25 110, 15 220, 32 300 C 45 360, 65 390, 52 450 C 46 475, 30 495, 24 505 C 38 490, 60 450, 64 400 C 72 330, 42 260, 50 170 C 56 115, 62 70, 50 30 Z" fill="url(#grad)" opacity="0.95"/>
      <!-- Fluid arch forming the 'D' loop -->
      <path d="M 52 50 C 115 35, 215 80, 215 200 C 215 320, 125 370, 75 390 C 60 375, 70 345, 98 325 C 150 295, 175 235, 165 185 C 155 125, 100 85, 52 50 Z" fill="url(#grad)"/>
    </g>

    <!-- Typography -->
    <g transform="translate(235, 255)">
      <text font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" font-size="94" letter-spacing="-3">
        <tspan fill="#1E293B" font-weight="800">destrava</tspan><tspan fill="#64748B" font-weight="400">leve</tspan><tspan fill="url(#plusGrad)" font-weight="900" dx="8">+</tspan>
      </text>
    </g>
  </g>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile('public/logo-destrava-vetorial.png')
  .then(() => {
    console.log('Vector logo rendered to public/logo-destrava-vetorial.png');
  })
  .catch(err => console.error(err));
