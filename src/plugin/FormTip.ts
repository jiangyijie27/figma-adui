import {convertColorToCSS, stringifyStyle} from './utils';
const FormTip = (node: TextNode, additionalStyle) => {
  const {characters, fills} = node;
  let intent: TIntent;
  /**
   * color
   */
  if (
    fills &&
    Array.isArray(fills) &&
    fills.length === 1 &&
    fills[0].type === 'SOLID'
  ) {
    if (
      convertColorToCSS(fills[0]) !== '#a3a3a3' &&
      convertColorToCSS(fills[0]) !== '#6b6b6b'
    ) {
      intent = 'danger';
    }
  }

  return `
    <Form.Tip
      ${intent ? `intent="${intent}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${characters}
    </Form.Tip>
  `;
};

export default FormTip;
