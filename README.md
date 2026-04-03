# Troy Cole Website
## Multi-page site for troycole.com redesign
**Stack:** Plain HTML / CSS / JS — no build step, no framework
**Deploy:** Netlify via GitHub

---

## FILE STRUCTURE

```
troy-cole-site/
├── index.html              ← Homepage
├── about.html              ← About Troy
├── services.html           ← All 5 programs
├── freebies.html           ← Downloads + email list
├── netlify.toml            ← Netlify config (no build step)
├── _shared-snippets.html   ← Nav/footer reference (NOT a real page)
│
├── css/
│   └── style.css           ← ALL shared styles
│
├── js/
│   └── main.js             ← ALL shared JS (cursor, nav, mobile menu, reveal, filters)
│
├── blog/
│   ├── index.html          ← Blog listing with category filters
│   └── dont-aim-just-throw-it.html  ← Blog post template (copy for new posts)
│
└── downloads/              ← PUT PDF downloads here
    └── (placeholder — add Troy's actual PDFs)
```

---

## DESIGN SYSTEM

| Token | Value |
|-------|-------|
| --black | #0a0a0a |
| --black-mid | #111111 |
| --black-light | #1a1a1a |
| --purple | #6F42C1 |
| --purple-light | #8B5CF6 |
| --white | #f5f3ef |
| --font-display | Bebas Neue |
| --font-serif | Cormorant Garamond |
| --font-body | DM Sans |

---

## DEPLOYING TO NETLIFY VIA GITHUB

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Troy Cole website"
git remote add origin https://github.com/YOUR_USERNAME/troy-cole-site.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and log in
2. Click **"Add new site" → "Import an existing project"**
3. Connect to GitHub and select the `troy-cole-site` repo
4. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `.`
5. Click **Deploy site**

### Step 3: Custom Domain (optional)
- In Netlify: Site settings → Domain management → Add custom domain
- Add `troycole.com` and follow DNS instructions

---

## ADDING NEW BLOG POSTS

1. Duplicate `blog/dont-aim-just-throw-it.html`
2. Rename to match the post slug (e.g. `blog/price-is-never-the-problem.html`)
3. Update in the new file:
   - `<title>` tag
   - `<meta name="description">` tag
   - `.post-meta` — category, date, read time
   - `.post-title` — headline
   - `.post-subtitle` — deck/subtitle
   - `article.post-content` — the actual article body
   - `.post-nav` — prev/next post links
   - CTA headline (optional)
4. Add a card for it in `blog/index.html` (copy an existing `.blog-card`)
5. Commit and push — Netlify auto-deploys

---

## ADDING DOWNLOADS (Freebies page)

1. Add the PDF to the `/downloads/` folder
2. Update the `data-download` attribute on the matching `.freebie-card` in `freebies.html`
3. The email gate is handled in `js/main.js` → `.freebie-gate-submit` click handler
4. **To connect a real email service** (ConvertKit, Mailchimp, etc.):
   - Replace the handler in `main.js` with a fetch() POST to their API
   - Or use a Netlify Form → Zapier → ConvertKit workflow

---

## CONTACT FORMS

All forms currently have no backend. To make them work:
- **Option A (Easiest):** Add `netlify` attribute to each `<form>` tag and Netlify will handle submissions natively (free, appears in Netlify dashboard)
- **Option B:** Connect to ConvertKit / ActiveCampaign / GoHighLevel via Zapier
- **Option C:** Use a service like Formspree

To enable Netlify Forms, wrap each form in:
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact">
  <!-- existing fields -->
</form>
```

---

## ADDING TROY'S PHOTO

When the photo arrives from the photographer:
1. Add it to the root directory as `troy-photo.jpg` (or `/images/troy-photo.jpg`)
2. In `index.html`, replace the `.hero-photo-placeholder` div with:
```html
<img src="/troy-photo.jpg" alt="Troy Cole" style="width:100%;height:100%;object-fit:cover;object-position:center top;">
```
3. On `about.html`, replace `.about-photo-frame` inner content similarly

---

## NOTES FOR CLAUDE CODE

- All pages share `/css/style.css` and `/js/main.js`
- Each page has page-specific `<style>` blocks in the `<head>` for page-only styles
- Nav and footer are copy-pasted on each page (no server-side includes in plain HTML)
- Blog posts in `/blog/` subfolder use `/css/style.css` and `/js/main.js` with root-relative paths
- The `netlify.toml` handles clean URL redirects (e.g. /about → /about.html)
- No npm, no node_modules, no build step — just commit and push
