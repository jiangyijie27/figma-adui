import {stringifyStyle, styleObjectToTailwind} from './utils';

const ButtonGroup = (props: IRenderProps) => {
  const {
    node,
    generate,
    additionalStyle: additionalStyleParam = {},
    useTailwind,
  } = props;
  const additionalStyle = {};

  let childrenCodes = '';
  if ('children' in node) {
    const {children} = node;
    childrenCodes = children.map(o => generate(o)).join('\n');
  }
  let styleString = Object.keys(additionalStyle).length
    ? `style={${stringifyStyle(additionalStyle)}}`
    : '';

  if (useTailwind) {
    styleString = Object.keys(additionalStyle).length
      ? `className="${styleObjectToTailwind(additionalStyle)}"`
      : '';
  }
  return `
    <Button.Group
      ${styleString}
    >
      ${childrenCodes}
    </Button.Group>
  `;
};

export default ButtonGroup;
