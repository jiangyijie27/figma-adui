import {stringifyStyle} from './utils';

const ButtonGroup = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let childrenCodes = '';
  if ('children' in node) {
    const {children} = node;
    childrenCodes = children.map(o => generate(o)).join('\n');
  }
  // auto layout 时子元素会倒序；array.prototype.reverse 会报错
  return `
    <Button.Group
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenCodes}
    </Button.Group>
  `;
};

export default ButtonGroup;
