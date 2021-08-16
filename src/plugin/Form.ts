import {reverseArr} from './utils';

const getFormatStrLeng = (str: string) => {
  const len = str.length;
  let realLength = 0;
  let charCode = -1;
  for (let i = 0; i < len; i += 1) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 0.5;
    } else {
      realLength += 1;
    }
  }
  return Math.ceil(realLength);
};

const Form = (props: IRenderProps) => {
  const {node, generate, additionalClassNames = []} = props;

  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  let childrenNodes = '';
  let labelSize = 0;

  if ('children' in node) {
    childrenNodes = (layoutMode === 'NONE'
      ? reverseArr(node.children)
      : node.children
    )
      .map(o => generate(o))
      .join('');

    node.children.forEach(o => {
      if ('children' in o) {
        const label = o.children.find(p => p.name === '表单-label') as TextNode;
        const help = o.children.find(p => p.name === '反馈/help-circle');
        if (label) {
          const length = getFormatStrLeng(label.characters) + (help ? 1 : 0);
          if (labelSize < length) {
            labelSize = length;
          }
        }
      }
    });
  }

  let classNameString = '';

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  return `
    <Form
      ${labelSize ? `labelSize={${labelSize}}` : ''}
      ${classNameString}
    >
      ${childrenNodes}
    </Form>
  `;
};

export default Form;
