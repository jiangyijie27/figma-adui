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

    if (text.includes('禁用')) {
      finalValue = 'disabled';
    } else if (text.includes('点击')) {
      finalValue = 'active';
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
 * 将 style 对象转换成 string
 * @param style IBaseObject
 */
export const stringifyStyle = (style: IBaseObject) =>
  JSON.stringify(style).replace(/"([^"]+)":/g, '$1:');

/**
 * 返回 size
 * @param node: SceneNode
 * @return TSize
 */
export const getSize: (node: SceneNode) => TSize = node => {
  if (!node) {
    return undefined;
  }
  let size: TSize;

  if (node.type === 'TEXT') {
    const {fontSize} = node;
    switch (fontSize) {
      case 16:
        size = 'large';
        break;
      case 14:
        size = 'medium';
        break;
      case 12:
        size = 'mini';
        break;
      default:
    }
  } else {
    const {height} = node;
    switch (height) {
      case 42:
        size = 'large';
        break;
      case 36:
        size = 'medium';
        break;
      case 26:
        size = 'mini';
        break;
      default:
    }
  }

  return size;
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
 * 返回 checked
 * @param node: SceneNode
 * @return boolean
 */
export const getChecked: (node: SceneNode) => boolean = node => {
  const {name} = node;
  let mainComponent: ComponentNode;
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }

  return (
    !(name.includes('未选中') || mainComponent?.name.includes('未选中')) &&
    (name.includes('选中') || mainComponent?.name.includes('选中'))
  );
};

/**
 * 返回 disabled
 * @param node: SceneNode
 * @return boolean
 */
export const getDisabled: (node: SceneNode) => boolean = node => {
  const {name} = node;
  let mainComponent: ComponentNode;
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }

  return name.includes('禁用') || mainComponent?.name.includes('禁用');
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
export const convertNumToPx = (num: number) => {
  return num !== 0 ? `${num}px` : num;
};

interface IGradientTransformData {
  m00: number;
  m01: number;
  m02: number;
  m10: number;
  m11: number;
  m12: number;
}

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
export const toCamelCase = (str: string) => {
  // Lower cases the string
  return (
    str
      .toLowerCase() // Replaces any - or _ characters with a space
      .replace(/[-_]+/g, ' ') // Removes any non alphanumeric characters
      .replace(/[^\w\s]/g, '') // Uppercases the first character in each group immediately following a space
      // (delimited by spaces)
      .replace(/ (.)/g, function($1) {
        return $1.toUpperCase();
      }) // Removes spaces
      .replace(/ /g, '')
  );
};

export const convertColorToCSS = (
  paint: Paint,
  options?: {gradient?: boolean}
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
    return 'url()';
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
