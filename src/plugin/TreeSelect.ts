import {stringifyStyle} from './utils';

const TreeSelect = (node: SceneNode, additionalClassNames: IBaseObject) => {
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
  return `
    <TreeSelect
      style={${stringifyStyle(additionalClassNames)}}
    >
      <TreeSelect.TreeNode
        key="1"
        value="1"
        title="选项"
      />
    </TreeSelect>
  `;
};

export default TreeSelect;
