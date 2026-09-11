# FF ROOM CITY V4 — Cloudflare
Architecture: Cloudflare Pages + Pages Functions + D1.
1. Create a Cloudflare Pages project from this repository.
2. Create a D1 database named `ff-room-city`.
3. Add a Pages Function D1 binding named `DB`.
4. Add a secret/environment variable named `ADMIN_CODE`.
5. Set the Pages build output directory to `public`.
6. Deploy. The site will be on `*.pages.dev`.
7. Open `/admin.html` for the owner panel.
The backend is in `functions/api/index.js`.
