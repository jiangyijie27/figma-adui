import {reverseArr, stringifyStyle} from './utils';
const Form = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
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
          const length = label.characters.length + (help ? 1 : 0);
          if (labelSize < length) {
            labelSize = length;
          }
        }
      }
    });
  }

  return `
    <Form
      ${labelSize ? `labelSize={${labelSize}}` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenNodes}
    </Form>
  `;
};

export default Form;
