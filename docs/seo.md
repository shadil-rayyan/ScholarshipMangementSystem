# Database and SEO Configuration Workflow

## 1. Update Metadata in `src/app/layout.js`

- Open `src/app/layout.js` in your project.
- Update the **metadata fields** such as:
  - `title`
  - `description`
  - `keywords`
  - `author`
  - Any other SEO-relevant fields.
- Save the file after updating.

## 2. Update Domain in `next.sitemap.config.js`

- Open `next.sitemap.config.js`.
- Replace the `siteUrl` field with your **current domain**.
- Ensure all paths point correctly for sitemap generation.

## 3. Update Public Files

### a) `public/robots.txt`

- Open `public/robots.txt`.
- Replace any placeholder domain with your **current domain**.
- Ensure it allows/disallows crawling correctly.

### b) `public/humans.txt`

- Open `public/humans.txt`.
- Add your **team information**:
  - Name(s)
  - Contact info
  - Website or organization
- Save the file.

## 4. Generate Sitemap

- Run the command:

```bash
npm run sitemap
