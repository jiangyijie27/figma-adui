import {getPadding, stringifyStyle} from './utils';
const RenderFlex = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  let layoutGrow: 0 | 1;
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  if ('layoutGrow' in node) {
    const {layoutGrow: lg} = node;
    layoutGrow = lg;
  }
  if (layoutGrow === 1) {
    additionalStyle.flex = 1 
  }
  additionalStyle.display = 'flex';

  if (layoutMode === 'VERTICAL') {
    additionalStyle.flexDirection = 'column';
  }

  /**
   * 主轴
   * 横向时，MIN 代表子元素向上对齐；MAX 代表子元素向下对齐
   * 纵向时，MIN 代表子元素向左对齐；MAX 代表子元素向右对齐
   * In horizontal auto-layout frames, “MIN” and “MAX” correspond to top and bottom respectively.
   * In vertical auto-layout frames, “MIN” and “MAX” correspond to left and right respectively.
   */
  if ('primaryAxisAlignItems' in node) {
    const {primaryAxisAlignItems} = node;
    switch (primaryAxisAlignItems) {
      case 'CENTER':
        additionalStyle.justifyContent = 'center';
        break;
      case 'MAX':
        additionalStyle.justifyContent = 'flex-end';
        break;
      case 'SPACE_BETWEEN':
        additionalStyle.justifyContent = 'space-between';
        break;
      default:
    }
  }

  /**
   * 正交轴
   * 横向时，MIN 代表子元素向上对齐；MAX 代表子元素向下对齐
   * 纵向时，MIN 代表子元素向左对齐；MAX 代表子元素向右对齐
   * In horizontal auto-layout frames, “MIN” and “MAX” correspond to top and bottom respectively.
   * In vertical auto-layout frames, “MIN” and “MAX” correspond to left and right respectively.
   */
  if ('counterAxisAlignItems' in node) {
    const {counterAxisAlignItems} = node;
    switch (counterAxisAlignItems) {
      case 'CENTER':
        additionalStyle.alignItems = 'center';
        break;
      case 'MAX':
        additionalStyle.alignItems = 'flex-end';
        break;
      default:
    }
  }

  const padding = getPadding(node);
  if (padding) {
    additionalStyle.padding = padding;
  }

  /**
   * 主轴是否固定尺寸
   * 横向表示 width 固定；纵向表示 height 固定
   */
  if ('primaryAxisSizingMode' in node) {
    const {primaryAxisSizingMode, layoutAlign, width, height} = node;
    if (
      primaryAxisSizingMode === 'FIXED' &&
      layoutAlign !== 'STRETCH' &&
      layoutGrow !== 1
    ) {
      if (layoutMode === 'VERTICAL') {
        additionalStyle.height = `${height}px`;
      } else {
        additionalStyle.width = `${width}px`;
      }
    }
  }

  /**
   * 正交轴是否固定尺寸
   * 横向表示 height 固定；纵向表示 width 固定
   */
  if ('counterAxisSizingMode' in node) {
    const {counterAxisSizingMode, layoutAlign, width, height} = node;
    if (
      counterAxisSizingMode === 'FIXED' &&
      layoutAlign !== 'STRETCH' &&
      layoutGrow !== 1
    ) {
      if (layoutMode === 'VERTICAL') {
        additionalStyle.width = `${width}px`;
      } else {
        additionalStyle.height = `${height}px`;
      }
    }
  }

  let childrenNodes = '';

  if ('children' in node) {
    if (layoutMode === 'VERTICAL') {
      childrenNodes = `<div>${node.children
        .map(o => generate(o))
        .join('</div><div>')}</div>`;
    } else {
      childrenNodes = node.children.map(o => generate(o)).join('');
    }
  }

  return `
    <div
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenNodes}
    </div>
  `;
};

export default RenderFlex;
