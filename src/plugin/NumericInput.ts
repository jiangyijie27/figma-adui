import {getValueFromNode, stringifyStyle} from './utils';

const NumericInput = (node: SceneNode, additionalStyle: IBaseObject) => {
  // @ts-ignore
  const {layoutAlign, layoutGrow} = node;

  if (layoutGrow === 1 || layoutAlign === 'STRETCH') {
    additionalStyle.display = 'block';
    additionalStyle.width = '100%';
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
