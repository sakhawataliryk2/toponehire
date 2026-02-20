'use client';

import Script from 'next/script';
import { useRef, useLayoutEffect, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY ?? '';

export interface RecaptchaV2CheckboxHandle {
  getToken: () => string | null;
  reset: () => void;
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: { sitekey: string; callback?: (token: string) => void }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
      ready: (callback: () => void) => void;
    };
    __recaptchaV2Ready?: () => void;
  }
}

type Props = {
  onComplete?: (token: string) => void;
};

export const RecaptchaV2Checkbox = forwardRef<RecaptchaV2CheckboxHandle, Props>(function RecaptchaV2Checkbox(
  { onComplete },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !SITE_KEY || typeof window === 'undefined' || !window.grecaptcha) return;
    if (widgetIdRef.current !== null) return;
    try {
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => {
          onComplete?.(token);
        },
      });
    } catch (e) {
      console.error('reCAPTCHA v2 render error:', e);
    }
  }, [onComplete]);

  const handleLoad = useCallback(() => {
    // When the v2 script loads it calls this; the v2 API is ready, so render directly.
    // Do not call window.grecaptcha.ready() here: if Enterprise script also loaded (from layout),
    // it overwrites window.grecaptcha and Enterprise has no .ready() (only .enterprise.ready()).
    renderWidget();
  }, [renderWidget]);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window).__recaptchaV2Ready = handleLoad;
    }
  }, [handleLoad]);

  useImperativeHandle(
    ref,
    () => ({
      getToken() {
        if (typeof window === 'undefined' || !window.grecaptcha) return null;
        const token = window.grecaptcha.getResponse(widgetIdRef.current ?? undefined);
        return token && token.length > 0 ? token : null;
      },
      reset() {
        if (typeof window === 'undefined' || !window.grecaptcha || widgetIdRef.current === null) return;
        window.grecaptcha.reset(widgetIdRef.current);
      },
    }),
    []
  );

  if (!SITE_KEY) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        reCAPTCHA v2 not configured. Set NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY for the “I’m not a robot” checkbox.
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=__recaptchaV2Ready&render=explicit"
        strategy="afterInteractive"
      />
      <div className="flex justify-center py-2">
        <div ref={containerRef} />
      </div>
    </>
  );
});
