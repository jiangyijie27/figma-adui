import {stringifyStyle} from './utils';

const ColorPicker = (node: SceneNode, additionalStyle: IBaseObject) => {
  let size: TSize;

  if ('children' in node) {
    const selector = node.children.find(o => o.name.includes('颜色选择器-'));
    if (selector) {
      const sizeText = selector.name.split("-")[1]
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
    }
  }

  return `
    <ColorPicker
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    />
  `;
};

export default ColorPicker;
