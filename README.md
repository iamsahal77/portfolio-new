# Sahal KV — Portfolio

Run `node server.js` and open http://localhost:3000. Build the static site with `node build.cjs`; the publish output is `out/`.

The employer-focused design keeps the supplied portrait sequence, with a shorter scroll introduction, featured Orbit preview, Forma and Pulse previews, detailed case-study dialogs, about, approach, and contact sections. All case-study content, proposed technologies, products, and metrics are clearly labeled as illustrative demo material. The résumé action requests a real résumé by email; no fabricated work history, profile URLs, or résumé file is supplied.

## Animation

`assets/frames/desktop` contains 1600px WebP images (10.94 MB for 240 frames). `assets/frames/mobile` contains 960px variants (5.66 MB). Originals are preserved. `optimize-frames.py` regenerates missing variants with Pillow. The hero starts at frame 48 to skip the black opening and reveal the portrait immediately.

The renderer uses time-based easing, adjacent-frame blending, four concurrent loads, and a decoded cache capped at 28 frames on mobile or 40 on desktop. Compressed files remain cached for reverse scrolling. It pauses unnecessary rendering outside the hero and when the tab is hidden. Missing frames retain the nearest available image or the initial poster. Reduced-motion visitors get a static view with an explicit enable control.

## Update demo content

Edit the `projects` object in `main.js` for the case studies. Replace the preview content in `index.html` when real project assets and facts are available. Contact is `sahalwc4@gmail.com`. The site identity and static output location are stored in `.openai/hosting.json`.

## Verification

JavaScript syntax and static asset references checked. Browser review covers desktop and mobile layouts, scroll playback and reversal, motion toggle, case-study open/close and Escape focus restoration, and navigation. The connected browser reports reduced motion enabled; its static initial mode and explicit motion opt-in were checked.
