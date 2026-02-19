# reCAPTCHA Enterprise setup

The app uses **reCAPTCHA Enterprise** with your site key and the same pattern as your snippet:

- Script: `https://www.google.com/recaptcha/enterprise.js?render=6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg`
- **Login**: `grecaptcha.enterprise.ready()` then `grecaptcha.enterprise.execute(siteKey, { action: 'LOGIN' })`
- **Registration**: same, with `action: 'REGISTER'`

## What you need to add

### 1. Server-side secret (required for verification)

Add to your `.env` (and to Vercel/hosting env vars):

```env
RECAPTCHA_SECRET_KEY=your_enterprise_secret_key_here
```

- Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials** (or **Security** → **reCAPTCHA Enterprise**).
- Open your reCAPTCHA Enterprise key.
- Copy the **Secret key** (server key) and set it as `RECAPTCHA_SECRET_KEY`.

**Note:** reCAPTCHA Enterprise usually verifies tokens via the [Recaptcha Enterprise API](https://cloud.google.com/recaptcha-enterprise/docs/verify-assessment) (createAssessment), not the classic `siteverify` endpoint. This app currently uses `siteverify`. If verification fails in production, you may need to switch to the Enterprise API (project ID + API key or service account). For many keys, a “secret” is still provided and works with the existing flow.

### 2. Optional: minimum score

To enforce a minimum score (e.g. 0.5):

```env
RECAPTCHA_MIN_SCORE=0.5
```

### 3. No front-end env needed

The site key `6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg` is already in the code. If you prefer to load it from env, add:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg
```

and we can switch the app to use it.

## Summary

| You provide | Where | Purpose |
|------------|--------|--------|
| **RECAPTCHA_SECRET_KEY** | `.env` and hosting | Server-side token verification (required). |
| RECAPTCHA_MIN_SCORE | `.env` (optional) | Minimum score; default 0.5. |
| NEXT_PUBLIC_RECAPTCHA_SITE_KEY | `.env` (optional) | Only if you want the site key from env. |

After setting `RECAPTCHA_SECRET_KEY`, restart the dev server or redeploy.
