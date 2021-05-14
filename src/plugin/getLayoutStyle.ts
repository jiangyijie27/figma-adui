import {CSSProperties} from 'react';

const getLayoutStyle = (node: SceneNode) => {
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
  } = node;

  let style: CSSProperties = {
    display: 'flex',
  };
  if (layoutMode === 'VERTICAL') {
    style.flexDirection = 'column';
  }
  if (counterAxisAlignItems === 'CENTER') {
    style.alignItems = 'center';
  }
  if (counterAxisAlignItems === 'MAX') {
    style.alignItems = 'flex-end';
  }
  if (primaryAxisAlignItems === 'SPACE_BETWEEN') {
    style.justifyContent = 'space-between';
  }
  if (primaryAxisAlignItems === 'CENTER') {
    style.justifyContent = 'center';
  }
  return style;
};

export default getLayoutStyle;
