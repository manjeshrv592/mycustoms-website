# My Customs Website — Hosting & Deployment Guide

This document explains how to deploy the My Customs website to a production
server. It assumes you have already read **SETUP.md**, which covers local
installation and environment variables.

> **Stack note for the hosting/IT team**
> This is a [Next.js](https://nextjs.org) (Node.js) application with an
> embedded Sanity Studio — **it is not a PHP or WordPress site**. You do
> **not** need Apache (`httpd`), `mod_php`, or a WordPress install. The only
> runtime requirement is Node.js. Nginx is optional but recommended as a
> reverse proxy / TLS terminator in front of the Node process.

---

## 1. Prerequisites (server-side)

| Software        | Recommended version | Purpose                                               |
| ---------------- | -------------------- | ------------------------------------------------------ |
| **Node.js**       | 20 LTS or newer       | Runs the built Next.js app.                             |
| **npm**           | 10 or newer           | Installs dependencies, comes with Node.js.              |
| **PM2**           | Latest (`npm i -g pm2`) | Keeps the app running, restarts on crash/reboot.        |
| **Nginx**         | Latest                | Reverse proxy, TLS (HTTPS), and serving on port 80/443. |
| **Git**           | Any recent version    | To pull the code / updates onto the server.             |
| **Certbot**       | Latest                | Free TLS certificates via Let's Encrypt (if using Nginx).|

Not required: Apache/httpd, PHP, MySQL/MariaDB, WordPress.

---

## 2. Get the code onto the server

Either clone the repository directly on the server, or transfer the project
folder (e.g. from the OneDrive handover) via SFTP/SCP:

```bash
git clone <repository-url> mycustoms-website
cd mycustoms-website
```

---

## 3. Install dependencies and build

```bash
npm install
npm run build
```

`npm run build` needs the devDependencies (TypeScript, Tailwind, etc.), so
run the full `npm install` — don't use `--omit=dev` before building.

### Environment variables

Create `.env.local` in the project root with the production values (see
**SETUP.md, section 3** for the full variable reference). At minimum, update:

- `SITE_URL` — the live production domain (e.g. `https://my-customs.nl`).
- All Sanity, SMTP, and reCAPTCHA values from the
  **"MyCustoms-Credentials"** document.

---

## 4. Run the app with PM2

An `ecosystem.config.js` is included in the project root:

```js
module.exports = {
  apps: [
    {
      name: "mycustoms-website",
      script: "npm",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
    },
  ],
};
```

Start it:

```bash
pm2 start ecosystem.config.js
```

Make PM2 survive server reboots:

```bash
pm2 save
pm2 startup   # then run the command it prints (needs sudo)
```

Common PM2 commands:

```bash
pm2 status                     # check the app is running
pm2 logs mycustoms-website     # tail logs
pm2 restart mycustoms-website  # restart after a config change
```

---

## 5. Deploying updates

```bash
cd mycustoms-website
git pull
npm install
npm run build
pm2 reload mycustoms-website   # zero-downtime reload
```

---

## 6. Reverse proxy with Nginx (recommended)

Nginx sits in front of the Node process on port 3000, handles port 80/443,
and terminates TLS. Example server block:

```nginx
server {
    listen 80;
    server_name my-customs.nl www.my-customs.nl;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable HTTPS with Certbot:

```bash
sudo certbot --nginx -d my-customs.nl -d www.my-customs.nl
```

---

## 7. Sanity webhook (content revalidation)

`SANITY_WEBHOOK_SECRET` (see SETUP.md) is used to verify webhook calls from
Sanity so that publishing content triggers on-demand revalidation. This
requires the production domain to be publicly reachable over HTTPS — set the
webhook URL in the Sanity project dashboard (manage.sanity.io) to
`https://<your-domain>/api/revalidate` (or the actual route used in
`src/app/`) once the domain and TLS are live.

---

## 8. Firewall

Open only the ports actually needed:

- **80/443** — public web traffic (Nginx).
- **22** — SSH for maintenance.
- Keep **3000** (the Node process) closed to the public internet — Nginx
  should be the only thing talking to it, over `127.0.0.1`.
