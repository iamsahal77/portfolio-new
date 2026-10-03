# Sahal KV — Portfolio

Run `node server.js` and open http://localhost:3000.

The original 240-frame animation is preserved within a sticky hero. Frames are progressively loaded, downsampled, and retained in a bounded 48-frame cache to reduce memory usage. The hero animation plays by default and includes a visible Pause motion control that freezes decorative motion and shows a static portrait. The requested animated experience is enabled by default.

Sections: cinematic hero, selected work, about, expertise, process, contact. Project cards are illustrative concepts with modal previews. Replace project descriptions in main.js and artwork in index.html with real work when available. The biography and expertise copy are draft positioning to review before publishing.

Palette drawn from the image sequence: black #090708, burgundy #581d2b, coral #ff625c, pink #ef8faf, warm white #f5ece8. Google Fonts use system fallbacks if offline.

Contact is configured to sahalwc4@gmail.com. Native dialog supports Escape and focus restoration. Service rows support keyboard interaction. No build tool or dependencies required.



The hero has four scroll-synchronized text chapters: introduction, software engineer, code with purpose, and collaboration. Numbered controls jump to each chapter. Inactive scenes are hidden from assistive technology and their controls cannot receive focus. Other motion includes project artwork loops, pointer tilt, magnetic buttons, section reveals, portrait parallax, and a page progress line.

