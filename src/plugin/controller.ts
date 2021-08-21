import Alert from './Alert';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Card from './Card';
import CardHeader from './CardHeader';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import ColorPicker from './ColorPicker';
import DatePicker from './DatePicker';
import Dialog from './Dialog';
import Form from './Form';
import FormItem from './FormItem';
import FormTip from './FormTip';
import Icon from './Icon';
import Input from './Input';
import NumericInput from './NumericInput';
import Pagination from './Pagination';
import Popover from './Popover';
import Radio from './Radio';
import RadioGroup from './RadioGroup';
import Select from './Select';
import Switch from './Switch';
import Table from './Table';
import Tabs from './Tabs';
import TimePicker from './TimePicker';
import Upload from './Upload';
import RenderRectangleNode from './RenderRectangleNode';
import RenderEllipseNode from './RenderEllipseNode';
import RenderLineNode from './RenderLineNode';
import RenderTextNode from './RenderTextNode';
import getLayoutClassName from './getLayoutClassName';
import TreeSelect from './TreeSelect';
import {
  reverseArr,
  convertNumToPx,
  convertColorToCSS,
  colors,
  shadows,
  rgbToHex,
} from './utils';

figma.showUI(__html__, {width: 700, height: 1200});

const generate: IGenerate = node => {
  let styleString = '';
  let returnString = '';
  if (!node || !node.visible) {
    return '';
  }
  let {id, name, parent} = node;
  let mainComponent: ComponentNode;
  let children: readonly SceneNode[];
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  let layoutGrow: number;
  if ('children' in node) {
    children = node.children;
  }
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  if ('layoutGrow' in node) {
    layoutGrow = node.layoutGrow;
  }
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }
  let childrenCodes = '';
  let additionalClassNames: string[] = [];

  if (['HORIZONTAL', 'VERTICAL'].includes(layoutMode)) {
    additionalClassNames = getLayoutClassName(node);
  }
  // 纵向 padding
  if ('paddingTop' in node && node.paddingTop) {
    if ('paddingBottom' in node && node.paddingBottom) {
      if (node.paddingTop === node.paddingBottom) {
        additionalClassNames.push(`py-${node.paddingTop}`);
      } else {
        additionalClassNames.push(`pt-${node.paddingTop}`);
        additionalClassNames.push(`pb-${node.paddingBottom}`);
      }
    } else {
      additionalClassNames.push(`pt-${node.paddingTop}`);
    }
  } else if ('paddingBottom' in node && node.paddingBottom) {
    additionalClassNames.push(`pb-${node.paddingBottom}`);
  }

  // 横向 padding
  if ('paddingLeft' in node && node.paddingLeft) {
    if ('paddingRight' in node && node.paddingRight) {
      if (node.paddingLeft === node.paddingRight) {
        additionalClassNames.push(`px-${node.paddingLeft}`);
      } else {
        additionalClassNames.push(`pl-${node.paddingLeft}`);
        additionalClassNames.push(`pr-${node.paddingRight}`);
      }
    } else {
      additionalClassNames.push(`pl-${node.paddingLeft}`);
    }
  } else if ('paddingRight' in node && node.paddingRight) {
    additionalClassNames.push(`pr-${node.paddingRight}`);
  }

  // 如果父级是 flex 则判断 layoutGrow
  // 以前会在这里做 marginRight marginBottom 的复杂添加
  // 现在有了 tailwind 的 space 相关类名，直接在父级加
  if (
    'layoutMode' in parent &&
    ['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode) &&
    layoutGrow === 1
  ) {
    additionalClassNames.push('flex-1');
  }

  if (name === '卡片' || mainComponent?.name === '卡片') {
    /**
     * Component: Card
     */
    returnString = Card({node, generate, additionalClassNames});
  } else if (name === '卡片顶栏') {
    returnString = CardHeader({
      node,
      generate,
      additionalClassNames,
    });
  } else if (name.includes('提醒') || mainComponent?.name.includes('提醒')) {
    /**
     * Component: Alert
     */
    returnString = Alert({node, generate, additionalClassNames});
  } else if (mainComponent?.parent?.name === '按钮组') {
    /**
     * Component: Button.Group
     * 名称：按钮组
     * 不允许 detach
     */
    returnString = ButtonGroup({
      node,
      generate,
      additionalClassNames,
    });
  } else if (
    mainComponent?.parent?.name === '按钮' ||
    mainComponent?.parent?.name === '.按钮'
  ) {
    /**
     * Component: Button
     * 名称：按钮 | .按钮（按钮组中的情况）
     * 不允许 detach
     */
    returnString = Button({node, generate, additionalClassNames});
  } else if (['勾选', '勾选状态'].includes(mainComponent?.parent?.name)) {
    /**
     * Component: Checkbox
     * 名称：勾选
     * 不允许 detach
     */
    returnString = Checkbox(node);
  } else if (mainComponent?.parent?.name.includes('勾选组')) {
    /**
     * Component: Checkbox.Group
     * 名称：勾选组
     * 不允许 detach
     */
    returnString = CheckboxGroup(node, generate, additionalClassNames);
  } else if (
    /**
     * Component: Dialog
     */
    name.includes('对话框') ||
    mainComponent?.name.includes('对话框')
  ) {
    returnString = Dialog(node, generate);
  } else if (name === '表单-wrap' || mainComponent?.name === '表单-wrap') {
    /**
     * Component: Form
     */
    returnString = Form({node, generate, additionalClassNames});
  } else if (name === '表单' || mainComponent?.name === '表单') {
    /**
     * Component: FormItem
     */
    returnString = FormItem({
      node,
      generate,
      additionalClassNames,
    });
  } else if (
    node.type === 'TEXT' &&
    (name === '表单-tip' || mainComponent?.name === '表单-tip')
  ) {
    /**
     * Component: FormTip
     */
    returnString = FormTip(node, additionalClassNames);
  } else if (
    /**
     * Component: Input
     * 名称：输入框
     * 不允许 detach
     */
    mainComponent?.parent?.name === '输入框'
  ) {
    returnString = Input({node, generate, additionalClassNames});
  } else if (
    /**
     * Component: NumericInput
     * 名称：数字输入框
     * 不允许 detach
     */
    mainComponent?.parent?.name === '数字输入框'
  ) {
    returnString = NumericInput(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('分页器')) {
    /**
     * Component: Pagination
     * 名称：分页器
     * 不允许 detach
     */
    returnString = Pagination(node, additionalClassNames);
  } else if (['单选', '单选状态'].includes(mainComponent?.parent?.name)) {
    /**
     * Component: Radio
     * 名称：单选
     * 不允许 detach
     */
    returnString = Radio(node);
  } else if (mainComponent?.parent?.name.includes('单选组')) {
    /**
     * Component: Radio.Group
     * 名称：单选组
     * 不允许 detach
     */
    returnString = RadioGroup(node, generate, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('颜色选择器')) {
    /**
     * Component: ColorPicker
     * 名称：颜色选择器
     * 不允许 detach
     */
    returnString = ColorPicker(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('日期选择器')) {
    /**
     * Component: DatePicker
     * 名称：日期选择器
     * 不允许 detach
     */
    returnString = DatePicker(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('树形选择器')) {
    /**
     * Component: TreeSelect
     * 名称：树形选择器
     * 不允许 detach
     */
    returnString = TreeSelect(node, additionalClassNames);
  } else if (name.includes('表格-') || mainComponent?.name.includes('表格-')) {
    /**
     * Component: Table
     */
    returnString = Table(node, generate, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('导航页签')) {
    /**
     * Component: Tabs
     * 名称：导航页签
     * 不允许 detach
     */
    returnString = Tabs(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('时间选择器')) {
    /**
     * Component: TimePicker
     * 名称：时间选择器
     * 不允许 detach
     */
    returnString = TimePicker(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('选择器')) {
    /**
     * Component: Select
     * 名称：选择器
     * 不允许 detach
     */
    returnString = Select(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('开关')) {
    /**
     * Component: Switch
     * 名称：开关
     * 不允许 detach
     */
    returnString = Switch(node, additionalClassNames);
  } else if (mainComponent?.parent?.name.includes('上传')) {
    /**
     * Component: Upload
     * 名称：上传
     * 不允许 detach
     */
    returnString = Upload(node, additionalClassNames);
  } else if (node.type === 'RECTANGLE') {
    /**
     * RectangleNode
     */
    returnString = RenderRectangleNode({
      node,
      additionalClassNames,
    });
  } else if (node.type === 'ELLIPSE') {
    /**
     * RectangleNode
     */
    returnString = RenderEllipseNode({
      node,
      additionalClassNames,
    });
  } else if (node.type === 'LINE') {
    /**
     * RectangleNode
     */
    returnString = RenderLineNode(node, additionalClassNames);
  } else if (node.type === 'TEXT') {
    /**
     * TextNode
     */
    returnString = RenderTextNode({
      node,
      additionalClassNames,
    });
  } else if (mainComponent?.name.includes('/')) {
    /**
     * Component: Icon
     */
    returnString = Icon(node, additionalClassNames);
  }
  // else if ('parent' in node && node.parent.type === 'PAGE') {
  //   if (children) {
  //     childrenCodes = (layoutMode === 'NONE' ? reverseArr(children) : children)
  //       .map((o: SceneNode) => generate(o)
  //       .join('');
  //   }
  //   returnString = `<div>${childrenCodes}</div>`;
  // }
  else if ('children' in node) {
    const childGenerated = (layoutMode === 'NONE'
      ? reverseArr(children)
      : children
    )
      .map(o => generate(o))
      .join('');
    if (childGenerated) {
      /**
       * fills
       */
      const {
        // @ts-ignore
        fills,
      } = node;

      if (fills && Array.isArray(fills)) {
        // 最简单的情况，纯色背景
        if (fills.length === 1) {
          const color = convertColorToCSS(fills[0]);
          if (colors[color]) {
            additionalClassNames.push(`bg-${colors[color]}`);
          } else if (color.includes('url')) {
            additionalClassNames.push('bg-cover');
            styleString = `backgroundImage: "${color}"`;
          } else if (color) {
            styleString = `backgroundColor: "${color}"`;
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
        if (
          shadows[`0 0 0 ${strokeWeight}px ${convertColorToCSS(strokes[0])}`]
        ) {
          additionalClassNames.push(
            `shadow-${
              shadows[
                `0 0 0 ${strokeWeight}px ${convertColorToCSS(strokes[0])}`
              ]
            }`
          );
        } else {
          styleString = `${
            styleString ? `${styleString}, ` : ''
          }border: "${strokeWeight}px solid ${convertColorToCSS(strokes[0])}"`;
        }
      }

      /**
       * Shadow
       */
      if ('effects' in node) {
        const {effects} = node;
        const shadowss = effects.filter(
          o => o.type === 'DROP_SHADOW' || o.type === 'INNER_SHADOW'
        ) as ShadowEffect[];
        if (shadowss.length) {
          const shadowsStr = shadowss.map(o => {
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

          const shadowFinal = shadowsStr.filter(o => o).join(', ');
          if (shadows[shadowFinal]) {
            additionalClassNames.push(`shadow-${shadows[shadowFinal]}`);
          } else {
            styleString = `${
              styleString ? `${styleString}, ` : ''
            }boxShadow: "${shadowFinal}"`;
          }

          // if (type === 'TEXT') {
          //   additionalClassNames.textShadow = shadowsStr
          //     .filter(o => o)
          //     .join(', ');
          // } else {
          //   additionalClassNames.boxShadow = shadowsStr
          //     .filter(o => o)
          //     .join(', ');
          // }
        }
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
        additionalClassNames.push(`rounded-${cornerRadius}`);
      } else {
        if (topLeftRadius) {
          additionalClassNames.push(`rounded-tl-${topLeftRadius}`);
        }
        if (topRightRadius) {
          additionalClassNames.push(`rounded-tr-${topRightRadius}`);
        }
        if (bottomLeftRadius) {
          additionalClassNames.push(`rounded-bl-${bottomLeftRadius}`);
        }
        if (bottomRightRadius) {
          additionalClassNames.push(`rounded-br-${bottomRightRadius}`);
        }
      }

      let classNameString = '';
      if (additionalClassNames.length) {
        classNameString = `className="${additionalClassNames.join(' ')}"`;
      }

      returnString = `<div
        ${classNameString}
        ${styleString ? `style={{ ${styleString} }}` : ''}
      >${childGenerated}</div>`;
    }
  }

  /**
   * Component: Popover
   */
  if ('parent' in node) {
    const {parent} = node;
    const popoverNode = parent.children.find(o => o.name.includes('Popover'));
    if (!name.includes('Popover') && popoverNode) {
      returnString = Popover(popoverNode, returnString);
    }
  }

  return returnString;
};

const poll = () => {
  const {selection} = figma.currentPage;
  if (selection.length === 1) {
    const codes = (generate(selection[0]) || '').replace(/\n\s*\n/g, '\n');

    figma.ui.postMessage({
      action: 'update',
      codes,
    });
  }
};

poll();

figma.ui.onmessage = (msg: {type: string; height: string}) => {
  if (msg.type === 'generate') {
    poll();
  }
  if (msg.type === 'resize') {
    try {
      figma.ui.resize(700, parseInt(msg.height, 10));
    } catch (error) {}
  }
};
