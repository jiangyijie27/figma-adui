import {getTheme, stringifyStyle} from './utils';

const DatePicker = (node: SceneNode, additionalStyle: IBaseObject) => {
  additionalStyle.width = `${node.width}px`;
  const theme = getTheme(node);
  let isRangePicker = false
  
  // 以选择面板的宽度来判断是 rangepicker 与否，这是最安全的
  if ("children" in node) {
    const panel = node.children.find(o => o.name === "选择面板")
    if (panel?.width > 450) {
      isRangePicker = true
    }
  }

  return `
    <${isRangePicker ? "DatePicker.RangePicker" : "DatePicker"}
      ${theme ? `theme="${theme}"` : ''}
      style={${stringifyStyle(additionalStyle)}}
    />
  `;
};

export default DatePicker;
