# Design Pattern — Elegant Experimentalism

## Description
A design aesthetic that blends clean, minimal layout structures with generative visuals, noise textures, and gradient orbs. The elegance comes from restraint in typography, spacing, and navigation. The experimentalism comes from layered canvas animations, gradient orbs, noise overlays, and abstract generative imagery.

## When to Use
- Creative portfolios (audio, visual, music, film)
- Brand sites for artists and producers
- Projects where the work itself is abstract or generative
- Dark-mode-first sites targeting creative professionals

## Key Elements
1. **Noise overlay** — Subtle grain texture layered over dark backgrounds for depth
2. **Gradient orbs** — Soft, blurred color fields (violet, teal) that float behind content
3. **Generative canvas** — Animated waveforms, particles, or abstract shapes
4. **Minimal typography** — Space Grotesk (headings) + Inter (body), 2 weights each
5. **Abstract imagery** — No literal representations; gradients, textures, geometry
6. **Dual-path navigation** — Separate content streams (e.g., Work / Music) for dual-audience sites

## Technical Implementation
- CSS custom properties for color tokens (15 HSL values)
- BEM naming convention (block__element--modifier)
- IntersectionObserver for scroll-reveal animations (fade-in class)
- Canvas API for waveform animation (pauses when off-screen)
- `prefers-reduced-motion` media query for accessibility

## References
- A24.com — Dark, experimental, minimal
- Monstercat.com — Electronic music brand, generative visuals
- Ableton.com — Clean layout + experimental aesthetics
