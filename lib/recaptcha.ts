const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');
const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID;
const RECAPTCHA_ENTERPRISE_API_KEY = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/**
 * Verify reCAPTCHA token. Uses Enterprise createAssessment API when
 * RECAPTCHA_PROJECT_ID and RECAPTCHA_ENTERPRISE_API_KEY are set (required for
 * enterprise.js tokens). Otherwise falls back to legacy siteverify.
 */
export async function verifyRecaptchaToken(token: string | undefined | null, action?: string) {
  if (!token) {
    return false;
  }

  // Prefer reCAPTCHA Enterprise API when credentials are set (needed for enterprise.js tokens)
  if (RECAPTCHA_PROJECT_ID && RECAPTCHA_ENTERPRISE_API_KEY && RECAPTCHA_SITE_KEY) {
    return verifyWithEnterprise(token, action);
  }

  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY is not set. For reCAPTCHA Enterprise, set RECAPTCHA_PROJECT_ID and RECAPTCHA_ENTERPRISE_API_KEY instead.');
    return true;
  }

  return verifyWithSiteverify(token, action);
}

async function verifyWithEnterprise(token: string, action?: string): Promise<boolean> {
  try {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_ENTERPRISE_API_KEY}`;
    const body = {
      event: {
        token,
        siteKey: RECAPTCHA_SITE_KEY,
        expectedAction: action || 'ACTION',
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data: any = await res.json();

    if (!res.ok) {
      console.warn('reCAPTCHA Enterprise API error:', res.status, data);
      return false;
    }

    if (!data.tokenProperties?.valid) {
      console.warn('reCAPTCHA Enterprise token invalid:', data.tokenProperties?.invalidReason);
      return false;
    }

    if (action && data.tokenProperties?.action && String(data.tokenProperties.action).toLowerCase() !== String(action).toLowerCase()) {
      console.warn('reCAPTCHA action mismatch:', data.tokenProperties.action, 'expected:', action);
      return false;
    }

    const score = data.riskAnalysis?.score;
    if (typeof score === 'number' && score < RECAPTCHA_MIN_SCORE) {
      console.warn('reCAPTCHA score below threshold:', score);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA Enterprise:', error);
    return false;
  }
}

async function verifyWithSiteverify(token: string, action?: string): Promise<boolean> {
  try {
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET_KEY!);
    params.append('response', token);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data: any = await res.json();

    if (!data.success) {
      console.warn('reCAPTCHA verification failed:', data);
      return false;
    }

    if (typeof data.score === 'number' && data.score < RECAPTCHA_MIN_SCORE) {
      console.warn('reCAPTCHA score below threshold:', data.score);
      return false;
    }

    if (action && data.action && String(data.action).toLowerCase() !== String(action).toLowerCase()) {
      console.warn('reCAPTCHA action mismatch:', data.action, 'expected:', action);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return false;
  }
}

const RECAPTCHA_V2_SECRET_KEY = process.env.RECAPTCHA_V2_SECRET_KEY;

/**
 * Verify reCAPTCHA v2 Checkbox token ("I'm not a robot" / image challenge).
 * Use for sign-in and sign-up forms. Requires RECAPTCHA_V2_SECRET_KEY and a
 * v2 Checkbox key from https://www.google.com/recaptcha/admin
 */
export async function verifyRecaptchaV2Token(token: string | undefined | null): Promise<boolean> {
  if (!RECAPTCHA_V2_SECRET_KEY) {
    console.warn('RECAPTCHA_V2_SECRET_KEY is not set. Skipping reCAPTCHA v2 verification.');
    return true;
  }
  if (!token) {
    return false;
  }
  try {
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_V2_SECRET_KEY);
    params.append('response', token);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data: any = await res.json();
    if (!data.success) {
      console.warn('reCAPTCHA v2 verification failed:', data);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA v2 token:', error);
    return false;
  }
}

