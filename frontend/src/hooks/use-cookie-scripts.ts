import { useEffect } from 'react';
import { useCookieConsent } from './use-cookie-consent';

/**
 * Hook to conditionally load third-party scripts based on cookie consent
 * This ensures GDPR compliance by only loading tracking scripts after user consent
 */
export function useCookieScripts() {
  const { preferences, hasResponded } = useCookieConsent();

  // Handle Analytics Scripts (Google Analytics)
  useEffect(() => {
    if (!hasResponded) {
      // Don't load anything until user has responded to cookie banner
      return;
    }

    if (preferences.analytics) {
      // User has consented to analytics cookies
      console.log('[Cookie Scripts] Analytics consent granted - GA would load here');

      // TEMPLATE: Uncomment below to load Google Analytics
      /*
      const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 measurement ID

      // Load Google Analytics gtag.js script
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gtagScript);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true, // Anonymize IP for GDPR compliance
        cookie_flags: 'SameSite=None;Secure' // Cookie security flags
      });
      */
    } else {
      // User has rejected analytics cookies - remove any existing GA cookies
      console.log('[Cookie Scripts] Analytics consent withdrawn - Removing GA cookies');

      // Remove Google Analytics cookies
      const gaCookies = ['_ga', '_gid', '_gat', '_gat_gtag'];
      gaCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });
    }
  }, [preferences.analytics, hasResponded]);

  // Handle Marketing Scripts
  useEffect(() => {
    if (!hasResponded) {
      return;
    }

    if (preferences.marketing) {
      // User has consented to marketing cookies
      console.log('[Cookie Scripts] Marketing consent granted - Marketing pixels would load here');

      // TEMPLATE: Add marketing pixels here (Facebook Pixel, LinkedIn Insight Tag, etc.)
      /*
      // Example: Facebook Pixel
      !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      }(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
      */
    } else {
      // User has rejected marketing cookies - remove any existing marketing cookies
      console.log('[Cookie Scripts] Marketing consent withdrawn - Removing marketing cookies');

      // Remove Facebook Pixel cookies (if implemented)
      const fbCookies = ['_fbp', '_fbc'];
      fbCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
  }, [preferences.marketing, hasResponded]);

  // Log consent status on change
  useEffect(() => {
    if (hasResponded) {
      console.log('[Cookie Scripts] Consent status:', {
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        necessary: preferences.necessary
      });
    }
  }, [preferences, hasResponded]);
}
