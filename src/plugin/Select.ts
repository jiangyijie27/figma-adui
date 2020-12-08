import {getTheme, stringifyStyle} from './utils';

const Select = (node: SceneNode, additionalStyle: IBaseObject) => {
  const theme = getTheme(node);
  let searchable = false;
  // @ts-ignore
  const {layoutAlign, layoutGrow} = node;

  if (layoutGrow === 1 || layoutAlign === 'STRETCH') {
    additionalStyle.display = 'block';
    additionalStyle.width = '100%';
  } else {
    additionalStyle.width = `${node.width}px`;
  }

  if ('children' in node) {
    const dropdown = node.children.find(o => o.name === '选择面板');
    if (dropdown && 'children' in dropdown) {
      const search = dropdown.children.find(o => o.name === '搜索栏');
      if (search?.visible) {
        searchable = true;
      }
    }
  }

  return `
    <Select
      ${searchable ? `searchable` : ''}
      ${theme ? `theme="${theme}"` : ''}
      style={${stringifyStyle(additionalStyle)}}
    >
      <Select.Option key="1">选项</Select.Option>
    </Select>
  `;
};

export default Select;
