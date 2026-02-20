const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');

export async function verifyRecaptchaToken(token: string | undefined | null, action?: string) {
  if (!RECAPTCHA_SECRET_KEY) {
    // If not configured, skip verification (avoid blocking in development)
    console.warn('RECAPTCHA_SECRET_KEY is not set. Skipping reCAPTCHA verification.');
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET_KEY);
    params.append('response', token);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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

