# Deploy Unlock with a Kiss on Hostinger

This repository is the Node.js version. It does not use Cloudflare, D1, or ChatGPT authentication.

## 1. Create the database

In Hostinger hPanel, open **Websites → Dashboard → Databases → Management** and create a MySQL database and user. Save the database host, full database name, full username, and password. The app creates its three tables on first use; you do not need to import SQL. Use a dedicated database for this app.

## 2. Import this GitHub repository

Open **Websites → Add Website → Node.js Web App → Import Git repository**. Connect `LynnintheLab/unlockwithkiss`, branch `main`.

| Setting | Value |
| --- | --- |
| Framework | Next.js (backend/server app, not static export) |
| Node.js | 24.x (22.13+ also supported) |
| Root directory | Repository root (`/`) |
| Package manager | npm |
| Install command, if requested | `npm ci` |
| Build command | `npm run build` |
| Output directory | `.next` |
| Start command | `npm start` |

The start command listens on `0.0.0.0` and uses Hostinger's `PORT` environment variable. A normal Next.js deployment does not require a custom entry file.

## 3. Add private environment variables

Add these in the deployment's Environment Variables panel. Copy `.env.example` as a reference, but replace every placeholder. Do not upload passwords to GitHub and do not prefix them with `NEXT_PUBLIC_`.

| Variable | What to enter |
| --- | --- |
| `APP_URL` | Your exact HTTPS site origin, e.g. `https://your-domain.com`; no path |
| `ADMIN_PASSWORD` | Your private admin password (the one provided in the Codex conversation, or a new long unique password) |
| `GUEST_PASSWORD` | The six-digit guest password you requested in the Codex conversation |
| `DRIVE_URL` | Your Google Drive folder link from the conversation |
| `DB_HOST` | Database hostname shown by Hostinger, usually `localhost` |
| `DB_PORT` | `3306`, unless Hostinger specifies otherwise |
| `DB_USER` | Full MySQL username from hPanel |
| `DB_PASSWORD` | MySQL user's password |
| `DB_NAME` | Full MySQL database name from hPanel |

Do not set `DB_SOCKET` on Hostinger; it is only an optional local testing override. Hostinger normally sets `NODE_ENV=production`; use production mode.

If your temporary domain is assigned only after the first deployment, add that exact HTTPS origin as `APP_URL` and restart/redeploy. Update `APP_URL` when switching to your custom domain. This setting protects form submissions and enables secure cookies behind Hostinger's proxy. A wrong origin causes a visible form error.

## 4. Deploy and check

1. Click **Deploy** and wait for the deployment to succeed.
2. Visit `/admin`, sign in, and check that your Drive link is present.
3. Visit `/` in a separate/private browser. Either Burmese answer leads to the guest password form.
4. Enter the guest password. The kiss message appears; the Drive link stays hidden.
5. In admin, choose **Yes, unlock for her**. Her page updates within five seconds.
6. Choose **Lock the diary again** when you want to restore the lock.

The initial state is locked. `DRIVE_URL` seeds the database only on first use. Afterward, change the link in `/admin`; restarts and deployments do not reset saved settings. MySQL stores settings and sessions independently of the app's build directory. Keep the same database credentials for future deploys.

## Troubleshooting

- **Admin login says unavailable:** check all environment variables and the MySQL user's permissions to create/select/insert/update/delete tables. Then restart the app.
- **Please use this site to make changes:** `APP_URL` must match the address used in your browser (including `www` if present).
- **Too many tries:** wait 15 minutes. Admin and guest have separate shared attempt limits; this avoids trusting proxy IP headers.
- **Drive requests access:** share the folder with her Google account in Google Drive. The website does not change Google Drive sharing.
- **A previous visitor still opens Drive after relocking:** locking hides the link on this website; it cannot revoke a Drive URL someone already knows. Control the underlying folder's permissions in Google Drive.

## Sources

- [Hostinger: deploy Codex apps via GitHub](https://www.hostinger.com/support/how-to-deploy-apps-built-with-codex-on-hostinger/)
- [Hostinger: connect MySQL to Node.js](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/)
- [Next.js: Node.js deployment](https://nextjs.org/docs/app/getting-started/deploying)

## Link previews in messaging apps

The homepage publishes Open Graph and Twitter preview tags and a public 1200×630 PNG at `/opengraph-image`. It contains only a romantic message, never the Drive link or login details. The default public address is `https://loveu.lynninthelab.space`; set optional `SITE_URL` before building if you change the domain. Keep `APP_URL` set to your actual site origin for authentication.

After deploying a preview update, paste the link into a new message and allow time for the preview to load. Old messages or messaging-app caches may keep the previous preview. Preview availability and size are ultimately controlled by the messaging app and its settings.
