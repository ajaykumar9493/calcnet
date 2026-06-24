declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

const CONSENT_KEY = "calcnet-analytics-consent";

export function getAnalyticsConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(CONSENT_KEY);
  if (val === "true") return true;
  if (val === "false") return false;
  return null;
}

export function setAnalyticsConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, String(accepted));
  if (accepted) initAnalytics();
}

export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!getAnalyticsConsent()) return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId && !document.getElementById("ga-script")) {
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.gtag = function (...args: unknown[]) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer =
        (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (plausibleDomain && !document.getElementById("plausible-script")) {
    const script = document.createElement("script");
    script.id = "plausible-script";
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }
}

export function trackEvent(
  name: string,
  props?: Record<string, string>
): void {
  if (!getAnalyticsConsent()) return;
  window.gtag?.("event", name, props);
  window.plausible?.(name, props ? { props } : undefined);
}

export function trackPageView(path: string): void {
  trackEvent("page_view", { path });
}

export function trackCalculatorUse(slug: string): void {
  trackEvent("calculator_use", { calculator: slug });
}
