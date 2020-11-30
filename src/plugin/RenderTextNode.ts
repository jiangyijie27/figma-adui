import {
  convertNumToPx,
  convertColorToCSS,
  toCamelCase,
  stringifyStyle,
} from './utils';

const TextNode = (
  node: TextNode,
  additionalStyle: IBaseObject,
  tagName: 'div' | 'span' = 'span'
) => {
  additionalStyle.display = 'inline-block';

  const {
    characters,
    fontName,
    fontSize,
    letterSpacing,
    lineHeight,
    fills,
  } = node;
  const style: string[] = [];
  /**
   * fontSize
   */
  if (typeof fontSize === 'number') {
    style.push(`font-size: ${convertNumToPx(fontSize)};`);
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
      style.push(`font-weight: ${fontWeightMapping[fontWeight]};`);
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
      style.push(`line-height: ${convertNumToPx(value)};`);
    } else if (unit === 'PERCENT') {
      style.push(`line-height: ${value}%;`);
    }
  }
  /**
   * letterSpacing
   */
  if (typeof letterSpacing === 'object') {
    const {unit, value} = letterSpacing;
    if (value !== 0) {
      if (unit === 'PIXELS') {
        style.push(`letter-spacing: ${convertNumToPx(value)};`);
      } else {
        style.push(`letter-spacing: ${value / 100}em;`);
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
    style.push(`color: ${convertColorToCSS(fills[0])};`);
  }

  const styleString: string[] = [];

  style.forEach((cssExpression: string) => {
    const ex = cssExpression.replace(';', '').split(': ');
    const exText = toCamelCase(ex[0]) + ': ' + '"' + ex[1] + '"' + ',';
    styleString.push(exText);
  });

  return `
    <${tagName}
      style={{
        ${
          Object.keys(additionalStyle).length
            ? `${stringifyStyle(additionalStyle).slice(
                1,
                stringifyStyle(additionalStyle).length - 1
              )},`
            : ''
        }
        ${styleString.join('\n')}
      }}
    >
      ${characters}
    </${tagName}>
  `;
};

export default TextNode;
