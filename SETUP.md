# My Customs Website — Setup & Handover Guide

This document explains how to install, configure, and run the My Customs
website on a fresh machine. The project is a [Next.js](https://nextjs.org)
application with an embedded [Sanity](https://www.sanity.io) Studio (CMS).

> **Sensitive data notice**
> No passwords, API tokens, or other secrets are stored in this source code.
> All sensitive values — environment variables, the Sanity/Google sign-in
> account, and any other credentials — are delivered separately in a document
> titled **"MyCustoms-Credentials"**, sent to you by email.
> Keep that document private and do not commit it to version control.

---

## 1. Prerequisites

Make sure the following are installed on your machine:

| Tool        | Recommended version | Notes                                   |
| ----------- | ------------------- | --------------------------------------- |
| **Node.js** | 20 LTS or newer     | Includes `npm`. Download from nodejs.org |
| **npm**     | 10 or newer         | Comes bundled with Node.js              |
| **Git**     | Any recent version  | To clone / manage the repository        |

Check your versions:

```bash
node -v
npm -v
```

---

## 2. Install dependencies

From the project root (the folder containing `package.json`):

```bash
npm install
```

This installs all packages listed in `package.json` into `node_modules`.

---

## 3. Configure environment variables

The app reads its configuration from a `.env.local` file in the project root.
This file is **not** included in the handed-over source code (it contains
secrets). A template is provided as `.env.example`.

1. Create your own `.env.local` from the template:

   ```bash
   cp .env.example .env.local      # macOS / Linux
   copy .env.example .env.local    # Windows (cmd)
   ```

2. Open `.env.local` and fill in the real values.
   **All of these values are provided in the "MyCustoms-Credentials"
   document sent by email.**

### Environment variable reference

| Variable                          | Required | Purpose                                                            |
| --------------------------------- | -------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | Yes      | Sanity project ID (used by the site and Studio).                   |
| `NEXT_PUBLIC_SANITY_DATASET`      | Yes      | Sanity dataset name (e.g. `production`).                            |
| `NEXT_PUBLIC_SANITY_API_VERSION`  | No       | Sanity API version. Defaults to `2025-12-22` if not set.           |
| `SANITY_API_TOKEN`                | No\*     | Write token. Only needed to run the migration script in `/scripts`.|
| `SANITY_WEBHOOK_SECRET`           | Yes      | Verifies Sanity webhooks for on-demand revalidation.               |
| `LIBRETRANSLATE_URL`              | No       | URL of a LibreTranslate server (auto-translation helper).          |
| `SITE_URL`                        | Yes      | Public base URL of the site (used in emails / links).              |
| `REACH_OUT_EMAIL`                 | Yes      | Sales/contact email shown in outgoing emails.                      |
| `REACH_OUT_PHONE`                 | Yes      | Contact phone number shown in outgoing emails.                     |
| `SMTP_HOST`                       | Yes      | SMTP server host for sending contact-form emails.                  |
| `SMTP_PORT`                       | Yes      | SMTP server port (e.g. `587`).                                     |
| `SMTP_USER`                       | Yes      | SMTP username.                                                     |
| `SMTP_PASSWORD`                   | Yes      | SMTP password.                                                     |
| `SMTP_FROM_EMAIL`                 | Yes      | "From" address for outgoing emails.                                |
| `SMTP_FROM_NAME`                  | Yes      | "From" display name for outgoing emails.                           |
| `CONTACT_FORM_RECIPIENT`          | Yes      | Inbox that receives contact-form submissions.                      |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`  | Yes      | Google reCAPTCHA v2 public site key.                               |
| `RECAPTCHA_SECRET_KEY`            | Yes      | Google reCAPTCHA v2 secret key.                                    |

\* `SANITY_API_TOKEN` is only required if you run the one-off data migration
script located in the `scripts/` folder. It is not needed for normal site use.

---

## 4. Run the project

### Development

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.
The page auto-reloads as you edit files.

### Production build

```bash
npm run build   # create an optimized production build
npm run start   # serve the production build (default port 3000)
```

### Linting

```bash
npm run lint
```

---

## 5. Sanity Studio (CMS) — `/studio`

The Sanity Studio is **embedded inside this Next.js app**; it is not a separate
deployment. Once the app is running you can reach it at:

```
http://localhost:3000/studio
```

(or `https://<your-domain>/studio` in production).

### Signing in

The Sanity project for this site was created using a **Google (Gmail) account**.
To open the Studio:

1. Go to `/studio`.
2. Choose **"Continue with Google"**.
3. Sign in with the Gmail account and password provided in the
   **"MyCustoms-Credentials"** document (sent by email).

> Because the Studio uses Google sign-in, there is no separate Sanity
> username/password — authentication happens through that Google account.
> You may later invite additional editors from the Sanity project dashboard
> (https://www.sanity.io/manage) if you prefer not to share the Gmail login.

---

## 6. Project structure (quick reference)

| Path                                | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `src/app/`                          | Next.js App Router pages and API routes.     |
| `src/app/studio/[[...tool]]/`       | Embedded Sanity Studio route (`/studio`).    |
| `src/sanity/`                       | Sanity config, schema types, and queries.    |
| `src/lib/email.ts`                  | Contact-form email sending (SMTP).           |
| `src/components/`                   | React UI components.                         |
| `scripts/`                          | One-off maintenance/migration scripts.       |
| `sanity.config.ts`                  | Sanity Studio configuration.                 |
| `.env.example`                      | Template for required environment variables. |

---

## 7. Credentials & secrets (separate email)

For security, the following are **not** included in this source code and are
delivered separately in the **"MyCustoms-Credentials"** document sent by email:

- All `.env.local` values (Sanity, SMTP, reCAPTCHA, webhook secret, etc.).
- The Google (Gmail) account used to sign in to the Sanity Studio at `/studio`.

If you did not receive that document, please request it before proceeding.
