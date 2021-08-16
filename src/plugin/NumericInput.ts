import {getValueFromNode, stringifyStyle} from './utils';

const NumericInput = (node: SceneNode, additionalClassNames: IBaseObject) => {
  // @ts-ignore
  const {layoutAlign, layoutGrow} = node;

  if (layoutGrow === 1) {
    additionalClassNames.flex = 1;
  } else if (layoutAlign === 'STRETCH') {
    additionalClassNames.display = 'block';
    additionalClassNames.width = '100%';
  } else {
    additionalClassNames.width = `${node.width}px`;
  }
  const size = getValueFromNode('尺寸', node);

  return `
    <NumericInput
      ${size ? `size="${size}"` : ''}
      style={${stringifyStyle(additionalClassNames)}}
    />
  `;
};

export default NumericInput;
