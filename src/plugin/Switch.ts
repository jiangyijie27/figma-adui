import {getDisabled} from './utils';

const Switch = (node: SceneNode) => {
  let mainComponent: ComponentNode;
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }
  let size: TSize;
  const checked =
    node.name.includes('开') || mainComponent?.name.includes('开');
  let text = '';
  let disabled = getDisabled(node);

  if ('children' in node) {
    const name = node.children.find(o => o.name.includes('/'))?.name;
    const [sizeText] = name.split('/');
    switch (sizeText) {
      case '大':
        size = 'large';
        break;
      case '中':
        size = 'medium';
        break;
      case '迷你':
        size = 'mini';
        break;
      default:
    }

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
    />
  `;
};

export default Switch;
