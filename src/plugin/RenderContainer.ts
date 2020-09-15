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
  if (name.includes("Container: flex")) {
    additionalStyle.display = 'flex';
    additionalStyle.alignItems = 'center';
  }

  if (name === 'Container: flex-sb') {
    additionalStyle.justifyContent = 'space-between';
  }

  if (name === 'Container: flex-c') {
    additionalStyle.justifyContent = 'center';
  }

  if (node?.parent.name === '表单') {
    delete additionalStyle.marginLeft;
  }

  if (additionalStyle.display === "block") {
    delete additionalStyle.display
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
