import {
  getPadding,
  convertNumToPx,
  convertColorToCSS,
  rgbToHex,
  styleObjectToCSS,
} from './utils';
const RenderFlex = ({
  node,
  generate,
  options = {},
}: {
  node: SceneNode;
  generate: IGenerate;
  additionalClassNames: string[];
  options: IBaseObject;
}) => {
  const {type} = node;
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  let layoutGrow: number;
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  if ('layoutGrow' in node) {
    const {layoutGrow: lg} = node;
    layoutGrow = lg;
  }
  if (layoutGrow === 1) {
    additionalClassNames.flex = 1;
  }
  additionalClassNames.display = 'flex';

  if (layoutMode === 'VERTICAL') {
    additionalClassNames.flexDirection = 'column';
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
        additionalClassNames.justifyContent = 'center';
        break;
      case 'MAX':
        additionalClassNames.justifyContent = 'flex-end';
        break;
      case 'SPACE_BETWEEN':
        additionalClassNames.justifyContent = 'space-between';
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
        additionalClassNames.alignItems = 'center';
        break;
      case 'MAX':
        additionalClassNames.alignItems = 'flex-end';
        break;
      default:
    }
  }

  const padding = getPadding(node);
  if (padding) {
    additionalClassNames.padding = padding;
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
        additionalClassNames.height = `${Math.round(height)}px`;
      } else {
        additionalClassNames.width = `${Math.round(width)}px`;
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
        additionalClassNames.width = `${Math.round(width)}px`;
      } else {
        additionalClassNames.height = `${Math.round(height)}px`;
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
        additionalClassNames.background = convertColorToCSS(fills[0], {
          width: node.width,
          height: node.height,
        });
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

  if (
    strokes &&
    strokes.length === 1 &&
    strokes[0].type === 'SOLID' &&
    strokes[0].visible
  ) {
    additionalClassNames.border = `${strokeWeight}px solid ${convertColorToCSS(
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
    additionalClassNames.borderRadius = convertNumToPx(cornerRadius);
    additionalClassNames.overflow = 'hidden';
  } else {
    const rad = `${convertNumToPx(topLeftRadius)} ${convertNumToPx(
      topRightRadius
    )} ${convertNumToPx(bottomRightRadius)} ${convertNumToPx(
      bottomLeftRadius
    )}`;

    if (rad !== '0 0 0 0') {
      additionalClassNames.borderRadius = rad;
      additionalClassNames.overflow = 'hidden';
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
        additionalClassNames.textShadow = shadowsStr.filter(o => o).join(', ');
      } else {
        additionalClassNames.boxShadow = shadowsStr.filter(o => o).join(', ');
      }
    }
  }

  if (
    additionalClassNames.background === '' ||
    additionalClassNames.background === 'url()'
  ) {
    delete additionalClassNames.background;
  }
  if (additionalClassNames.boxShadow === '') {
    delete additionalClassNames.boxShadow;
  }
  if (additionalClassNames.borderRadius === '') {
    delete additionalClassNames.borderRadius;
  }

  let childrenNodes = '';

  if ('children' in node) {
    if (layoutMode === 'VERTICAL') {
      if (
        !additionalClassNames.justifyContent &&
        !additionalClassNames.alignItems
      ) {
        delete additionalClassNames.justifyContent;
        delete additionalClassNames.alignItems;
        delete additionalClassNames.display;
        delete additionalClassNames.flexDirection;
      }
      childrenNodes = `<div>${node.children
        .map(o => generate(o, options))
        .join('</div><div>')}</div>`;
    } else {
      childrenNodes = node.children.map(o => generate(o, options)).join('');
    }
  }

  let className = `${node.type}_${node.id.replace(/:|;/g, '')}`.toLowerCase();

  const inlineStyle = stringifyStyle(additionalClassNames);

  const cssStyle = styleObjectToCSS(additionalClassNames);
  const found = additionalClassNames.find(o => o.style === cssStyle);
  if (found) {
    className = found.className;
  } else {
    additionalClassNames.push({
      style: cssStyle,
      className,
    });
  }

  return `
    <div
      ${
        options.useClassName
          ? `className="${className}"`
          : `${
              Object.keys(additionalClassNames).length
                ? `style={${inlineStyle}}`
                : ''
            }`
      }
    >
      ${childrenNodes}
    </div>
  `;
};

export default RenderFlex;
