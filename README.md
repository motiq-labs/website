<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/motiq-reversed.svg">
  <img src="assets/brand/motiq-horizontal.svg" alt="Motiq Labs" width="220">
</picture>

# Motiq Labs website

English website for [Motiq Labs](https://www.motiq.hr): robotics, AI, DevOps and engineering consulting. GitHub Pages publishes the root of `master` to **www.motiq.hr**.

## Edit and build

Edit `src/site.html` (homepage), `src/ai-boost.html` (AI-BOOST news article) and `css/style.css`. Run `npm run build` to regenerate the public pages and their content-hashed stylesheet. Commit the sources and generated output together. Historical hashed assets are retained for cached pages.

For a local preview, run `python3 -m http.server 8766 --bind 127.0.0.1`. Check desktop and mobile layouts, links and keyboard focus. The previous `hr.html` URL redirects to the English homepage. The site has no language selector, contact form or tracking. A small dependency-free script starts one 4.8-second gripper illustration when it enters view and supports replay. A short scroll transition opens the green service surface around a small hoe motif, retaining native scrolling and the original page length. Reduced-motion preferences are respected. The footer offers a user-triggered copy-email button, with a regular mail link as fallback. Contact links open the visitor's email application.

`locales/`, `css/tokens.css` and the old JavaScript files are retained for historical reference and cached pages; the current build does not load them.

## Brand assets

The approved Motiq Labs logo is unchanged. `assets/brand/master.json` contains the canonical M + gripper geometry and centered outlined Labs subtitle. See [the brand guide](assets/brand/README.md). Run `npm ci` and `npm run brand:build` to regenerate the brand exports when needed.

## AI-BOOST acknowledgement

The homepage retains a brief acknowledgement and links to the Spark-selection news article. The article uses the supplied official Challenge 1 visual, with the original proportions preserved. Prototype development and validation remain ongoing; the copy does not claim a completed deployment or final competition victory.

`assets/brand/ai-boost-horizontal.jpg` is an unmodified official horizontal logo variant from the October 2026 AI Challenge Competition Winners Kit and links to https://aiboost-project.eu/. The EU funding emblem is the existing official English asset. The disclaimer reproduces the kit's GA 101135737 wording. This acknowledgement is not a claim that Motiq has received a payment.

The website article announces selection as a Spark phase winner and progression to Advance. The LinkedIn announcement and submission of publication links remain separate follow-up work.
