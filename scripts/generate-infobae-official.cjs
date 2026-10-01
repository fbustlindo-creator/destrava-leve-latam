const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const artifactDir = 'C:\\Users\\berna\\.gemini\\antigravity\\brain\\14fbb087-29d4-48c7-8b50-849578db5474';

// 1. Official Infobae SVG paths (cleanly extracted from infobae.com)
const infobaePaths = `
  <path fill="#F68E1E" d="M9.7,18.9c-1.7,0-3.2-0.7-4.3-1.7v39.4H14V17.2C12.9,18.2,11.4,18.9,9.7,18.9z"/>
	<ellipse fill="#F68E1E" cx="9.7" cy="9.6" rx="4.8" ry="4.9"/>
	<g>
		<path fill="#F68E1E" d="M21.1,16.9h8.2v5.8l0.2,0.2c1.3-2.2,3-3.9,5.1-5.2c2.1-1.3,4.5-1.9,7-1.9c4.3,0,7.7,1.1,10.1,3.4
			c2.5,2.2,3.7,5.6,3.7,10.1v27.2h-8.6V31.6c-0.1-3.1-0.8-5.4-2-6.8s-3.1-2.1-5.7-2.1c-1.5,0-2.8,0.3-3.9,0.8
			c-1.2,0.5-2.1,1.3-2.9,2.2c-0.8,0.9-1.4,2.1-1.9,3.3c-0.5,1.3-0.7,2.6-0.7,4.1v23.4h-8.6C21.1,56.5,21.1,16.9,21.1,16.9z"/>
		<path fill="#F68E1E" d="M58.2,16.9h6.4v-3.3c0-2.5,0.3-4.5,0.9-6.1s1.4-2.8,2.4-3.6s2.2-1.4,3.4-1.7c1.3-0.3,2.6-0.4,4-0.4
			c2.8,0,4.8,0.2,6,0.5v6.8c-0.6-0.2-1.1-0.3-1.8-0.3c-0.4,0-1.2-0.1-2-0.1c-1.2,0-2.2,0.3-3,0.8c-0.8,0.6-1.2,1.7-1.2,3.3v4.1h7.3
			v6.5h-7.3v33.1h-8.6V23.4h-6.4L58.2,16.9L58.2,16.9z"/>
		<path fill="#F68E1E" d="M101.4,57.6c-3.1,0-5.9-0.5-8.3-1.6c-2.4-1-4.5-2.5-6.2-4.3s-3-4-3.9-6.6s-1.3-5.4-1.3-8.4
			c0-3,0.4-5.8,1.3-8.4s2.2-4.8,3.9-6.6c1.7-1.8,3.7-3.3,6.2-4.3c2.4-1,5.2-1.6,8.3-1.6c3.1,0,5.9,0.5,8.3,1.6
			c2.4,1,4.5,2.5,6.2,4.3s3,4,3.9,6.6s1.3,5.3,1.3,8.4s-0.4,5.9-1.3,8.4c-0.9,2.6-2.2,4.8-3.9,6.6c-1.7,1.8-3.8,3.3-6.2,4.3
			C107.3,57.1,104.5,57.6,101.4,57.6z M101.4,50.7c1.9,0,3.6-0.4,5-1.2s2.6-1.9,3.5-3.2s1.6-2.8,2-4.5s0.6-3.4,0.6-5.1
			c0-1.7-0.2-3.4-0.6-5.1c-0.4-1.7-1.1-3.2-2-4.5s-2.1-2.4-3.5-3.2c-1.4-0.8-3.1-1.2-5-1.2s-3.6,0.4-5,1.2c-1.4,0.8-2.6,1.9-3.5,3.2
			c-0.9,1.3-1.6,2.8-2,4.5c-0.4,1.7-0.6,3.4-0.6,5.1s0.2,3.4,0.6,5.1c0.4,1.7,1.1,3.2,2,4.5s2.1,2.4,3.5,3.2S99.5,50.7,101.4,50.7z"/>
		<path fill="#F68E1E" d="M126.2,1.8h8.6V22h0.2c0.6-1,1.3-1.8,2.2-2.6c0.9-0.8,1.8-1.4,2.8-2c1-0.5,2.1-0.9,3.2-1.2
			c1.1-0.3,2.3-0.4,3.4-0.4c3.1,0,5.7,0.5,8,1.6s4.2,2.6,5.7,4.5s2.6,4.2,3.4,6.7c0.8,2.6,1.1,5.3,1.1,8.2c0,2.7-0.3,5.2-1,7.7
			s-1.7,4.7-3.1,6.6c-1.4,1.9-3.1,3.5-5.2,4.6c-2.1,1.2-4.6,1.7-7.5,1.7c-1.3,0-2.6-0.1-4-0.3c-1.3-0.2-2.6-0.5-3.8-1
			s-2.3-1.2-3.3-2s-1.8-1.9-2.5-3.2h-0.1v5.4h-8.2L126.2,1.8L126.2,1.8z M156.2,36.8c0-1.8-0.2-3.5-0.7-5.2s-1.1-3.2-2-4.5
			s-2-2.4-3.4-3.1c-1.4-0.8-2.9-1.2-4.7-1.2c-3.6,0-6.4,1.3-8.2,3.8c-1.8,2.6-2.8,6-2.8,10.2c0,2,0.2,3.8,0.7,5.6
			c0.5,1.7,1.2,3.2,2.2,4.4s2.1,2.2,3.4,2.9c1.3,0.7,2.9,1.1,4.6,1.1c2,0,3.6-0.4,5-1.2s2.5-1.9,3.4-3.2s1.5-2.8,1.9-4.4
			C156,40.2,156.2,38.5,156.2,36.8z"/>
		<path fill="#F68E1E" d="M202.4,47.7c0,1.1,0.1,1.8,0.4,2.3c0.3,0.5,0.8,0.7,1.6,0.7c0.3,0,0.6,0,0.9,0c0.4,0,0.8-0.1,1.2-0.2v6.1
			c-0.3,0.1-0.7,0.2-1.2,0.3s-1,0.2-1.5,0.3s-1,0.2-1.5,0.2c-0.5,0.1-0.9,0.1-1.3,0.1c-1.8,0-3.2-0.4-4.4-1.1
			c-1.2-0.7-1.9-2-2.3-3.8c-1.7,1.7-3.8,2.9-6.3,3.7s-4.9,1.1-7.2,1.1c-1.8,0-3.4-0.2-5.1-0.7c-1.6-0.5-3-1.2-4.3-2.1
			c-1.2-0.9-2.2-2.1-2.9-3.6s-1.1-3.2-1.1-5.1c0-2.5,0.4-4.4,1.3-6c0.9-1.5,2-2.7,3.5-3.6c1.4-0.9,3-1.5,4.8-1.9s3.6-0.7,5.4-0.9
			c1.6-0.3,3-0.5,4.5-0.7c1.4-0.1,2.7-0.3,3.7-0.7c1.1-0.3,1.9-0.8,2.6-1.4c0.6-0.6,0.9-1.6,0.9-2.9c0-1.1-0.3-2-0.8-2.8
			c-0.5-0.7-1.2-1.3-2-1.6c-0.8-0.4-1.6-0.6-2.6-0.8c-1-0.1-1.9-0.2-2.7-0.2c-2.4,0-4.4,0.5-6,1.5s-2.4,2.6-2.6,4.8h-8.6
			c0.2-2.6,0.8-4.7,1.8-6.4c1.1-1.7,2.4-3,4-4.1c1.6-1,3.5-1.7,5.6-2.1s4.2-0.6,6.3-0.6c1.9,0,3.8,0.2,5.7,0.6s3.5,1.1,5,2
			s2.7,2.1,3.6,3.6c0.9,1.5,1.4,3.2,1.4,5.3v20.7H202.4z M193.8,36.7c-1.3,0.9-2.9,1.4-4.8,1.6c-1.9,0.2-3.8,0.4-5.7,0.8
			c-0.9,0.2-1.8,0.4-2.6,0.7c-0.9,0.3-1.6,0.7-2.3,1.2s-1.2,1.1-1.5,1.9c-0.4,0.8-0.6,1.8-0.6,2.9c0,1,0.3,1.8,0.8,2.5
			c0.6,0.7,1.2,1.2,2,1.6c0.8,0.4,1.6,0.7,2.6,0.8c0.9,0.2,1.8,0.2,2.5,0.2c1,0,2-0.1,3.1-0.4c1.1-0.3,2.2-0.7,3.1-1.3
			c1-0.6,1.8-1.4,2.5-2.3c0.7-0.9,1-2.1,1-3.5v-6.7H193.8z"/>
		<path fill="#F68E1E" d="M216.1,39c0,1.5,0.2,3,0.6,4.4c0.4,1.4,1.1,2.7,1.9,3.8c0.9,1.1,1.9,1.9,3.2,2.6c1.3,0.6,2.9,1,4.7,1
			c2.5,0,4.5-0.5,6.1-1.6c1.5-1.1,2.7-2.7,3.4-4.9h8.2c-0.5,2.1-1.2,4.1-2.3,5.8s-2.4,3.1-4,4.3c-1.6,1.1-3.3,2-5.2,2.6
			s-4,0.9-6.1,0.9c-3.1,0-5.8-0.5-8.2-1.5s-4.4-2.5-6-4.3s-2.9-4-3.7-6.6s-1.2-5.4-1.2-8.4c0-2.8,0.4-5.5,1.3-8
			c0.9-2.5,2.1-4.8,3.8-6.7c1.6-1.9,3.6-3.4,5.9-4.6c2.3-1.1,4.9-1.7,7.9-1.7c3.1,0,5.8,0.7,8.3,2c2.4,1.3,4.5,3,6.1,5.2
			c1.6,2.1,2.8,4.6,3.5,7.4c0.7,2.8,0.9,5.7,0.6,8.6h-28.8V39z M236.2,33.2c-0.1-1.4-0.4-2.7-0.9-4s-1.1-2.4-2-3.3
			c-0.8-0.9-1.8-1.7-3-2.3c-1.2-0.6-2.5-0.9-4-0.9s-2.9,0.3-4.1,0.8c-1.2,0.5-2.3,1.3-3.2,2.2c-0.9,0.9-1.6,2.1-2.1,3.3
			c-0.5,1.3-0.8,2.7-0.9,4.1L236.2,33.2L236.2,33.2z"/>
	</g>
`;

// 2. Real Infobae Mobile Header (1024 x 90, Pure White Background #FFFFFF)
const officialWhiteHeaderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 92" width="1024" height="92">
  <!-- Clean White Header Background -->
  <rect width="1024" height="92" fill="#ffffff"/>

  <!-- Left: Black Hamburger Menu Icon -->
  <g transform="translate(36, 30)">
    <rect width="30" height="4" rx="2" fill="#111827"/>
    <rect y="12" width="24" height="4" rx="2" fill="#111827"/>
    <rect y="24" width="30" height="4" rx="2" fill="#111827"/>
  </g>

  <!-- Center/Left: Authentic Orange Infobae Logo -->
  <g transform="translate(100, 16) scale(1.02)">
    ${infobaePaths}
  </g>

  <!-- Section divider & Section Name: SALUD -->
  <g transform="translate(390, 61)">
    <line x1="0" y1="-34" x2="0" y2="2" stroke="#E2E8F0" stroke-width="2.5"/>
    <text x="22" y="-2" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="900" fill="#1E293B" letter-spacing="2">
      SALUD
    </text>
  </g>

  <!-- Right Side: AMÉRICA Edition Badge & Search Icon -->
  <g transform="translate(860, 46)">
    <!-- Edition pill -->
    <rect x="-115" y="-17" width="128" height="34" rx="17" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
    <circle cx="-96" cy="0" r="4.5" fill="#10B981"/>
    <text x="-46" y="5" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="15" font-weight="700" fill="#475569" text-anchor="middle" letter-spacing="1">AMÉRICA</text>

    <!-- Search Magnifying Glass Icon in crisp black -->
    <g transform="translate(48, -12)">
      <circle cx="11" cy="11" r="9.5" fill="none" stroke="#1E293B" stroke-width="2.8"/>
      <line x1="18.5" y1="18.5" x2="26" y2="26" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Subtle Bottom Border line -->
  <line x1="0" y1="91" x2="1024" y2="91" stroke="#E5E7EB" stroke-width="1.5"/>
  <!-- Thin orange brand accent line -->
  <rect x="0" y="89" width="375" height="3" fill="#F68E1E"/>
</svg>
`;

async function run() {
  // Generate the clean header PNG and WEBP
  const headerBuf = Buffer.from(officialWhiteHeaderSvg);
  
  const headerPngPath = path.join(artifactDir, 'infobae-header-oficial-blanco.png');
  await sharp(headerBuf).png().toFile(headerPngPath);
  
  // Also save to public for the app
  await sharp(headerBuf).png().toFile('public/infobae-header-ref.png');
  await sharp(headerBuf).webp({ quality: 95 }).toFile('public/infobae-header-ref.webp');

  console.log('Saved header to:', headerPngPath);

  // Now create a FULL preview mockup of the Infobae article card as it appears on mobile!
  // Width: 800px, Height: 1200px
  const fullCardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1250" width="800" height="1250">
  <defs>
    <filter id="cardShadow" x="-5%" y="-2%" width="110%" height="106%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.10"/>
    </filter>
  </defs>

  <!-- Background App Canvas -->
  <rect width="800" height="1250" fill="#f4f5f8"/>

  <!-- Top Phone Funnel Bar / Category -->
  <rect width="800" height="70" fill="#ffffff"/>
  <text x="40" y="44" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="20" font-weight="700" fill="#64748b">MECANISMO SOMÁTICO</text>
  <text x="760" y="44" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="20" font-weight="800" fill="#F68E1E" text-anchor="end">PASO 26 DE 39</text>
  <line x1="0" y1="70" x2="800" y2="70" stroke="#e2e8f0" stroke-width="2"/>

  <!-- Main Article Card -->
  <g transform="translate(40, 100)" filter="url(#cardShadow)">
    <!-- White Card Body -->
    <rect width="720" height="1090" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>

    <!-- Embed Infobae Official Header (clipped to top radius) -->
    <g transform="translate(0, 0)">
      <clipPath id="headerClip">
        <rect width="720" height="74" rx="16"/>
      </clipPath>
      <g clip-path="url(#headerClip)">
        <rect width="720" height="74" fill="#ffffff"/>
        
        <!-- Hamburger -->
        <g transform="translate(24, 25)">
          <rect width="24" height="3" rx="1.5" fill="#111827"/>
          <rect y="9" width="18" height="3" rx="1.5" fill="#111827"/>
          <rect y="18" width="24" height="3" rx="1.5" fill="#111827"/>
        </g>

        <!-- Logo -->
        <g transform="translate(70, 14) scale(0.78)">
          ${infobaePaths}
        </g>

        <!-- Divider & SALUD -->
        <g transform="translate(290, 48)">
          <line x1="0" y1="-26" x2="0" y2="2" stroke="#E2E8F0" stroke-width="2"/>
          <text x="16" y="-2" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="21" font-weight="900" fill="#1E293B" letter-spacing="1.5">SALUD</text>
        </g>

        <!-- Right: AMÉRICA & Search -->
        <g transform="translate(620, 38)">
          <rect x="-70" y="-13" width="90" height="26" rx="13" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
          <circle cx="-56" cy="0" r="3.5" fill="#10B981"/>
          <text x="-16" y="4" font-family="Arial" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">AMÉRICA</text>
          
          <g transform="translate(32, -9)">
            <circle cx="8" cy="8" r="7" fill="none" stroke="#1E293B" stroke-width="2"/>
            <line x1="13.5" y1="13.5" x2="19" y2="19" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/>
          </g>
        </g>

        <!-- Bottom Border & Orange Bar -->
        <line x1="0" y1="73" x2="720" y2="73" stroke="#E5E7EB" stroke-width="1"/>
        <rect x="0" y="71" width="260" height="3" fill="#F68E1E"/>
      </g>
    </g>

    <!-- Kicker -->
    <text x="32" y="118" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="14" font-weight="900" fill="#F68E1E" letter-spacing="1.5">TENDENCIAS &amp; BIENESTAR</text>

    <!-- Headline -->
    <text x="32" y="156" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="28" font-weight="900" fill="#111827">“Destrava Leve”: El Método de</text>
    <text x="32" y="194" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="28" font-weight="900" fill="#111827">7 Minutos de Liberación Fascial</text>
    <text x="32" y="232" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="28" font-weight="900" fill="#111827">que Ayuda a Mujeres en América Latina</text>

    <!-- Lead / Bajada -->
    <text x="32" y="280" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="18.5" font-weight="400" fill="#475569">Especialistas destacan cómo la liberación suave de la fascia</text>
    <text x="32" y="308" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="18.5" font-weight="400" fill="#475569">combinada con la activación del nervio vago permite desarmar</text>
    <text x="32" y="336" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="18.5" font-weight="400" fill="#475569">la rigidez crónica y recuperar la ligereza sin impacto articular.</text>

    <!-- Byline Meta -->
    <g transform="translate(32, 382)">
      <line x1="0" y1="0" x2="656" y2="0" stroke="#f1f5f9" stroke-width="1.5"/>
      <text x="0" y="26" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="14" fill="#64748b">
        <tspan font-weight="800" fill="#111827">Por Infobae Salud</tspan> | Edición América Latina · Actualizado hace 1 hora
      </text>
      <line x1="0" y1="42" x2="656" y2="42" stroke="#f1f5f9" stroke-width="1.5"/>
    </g>

    <!-- Photo Container placeholder with styled graphic -->
    <g transform="translate(32, 450)">
      <rect width="656" height="390" rx="12" fill="#e2e8f0"/>
      <!-- Soft gradient overlay -->
      <defs>
        <linearGradient id="photoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="60%" stop-color="#1e293b" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect width="656" height="390" rx="12" fill="url(#photoGrad)"/>
      <text x="328" y="195" font-family="Arial" font-size="22" font-weight="700" fill="#64748b" text-anchor="middle">[Foto: Práctica Somática Suave en Casa]</text>
      
      <!-- Photo Badge -->
      <rect x="20" y="340" width="190" height="30" rx="6" fill="#000000" fill-opacity="0.6"/>
      <text x="115" y="360" font-family="Arial" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">RUTINA DE 7 MINUTOS</text>
    </g>

    <!-- Epígrafe / Pie de foto -->
    <text x="32" y="866" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="13.5" font-style="italic" fill="#64748b">
      La rutina diaria de 7 minutos se enfoca en liberar la rigidez de la fascia para desinflamar el cuerpo. (Foto: Archivo / Infobae)
    </text>

    <!-- Share Buttons (Facebook, WhatsApp, Compartir) -->
    <g transform="translate(32, 895)">
      <!-- FB -->
      <rect x="0" y="0" width="206" height="52" rx="12" fill="#eff6ff" stroke="#dbeafe" stroke-width="1.5"/>
      <text x="103" y="32" font-family="Arial" font-size="15" font-weight="700" fill="#1d4ed8" text-anchor="middle">Facebook</text>

      <!-- WA -->
      <rect x="225" y="0" width="206" height="52" rx="12" fill="#f0fdf4" stroke="#dcfce7" stroke-width="1.5"/>
      <text x="328" y="32" font-family="Arial" font-size="15" font-weight="700" fill="#15803d" text-anchor="middle">WhatsApp</text>

      <!-- Share -->
      <rect x="450" y="0" width="206" height="52" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="553" y="32" font-family="Arial" font-size="15" font-weight="700" fill="#475569" text-anchor="middle">Compartir</text>
    </g>

    <!-- Qualification Preview Banner at the bottom -->
    <g transform="translate(32, 975)">
      <rect width="656" height="85" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="24" y="36" font-family="Arial" font-size="18" font-weight="900" fill="#10B981">✨ ¡Excelente noticia!</text>
      <text x="24" y="62" font-family="Arial" font-size="14.5" fill="#475569">Tu perfil coincide con los resultados del protocolo Destrava Leve...</text>
    </g>
  </g>
</svg>
`;

  const previewBuf = Buffer.from(fullCardSvg);
  const previewPngPath = path.join(artifactDir, 'preview-mecanismo-infobae-oficial.png');
  await sharp(previewBuf).png().toFile(previewPngPath);
  console.log('Saved preview mockup to:', previewPngPath);
}

run();
