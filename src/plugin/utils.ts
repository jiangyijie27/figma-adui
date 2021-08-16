import {CSSProperties} from 'react';
/**
 * 根据不同 layout 属性，reverse 一个数组
 * @param input readonly SceneNode[]
 * @return readonly SceneNode[]
 */
export const reverseArr: (
  input: readonly SceneNode[]
) => readonly SceneNode[] = input => {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
};

/**
 * 获取 mainComponent，如不存在返回 null
 * @param node SceneNode
 * @return ComponentNode | null
 */
export const getMainComponent = (node: SceneNode) => {
  if ('mainComponent' in node) {
    return node.mainComponent;
  }
  return null;
};

/**
 * 从 name 中获取 key 值
 * name 要符合以下格式：
 * "尺寸=小, 风格=普通, 类型=普通按钮, 状态=常态, icon=off"
 * @param key key
 * @param name 字符串
 */
export const getValueFromName = (key: string, name: string) => {
  try {
    const splited = name.split(`${key}=`);
    const text = splited[1].split(',')[0];
    let finalValue = text;
    switch (text) {
      case '大':
        finalValue = 'large';
        break;
      case '中':
        finalValue = 'medium';
        break;
      case '小':
        finalValue = '';
        break;
      case '迷你':
        finalValue = 'mini';
        break;
      default:
    }

    if (text.includes('主题')) {
      finalValue = 'primary';
    } else if (text.includes('成功')) {
      finalValue = 'success';
    } else if (text.includes('警示')) {
      finalValue = 'warning';
    } else if (text.includes('危险')) {
      finalValue = 'danger';
    } else if (text.includes('消息')) {
      finalValue = 'info';
    } else if (text.includes('普通')) {
      finalValue = '';
    }

    if (text.includes('轻量')) {
      finalValue = 'light';
    }

    return finalValue;
  } catch (error) {
    return '';
  }
};

/**
 * 获取 node 的 mainComponent，然后从 name 中取 key
 * 就是整合以下 getMainComponent 和 getValueFromName 两个方法
 * @param key key
 * @param node SceneNode
 */
export const getValueFromNode = (key: string, node: SceneNode) => {
  const mainComponent = getMainComponent(node);
  if (mainComponent) {
    return getValueFromName(key, mainComponent.name);
  }
  return '';
};

/**
 * 返回 Node 的 padding 值，string
 * @param node SceneNode
 */
export const getPadding = (node: SceneNode) => {
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
      return style.paddingTop;
    }
    return '';
  }
  if (
    style.paddingTop === style.paddingBottom &&
    style.paddingRight === style.paddingLeft
  ) {
    return `${style.paddingTop} ${style.paddingRight}`;
  }
  if (style.paddingRight === style.paddingLeft) {
    return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom}`;
  }
  return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
};

/**
 * 返回 intent
 * @param node: SceneNode
 * @return TIntent
 */
export const getIntent: (node: SceneNode) => TIntent = node => {
  const {name} = node;
  let mainComponent: ComponentNode;
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }

  let intent: TIntent;

  if (name.includes('主题') || mainComponent?.name.includes('主题')) {
    intent = 'primary';
  } else if (name.includes('成功') || mainComponent?.name.includes('成功')) {
    intent = 'success';
  } else if (name.includes('警示') || mainComponent?.name.includes('警示')) {
    intent = 'warning';
  } else if (name.includes('危险') || mainComponent?.name.includes('危险')) {
    intent = 'danger';
  } else if (name.includes('消息') || mainComponent?.name.includes('消息')) {
    intent = 'info';
  }

  return intent;
};

/**
 * 返回 theme
 * @param node: SceneNode
 * @return TTheme
 */
export const getTheme: (node: SceneNode) => TTheme = node => {
  const {name} = node;
  let mainComponent: ComponentNode;
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }

  return name.includes('轻量') || mainComponent?.name.includes('轻量')
    ? 'light'
    : null;
};

/**
 * add px after number, return 0 if 0
 * @param num
 */
export const convertNumToPx = (num: number): string => {
  return num !== 0 ? `${num}px` : `${num}`;
};

// interface IGradientTransformData {
//   m00: number;
//   m01: number;
//   m02: number;
//   m10: number;
//   m11: number;
//   m12: number;
// }

/**
 * number to 16
 * @param c r/g/b
 */
const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

/**
 * rgb to hex
 * @param r 0-1
 * @param g 0-1
 * @param b 0-1
 */
export const rgbToHex = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
  a?: number;
}) => {
  const val =
    '#' +
    componentToHex(Math.round(r * 255)) +
    componentToHex(Math.round(g * 255)) +
    componentToHex(Math.round(b * 255));

  if (
    val.charAt(1) == val.charAt(2) &&
    val.charAt(3) == val.charAt(4) &&
    val.charAt(5) == val.charAt(6)
  ) {
    return '#' + val.charAt(1) + val.charAt(3) + val.charAt(5);
  }
  return val;
};

/**
 * Convert CSS String to React style
 * @param str : CSS String
 */
export const toCamelCase = (str: string): string =>
  // Lower cases the string
  str
    .toLowerCase() // Replaces any - or _ characters with a space
    .replace(/[-_]+/g, ' ') // Removes any non alphanumeric characters
    .replace(/[^\w\s]/g, '') // Uppercases the first character in each group immediately following a space
    // (delimited by spaces)
    .replace(/ (.)/g, function($1) {
      return $1.toUpperCase();
    }) // Removes spaces
    .replace(/ /g, '');

export const toHyphenCase = (str: string): string =>
  str
    .replace(/(?:^|\.?)([A-Z])/g, (_, y) => '-' + y.toLowerCase())
    .replace(/^-/, '')
    .replace(/,\n/g, ';')
    .replace(/\n|"|'/g, '');

export const styleObjectToCSS = (style: IBaseObject): string =>
  toHyphenCase(
    `{${Object.keys(style)
      .map(o => `${o}: ${style[o]};`)
      .join('')}}`
  );

export const convertColorToCSS = (
  paint: Paint,
  options?: {gradient?: boolean; width?: number; height?: number}
) => {
  if (paint.visible === false) {
    return '';
  }
  const {type} = paint;
  if (type === 'SOLID') {
    // if solid color
    const {color, opacity} = paint as SolidPaint;
    let returnVal = '';
    if (opacity !== 1) {
      returnVal = `rgba(${Math.round(color.r * 255)}, ${Math.round(
        color.g * 255
      )}, ${Math.round(color.b * 255)}, ${Number(opacity.toFixed(2))})`;
    } else {
      returnVal = rgbToHex(color);
    }
    if (options && options.gradient) {
      returnVal = `linear-gradient(0deg, ${returnVal}, ${returnVal})`;
    }
    return returnVal;
  } else if (type === 'IMAGE') {
    // if img return url(), figma does this as well
    return `url(https://source.unsplash.com/random/${
      options?.width && options?.height
        ? `${options.width}x${options.height}`
        : ''
    }?nature)`;
  } else if (type === 'GRADIENT_LINEAR') {
    // if linear gradient
    const {gradientTransform, gradientStops} = paint as GradientPaint;
    // let returnStr = '';
    // let o = 0;
    // let n = 1;
    if (!gradientTransform || !gradientStops) {
      return '';
    }
    // let gradientTransformData: IGradientTransformData = {
    //   m00: 1,
    //   m01: 0,
    //   m02: 0,
    //   m10: 0,
    //   m11: 1,
    //   m12: 0,
    // };
    // const delta =
    //   gradientTransform[0][0] * gradientTransform[1][1] -
    //   gradientTransform[0][1] * gradientTransform[1][0];
    // if (delta !== 0) {
    //   const deltaVal = 1 / delta;
    //   gradientTransformData = {
    //     m00: gradientTransform[1][1] * deltaVal,
    //     m01: -gradientTransform[0][1] * deltaVal,
    //     m02:
    //       (gradientTransform[0][1] * gradientTransform[1][2] -
    //         gradientTransform[1][1] * gradientTransform[0][2]) *
    //       deltaVal,
    //     m10: -gradientTransform[1][0] * deltaVal,
    //     m11: gradientTransform[0][0] * deltaVal,
    //     m12:
    //       (gradientTransform[1][0] * gradientTransform[0][2] -
    //         gradientTransform[0][0] * gradientTransform[1][2]) *
    //       deltaVal,
    //   };
    // }
    // const rotationTruthy =
    //   gradientTransformData.m00 * gradientTransformData.m11 -
    //     gradientTransformData.m01 * gradientTransformData.m10 >
    //   0
    //     ? 1
    //     : -1;
    // let rotationData = ((
    //   data: IGradientTransformData,
    //   param: {x: number; y: number}
    // ) => ({
    //   x: data.m00 * param.x + data.m01 * param.y,
    //   y: data.m10 * param.x + data.m11 * param.y,
    // }))(gradientTransformData, {x: 0, y: 1});

    // returnStr = `linear-gradient(${(
    //   (Math.atan2(
    //     rotationData.y * rotationTruthy,
    //     rotationData.x * rotationTruthy
    //   ) /
    //     Math.PI) *
    //   180
    // ).toFixed(2)}deg`;

    // const temp =
    //   (Math.abs(rotationData.x) + Math.abs(rotationData.y)) /
    //   Math.hypot(rotationData.x, rotationData.y);

    // n = 1 / temp;
    // o = (temp - 1) / 2;
  }
};

export const convertPxToNum = (num: string | number): string =>
  `${num}`.split('px')[0];

export const colors = {
  transparent: 'transparent',
  currentColor: 'current',
  '#000': 'black',
  '#fff': 'white',
  '#07c160': 'green',
  '#eda20c': 'orange',
  '#2b7bd6': 'blue',
  '#d9514c': 'red',
  '#ffffff': 'gray-0',
  '#fafafa': 'gray-50',
  '#f2f2f2': 'gray-100',
  '#ebebeb': 'gray-200',
  '#e6e6e6': 'gray-300',
  '#e0e0e0': 'gray-400',
  '#d6d6d6': 'gray-500',
  '#c7c7c7': 'gray-600',
  '#a3a3a3': 'gray-700',
  '#6b6b6b': 'gray-800',
  '#1f1f1f': 'gray-900',
  'rgba(0, 0, 0, 0)': 'tp-gray-0',
  'rgba(0, 0, 0, 0.02)': 'tp-gray-50',
  'rgba(0, 0, 0, 0.06)': 'tp-gray-100',
  'rgba(0, 0, 0, 0.08)': 'tp-gray-200',
  'rgba(0, 0, 0, 0.1)': 'tp-gray-300',
  'rgba(0, 0, 0, 0.12)': 'tp-gray-400',
  'rgba(0, 0, 0, 0.16)': 'tp-gray-500',
  'rgba(0, 0, 0, 0.22)': 'tp-gray-600',
  'rgba(0, 0, 0, 0.36)': 'tp-gray-700',
  'rgba(0, 0, 0, 0.58)': 'tp-gray-800',
  'rgba(0, 0, 0, 0.88)': 'tp-gray-900',
};

const shadows = {
  none: 'none',
  '0 0 0 1px rgba(223, 223, 223, 0.45)': 0,
  '0 0 0 1px rgba(223, 223, 223, 0.5), 0 3px 6px 0 rgba(0, 0, 0, 0.04)': 1,
  '0 0 0 1px rgba(219, 219, 219, 0.55),0 3px 5px 0 rgba(0, 0, 0, 0.05), 0 6px 15px 0 rgba(0, 0, 0, 0.05)': 2,
  '0 0 0 1px rgba(219, 219, 219, 0.7), 0 8px 20px 0 rgba(0, 0, 0, 0.08), 0 4px 10px 0 rgba(0, 0, 0, 0.07)': 3,
  '0 0 0 1px rgba(107, 107, 107, 0.15), 0 10px 36px 0 rgba(0, 0, 0, 0.1), 0 6px 15px 0 rgba(0, 0, 0, 0.07)': 4,
};
Object.keys(colors).forEach(key => {
  const value = colors[key];
  shadows[`0 -1px 0 ${key}`] = `t-${value}`;
  shadows[`0 1px 0 ${key} inset`] = `t-inset-${value}`;
  shadows[`0 1px 0 ${key}`] = `b-${value}`;
  shadows[`0 -1px 0 ${key} inset`] = `b-inset-${value}`;
  shadows[`1px 0 0 ${key}`] = `r-${value}`;
  shadows[`-1px 0 0 ${key} inset`] = `r-inset-${value}`;
  shadows[`-1px 0 0 ${key}`] = `l-${value}`;
  shadows[`1px 0 0 ${key} inset`] = `l-inset-${value}`;
});

export const styleObjectToTailwind = (styleParam: IBaseObject) => {
  const style = styleParam;

  if (style.marginTop && style.marginTop === style.marginBottom) {
    style.marginY = style.marginTop;
    delete style.marginTop;
    delete style.marginBottom;
  }

  if (style.marginLeft && style.marginLeft === style.marginRight) {
    style.marginX = style.marginLeft;
    delete style.marginLeft;
    delete style.marginRight;
  }

  if (style.marginX && style.marginX === style.marginY) {
    style.margin = style.marginX;
    delete style.marginX;
    delete style.marginY;
  }

  if (style.paddingTop && style.paddingTop === style.paddingBottom) {
    style.paddingY = style.paddingTop;
    delete style.paddingTop;
    delete style.paddingBottom;
  }

  if (style.paddingLeft && style.paddingLeft === style.paddingRight) {
    style.paddingX = style.paddingLeft;
    delete style.paddingLeft;
    delete style.paddingRight;
  }

  if (style.paddingX && style.paddingX === style.paddingY) {
    style.padding = style.paddingX;
    delete style.paddingX;
    delete style.paddingY;
  }

  let cls = '';
  Object.keys(style).forEach(key => {
    const value = style[key];
    switch (key) {
      case 'margin':
        cls += `m-${convertPxToNum(value)} `;
        break;
      case 'marginX':
        cls += `mx-${convertPxToNum(value)} `;
        break;
      case 'marginY':
        cls += `my-${convertPxToNum(value)} `;
        break;
      case 'marginTop':
        cls += `mt-${convertPxToNum(value)} `;
        break;
      case 'marginRight':
        cls += `mr-${convertPxToNum(value)} `;
        break;
      case 'marginBottom':
        cls += `mb-${convertPxToNum(value)} `;
        break;
      case 'marginLeft':
        cls += `ml-${convertPxToNum(value)} `;
        break;
      case 'padding':
        cls += `p-${convertPxToNum(value)} `;
        break;
      case 'paddingX':
        cls += `px-${convertPxToNum(value)} `;
        break;
      case 'paddingY':
        cls += `py-${convertPxToNum(value)} `;
        break;
      case 'paddingTop':
        cls += `pt-${convertPxToNum(value)} `;
        break;
      case 'paddingRight':
        cls += `pr-${convertPxToNum(value)} `;
        break;
      case 'paddingBottom':
        cls += `pb-${convertPxToNum(value)} `;
        break;
      case 'paddingLeft':
        cls += `pl-${convertPxToNum(value)} `;
        break;
      case 'display':
        cls += `${value} `;
        break;
      case 'alignItems':
        if (value === 'flex-end') {
          cls += `items-end `;
        } else {
          cls += `items-${value} `;
        }
        break;
      case 'justifyContent':
        if (value === 'flex-end') {
          cls += `justify-end `;
        } else if (value === 'space-between') {
          cls += `justify-between `;
        } else {
          cls += `justify-${value} `;
        }
        break;
      case 'flex':
        cls += `flex-${value} `;
        break;
      case 'fontSize':
        cls += `text-${convertPxToNum(value)} `;
        break;
      case 'lineHeight':
        cls += `leading-${convertPxToNum(value)} `;
        break;
      case 'color':
        cls += `text-${colors[value]} `;
        break;
      case 'boxShadow':
        cls += `shadow-${shadows[value]} `;
      default:
        break;
    }
  });
  return cls.trim();
};
