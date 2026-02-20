# reCAPTCHA Enterprise setup

The app uses **reCAPTCHA Enterprise** with your site key and the same pattern as your snippet:

- Script: `https://www.google.com/recaptcha/enterprise.js?render=6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg`
- **Login**: `grecaptcha.enterprise.ready()` then `grecaptcha.enterprise.execute(siteKey, { action: 'LOGIN' })`
- **Registration**: same, with `action: 'REGISTER'`

---

## Fix "reCAPTCHA verification failed" and "Invalid domain" (Vercel)

Do **both** of these:

### Step 1: Add your Vercel domain to the key

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **Security** → **reCAPTCHA Enterprise**.
2. Open the **Website** key whose **Site key** is `6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg`.
3. Under **Domain names** (or **Application restrictions**), add exactly: **`toponehire.vercel.app`** (no https, no path).
4. Save. Wait 1–2 minutes.

### Step 2: Use Enterprise verification (recommended)

Tokens from `enterprise.js` verify correctly when you use the Enterprise API. Add these to **Vercel** (Project → Settings → Environment Variables) and to your local `.env`:

```env
RECAPTCHA_PROJECT_ID=your-google-cloud-project-id
RECAPTCHA_ENTERPRISE_API_KEY=your-api-key-with-recaptcha-enterprise-enabled
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg
```

- **RECAPTCHA_PROJECT_ID**: Your Google Cloud project ID (e.g. `my-project-123`) where the reCAPTCHA key was created. Find it in Cloud Console project dropdown or IAM & Admin → Settings.
- **RECAPTCHA_ENTERPRISE_API_KEY**: In **APIs & Services** → **Credentials** → **Create credentials** → **API key**. Restrict the key to **Recaptcha Enterprise API**.

Redeploy after setting the variables. Login and registration should then succeed.

---

## reCAPTCHA v2 Checkbox (Sign in / Sign up)

Sign-in and registration pages use **reCAPTCHA v2 Checkbox** (“I’m not a robot”) so users must complete the checkbox and any image challenge before submitting.

1. Create a **v2 Checkbox** key at [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin): choose **reCAPTCHA v2** → **“I’m not a robot” Checkbox**, add your domains (e.g. `toponehire.vercel.app`), then get the **Site key** and **Secret key**.
2. In `.env` and Vercel set:
   - `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY` = your v2 site key  
   - `RECAPTCHA_V2_SECRET_KEY` = your v2 secret key  

The Resume (add-listing) flow still uses the Enterprise/invisible reCAPTCHA; only Sign in and Sign up use the v2 checkbox.

---

## What you need to add

### 1a. Enterprise verification (recommended)

Set these so the app uses the createAssessment API (see Step 2 above for how to get them):

```env
RECAPTCHA_PROJECT_ID=your-gcp-project-id
RECAPTCHA_ENTERPRISE_API_KEY=your-api-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg
```

### 1b. Legacy secret (fallback)

If you do not set the Enterprise vars, the app uses the classic siteverify endpoint. Add to `.env` and Vercel:

```env
RECAPTCHA_SECRET_KEY=6Le5S20sAAAAALqjF97HY__tiOfl4gZGhopv6PIZ
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

The site key is loaded from `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (fallback in code). If you prefer to load it from env, add:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg
```

and we can switch the app to use it.

## Summary

| Variable | Where | Purpose |
|----------|--------|--------|
| **RECAPTCHA_PROJECT_ID** + **RECAPTCHA_ENTERPRISE_API_KEY** | `.env` and Vercel | Enterprise verification (recommended). |
| **RECAPTCHA_SECRET_KEY** | `.env` and Vercel | Fallback legacy verification. |
| NEXT_PUBLIC_RECAPTCHA_SITE_KEY | `.env` and Vercel | Site key (used by frontend and Enterprise API). |
| RECAPTCHA_MIN_SCORE | `.env` (optional) | Minimum score; default 0.5. |

After changing env vars, restart the dev server or redeploy.

---

## Troubleshooting: "Invalid domain" on Vercel

This error means the **exact hostname** of the page (what you see in the browser address bar) is not in your reCAPTCHA key’s domain list.

### 1. Use the exact hostname (no protocol, no path)

- ✅ Correct: `toponehire.com`, `www.toponehire.com`, `your-app.vercel.app`
- ❌ Wrong: `https://toponehire.com`, `toponehire.com/login`, `https://www.toponehire.com/`

### 2. Add every domain you use

In [Google Cloud Console](https://console.cloud.google.com/) → **Security** → **reCAPTCHA Enterprise** → your **Website** key → **Domain names** (or **Application restrictions**), add **each** of these that you actually use:

| Where you open the site | Add this domain |
|-------------------------|------------------|
| Production (Vercel)     | `your-project.vercel.app` (replace with your real Vercel URL) |
| Custom domain           | `toponehire.com` and `www.toponehire.com` if you use www |
| Preview deployments     | Either the exact URL (e.g. `project-git-main-you.vercel.app`) or try adding `vercel.app` so all `*.vercel.app` are allowed |

So if you open the app at `https://toponehire-xyz.vercel.app/login`, the domain list must include `toponehire-xyz.vercel.app`.

### 3. Check it’s the right key

Confirm the key whose **Key ID** or **Site key** is `6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg` is the one where you added the domains. If you have multiple keys, it’s easy to edit the wrong one.

### 4. Save and wait a minute

After adding or changing domains, **save** the key. Changes can take a short time to apply; try again after 1–2 minutes.

### 5. See the real hostname on Vercel

To know exactly what to add:

- Open your app on Vercel (production or preview).
- Look at the browser address bar: e.g. `https://toponehire-abc123.vercel.app/...`
- The part to add is: `toponehire-abc123.vercel.app` (no `https://`, no path).

Add that string to the reCAPTCHA key’s domain list, save, then reload the page and try again.
