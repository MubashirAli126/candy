# 🍬 Candy — Ladies Clothing E‑Commerce Store

Ladies 3 piece suits, 2 piece suits and kurtis online store built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Prisma** and **PostgreSQL**. Includes a full **admin panel** to manage products and orders, and is fully **SEO‑optimized** and **responsive** (mobile, tablet, desktop).

> _Chamka do apni dunya!_ ✨

---

## ✨ Features

- **Storefront** — home, category pages (Car / Bike / Wall), product listing with filters, product detail pages, cart & checkout.
- **Cart** — persistent client‑side cart (localStorage), quantity & size selection.
- **Checkout** — Cash‑on‑Delivery order flow. On placing an order, WhatsApp opens pre‑filled with the order details for confirmation.
- **Admin Panel** (`/admin`) — dashboard with stats, order management (view + update status), full product CRUD (create / edit / delete).
- **Auth** — simple, secure email + password admin login (JWT cookie session).
- **SEO** — per‑page metadata, OpenGraph + auto‑generated social image, JSON‑LD structured data (Store + Product), dynamic `sitemap.xml` and `robots.txt`.
- **Responsive & accessible** — works great on mobile, tablet and desktop.

---

## 🚀 Getting Started (in VS Code)

### 1. Prerequisites
Install **Node.js 18.18+** (or 20+): https://nodejs.org

### 2. Install dependencies
Open the project folder in VS Code, then in the terminal run:

```bash
npm install
```

### 3. Create a database
The app uses **PostgreSQL**. Create a free database at [Neon](https://neon.tech), copy the
**pooled** connection string, and put it in `.env` as `DATABASE_URL` (see `.env.example`).

### 4. Push the schema & seed sample data

```bash
npm run setup
```

> `npm run setup` runs `prisma db push` + seeds sample data. You can also run them separately with `npm run db:push` and `npm run db:seed`.

### 5. Start the dev server
```bash
npm run dev
```

Open **http://localhost:3000** in your browser. 🎉

---

## 🔐 Admin Panel

- URL: **http://localhost:3000/admin**
- Default login (change in `.env`):
  - **Email:** whatever `ADMIN_EMAIL` is set to in `.env`
  - **Password:** `admin123`

From the admin panel you can:
- See order & revenue stats on the dashboard
- View orders and update their status (Pending → Confirmed → Shipped → Delivered …)
- Add, edit, and delete products

---

## ⚙️ Configuration (`.env`)

A ready‑to‑use `.env` file is included for local development. **Change these before going live:**

| Variable | What it does |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled URL). |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token — required for admin product‑image uploads. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin panel login credentials. |
| `AUTH_SECRET` | Secret used to sign admin sessions. Use a long random string. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number for order confirmations (format: `923001234567`). |
| `NEXT_PUBLIC_SITE_URL` | Your live domain (used for SEO / sitemap). |

---

## 🖼️ Adding your real logo

An inline SVG wordmark is used for now (see the `Logo` component) — the files in `public/` still belong to the previous brand.

To use your own logo:
1. Drop your logo file into the `public/` folder (e.g. `public/logo.png`).
2. Open `src/components/Logo.tsx` and replace the badge markup with:
   ```tsx
   import Image from "next/image";
   // ...inside the Link:
   <Image src="/logo.png" alt="Candy" width={160} height={40} priority />
   ```

Product images can be **any image URL**, or a file placed in `public/` (referenced as `/yourfile.jpg`) — set via the admin product form.

---

## 📦 Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run setup` | Create DB + seed sample data |
| `npm run db:studio` | Open Prisma Studio to browse the database visually |
| `npm run db:seed` | Re‑seed sample data |
| `npm run lint` | Run ESLint |

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── (storefront)/        # Public site (home, products, category, cart, checkout, about, contact)
│   ├── admin/               # Admin panel (login + protected dashboard/orders/products)
│   ├── api/                 # API routes (orders, admin login/logout, product & order management)
│   ├── layout.tsx           # Root layout + global SEO metadata + JSON‑LD
│   ├── sitemap.ts           # Dynamic sitemap.xml
│   ├── robots.ts            # robots.txt
│   └── opengraph-image.tsx  # Auto‑generated social share image
├── components/              # UI components (Header, Footer, ProductCard, admin/*, …)
├── context/                 # Cart context (client state)
└── lib/                     # prisma client, auth, data helpers, utils, types
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Sample data
```

---

## 🌐 Going live (deployment)

The easiest host is **Vercel** (made by the Next.js team):
1. Push this project to GitHub.
2. Import it in Vercel.
3. Create a **Neon** Postgres database and push the schema to it once from your machine:
   `npm run db:push` (then `npm run db:seed` if you want the sample products).
4. Create a **Blob** store in the Vercel dashboard (Storage → Blob). This injects
   `BLOB_READ_WRITE_TOKEN` automatically.
5. Add the remaining `.env` variables in the Vercel dashboard (`DATABASE_URL`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `AUTH_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`)
   for the **Production, Preview and Development** environments.

> The build itself never touches the database — every DB‑backed page is rendered on demand —
> so a deploy won't fail if the database is briefly unreachable.

---

## 🛠️ Tech stack

- [Next.js 14](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma ORM](https://www.prisma.io) + PostgreSQL ([Neon](https://neon.tech))
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for product image storage
- [Zod](https://zod.dev) for validation
- [jose](https://github.com/panva/jose) for JWT sessions

---

Made with ❤️ in Pakistan for **Candy**.
