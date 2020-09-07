import {getChecked, getDisabled, getSize} from './utils';

const Radio = (node: SceneNode) => {
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
      node.parent.name.includes('单选组') ||
      mainComponent?.name.includes('单选组')
    ) {
      isGroupChild = true;
    }
  }

  if ('children' in node) {
    const textChild = node.children.find(o => o.type == 'TEXT') as TextNode;
    childString = textChild?.characters;
    size = getSize(textChild);
  }

  return `
    <Radio
      ${checked ? 'checked' : ''}
      ${disabled ? 'disabled' : ''}
      ${size && !isGroupChild ? `size="${size}"` : ''}
      ${
        childString
          ? `
        >
          ${childString}
        </Radio>
      `
          : '/>'
      }
  `;
};

export default Radio;
