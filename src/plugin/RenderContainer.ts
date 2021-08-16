import {reverseArr, stringifyStyle} from './utils';

const RenderContainer = (
  node: SceneNode,
  generate: IGenerate,
  additionalClassNames: IBaseObject
) => {
  const {name} = node;
  let childrenNodes = '';
  if ('children' in node) {
    childrenNodes = reverseArr(node.children)
      .map(o => generate(o))
      .join('');
  }
  if (name.includes('Container: flex')) {
    additionalClassNames.display = 'flex';
    additionalClassNames.alignItems = 'center';
  }

  if (name === 'Container: flex-sb') {
    additionalClassNames.justifyContent = 'space-between';
  }

  if (name === 'Container: flex-c') {
    additionalClassNames.justifyContent = 'center';
  }

  if (node?.parent.name === '表单') {
    delete additionalClassNames.marginLeft;
  }

  if (additionalClassNames.display === 'block') {
    delete additionalClassNames.display;
  }

  return `<div
    ${
      Object.keys(additionalClassNames).length
        ? `style={${stringifyStyle(additionalClassNames)}}`
        : ''
    }
  >
    ${childrenNodes}
  </div>`;
};

export default RenderContainer;
