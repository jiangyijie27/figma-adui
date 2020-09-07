import {convertColorToCSS} from './utils';
const FormTip = (node: TextNode) => {
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
    if (convertColorToCSS(fills[0]) !== '#a3a3a3') {
      intent = 'danger';
    }
  }

  return `
    <Form.Tip
      ${intent ? `intent="${intent}"` : ''}
    >
      ${characters}
    </Form.Tip>
  `;
};

export default FormTip;
