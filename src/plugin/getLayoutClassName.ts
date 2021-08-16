import {colors, convertColorToCSS} from './utils';

const getLayoutClassName = (node: SceneNode): string[] => {
  const {
    // @ts-ignore
    children,
    // @ts-ignore
    itemSpacing,
    // @ts-ignore
    counterAxisAlignItems,
    // @ts-ignore
    counterAxisSizingMode,
    // @ts-ignore
    layoutAlign,
    // @ts-ignore
    layoutGrow,
    // @ts-ignore
    layoutMode,
    // @ts-ignore
    primaryAxisAlignItems,
    // @ts-ignore
    primaryAxisSizingMode,
    // @ts-ignore
    fills,
  } = node;

  let classNames = ['flex'];

  // 有了 tailwind 的 space 相关类名，不需要在子元素上依次添加
  if (
    itemSpacing &&
    !classNames.includes('justify-between') &&
    children?.length > 1
  ) {
    classNames.push(
      `space-${layoutMode === 'HORIZONTAL' ? 'x' : 'y'}-${itemSpacing}`
    );
  }

  if (counterAxisAlignItems === 'CENTER') {
    classNames.push('items-center');
  }
  if (counterAxisAlignItems === 'MAX') {
    classNames.push('items-end');
  }
  if (primaryAxisAlignItems === 'SPACE_BETWEEN') {
    classNames.push('justify-between');
    const spaceIndex = classNames.findIndex(o => o.includes('space-'));
    if (spaceIndex > -1) {
      classNames.splice(spaceIndex, 1);
    }
  }
  if (primaryAxisAlignItems === 'CENTER') {
    classNames.push('justify-center');
  }

  if (fills && Array.isArray(fills)) {
    // 最简单的情况，纯色背景
    if (fills.length === 1) {
      const color = convertColorToCSS(fills[0]);
      if (colors[color]) {
        classNames.push(`bg-${colors[color]}`);
      }
    }
  }

  return classNames;
};

export default getLayoutClassName;
