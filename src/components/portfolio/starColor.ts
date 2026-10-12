type ColorAnchor = { x: number; y: number; color: [number, number, number] };

const COLOR_ANCHORS: ColorAnchor[] = [
  { x: 0.02, y: 0.16, color: [39, 70, 255] },
  { x: 0.2, y: 0.2, color: [255, 58, 167] },
  { x: 0.42, y: 0.16, color: [255, 183, 0] },
  { x: 0.62, y: 0.2, color: [0, 197, 118] },
  { x: 0.86, y: 0.2, color: [0, 157, 226] },
  { x: 0.12, y: 0.58, color: [255, 82, 50] },
  { x: 0.42, y: 0.53, color: [250, 66, 137] },
  { x: 0.68, y: 0.52, color: [135, 62, 221] },
  { x: 0.9, y: 0.58, color: [25, 111, 230] },
  { x: 0.26, y: 0.9, color: [0, 135, 221] },
  { x: 0.58, y: 0.88, color: [210, 53, 176] },
  { x: 0.88, y: 0.86, color: [38, 126, 218] },
];

export const getSpatialStarColor = (x: number, y: number): [number, number, number] => {
  let red = 0;
  let green = 0;
  let blue = 0;
  let totalWeight = 0;

  for (const anchor of COLOR_ANCHORS) {
    const dx = x - anchor.x;
    const dy = y - anchor.y;
    const weight = Math.exp(-(dx * dx + dy * dy) / 0.055);
    red += anchor.color[0] * weight;
    green += anchor.color[1] * weight;
    blue += anchor.color[2] * weight;
    totalWeight += weight;
  }

  return [
    Math.round(red / totalWeight),
    Math.round(green / totalWeight),
    Math.round(blue / totalWeight),
  ];
};

export const rgbString = ([red, green, blue]: [number, number, number]) =>
  `rgb(${red}, ${green}, ${blue})`;

export const rgbaString = ([red, green, blue]: [number, number, number], alpha: number) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`;
