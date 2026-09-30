export const GTM_ID = 'GTM-NQCZ3SLQ';

// IDs para configuração das Tags no painel do Google Tag Manager (GTM):
export const CLARITY_ID = 'yl1hrz7ba2';
export const GA4_ID = 'G-V5KMKVNMB3';
export const META_PIXEL_ID = '4482035205446119';

export function GtmHeadScript({ gtmId = GTM_ID }: { gtmId?: string }) {
  const gtmCode = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

  return (
    <script
      id="gtm-script"
      dangerouslySetInnerHTML={{ __html: gtmCode }}
    />
  );
}

export function GtmNoscript({ gtmId = GTM_ID }: { gtmId?: string }) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
