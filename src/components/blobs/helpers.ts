export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

export const calcLum = (r: number, g: number, b: number) => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
