import {stringifyStyle, convertColorToCSS, styleObjectToCSS} from './utils';

const RenderRectangleNode = ({
  node,
  additionalStyle,
  options = {},
  additionalClassNames,
}: {
  node: RectangleNode;
  additionalStyle: IBaseObject;
  options: IBaseObject;
  additionalClassNames: IAdditionalClassName[];
}) => {
  let layoutAlign = '';
  if ('layoutAlign' in node) {
    const {layoutAlign: la} = node;
    layoutAlign = la;
  }
  if (layoutAlign !== 'STRETCH') {
    additionalStyle.width = `${Math.round(node.width)}px`;
  }
  additionalStyle.height = `${Math.round(node.height)}px`;

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

  let className = `rect_${node.id.replace(/:|;/g, '')}`.toLowerCase();

  const inlineStyle = stringifyStyle(additionalStyle);

  const cssStyle = styleObjectToCSS(additionalStyle);
  const found = additionalClassNames.find(o => o.style === cssStyle);
  if (found) {
    className = found.className;
  } else {
    additionalClassNames.push({
      style: cssStyle,
      className,
    });
  }

  return `<div
    ${
      options.useClassName
        ? `className="${className}"`
        : `${
            Object.keys(additionalStyle).length ? `style={${inlineStyle}}` : ''
          }`
    }
    />`;
};

export default RenderRectangleNode;
