---
name: design-system-selected-work
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Selected Work

## Mission
Deliver implementation-ready design-system guidance for Selected Work that can be applied consistently across dashboard web app interfaces.

## Brand
- Product/brand: Selected Work
- URL: https://www.nk.studio/work/
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=DM Sans`, `font.family.stack=DM Sans, sans-serif`, `font.size.base=20px`, `font.weight.base=400`, `font.lineHeight.base=21.8px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=12px`, `font.size.md=14px`, `font.size.lg=15px`, `font.size.xl=16px`, `font.size.2xl=20px`, `font.size.3xl=32px`, `font.size.4xl=56px`
- Color palette: `color.text.primary=#fdfdf9`, `color.text.secondary=#070b0a`, `color.text.tertiary=#888a88`, `color.surface.base=#000000`, `color.border.strong=rgba(253, 253, 249, 0.75) rgba(253, 253, 249, 0.75) rgba(253, 253, 249, 0.25)`
- Spacing scale: `space.1=7.2px`, `space.2=8px`, `space.3=16px`, `space.4=31px`, `space.5=80px`
- Radius/shadow/motion tokens: `shadow.1=rgba(194, 195, 192, 0.14) 0px 1px 4px 0px` | `motion.duration.instant=300ms`, `motion.duration.fast=700ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
