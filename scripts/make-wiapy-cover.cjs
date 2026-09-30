const fs = require('fs');
const sharp = require('sharp');

const verticalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="50%" stop-color="#1C2541"/>
      <stop offset="100%" stop-color="#0B132B"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
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
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="25" stdDeviation="35" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Premium Deep Emerald/Navy Background -->
  <rect width="1080" height="1920" fill="url(#bgGrad)"/>

  <!-- Subtle ambient decorative glow rings -->
  <circle cx="540" cy="860" r="550" fill="none" stroke="#10B981" stroke-width="1.5" opacity="0.12"/>
  <circle cx="540" cy="860" r="420" fill="none" stroke="#E11D48" stroke-width="1" opacity="0.08"/>

  <!-- Top Brand Tag -->
  <g transform="translate(540, 360)" text-anchor="middle">
    <rect x="-160" y="-26" width="320" height="52" rx="26" fill="#ffffff" fill-opacity="0.08" stroke="#34D399" stroke-width="1.5" stroke-opacity="0.3"/>
    <text y="8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#6EE7B7" letter-spacing="3">MÉTODO EXCLUSIVO</text>
  </g>

  <!-- Central Card with Brand Logo -->
  <g filter="url(#cardShadow)">
    <rect x="160" y="460" width="760" height="800" rx="40" fill="url(#cardGrad)"/>
    
    <!-- Somatic 'D' Monogram in Card -->
    <g transform="translate(540, 720)">
      <g transform="translate(-120, -260) scale(0.48)">
        <path d="M 50 30 C 25 110, 15 220, 32 300 C 45 360, 65 390, 52 450 C 46 475, 30 495, 24 505 C 38 490, 60 450, 64 400 C 72 330, 42 260, 50 170 C 56 115, 62 70, 50 30 Z" fill="url(#dGrad)" opacity="0.95"/>
        <path d="M 52 50 C 115 35, 215 80, 215 200 C 215 320, 125 370, 75 390 C 60 375, 70 345, 98 325 C 150 295, 175 235, 165 185 C 155 125, 100 85, 52 50 Z" fill="url(#dGrad)"/>
        <path d="M 68 85 C 105 75, 160 115, 150 185 C 142 245, 98 280, 78 300 C 70 270, 85 220, 100 180 C 110 150, 95 115, 68 85 Z" fill="#ffffff" opacity="0.3"/>
      </g>
    </g>

    <!-- Typography Inside Card -->
    <g transform="translate(540, 1090)" text-anchor="middle">
      <text font-family="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif" font-size="64" letter-spacing="-2.5">
        <tspan fill="#0F172A" font-weight="800">destrava</tspan><tspan fill="#64748B" font-weight="400">leve</tspan><tspan fill="url(#plusGrad)" font-weight="900" dx="5">+</tspan>
      </text>
      <text y="65" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#059669" letter-spacing="6">PROTOCOLO 28 DIAS</text>
    </g>
  </g>

  <!-- Bottom Badges / Trust -->
  <g transform="translate(540, 1420)" text-anchor="middle">
    <text font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#F8FAFC" letter-spacing="1">ALÍVIO E BEM-ESTAR CORPORAL</text>
    <text y="46" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#94A3B8" letter-spacing="0.5">Sessões Práticas Diárias de 7 Minutos</text>
    
    <!-- Trust Pill -->
    <g transform="translate(0, 110)">
      <rect x="-190" y="-26" width="380" height="52" rx="26" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-width="1" stroke-opacity="0.15"/>
      <text y="8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#CBD5E1" letter-spacing="1">ACESSO IMEDIATO • 100% ONLINE</text>
    </g>
  </g>
</svg>`;

async function run() {
  await sharp(Buffer.from(verticalSvg))
    .jpeg({ quality: 92 })
    .toFile('public/capa-wiapy-destrava-1080x1920.jpg');
  console.log('Cover generated: public/capa-wiapy-destrava-1080x1920.jpg');
}

run();
