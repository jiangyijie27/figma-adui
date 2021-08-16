import {getValueFromNode, stringifyStyle} from './utils';

const ColorPicker = (node: SceneNode, additionalClassNames: IBaseObject) => {
  const size = getValueFromNode('尺寸', node);
  return `
    <ColorPicker
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalClassNames).length
          ? `style={${stringifyStyle(additionalClassNames)}}`
          : ''
      }
    />
  `;
};

export default ColorPicker;
