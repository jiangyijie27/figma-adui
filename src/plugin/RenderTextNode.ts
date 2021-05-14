import {
  convertNumToPx,
  convertColorToCSS,
  toCamelCase,
  toHyphenCase,
  stringifyStyle,
  styleObjectToCSS,
  styleObjectToTailwind,
} from './utils';

const TextNode = ({
  node,
  additionalStyle,
  tagName = 'div',
  options = {},
}: {
  node: TextNode;
  additionalStyle: IBaseObject;
  tagName?: 'div' | 'span';
  options: IBaseObject;
}) => {
  const {useTailwind} = options;
  const {
    characters,
    fontName,
    fontSize,
    letterSpacing,
    lineHeight,
    textAlignHorizontal,
    textAutoResize,
    fills,
    width,
  } = node;
  const style: IBaseObject = {};
  /**
   * width
   */
  if (textAutoResize !== 'WIDTH_AND_HEIGHT') {
    additionalStyle.width = `${Math.round(width)}px`;
  }
  /**
   * textAlign
   */
  switch (textAlignHorizontal) {
    case 'CENTER':
      additionalStyle.textAlign = 'center';
      break;
    case 'RIGHT':
      additionalStyle.textAlign = 'right';
      break;
  }
  /**
   * fontSize
   */
  if (typeof fontSize === 'number') {
    style.fontSize = convertNumToPx(fontSize);
  }
  /**
   * fontWeight
   */
  if (typeof fontName === 'object') {
    const {style: fontWeight} = fontName;
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
    const fontWeightMapping = {
      Thin: 100,
      Hairline: 100,
      Ultralight: 200,
      Extralight: 200,
      Light: 300,
      Normal: 400,
      Regular: 400,
      Medium: 500,
      Semibold: 600,
      Demibold: 600,
      Bold: 700,
      Extrabold: 800,
      Ultrabold: 800,
      Black: 900,
      Heavy: 900,
      Extrablack: 950,
      Ultrablack: 950,
    };
    if (fontWeightMapping[fontWeight] !== 400) {
      style.fontWeight = fontWeightMapping[fontWeight];
    }
  }
  /**
   * lineHeight
   */
  if (typeof lineHeight === 'object') {
    const {unit, value} = lineHeight as {
      readonly value: number;
      readonly unit: 'PIXELS' | 'PERCENT';
    };
    if (unit === 'PIXELS') {
      style.lineHeight = convertNumToPx(value);
    } else if (unit === 'PERCENT') {
      style.lineHeight = `${value}%`;
    }
  }
  /**
   * letterSpacing
   */
  if (typeof letterSpacing === 'object') {
    const {unit, value} = letterSpacing;
    if (value !== 0) {
      if (unit === 'PIXELS') {
        style.letterSpacing = convertNumToPx(value);
      } else {
        style.letterSpacing = `${value / 100}em;`;
      }
    }
  }
  /**
   * color
   */
  if (
    fills &&
    Array.isArray(fills) &&
    fills.length === 1 &&
    fills[0].type === 'SOLID'
  ) {
    style.color = convertColorToCSS(fills[0]);
  }

  let finalStyle = {
    ...additionalStyle,
    ...style,
  };

  let finalString = Object.keys(finalStyle).length
    ? `style={${stringifyStyle(finalStyle)}}`
    : '';

  if (useTailwind) {
    finalString = Object.keys(finalStyle).length
      ? `className="${styleObjectToTailwind(finalStyle)}"`
      : '';
  }

  return `
    <${tagName}
      ${finalString}
    >
      ${characters}
    </${tagName}>
  `;
};

export default TextNode;
