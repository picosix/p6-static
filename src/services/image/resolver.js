const _ = require('lodash');

// Constants
const DEFAULT_POSITION = 'southwest';
const ALLOW_POSITION = [
  'north',
  'northeast',
  'east',
  'southeast',
  'south',
  'southwest',
  'west',
  'northwest',
  'center',
  'centre'
];

/**
 * Return absolute width and height
 * @param {object} param Function parameter with {size, width, height}
 * @returns {object}
 */
const caculateSize = ({
  size = {},
  width: originalWidth,
  height: originalHeight
}) => {
  // Return full size, don't caculate anything
  if (size === 'full') {
    return { width: originalWidth, height: originalHeight };
  }

  // Size is percent of original size
  if (_.isNumber(size)) {
    return { width: originalWidth * size, height: originalHeight * size };
  }

  // Size is absolute width and height
  const absoluteWidth = Number(size.width);
  const absoluteHeight = Number(size.height);

  // Invalid size
  if (
    !(
      _.isNumber(absoluteWidth) &&
      !_.isNaN(absoluteWidth) &&
      _.isNumber(absoluteHeight) &&
      !_.isNaN(absoluteHeight)
    )
  ) {
    return {};
  }

  return { width: absoluteWidth, height: absoluteHeight };
};

/**
 * Return valid conposite image position
 * @param {string} position Conposite image position
 * @returns {object}
 */
const caculateCompositePosition = position =>
  ALLOW_POSITION.indexOf(position) < 0 ? DEFAULT_POSITION : position;

module.exports = { caculateSize, caculateCompositePosition };
