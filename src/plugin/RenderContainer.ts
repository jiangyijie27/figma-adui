import {reverseArr, stringifyStyle} from './utils';

const RenderContainer = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  const {name} = node;
  let childrenNodes = '';
  if ('children' in node) {
    childrenNodes = reverseArr(node.children)
      .map(o => generate(o))
      .join('');
  }
  if (name === 'Container: flex' || name === 'Container: space-between') {
    additionalStyle.display = 'flex';
    additionalStyle.alignItems = 'center';
  }

  if (name === 'Container: space-between') {
    additionalStyle.justifyContent = 'space-between';
  }

  if (node?.parent.name === '表单') {
    delete additionalStyle.marginLeft;
  }

  return `<div
    ${
      Object.keys(additionalStyle).length
        ? `style={${stringifyStyle(additionalStyle)}}`
        : ''
    }
  >
    ${childrenNodes}
  </div>`;
};

export default RenderContainer;
