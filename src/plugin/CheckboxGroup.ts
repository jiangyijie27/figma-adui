import {getSize, stringifyStyle} from './utils';

const CheckboxGroup = (node: SceneNode, generate: IGenerate, additionalStyle: IBaseObject) => {
  let size: TSize;
  let childrenString = '';

  if ('children' in node) {
    const {children} = node;
    let mainComponent: ComponentNode;
    if ('mainComponent' in node) {
      mainComponent = node.mainComponent;
    }
    const checkboxes = children.filter(
      o =>
        (o.name.includes('选项') ||
          o.name.includes('勾选/') ||
          mainComponent?.name.includes('勾选/')) &&
        o.visible
    );
    childrenString = checkboxes.map(o => generate(o)).join('');

    if (checkboxes.length) {
      const firstCheckbox = checkboxes[0];
      if ('children' in firstCheckbox) {
        const radioTextNode = firstCheckbox.children.find(
          o => o.type === 'TEXT'
        ) as TextNode;
        if (radioTextNode) {
          size = getSize(radioTextNode);
        }
      }
    }
  }

  return `
    <Checkbox.Group
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenString}
    </Checkbox.Group>
  `;
};

export default CheckboxGroup;
