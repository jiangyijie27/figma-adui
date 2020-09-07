import {getChecked, getDisabled, getSize} from './utils';

const Checkbox = (node: SceneNode) => {
  const checked = getChecked(node);
  const disabled = getDisabled(node);
  let size: TSize;
  let childString = '';

  // 如果是 group 内，则不使用 intent size
  let isGroupChild = false;
  if (node.parent) {
    let mainComponent: ComponentNode;
    if ('mainComponent' in node.parent) {
      mainComponent = node.parent.mainComponent;
    }
    if (
      node.parent.name.includes('勾选组') ||
      mainComponent?.name.includes('勾选组')
    ) {
      isGroupChild = true;
    }
  }

  if ('children' in node) {
    const textChild = node.children.find(o => o.type == 'TEXT') as TextNode;
    childString = textChild?.characters;
    if (textChild) {
      size = getSize(textChild);
    }
  }

  return `
    <Checkbox
      ${checked ? 'checked' : ''}
      ${disabled ? 'disabled' : ''}
      ${size && !isGroupChild ? `size="${size}"` : ''}
      ${
        childString
          ? `
        >
          ${childString}
        </Checkbox>
      `
          : '/>'
      }
  `;
};

export default Checkbox;
