import {
  getPadding,
  stringifyStyle,
  convertNumToPx,
  convertColorToCSS,
  rgbToHex,
} from './utils';
const RenderFlex = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  const {type} = node;
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
    additionalStyle.flex = 1;
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
        additionalStyle.height = `${Math.round(height)}px`;
      } else {
        additionalStyle.width = `${Math.round(width)}px`;
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
        additionalStyle.width = `${Math.round(width)}px`;
      } else {
        additionalStyle.height = `${Math.round(height)}px`;
      }
    }
  }

  /**
   * background
   */
  if ('fills' in node) {
    const {fills} = node;
    if (fills && Array.isArray(fills)) {
      // 最简单的情况，纯色背景
      if (fills.length === 1) {
        additionalStyle.background = convertColorToCSS(fills[0], {
          width: node.width,
          height: node.height,
        });
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

  /**
   * strokes
   */
  let strokes: any;
  if ('strokes' in node) {
    strokes = node.strokes;
  }
  let strokeWeight: any;
  if ('strokeWeight' in node) {
    strokeWeight = node.strokeWeight;
  }

  if (strokes && strokes.length === 1 && strokes[0].type === 'SOLID') {
    additionalStyle.border = `${strokeWeight}px solid ${convertColorToCSS(
      strokes[0]
    )}`;
  }

  /**
   * Radius
   */
  const {
    // @ts-ignore
    bottomLeftRadius,
    // @ts-ignore
    bottomRightRadius,
    // @ts-ignore
    cornerRadius,
    // @ts-ignore
    topLeftRadius,
    // @ts-ignore
    topRightRadius,
  } = node;

  // 如果四个 radius 不同，则 cornerRadius 会是 symbol
  if (typeof cornerRadius === 'number' && cornerRadius !== 0) {
    additionalStyle.borderRadius = convertNumToPx(cornerRadius);
    additionalStyle.overflow = 'hidden';
  } else {
    const rad = `${convertNumToPx(topLeftRadius)} ${convertNumToPx(
      topRightRadius
    )} ${convertNumToPx(bottomRightRadius)} ${convertNumToPx(
      bottomLeftRadius
    )}`;

    if (rad !== '0 0 0 0') {
      additionalStyle.borderRadius = rad;
      additionalStyle.overflow = 'hidden';
    }
  }

  /**
   * boxShadow
   */
  if ('effects' in node) {
    const {effects} = node;
    const shadows = effects.filter(
      o =>
        o.type === 'DROP_SHADOW' ||
        (type !== 'TEXT' && o.type === 'INNER_SHADOW')
    ) as ShadowEffect[];
    if (shadows.length) {
      const shadowsStr = shadows.map(o => {
        const {color, offset, radius, spread, visible, type} = o;

        let colorVal = '';
        if (!visible) {
          return '';
        }
        if (color.a === 1) {
          colorVal = rgbToHex(color);
        } else {
          colorVal = `rgba(${Math.round(color.r * 255)}, ${Math.round(
            color.g * 255
          )}, ${Math.round(color.b * 255)}, ${Number(color.a.toFixed(2))})`;
        }
        return `${type === 'INNER_SHADOW' ? 'inset ' : ''}${convertNumToPx(
          offset.x
        )} ${convertNumToPx(offset.y)} ${convertNumToPx(
          radius
        )} ${convertNumToPx(spread)} ${colorVal}`;
      });

      if (type === 'TEXT') {
        additionalStyle.textShadow = shadowsStr.filter(o => o).join(', ');
      } else {
        additionalStyle.boxShadow = shadowsStr.filter(o => o).join(', ');
      }
    }
  }

  if (
    additionalStyle.background === '' ||
    additionalStyle.background === 'url()'
  ) {
    delete additionalStyle.background;
  }
  if (additionalStyle.boxShadow === '') {
    delete additionalStyle.boxShadow;
  }
  if (additionalStyle.borderRadius === '') {
    delete additionalStyle.borderRadius;
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
