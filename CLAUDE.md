# Motion Code Studio — Project Notes

Handoff notes for anyone working on this site. Read this before changing anything.

## What this site is

Hand-coded static site. Plain HTML, CSS and vanilla JavaScript. **No framework, no
build step, no CMS.** There is no dashboard and no login to grant anyone. Changes
are made by editing the HTML directly.

- 16 pages, all in the root of this folder
- Hosted on **Netlify** (subdomain `creative-kelpie-17bea6.netlify.app`)
- Domain registered at **Squarespace**, DNS managed there
- Deployed by dragging the folder into Netlify. There is no CI.
- Source is in a private GitHub repo with full history

## Brand rules, non-negotiable

These are decided and should not be changed without the owner's say-so.

- **Never use AI to generate or edit photos.** Real photo edits only: crop,
  brightness, contrast, colour. Scan any image AI-clean before publishing.
- **No em dashes in copy.** Use commas, or restructure the sentence.
- **Doctorly tone.** Plain, precise, calm. No marketing superlatives, no
  "unlock your potential", no exclamation marks.
- **Never name the equipment trademark.** The suspension system is referred to
  as the Motion Frame or the Motion Room. Do not use the manufacturer name.
- **Never fabricate reviews, testimonials or credentials.**
- Identity line: **Advanced Chiropractic & Movement Restoration · Burbank**.
  As of Aug 2026 the homepage H1 also leads with Integrative Bodywork. Specifics
  belong inside pages, not in headlines.

## Voice, by example

The opening paragraph sets the register:

> Your body carries the record of how you live: every injury, every desk-bound
> hour, every mile. We read it, then rebuild it.

Short declaratives. Concrete nouns. Ends on a plain benefit. Match that.

## Page conventions

- Every page has a `<title>` in the form `[Service] in Burbank | Motion Code Studio`,
  kept under about 60 characters. The homepage is the exception.
- Every page carries GA4 `G-J6L8D9NLQE` and Google Ads `AW-18371687110`.
- Every page has LocalBusiness + Chiropractor JSON-LD. 15 of 16 also have FAQPage
  schema; `about.html` has no FAQ section so it correctly has none.
- Click tracking fires GA4 events on booking, call, text and email links.
- Images: `loading="lazy"` and explicit `width`/`height` on every `<img>`.
- Bump the `?v=` on `styles.css` and `script.js` after editing them, or returning
  visitors get a cached copy.

## Practice facts

- Dr. Maksim Ishankhanov, DC. Founder & Lead Practitioner.
  California Board of Chiropractic Examiners, License No. DC 35207
- Edgar Khachaturov. Certified Massage Therapist & Movement Practitioner.
- 175 E Olive Ave, Suite 200, Burbank, CA 91502
- (213) 932-0630 · hello@motioncodestudio.com
- Open daily 9 AM to 8 PM, by appointment
- Pricing: 30 min $100, 60 min $200, 90 min $300. Concierge $500 / $350.
  Integrative bodywork uses the same session lengths and pricing.

## Booking

Booking is **Jane** (janeapp.com). No automation layer, no Make, no Zapier.
The site links out to `calldrmax.janeapp.com`. That subdomain is wrong and only
Jane can change it; it needs an email from the account owner.

## Things that will bite you

- **`_redirects` and `_headers`** are Netlify config. `_redirects` blocks
  `/.git/` and the internal brand docs from being served publicly. Don't delete them.
- A redirect rule will not override a real file at the same path unless the
  status code ends in `!`. This is why `/BRAND-FOUNDATION.md 404` silently did
  nothing and `404!` works.
- The service worker (`sw.js`) caches assets. Pages are network-first so deploys
  show immediately, but CSS and JS are cache-first, which is why the `?v=` bump matters.
- Two adjacent dark sections merge into one block without the divider rule in
  `styles.css`.

## Who decides

Site, copy, design and brand decisions go to **Sasha**, who owns the domain, the
DNS and the brand. She is not a bottleneck for making changes, only for deciding
what the brand does. Account actions inside Max's own services (Jane, his Google
accounts) need Max.
