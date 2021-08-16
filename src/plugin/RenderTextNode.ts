import {colors, convertColorToCSS} from './utils';

const TextNode = ({
  node,
  additionalClassNames,
  tagName = 'div',
}: {
  node: TextNode;
  additionalClassNames: string[];
  tagName?: 'div' | 'span';
}) => {
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
  let styleString = '';
  /**
   * width
   */
  if (textAutoResize !== 'WIDTH_AND_HEIGHT') {
    additionalClassNames.push(`w-${Math.round(width)}`);

    /**
     * textAlign
     */
    switch (textAlignHorizontal) {
      case 'CENTER':
        additionalClassNames.push('text-center');
        break;
      case 'RIGHT':
        additionalClassNames.push('text-right');
        break;
    }
  }
  /**
   * fontSize
   */
  if (typeof fontSize === 'number') {
    additionalClassNames.push(`text-${Math.round(fontSize)}`);
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
    if (fontWeightMapping[fontWeight] === 500) {
      additionalClassNames.push('font-medium');
    } else if (fontWeightMapping[fontWeight] > 500) {
      additionalClassNames.push('font-bold');
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
      additionalClassNames.push(`leading-${value}`);
    }
  }
  /**
   * letterSpacing
   */
  if (typeof letterSpacing === 'object') {
    const {unit, value} = letterSpacing;
    if (value !== 0) {
      if (unit === 'PIXELS') {
        additionalClassNames.push(`tracking-${value}`);
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
    const color = convertColorToCSS(fills[0]);
    if (colors[color]) {
      additionalClassNames.push(`text-${colors[color]}`);
    } else {
      styleString = `style={{ color: "${color}" }}`;
    }
  }

  let classNameString = '';

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  return `
    <${tagName}
      ${classNameString}
      ${styleString}
    >
      ${characters}
    </${tagName}>
  `;
};

export default TextNode;
