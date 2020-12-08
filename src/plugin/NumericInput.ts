import {getValueFromNode, stringifyStyle} from './utils';

const NumericInput = (node: SceneNode, additionalStyle: IBaseObject) => {
  // @ts-ignore
  const {layoutGrow} = node;
  if (layoutGrow === 1) {
    additionalStyle.flex = 1;
  } else {
    additionalStyle.width = `${node.width}px`;
  }
  const size = getValueFromNode('尺寸', node);

  return `
    <NumericInput
      ${size ? `size="${size}"` : ''}
      style={${stringifyStyle(additionalStyle)}}
    />
  `;
};

export default NumericInput;
