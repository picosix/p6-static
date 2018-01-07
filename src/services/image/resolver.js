const _ = require('lodash');
const logger = require('../../libs/logger');

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
  // Size is percent of original size
  if (_.isNumber(size)) {
    return {
      width: Math.round(originalWidth * size),
      height: Math.round(originalHeight * size)
    };
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
    logger.warning('Invalid size config. Return original size', {
      size,
      originalWidth,
      originalHeight,
      absoluteWidth,
      absoluteHeight,
      category: 'services.image.resolver.caculateSize'
    });
    return {
      width: Math.round(originalWidth),
      height: Math.round(originalHeight)
    };
  }

  return {
    width: Math.round(absoluteWidth),
    height: Math.round(absoluteHeight)
  };
};

/**
 * Return valid conposite image position
 * @param {string} position Conposite image position
 * @returns {object}
 */
const caculateCompositePosition = position => {
  let pos = position;

  if (!_.isString(position) || ALLOW_POSITION.indexOf(position) < 0) {
    logger.warning('Invalid position config. Use DEFAULT_POSITION', {
      position,
      DEFAULT_POSITION,
      category: 'services.image.resolver.caculateCompositePosition'
    });
    pos = DEFAULT_POSITION;
  }

  return pos;
};

module.exports = { caculateSize, caculateCompositePosition };
