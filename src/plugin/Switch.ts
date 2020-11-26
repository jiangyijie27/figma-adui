import {getValueFromNode, stringifyStyle} from './utils';

const Switch = (node: SceneNode, additionalStyle: IBaseObject) => {
  const size = getValueFromNode('尺寸', node);
  const status = getValueFromNode('状态', node);
  let checked = false;
  let disabled = false;
  switch (status) {
    case '开':
      checked = true;
      break;
    case '关-禁用':
      disabled = true;
      break;
    case '开-禁用':
      checked = true;
      disabled = true;
      break;
    default:
  }

  let text = '';
  if ('children' in node) {
    const textNode = node.children.find(o => o.type === 'TEXT') as TextNode;
    if (textNode?.visible) {
      text = textNode.characters;
    }
  }

  return `
    <Switch
      ${checked ? 'checked' : 'checked={false}'}
      ${disabled ? 'disabled' : ''}
      ${size ? `size="${size}"` : ''}
      ${
        text
          ? `
          checkedText="${text}"
          unCheckedText="${text}"
        `
          : ''
      }
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    />
  `;
};

export default Switch;
