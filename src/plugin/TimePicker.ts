import {getTheme, stringifyStyle} from './utils';

const TimePicker = (node: SceneNode, additionalClassNames: IBaseObject) => {
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
  const theme = getTheme(node);
  let onlyHour = false;

  // 判断是否是整点选择
  if ('children' in node) {
    const dropdown = node.children.find(o => o.name === '选择面板');
    if (dropdown && 'children' in dropdown) {
      const minute = dropdown.children.find(
        o => o.name === '时间选择' && !o.visible
      );
      if (minute) {
        onlyHour = true;
      }
    }
  }

  return `
    <TimePicker
      ${onlyHour ? `onlyHour` : ''}
      ${theme ? `theme="${theme}"` : ''}
      style={${stringifyStyle(additionalClassNames)}}
    />
  `;
};

export default TimePicker;
