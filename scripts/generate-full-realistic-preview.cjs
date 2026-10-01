const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const artifactDir = 'C:\\Users\\berna\\.gemini\\antigravity\\brain\\14fbb087-29d4-48c7-8b50-849578db5474';

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

async function generatePreview() {
  // 1. Process the photo: resize to 656x390 with rounded corners
  const photo = await sharp('public/materia-g1-destrava.jpg')
    .resize(656, 390, { fit: 'cover' })
    .composite([{
      input: Buffer.from('<svg><rect width="656" height="390" rx="14" ry="14" fill="#fff"/></svg>'),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // 2. Base layout SVG
  const baseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 1200" width="760" height="1200">
  <defs>
    <filter id="shadow" x="-3%" y="-2%" width="106%" height="106%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="760" height="1200" fill="#f8fafc"/>

  <!-- Phone Top Status Bar -->
  <rect width="760" height="48" fill="#ffffff"/>
  <text x="32" y="30" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="14" font-weight="700" fill="#0f172a">9:41</text>
  <text x="728" y="30" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="14" font-weight="700" fill="#0f172a" text-anchor="end">100% 🔋</text>
  <line x1="0" y1="48" x2="760" y2="48" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Funnel Header: Destrava Leve + Progress -->
  <rect y="48" width="760" height="54" fill="#ffffff"/>
  <text x="32" y="81" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="16" font-weight="800" fill="#0f172a">← DESTRAVA LEVE</text>
  <text x="728" y="81" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="14" font-weight="700" fill="#F68E1E" text-anchor="end">67% COMPLETADO</text>
  <line x1="0" y1="102" x2="760" y2="102" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Infobae News Article Card -->
  <g transform="translate(24, 120)" filter="url(#shadow)">
    <!-- Card White Container -->
    <rect width="712" height="1040" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>

    <!-- ── Header Infobae Oficial (Blanco con Logo Naranja) ── -->
    <g transform="translate(0, 0)">
      <clipPath id="c1"><rect width="712" height="66" rx="16"/></clipPath>
      <g clip-path="url(#c1)">
        <rect width="712" height="66" fill="#ffffff"/>
        
        <!-- Hamburger Menu -->
        <g transform="translate(22, 22)">
          <rect width="22" height="3" rx="1.5" fill="#111827"/>
          <rect y="8" width="16" height="3" rx="1.5" fill="#111827"/>
          <rect y="16" width="22" height="3" rx="1.5" fill="#111827"/>
        </g>

        <!-- Official Infobae Vector Logo in Orange #F68E1E -->
        <g transform="translate(64, 11) scale(0.74)">
          ${infobaePaths}
        </g>

        <!-- Vertical Divider & SALUD -->
        <g transform="translate(275, 43)">
          <line x1="0" y1="-23" x2="0" y2="2" stroke="#E2E8F0" stroke-width="2"/>
          <text x="14" y="-2" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="19" font-weight="900" fill="#111827" letter-spacing="1.5">SALUD</text>
        </g>

        <!-- Right Side: AMÉRICA Pill & Search -->
        <g transform="translate(615, 33)">
          <rect x="-65" y="-12" width="82" height="24" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
          <circle cx="-52" cy="0" r="3.5" fill="#10B981"/>
          <text x="-16" y="4" font-family="Arial" font-size="10.5" font-weight="800" fill="#475569" text-anchor="middle">AMÉRICA</text>
          
          <g transform="translate(28, -8)">
            <circle cx="7" cy="7" r="6" fill="none" stroke="#111827" stroke-width="2"/>
            <line x1="12" y1="12" x2="16" y2="16" stroke="#111827" stroke-width="2.2" stroke-linecap="round"/>
          </g>
        </g>

        <!-- Bottom Border & Orange Brand Line -->
        <line x1="0" y1="65" x2="712" y2="65" stroke="#E5E7EB" stroke-width="1"/>
        <rect x="0" y="63" width="240" height="2.5" fill="#F68E1E"/>
      </g>
    </g>

    <!-- Kicker -->
    <text x="28" y="104" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="12" font-weight="900" fill="#F68E1E" letter-spacing="1.2">SALUD Y BIENESTAR</text>

    <!-- Headline -->
    <text x="28" y="138" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="24" font-weight="900" fill="#111827">“Destrava Leve”: El Método de</text>
    <text x="28" y="170" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="24" font-weight="900" fill="#111827">7 Minutos de Liberación Fascial</text>
    <text x="28" y="202" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="24" font-weight="900" fill="#111827">que Ayuda a Mujeres en América Latina</text>

    <!-- Lead -->
    <text x="28" y="238" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="15" font-weight="400" fill="#475569">Especialistas destacan cómo la liberación suave de la fascia combinada</text>
    <text x="28" y="260" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="15" font-weight="400" fill="#475569">con la activación del nervio vago permite desarmar la rigidez crónica</text>
    <text x="28" y="282" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="15" font-weight="400" fill="#475569">y recuperar la ligereza corporal, todo desde casa y sin impacto articular.</text>

    <!-- Byline Meta -->
    <g transform="translate(28, 308)">
      <line x1="0" y1="0" x2="656" y2="0" stroke="#f1f5f9" stroke-width="1"/>
      <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="12" fill="#64748b">
        <tspan font-weight="800" fill="#111827">Por Infobae Salud</tspan> | Tendencias y Bienestar · Actualizado hace 1 hora
      </text>
      <line x1="0" y1="32" x2="656" y2="32" stroke="#f1f5f9" stroke-width="1"/>
    </g>

    <!-- Space for photo at y=355 (656 x 390) -->

    <!-- Epígrafe -->
    <text x="28" y="770" font-family="-apple-system, BlinkMacSystemFont, Arial" font-size="12" font-style="italic" fill="#64748b">
      Rutina de 7 minutos diarios se enfoca en liberar la rigidez de la fascia para desinflamar el cuerpo. (Foto: Archivo / Infobae)
    </text>

    <!-- Share Buttons -->
    <g transform="translate(28, 792)">
      <!-- FB -->
      <rect x="0" y="0" width="208" height="44" rx="10" fill="#eff6ff" stroke="#dbeafe" stroke-width="1"/>
      <text x="104" y="27" font-family="Arial" font-size="13.5" font-weight="700" fill="#1d4ed8" text-anchor="middle">Facebook</text>

      <!-- WA -->
      <rect x="224" y="0" width="208" height="44" rx="10" fill="#f0fdf4" stroke="#dcfce7" stroke-width="1"/>
      <text x="328" y="27" font-family="Arial" font-size="13.5" font-weight="700" fill="#15803d" text-anchor="middle">WhatsApp</text>

      <!-- Share -->
      <rect x="448" y="0" width="208" height="44" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="552" y="27" font-family="Arial" font-size="13.5" font-weight="700" fill="#475569" text-anchor="middle">Compartir</text>
    </g>

    <!-- Qualification Card -->
    <g transform="translate(28, 856)">
      <rect width="656" height="154" rx="12" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="20" y="32" font-family="Arial" font-size="16" font-weight="900" fill="#166534">✨ ¡Excelente noticia!</text>
      <text x="20" y="58" font-family="Arial" font-size="13.5" font-weight="700" fill="#15803d">Tu perfil encaja perfectamente con el método Destrava Leve:</text>
      
      <text x="24" y="84" font-family="Arial" font-size="12.5" fill="#14532d">✓ Has intentado otros métodos sin lograr que tu cuerpo se sienta liviano y libre de dolor</text>
      <text x="24" y="104" font-family="Arial" font-size="12.5" fill="#14532d">✓ No tienes tiempo ni energía para rutinas agotadoras de gimnasio</text>
      <text x="24" y="124" font-family="Arial" font-size="12.5" fill="#14532d">✓ Sientes rigidez muscular, piernas pesadas o inflamación persistente en el abdomen</text>
      <text x="24" y="144" font-family="Arial" font-size="12.5" fill="#14532d">✓ Buscas una solución guiada de 7 minutos al día, segura y desde casa</text>
    </g>
  </g>
</svg>
`;

  // 3. Composite everything into one image
  const baseBuf = Buffer.from(baseSvg);
  const finalImage = await sharp(baseBuf)
    .composite([
      {
        input: photo,
        top: 475, // 120 + 355
        left: 52  // 24 + 28
      }
    ])
    .png()
    .toBuffer();

  const finalPath = path.join(artifactDir, 'mockup-mecanismo-infobae-real.png');
  await sharp(finalImage).toFile(finalPath);
  console.log('Final realistic mockup saved to:', finalPath);
}

generatePreview();
