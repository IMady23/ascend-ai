# Ascend Design Language (ADL) - Governance Rules

This document ensures that the ADL does not grow into a bloated, inconsistent UI library. Every new component or modification must pass this checklist before being merged into the ADL.

## Component Introduction Checklist

1. **Does an existing component solve this?**
   * Before building a new `InfoBanner`, check if `Badge` or `GlassCard` can support an `info` variant.
   
2. **Should this be a variant instead?**
   * If the new component shares 80% of its behavior with an existing one, it should be a variant (e.g., `Button variant="destructive"` instead of a new `DeleteButton` component).

3. **Does it belong in ADL?**
   * ADL components must be highly reusable. If a component contains heavy, page-specific business logic, it is a *Page Component*, not an ADL component.

4. **Is it reusable outside its original module?**
   * A `WorkoutSessionCard` might start in Training, but it must be built abstractly enough that AI Command can render it in a chat stream.

5. **Is it accessible by default?**
   * Does it support keyboard navigation (`tabIndex`, `:focus-visible`)?
   * Does it have appropriate ARIA labels?
   * Does it respect `@media (prefers-reduced-motion)`?
   * Is color contrast sufficient in both Light and Dark themes?

6. **Does it consume 100% Design Tokens?**
   * `padding: 16px` is forbidden. Use `p-4` (mapped to `spacing.4`).
   * `#FF5555` is forbidden. Use `var(--color-accent-orange)`.

7. **Does it follow the Component API Standard?**
   * Never invent `buttonSize="small"`. Use the standard `size="sm"`.
   * Standard props: `variant`, `size`, `className`, `children`, `isLoading`, `isDisabled`.

## Deprecation Strategy
When a component is replaced or retired:
1. Do not delete it immediately.
2. Mark its Status as `Deprecated` in `ADL_INVENTORY.md`.
3. Add a `@deprecated Use [ReplacementComponent] instead.` JSDoc comment to the interface.
4. Schedule its removal for the next major semver release.
