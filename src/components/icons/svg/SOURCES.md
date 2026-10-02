# Icon sources

Normalised SVG sources for `npm run icons`. Colours are `currentColor`
(follows the text colour); two-tone icons use `var(--icon-contrast, #fff)`
for the inner glyph.

| File | Origin |
| --- | --- |
| arrow-right-circle, arrow-right-circle-filled, chevron-up, truck, stethoscope, globe-earth, sort, radio-checked, radio-unchecked | Exported from the Figma design file |
| map-location, payment-success, customer-support, social-x, social-instagram, social-linkedin, social-linkedin-outline, social-facebook | [Hugeicons](https://hugeicons.com) stroke-rounded (MIT), via Iconify (`maps-location-01`, `payment-success-01`, `customer-support`, `new-twitter`, `instagram`, `linkedin-01`, `linkedin-02`, `facebook-02`) |
| star, close-circle | [Unicons](https://iconscout.com/unicons) (Apache-2.0), via Iconify (`uis:star`, `uil:times-circle`) |
| check-circle, menu | Hand-authored to match the design |
| logo | Apsu wordmark exported from Figma (`1:308`, user export L1); size it explicitly (87:32), e.g. `h-8 w-[5.4375rem]` |

Design names match the Figma layer names; icons were compared against the
design screenshots (see `doc/assets-checklist.md`).
