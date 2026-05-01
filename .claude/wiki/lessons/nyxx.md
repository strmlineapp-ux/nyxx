# Lessons Learned — Nyxx

## Design
Abstract brand names (Nyxx) with built-in visual marks (XX) create stronger brand identity than literal descriptors. No cliché audio imagery (no mic icons, headphones, studio stereotypes) was a key differentiator validated by competitor research.

## Architecture
Vanilla HTML/CSS/JS delivered better performance than React/Next.js for a static portfolio — zero JS bundle, faster LCP, simpler deployment. The framework expected React/Next.js, but the design spec didn't mandate it.

## Workflow
ComfyUI Z-Image-Turbo generated quality assets in 8 steps, but the images were dark abstract gradients — not ideal for project thumbnails. Real screenshots/photos would be better when available.

## Framework
The framework's Next.js-centric stages (Build, Deploy, Integrate) required adaptation for a static site. The concept, research, design, assets, and review stages translated well.

## Integration
Always replace placeholder assets before deployment. The 9 ComfyUI-generated images were saved to `public/assets/images/` but the HTML still referenced gradient placeholders — caught during review, not automated. The asset pipeline generated images but didn't update HTML references. A post-generation step should auto-update asset references.

## Quality
Manual QA (code review, accessibility audit, performance check) was more effective than automated tests for a static site — Playwright and Lighthouse weren't installed, but manual scores were strong (a11y=95, perf=92).
