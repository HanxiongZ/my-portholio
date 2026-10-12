# ColorOS cyan / blue / violet mesh gradient

Approved on 2026-10-10 as the default background for the latest ColorOS portfolio cover (`OppoOpening`). This is the integrated portfolio artwork, not only a standalone preview.

Original procedural background inspired by the soft color fields and fine grain of the approved Pinterest reference #6. No reference image pixels are used.

- Main blue: #0066FF; cyan on the left, violet on the right.
- Broad Gaussian fields, slight domain warping, neutral mist along the upper perimeter.
- Fine static monochrome grain at 3.7% peak-to-peak amplitude. No blurred texture layer or bright contours.
- Uses the existing portfolio renderer's 3.375x time multiplier, with an internal motion scale of 0.065. Respects reduced-motion preferences.
- `fluid.frag`: animated WebGL version.
- `generate.py`: NumPy / Pillow static fallback and matched mobile panel crops.
- `index.html`: standalone animated preview, with a pause control.

Preview: `/coloros-fluid/mesh-grain/index.html`

Applied page: `/project/oppo-audio-cover`

Previous background comparison: `/project/oppo-audio-cover?backdrop=previous` (the `blue-teal` assets are preserved).

Regenerate stills: `python3 generate.py --width 2560 --height 1141 --time 0`

Reference: https://se.pinterest.com/pin/45247171251032707/
