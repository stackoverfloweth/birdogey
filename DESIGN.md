# Design System Specification: Kinetic Precision



## 1. Overview & Creative North Star

### Creative North Star: "The Kinetic Navigator"

This design system moves away from the static, rigid structures of traditional data-heavy applications and embraces a philosophy of **Kinetic Precision**. Inspired by the mascot's vibrant plumage and high-energy motion, the UI is designed to feel as if it is in a state of suspended animation—precise and technical, yet fundamentally playful.



We break the "template" look by utilizing **Intentional Asymmetry**. Hero sections and data visualizations should avoid centered, balanced perfection. Instead, they should favor weighted compositions that suggest forward momentum. Elements overlap, surfaces bleed into one another, and typography is used at an editorial scale to create a "digital zine" feel that balances high-end professionalism with illustrative soul.



---



## 2. Colors & Atmospheric Depth

The palette shifts from legacy greens to a sophisticated spectrum of **Vibrant Blues** and **Deep Burnt Oranges**, mirroring the character's high-contrast features.



### Tonal Hierarchy

- **Primary Movement:** `primary` (#00618c) and `primary_container` (#00b3fe). These are the drivers of action.

- **The Warning Strike:** `secondary` (#974300) acts as a high-visibility counterpoint, used for critical accents and kinetic highlights.

- **Neutral Ground:** `surface` (#f5f7f9) and its variants provide the canvas.



### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined through:

1.  **Background Shifts:** A `surface_container_low` section sitting against a `surface` background.

2.  **Tonal Transitions:** Using soft gradients from `surface_container` to `surface_container_highest` to define clickable areas.



### The "Glass & Gradient" Rule

To elevate the experience beyond flat design, floating elements (modals, navigation bars, tooltips) should utilize **Glassmorphism**. Use semi-transparent `surface` tokens with a `backdrop-blur` effect (12px–20px). Main CTAs should not be flat; apply a subtle linear gradient from `primary` to `primary_container` to provide the "soul" and polish seen in high-end editorial digital pieces.



---



## 3. Typography

The system default font is the platform default (San Francisco on iOS). Use generous line-height (1.5 - 1.6) for body text to keep high-density data readable.

**Ephesis** is reserved for special moments only — brand titles, hero statements, and celebratory screens. It should never be used for body text, labels, or UI controls.

*   **Display (lg/md/sm):** Used for "Big Moments"—hero statements and major milestones. These should use tight letter-spacing (-0.02em) to feel authoritative and "blocky."

*   **Headline & Title:** The organizational backbone. Use `headline-lg` (2rem) for page titles to establish a clear editorial hierarchy.

*   **Body (lg/md/sm):** The workhorse. Always maintain a generous line-height (1.5 - 1.6) for readability in high-density data.

*   **Labels:** `label-sm` (0.6875rem) should be used for metadata and technical specs, often paired with `primary_dim` to keep the UI from feeling cluttered.



---



## 4. Elevation & Depth

Depth is not a shadow; depth is a **Layering Principle**. We stack tiers of `surface_container` tokens to create a "Tactile Stack."



*   **Tonal Layering:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#eef1f3) background. This creates a natural, soft lift without the visual "noise" of a shadow.

*   **Ambient Shadows:** Where physical separation is required (e.g., a floating Action Button), use an extra-diffused shadow.

    *   *Spec:* `0px 12px 32px rgba(44, 47, 49, 0.06)` (A tinted version of `on_surface`).

*   **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline_variant` (#abadaf) at **15% opacity**. This creates a "suggestion" of a line rather than a hard cage.



---



## 5. Components



### Buttons

*   **Primary:** A gradient fill (Primary to Primary Container) with `full` (9999px) roundedness.

*   **Secondary:** `surface_container_highest` fill with `primary` text. No border.

*   **Kinetic State:** On hover, buttons should scale slightly (1.02x) to lean into the brand's energetic personality.



### Cards

*   **Rule:** No dividers. Use vertical whitespace (referencing the `xl` 3rem spacing) to separate content.

*   **Style:** `surface_container_lowest` fill with a `md` (1.5rem) or `lg` (2rem) corner radius.



### Input Fields

*   **Unfocused:** `surface_container` fill, no border.

*   **Focused:** `surface_container_lowest` fill with a 2px `primary_fixed` ghost border (20% opacity).

*   **Typography:** Labels must use `label-md` in `on_surface_variant`.



### Chips & Tags

*   **Action Chips:** Utilize `secondary_container` (#ffc5a6) with `on_secondary_container` (#773400) text to draw the eye to interactive metadata. Use `full` roundedness.



### Custom Component: The "Precision Tracker"

A bespoke progress indicator or data-point container that uses the mascot's "X" eye motif or "kinetic" wings as subtle background icons (watermarked at 5% opacity) to ground the technical data in the brand's illustrative world.



---



## 6. Do's and Don'ts



### Do

*   **DO** use the `lg` (2rem) and `xl` (3rem) corner radius for large containers to evoke a friendly, organic feel.

*   **DO** allow character assets to break the container bounds. If a mascot is in a card, let a wing or beak overlap the edge.

*   **DO** use high-contrast typography scales (e.g., pairing a `display-lg` headline with `body-sm` metadata).



### Don't

*   **DON'T** use 100% black (#000000) for text. Always use `on_surface` (#2c2f31) for a softer, premium feel.

*   **DON'T** use 1px solid borders to separate list items. Use a 12px vertical gap or a subtle shift to `surface_container_low`.

*   **DON'T** settle for a symmetrical grid. If a three-column layout is needed, try a 2:1 or 1:2 ratio to keep the energy "kinetic."
