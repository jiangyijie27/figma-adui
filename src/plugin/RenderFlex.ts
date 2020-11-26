import {stringifyStyle} from './utils';
const RenderFlex = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  additionalStyle.display = 'flex';

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

  const style = {
    paddingTop: '0',
    paddingRight: '0',
    paddingBottom: '0',
    paddingLeft: '0',
  };
  if ('paddingTop' in node) {
    const {paddingTop} = node;
    if (paddingTop) {
      style.paddingTop = `${paddingTop}px`;
    }
  }
  if ('paddingRight' in node) {
    const {paddingRight} = node;
    if (paddingRight) {
      style.paddingRight = `${paddingRight}px`;
    }
  }
  if ('paddingBottom' in node) {
    const {paddingBottom} = node;
    if (paddingBottom) {
      style.paddingBottom = `${paddingBottom}px`;
    }
  }
  if ('paddingLeft' in node) {
    const {paddingLeft} = node;
    if (paddingLeft) {
      style.paddingLeft = `${paddingLeft}px`;
    }
  }

  /**
   * 简写
   */
  if (new Set(Object.values(style)).size === 1) {
    /**
     * 相同
     */
    if (style.paddingTop !== '0') {
      additionalStyle.padding = style.paddingTop;
    }
  } else if (
    style.paddingTop === style.paddingBottom &&
    style.paddingRight === style.paddingLeft
  ) {
    additionalStyle.padding = `${style.paddingTop} ${style.paddingRight}`;
  } else if (style.paddingRight === style.paddingLeft) {
    additionalStyle.padding = `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom}`;
  }

  /**
   * 主轴是否固定尺寸
   * 横向表示 width 固定；纵向表示 height 固定
   */
  if ('primaryAxisSizingMode' in node) {
    const {primaryAxisSizingMode} = node;
    if (primaryAxisSizingMode === 'FIXED') {
      additionalStyle.width = `${node.width}px`;
    }
  }

  /**
   * 正交轴是否固定尺寸
   * 横向表示 height 固定；纵向表示 width 固定
   */
  if ('counterAxisSizingMode' in node) {
    const {counterAxisSizingMode} = node;
    if (counterAxisSizingMode === 'FIXED') {
      additionalStyle.height = `${node.height}px`;
    }
  }

  let childrenNodes = '';

  if ('children' in node) {
    childrenNodes = node.children.map(o => generate(o)).join('');
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
