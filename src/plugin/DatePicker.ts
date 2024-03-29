import {getValueFromNode, stringifyStyle} from './utils';

const DatePicker = (node: SceneNode, additionalClassNames: IBaseObject) => {
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
  const theme = getValueFromNode('风格', node);
  const disabled = getValueFromNode('状态', node) === '禁用';

  let isRangePicker = false;

  // 以选择面板的宽度来判断是 rangepicker 与否，这是最安全的
  if ('children' in node) {
    const panel = node.children.find(o => o.name === '选择面板');
    if (panel?.width > 450) {
      isRangePicker = true;
    }
  }

  return `
    <${isRangePicker ? 'DatePicker.RangePicker' : 'DatePicker'}
      ${disabled ? 'disabled' : ''}
      ${theme ? `theme="${theme}"` : ''}
      style={${stringifyStyle(additionalClassNames)}}
    />
  `;
};

export default DatePicker;
