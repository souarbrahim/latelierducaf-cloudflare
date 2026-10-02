# L'Atelier du Café (Paris Coffee Cart)

Vite + React + Tailwind site, ready to deploy on **Cloudflare Pages** (or any static
host — it's plain HTML/CSS/JS once built, nothing Cloudflare-specific).

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build   # outputs to dist/
```

## Deploy on Cloudflare Pages
1. Push this folder to a GitHub repo.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and
   pick the repo.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Cloudflare gives you a free `your-project.pages.dev` address immediately.
5. To use your own domain: **Custom domains** tab on the project → add your domain,
   then switch its nameservers to the two Cloudflare gives you (same idea as the
   Netlify nameserver switch, just a different set of four — er, two — names).

The `public/_redirects` file (`/* /index.html 200`) makes page refreshes and direct
links work correctly — Cloudflare Pages reads it automatically, no extra config needed.

## Contact form → email (Web3Forms)
The quote form sends its data through **Web3Forms**, a free service that email you
each submission with no backend, no account/login, and no per-host lock-in.

**One-time setup (2 minutes):**
1. Go to **https://web3forms.com**, enter `bonjourlatelierducafe@gmail.com`, and
   click to create an access key.
2. Check that inbox — the access key arrives in seconds.
3. Open `src/App.tsx`, find this line near the top:
   ```ts
   const WEB3FORMS_ACCESS_KEY = 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE';
   ```
   and paste the key in between the quotes.
4. Commit and push — Cloudflare redeploys automatically, and the form is live.

Web3Forms says this key is not a secret (it only lets people *send you* mail through
their form, not read anything), so it's fine to leave directly in the code like this.

**Testing it:** after deploying, submit the form once from the live site with a
realistic name and message. The email arrives from Web3Forms within a minute or two —
check spam the first time. If nothing arrives, double-check the access key was pasted
exactly, with no extra spaces.
