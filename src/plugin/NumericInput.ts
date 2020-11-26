import {getValueFromNode, stringifyStyle} from './utils';

const NumericInput = (node: SceneNode, additionalStyle: IBaseObject) => {
  additionalStyle.width = `${node.width}px`;
  const size = getValueFromNode('尺寸', node);

  return `
    <NumericInput
      ${size ? `size="${size}"` : ''}
      style={${stringifyStyle(additionalStyle)}}
    />
  `;
};

export default NumericInput;
