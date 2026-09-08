---
version: 1
slug: "app-lang-cockpit-page-tsx"
primary_target: "app/[lang]/cockpit/page.tsx"
related_targets: ["components/cockpit","components/cockpit/cockpit-app.tsx","components/cockpit/scene/cockpit-scene.tsx","components/cockpit/chrome/intro-overlay.tsx","components/cockpit/dock/dock-overlay.tsx","components/cockpit/dock/dock-content.tsx"]
---

# Cockpit — playable CV

## Scope and mode

Mode: Experience. `/{locale}/cockpit` is the playable CV, with its intro,
scene, HUD and docked content. This setup does not redesign the game.

## Job and outcome

Let visitors explore Matteo's public work and profile, understand the
engineering through the experience, and reach contact or the CV. Keep
recruiter evaluation possible without mastering flight controls.

## Authority and boundaries

Use PRODUCT.md for facts, DESIGN.md for the implemented visual system,
and AGENTS.md for technical constraints. Preserve vanilla Three.js,
scene/React boundaries, HUD diffing, section data, input behavior, EN/IT,
public content and the existing private access gate.

## Review requirements

Check desktop keyboard and mobile touch, intro/start, direct navigation,
dock open/close, focus return, Escape, contact and public CV. Verify
reduced motion and unsupported WebGL behavior when changing the scene.
Keep landing improvements scoped to the landing unless cockpit work is
explicitly part of the implementation brief. Never turn gameplay into
a required step for a commercial enquiry.

## Approved shared language — 2026-09-08

The owner approved unifying both surfaces. Unbounded titles, Space Grotesk
text/actions and monospace telemetry; shared near-black, ivory and orange;
consistent flat controls, thin frames and language navigation.
The cockpit retains its playable astronaut and instrument function while
dropping decorative glow, scanlines and metal fasteners. The landing uses
an Image Gen astronaut based on a reference render of the cockpit GLB,
plus an original generated lunar background. Cal.com remains deferred. Preserve gameplay, public/private
access, localized content, keyboard/touch and the landing's native scroll.
The approved incumbent landing supplies the visual authority for this scoped
unification; no new direction tournament or replacement comp is requested.

## Owner refinement: character, portraits and CV action

Use an original Image Gen reinterpretation of the astronaut, with the GLB
render as its reference; do not serve the raw render on the landing. Replace
the header orbit symbol with a circular avatar derived from the supplied
real photograph, and remove the same symbol from all three service rows.
The avatar and services portrait must share a realistic, natural face and
confident expression, preserving the owner's recognizable features. Add the
secondary hero action “Gioca al mio CV” / “Play my CV” to the localized cockpit.
