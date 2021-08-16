import {colors, convertColorToCSS} from './utils';

const RenderRectangleNode = ({
  node,
  additionalClassNames,
}: {
  node: RectangleNode;
  additionalClassNames: string[];
}) => {
  let styleString = '';
  let layoutAlign = '';
  if ('layoutAlign' in node) {
    const {layoutAlign: la} = node;
    layoutAlign = la;
  }
  if (layoutAlign !== 'STRETCH') {
    additionalClassNames.push(`w-${node.width}`);
  }
  additionalClassNames.push(`h-${node.height}`, 'rounded-full');

  const {fills} = node;
  if (fills && Array.isArray(fills)) {
    // 最简单的情况，纯色背景
    if (fills.length === 1) {
      const color = convertColorToCSS(fills[0]);
      if (colors[color]) {
        additionalClassNames.push(`bg-${colors[color]}`);
      } else if (color.includes('url')) {
        additionalClassNames.push('bg-cover');
        styleString = `style={{ backgroundImage: "${color}" }}`;
      } else {
        styleString = `style={{ backgroundColor: "${color}" }}`;
      }
    }
  }

  let classNameString = '';
  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  return `<div
    ${classNameString}
    ${styleString}
  />`;
};

export default RenderRectangleNode;
