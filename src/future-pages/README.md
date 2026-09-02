# Future Pages Archive: About & Journal

This directory stores the complete, production-ready implementations of the **/about** and **/journal** routes for **Awaraa's Culture**.

These pages were built with complete SEO metadata, Schema.org structured data (AboutPage, BreadcrumbList, Blog, BlogPosting), responsive UI styling, and brand storytelling, and have been temporarily removed from the live site per the brand owner's request.

## Contained Pages
1. `about/page.tsx`:
   - Full brand story, wanderer philosophy, and locked brand principles.
   - Placeholder for founder story details: `[[BRAND OWNER TO PROVIDE: founder story details]]`.
   - `AboutPage` and `BreadcrumbList` JSON-LD schema.

2. `journal/page.tsx`:
   - Journal / blog editorial index.
   - `Blog` and `BreadcrumbList` JSON-LD schema.

3. `journal/[slug]/page.tsx`:
   - Dynamic article route layout.
   - `BlogPosting` and `BreadcrumbList` JSON-LD schema.

## How to Re-enable in the Future
To revive these routes on the live site:
1. Move the folders back into the App Router:
   - Copy `src/future-pages/about` to `src/app/(main)/about`
   - Copy `src/future-pages/journal` to `src/app/(main)/journal`
2. Re-add the links to:
   - `src/components/Nav.tsx` (Desktop & Mobile navigation menus)
   - `src/components/Footer.tsx` (Footer links)
   - `src/app/sitemap.ts` (Sitemap static routes)
