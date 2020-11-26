import {getValueFromNode} from './utils';

const Radio = (node: SceneNode) => {
  const size = getValueFromNode('尺寸', node);
  const status = getValueFromNode('状态', node);
  let checked = false;
  let disabled = false;
  switch (status) {
    case '选中':
      checked = true;
      break;
    case '禁用':
      disabled = true;
      break;
    case '禁用-选中':
      checked = true;
      disabled = true;
      break;
    default:
  }

  let childString = '';

  // 如果是 group 内，则不使用 size
  let isGroupChild = false;
  if (node.parent) {
    let mainComponent: ComponentNode;
    if ('mainComponent' in node.parent) {
      mainComponent = node.parent.mainComponent;
    }
    if (mainComponent?.parent?.name.includes('单选组')) {
      isGroupChild = true;
    }
  }

  if ('children' in node) {
    const textChild = node.children.find(o => o.type == 'TEXT') as TextNode;
    childString = textChild?.characters;
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
