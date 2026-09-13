# Personal Cybersecurity Portfolio + Blog CMS

A production-ready, minimalist, editorial personal portfolio and private Markdown blog content management system (CMS) designed for a serious cybersecurity professional and security researcher.

Visually inspired by editorial technical journals (such as *MIT Technology Review*, *The New Yorker*, and academic whitepapers), featuring spacious monochrome layouts, high-contrast photography, refined typography hierarchy (serif titles with clean monospace accents), and strict OWASP Top 10 security engineering.

---

## Key Features

### Public Presence
1. **Editorial Homepage (`/`)**:
   - **Hero**: Authentic monochrome personal portrait photograph, large typography (`[NAME]`, `Security Researcher`, `Web Pentester`), and concise professional statement.
   - **About**: Focus on web penetration testing, vulnerability research, GraphQL/microservices security, and protocol anomalies.
   - **Certificates (Static)**: Verified industry credentials (OSCP, BSCP, CRTO, CISSP) with verification links and credential IDs.
   - **Socials**: Verified channels (GitHub, LinkedIn, X/Twitter, HackerOne, Bugcrowd, Email).
   - **Latest Writings**: Recent peer-reviewed security research papers fetched from Supabase.
2. **Technical Publication Listing (`/blog`)**:
   - Lists only publicly published articles (`status = 'published'`).
   - Real-time search across titles, excerpts, and tags.
   - Tag filtration by security discipline (e.g. *IDOR*, *OAuth 2.0*, *HTTP/2*, *WAF Bypass*).
   - Reading time estimation, publication dates, and cover photography.
3. **Individual Research Article (`/blog/[slug]`)**:
   - Clean reading typography optimized for technical deep dives and exploit walkthroughs.
   - Automated **Table of Contents** sidebar with jump navigation.
   - Sanitized Markdown renderer with GitHub Flavored Markdown (GFM) tables, task lists, blockquotes, and copyable syntax-highlighted code blocks (`http`, `bash`, `python`, `graphql`, `sql`).
   - Next / Previous article pagination and related research recommendations.

### Private Blog Management System (`/manage-blog`)
- **Route Protection (`/manage-blog/*`)**: Enforced server-side via Next.js middleware and server actions (OWASP A01: Broken Access Control).
- **Authentication**: Powered by Supabase Auth (email/password). No public registration is enabled.
- **Admin Dashboard**: Overview metrics (Total Posts, Published, Drafts) and interactive article table with search, view, edit, and deletion.
- **Two-Panel Markdown Editor (`/manage-blog/new` & `/manage-blog/edit/[id]`)**:
  - Left panel: Markdown source with quick syntax insertion toolbar.
  - Right panel: Live synchronized editorial preview matching the public layout.
  - Image upload directly to Supabase Storage `blog-images` bucket.
  - Draft vs Published state management.
  - Safe deletion with a double-confirmation modal.

---

## Security Architecture & OWASP Top 10 Hardening

| OWASP Vulnerability | Defense Implementation |
| :--- | :--- |
| **A01: Broken Access Control** | Server-side middleware validates sessions on `/manage-blog/*`. Server actions perform `verifyAdminSession()` checks. Supabase Row Level Security (RLS) strictly restricts public anonymous queries to `status = 'published'` and denies all public inserts/updates/deletions. |
| **A02: Cryptographic Failures** | Authentication handled entirely by Supabase Auth with bcrypt/Argon2. Tokens stored in secure HTTP-only cookies. No secret keys or service role keys exposed in client bundles. |
| **A03: Injection & Stored XSS** | Database queries use parameterized Supabase builders (no string SQL concatenation). Markdown rendering runs through `rehype-sanitize` with a strict AST schema, stripping `<script>`, `<iframe>`, inline `onerror`/`onload` handlers, and `javascript:` URLs. |
| **A05: Security Misconfiguration** | Strict HTTP security headers configured in `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive `Permissions-Policy`. |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, `@tailwindcss/typography`, custom monochrome tokens
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth + Supabase Storage
- **Markdown & Code**: `react-markdown`, `remark-gfm`, `rehype-sanitize`, `rehype-highlight`
- **Icons**: `lucide-react`
- **Deployment**: Ready for Cloudflare Workers / Pages or Vercel

---

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/BesuDev195/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### 2. Local Development

You can immediately start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!TIP]
> **Zero-Friction Local Mode**: The application is pre-seeded with realistic security research writeups. If you haven't configured Supabase environment variables yet, the app runs in local demonstration mode. You can log into the private CMS at `/manage-blog` with `admin@security.local` / `Admin123!`.

---

## Supabase Setup (Production Database)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings -> API**, copy your:
   - **Project URL**
   - **anon / public key**

### 2. Apply Database Schema & Seed Data
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Copy and execute the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates:
   - The `blogs` table with UUID primary keys and triggers.
   - Performance indices for slugs and published posts.
   - The `blog-images` storage bucket.
   - Row Level Security (RLS) policies granting public read access only to published articles, and full access to authenticated admins.
3. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) to populate initial research writeups.

### 3. Create Administrator User
1. In the Supabase Dashboard, navigate to **Authentication -> Users**.
2. Click **Add User** -> **Create user**.
3. Enter your administrator email and a strong password.

### 4. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Restart your development server: `npm run dev`.

---

## Deployment to Cloudflare

This application uses standard Web APIs and Next.js App Router.

### Deploying via Cloudflare Pages
1. Push your repository to GitHub.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Compute (Workers) -> Workers & Pages -> Create Application**.
3. Select **Pages** -> **Connect to Git**.
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npx @opennextjs/cloudflare` or `npm run build`
   - **Root directory**: `/`
5. Under **Environment variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Save and Deploy**.

---

## Customization

- **Name, Bio, Certificates & Social Links**: Easily edit [`src/lib/config.ts`](src/lib/config.ts).
- **Hero Photograph**: Replace `public/images/portrait.jpg` with your own portrait.
- **Blog Covers**: Add cover images into `public/images/` or upload them directly via the `/manage-blog/new` interface.
