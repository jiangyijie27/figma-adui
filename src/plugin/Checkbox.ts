import {getValueFromNode} from './utils';

const Checkbox = (node: SceneNode) => {
  const size = getValueFromNode('尺寸', node);
  const status = getValueFromNode('状态', node);
  let checked = false;
  let disabled = false;
  let indeterminate = false;
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
    case '部分选中':
      indeterminate = true;
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
    if (mainComponent?.parent?.name.includes('勾选组')) {
      isGroupChild = true;
    }
  }

  if ('children' in node) {
    const textChild = node.children.find(o => o.type == 'TEXT') as TextNode;
    childString = textChild?.characters;
  }

  return `
    <Checkbox
      ${checked ? 'checked' : ''}
      ${disabled ? 'disabled' : ''}
      ${indeterminate ? 'indeterminate' : ''}
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
