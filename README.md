# For AThel — Unlock with a Kiss

A little daily-video diary, with a private admin panel.

- `/`: Burmese mood question → guest password → kiss-to-unlock message → Google Drive link after admin approval.
- `/admin`: separate admin password, editable Drive link, unlock and relock controls.
- Server-side authentication, HTTP-only session cookies, rate-limited logins, and persistent MySQL storage.
- The Drive link is not sent to guests until they are signed in and the diary is unlocked.

## Deploy on Hostinger

**[Follow HOSTINGER.md](HOSTINGER.md)** for GitHub import settings, database setup, and environment variables.

Stack: Next.js 16, React 19, Node.js 22.13+/24, MySQL (`mysql2`), Tailwind CSS.

## Local development

1. Install Node.js 24 and MySQL (or compatible MariaDB).
2. Create a dedicated local database and user.
3. Copy `.env.example` to `.env.local`, set local database credentials, the two passwords, Drive link, and `APP_URL=http://localhost:3000`.
4. Run `npm ci`, then `npm run dev`.

## Production check

```
npm run build
npm start
```

For browser tests, start the app against a **dedicated test database**, set `TEST_BASE_URL`, `TEST_ADMIN_PASSWORD`, and `TEST_GUEST_PASSWORD`, then run `npm test`. Tests unlock and relock the test diary. Playwright requires Chromium (`npx playwright install chromium`) or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` pointing to a local Chrome executable.

Do not point tests at your live diary. No real passwords or Drive URL are stored in this repository.

The three photographs in `public/photos/` were supplied by the site owner for this personal website. The hand-holding photograph is also used in the public link-preview card.
