import {stringifyStyle} from './utils';

const TreeSelect = (node: SceneNode, additionalStyle: IBaseObject) => {
  // @ts-ignore
  const {layoutGrow} = node;
  if (layoutGrow === 1) {
    additionalStyle.flex = 1;
  } else {
    additionalStyle.width = `${node.width}px`;
  }

  return `
    <TreeSelect
      style={${stringifyStyle(additionalStyle)}}
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
