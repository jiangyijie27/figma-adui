import {reverseArr, stringifyStyle} from './utils';
const Form = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let childrenNodes = '';
  let labelSize = 0;

  if ('children' in node) {
    childrenNodes = reverseArr(node.children)
      .map(o => generate(o))
      .join('');

    node.children.forEach(o => {
      if ('children' in o) {
        const label = o.children.find(p => p.name === '表单-label') as TextNode;
        if (label && labelSize < label.characters.length) {
          labelSize = label.characters.length;
        }
      }
    });
  }

  delete additionalStyle.display

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
