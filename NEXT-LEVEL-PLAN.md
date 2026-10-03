# Portfolio upgrade plan

## Direction

Audience: potential employers.
Style: refined cinematic. Keep the portrait sequence and dark coral/pink palette, simplify supporting motion, and make engineering evidence the focus of the page.

Desired visitor journey: understand Sahal's role → inspect credible work → review experience and résumé → contact.

## Current findings

- The hero uses 240 image frames and four scrolling text chapters. Several statements repeat broad positioning without explaining a specific engineering focus.
- Forma, Pulse, and Orbit are explicitly illustrative concepts. Their current dialogs describe design direction rather than implementation, ownership, or technical decisions.
- The existing site includes useful work, about, expertise, process, and contact sections. Refine these before adding more sections.
- The animation downloads 4K JPEGs and downsamples them in the browser. It keeps a bounded decoded cache, but loading and rendering can be improved for fast scrolling and mobile devices.
- Frame easing uses a fixed per-frame multiplier. The text chapters follow raw scroll progress while the images follow eased progress, which can make the timing feel disconnected.
- Repeating decorative animations, tiny labels, and a long mobile hero compete with reading and navigation.

## Phase 1 — Establish credible content

1. Write a direct opening statement using Sahal's actual specialization and target role.
2. Select two or three real projects. For each, collect the problem, individual contribution, stack, key engineering decisions, screenshots, outcome, and available repository/demo links.
3. Turn the existing project previews into concise case studies. Label learning projects and experiments honestly; use only verified results.
4. Replace broad expertise and process claims with concrete examples from those projects.
5. Prepare résumé, GitHub, and LinkedIn links from user-supplied destinations.

Acceptance: a visitor can explain what Sahal builds and identify evidence of his contribution after scanning the introduction and one project.

Dependency: real project details and career material must come from Sahal. Visual and performance work can proceed while these are collected.

## Phase 2 — Refine the cinematic presentation

1. Keep the portrait sequence as the dominant visual and reduce competing perpetual movement.
2. Shorten the introduction to clear beats: identity, engineering focus, selected work. Tune scroll distance separately for mobile and desktop.
3. Make the route to work and résumé visible from the opening view.
4. Use consistent type sizes, larger readable labels, deliberate spacing, and quieter supporting colors.
5. Give the strongest project the most visual space, with real screenshots and clear role/outcome captions.
6. Rewrite the contact section for hiring conversations.

Acceptance: the portrait and text remain legible together, project work is easy to reach, and each screen has one clear focal point.

## Phase 3 — Improve animation delivery

1. Generate appropriately sized, compressed frame variants before deployment and compare visual quality and transfer size.
2. Show a lightweight portrait while initial frames load.
3. Prioritize nearby frames in the direction of scrolling, bound concurrent requests, and retain a bounded decoded cache.
4. Use time-based easing and synchronize frame and chapter progress.
5. Coalesce scroll work into animation frames and stop unnecessary work when the hero is offscreen or the tab is hidden.
6. Honor system reduced-motion preferences and preserve a manual motion control with an understandable reading experience when paused.
7. Handle missing frames and slow connections without a blank hero.

Acceptance: profile forward/reverse scrolling and large scroll jumps on a representative phone and desktop; confirm bounded memory, stable rendering, and readable fallback states. Record before/after measurements rather than assume performance gains.

## Phase 4 — Complete the employer journey

1. Verify résumé, project, profile, and contact links.
2. Check keyboard navigation, dialog focus, visible focus indicators, text contrast, and touch targets.
3. Check narrow screens, short landscape screens, browser zoom, and reduced motion.
4. Refine page title and description and add a small site-specific favicon.
5. Test the packaged site locally, then publish the completed changes to the existing URL.

Acceptance: a recruiter can reach work, résumé, and contact with minimal navigation; content remains usable without animation; no console errors or broken links remain.

## Recommended order

Collect project and career material first. Then refine the hero and animation together, build the project case studies, and finish with mobile/accessibility checks and publication.

The first implementation milestone is a polished opening view and one complete project case study. Extend the established design to the remaining content after that milestone is reviewable.

This document is a plan; it does not change the published site.
