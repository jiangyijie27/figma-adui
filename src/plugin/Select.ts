import {getTheme, stringifyStyle} from './utils';

const Select = (node: SceneNode, additionalClassNames: IBaseObject) => {
  const theme = getTheme(node);
  let searchable = false;
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
      style={${stringifyStyle(additionalClassNames)}}
    >
      <Select.Option key="1">选项</Select.Option>
    </Select>
  `;
};

export default Select;
