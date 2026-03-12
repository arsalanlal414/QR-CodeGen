# QRShare

> Upload any image → get a QR code → share it. Anyone who scans lands on your image.

A production-ready Next.js 14 mini-MVP with a glassmorphism UI, drag-and-drop upload, and instant QR code generation.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS utilities |
| Animations | Framer Motion |
| QR generation | `qrcode` (server + browser) |
| File upload | React Dropzone + Next.js API route |
| Icons | Lucide React |

---

## Project structure

```
src/
  app/
    page.tsx                  ← Main upload page
    layout.tsx                ← Root layout
    globals.css               ← Global styles + utility classes
    not-found.tsx             ← 404 page
    image/
      [id]/page.tsx           ← Image display page (scanned QR lands here)
    api/
      upload/route.ts         ← POST /api/upload — accepts multipart/form-data
  components/
    Navbar.tsx
    UploadZone.tsx            ← Drag-and-drop upload area
    QRCodeDisplay.tsx         ← Canvas-based QR code renderer + download
    ResultCard.tsx            ← Post-upload result card
  types/
    index.ts                  ← Shared TypeScript interfaces
public/
  uploads/                   ← Runtime image storage (auto-created, gitignored)
data/
  uploads/                   ← Runtime metadata JSON (auto-created, gitignored)
```

---

## Getting started

### 1 — Install dependencies

```bash
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production — set this to your actual domain
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How it works

1. User **drops or selects** an image (JPEG / PNG / GIF / WebP, ≤ 10 MB).
2. `POST /api/upload` validates the file, saves it to `public/uploads/`, and writes metadata to `data/uploads/`.
3. The API returns the image's page URL: `{BASE_URL}/image/{uuid}`.
4. The front-end renders a **QR code** encoding that URL.
5. Anyone who **scans the QR code** is taken to `/image/{uuid}` — a beautiful page showing the full image with download & share options.

---

## Deploying to Vercel

> ⚠️ **Important:** Vercel's serverless filesystem is **ephemeral** — files written to `public/uploads/` and `data/uploads/` will not persist between invocations. For a production Vercel deployment you need an external storage provider.

### Recommended upgrade: Vercel Blob

1. Install the SDK:
   ```bash
   npm install @vercel/blob
   ```
2. Enable Blob storage in your Vercel project dashboard.
3. In `src/app/api/upload/route.ts`, replace the `writeFile` calls with:
   ```typescript
   import { put } from '@vercel/blob'

   const blob = await put(filename, buffer, { access: 'public' })
   // blob.url is the public URL — use this instead of /uploads/{filename}
   ```
4. For metadata, replace the JSON file with **Vercel KV** (Redis) or store the blob URL directly in the QR code.

### Environment variables on Vercel

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | `https://yourdomain.com` |

Set these in **Project → Settings → Environment Variables**.

---

## Customisation

| What | Where |
|---|---|
| Max file size | `MAX_SIZE` in `src/app/api/upload/route.ts` |
| Allowed formats | `ALLOWED_MIME_TYPES` / `ALLOWED_EXTENSIONS` in the same file |
| Brand colours | `tailwind.config.ts` → `theme.extend.colors.brand` |
| Base URL | `.env.local` → `NEXT_PUBLIC_BASE_URL` |

---

## License

MIT
