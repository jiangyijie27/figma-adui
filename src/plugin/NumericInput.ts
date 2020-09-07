import {
  getDisabled,
  getSize,
  getIntent,
  getTheme,
  stringifyStyle,
} from './utils';

const NumericInput = (node: SceneNode, additionalStyle: IBaseObject) => {
  additionalStyle.width = `${node.width}px`;

  let disabled = getDisabled(node);
  let intent = getIntent(node);
  let size = getSize(node);
  let theme = getTheme(node);
  return `
    <NumericInput
      ${disabled ? 'disabled' : ''}
      ${intent ? `intent="${intent}"` : ''}
      ${size ? `size="${size}"` : ''}
      style={${stringifyStyle(additionalStyle)}}
      ${theme ? `theme="${theme}"` : ''}
    />
  `;
};

export default NumericInput;
