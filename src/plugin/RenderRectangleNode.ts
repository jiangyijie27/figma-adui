import {stringifyStyle, convertColorToCSS} from './utils';

const RenderRectangleNode = (
  node: RectangleNode,
  additionalStyle: IBaseObject
) => {
  additionalStyle.width = node.width;
  additionalStyle.height = node.height;

  const {fills} = node;
  if (fills && Array.isArray(fills)) {
    // 最简单的情况，纯色背景
    if (fills.length === 1) {
      additionalStyle.background = convertColorToCSS(fills[0]);
    } else if (fills.length > 1) {
      const c = fills.map((fill, index) =>
        convertColorToCSS(fill, {
          gradient: index > 0 && fill.type === 'SOLID',
        })
      );

      additionalStyle.background = c
        .filter(o => o)
        .reverse()
        .join(', ');
    }
  }

  return `<div
    ${
      Object.keys(additionalStyle).length
        ? `style={${stringifyStyle(additionalStyle)}}`
        : ''
    }
    />`;
};

export default RenderRectangleNode;