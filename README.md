# FF ROOM CITY V4.1 — Cloudflare Pages + D1

Version corrigée pour Cloudflare Pages (legacy Pages workflow).

## Structure
- `public/` : interface du site + panneau Owner
- `functions/api/[[path]].js` : API Pages Function catch-all pour `/api/*`
- `schema.sql` : schéma D1 de secours
- `wrangler.json` : configuration Pages

## Déploiement Pages
1. Workers & Pages → **Create application** → **Need to use the legacy Pages workflow**.
2. **Import an existing Git repository** → choisir `kawaki-227aura/ff-room-city`.
3. Project name : `ff-city` (si tu veux `ff-city.pages.dev`).
4. Production branch : `main`.
5. Framework preset : `None`.
6. Build command : laisser vide.
7. Build output directory : `public`.
8. Déployer.

## D1
Après la création du projet Pages :
- Créer une base D1, par exemple `ff-room-city`.
- Projet Pages → Settings → Bindings → Add → **D1 database**.
- Variable name : `DB`.
- Sélectionner la base D1.
- Redéployer après l'ajout du binding.

La table `rooms` est créée automatiquement au premier appel de l'API si elle n'existe pas.

## Owner
Le panneau est disponible sur `/admin.html`.

Pour la sécurité, définir `ADMIN_CODE` comme secret/variable runtime dans les réglages Cloudflare Pages, plutôt que de mettre le code dans le dépôt.

## Important
Cette V4.1 corrige le routage de l'API : le catch-all `functions/api/[[path]].js` reçoit les routes `/api/rooms` et `/api/admin/...`.
