module.exports = (width, height, size) => {
  // Size is number, use relative size (%)
  if (typeof size === "number") {
    width *= size;
    // Use null or undefined to auto-scale the height to match the width
    return [Math.round(width)];
  }

  // Use size on setting
  // If width is not eixst, auto-scale the width to match the height
  // If height is not eixst, auto-scale the height to match the width
  // If bot width and height are eixst, transform to exact size
  if (typeof size.width === "number") width = size.width;
  if (typeof size.height === "number") height = size.height;

  // Return original size
  return [width, height];
};
