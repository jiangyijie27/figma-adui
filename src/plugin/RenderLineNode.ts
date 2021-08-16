import {stringifyStyle, convertColorToCSS} from './utils';

const RenderLineNode = (node: LineNode, additionalClassNames: IBaseObject) => {
  let layoutAlign = '';
  if ('layoutAlign' in node) {
    const {layoutAlign: la} = node;
    layoutAlign = la;
  }
  if (layoutAlign !== 'STRETCH') {
    additionalClassNames.width = `${Math.round(node.width)}px`;
  }
  additionalClassNames.height = `${Math.round(node.strokeWeight)}px`;

  const {strokes: fills} = node;
  if (fills && Array.isArray(fills)) {
    // 最简单的情况，纯色背景
    if (fills.length === 1) {
      additionalClassNames.background = convertColorToCSS(fills[0]);
    } else if (fills.length > 1) {
      const c = fills.map((fill, index) =>
        convertColorToCSS(fill, {
          gradient: index > 0 && fill.type === 'SOLID',
        })
      );

      additionalClassNames.background = c
        .filter(o => o)
        .reverse()
        .join(', ');
    }
  }

  return `<div
    ${
      Object.keys(additionalClassNames).length
        ? `style={${stringifyStyle(additionalClassNames)}}`
        : ''
    }
    />`;
};

export default RenderLineNode;
