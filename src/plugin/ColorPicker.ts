import {getValueFromNode, stringifyStyle} from './utils';

const ColorPicker = (node: SceneNode, additionalStyle: IBaseObject) => {
  const size = getValueFromNode('尺寸', node);
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
