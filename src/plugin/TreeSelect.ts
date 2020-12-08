import {stringifyStyle} from './utils';

const TreeSelect = (node: SceneNode, additionalStyle: IBaseObject) => {
  // @ts-ignore
  const {layoutAlign, layoutGrow} = node;

  if (layoutGrow === 1 || layoutAlign === 'STRETCH') {
    additionalStyle.display = 'block';
    additionalStyle.width = '100%';
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
