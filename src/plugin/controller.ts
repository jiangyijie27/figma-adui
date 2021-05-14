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
import RenderLineNode from './RenderLineNode';
import RenderTextNode from './RenderTextNode';
import getLayoutStyle from './getLayoutStyle';
import TreeSelect from './TreeSelect';
import {reverseArr, stringifyStyle, styleObjectToTailwind} from './utils';

figma.showUI(__html__, {width: 700, height: 1200});

let additionalClassNames = '';

const generate: IGenerate = (node, options = {}) => {
  const useTailwind = options.useTailwind;
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
  let additionalStyle: React.CSSProperties = {};

  if (layoutMode === 'HORIZONTAL') {
    additionalStyle = getLayoutStyle(node);
  }
  if ('paddingTop' in node && node.paddingTop) {
    additionalStyle.paddingTop = `${node.paddingTop}px`;
  }
  if ('paddingRight' in node && node.paddingRight) {
    additionalStyle.paddingRight = `${node.paddingRight}px`;
  }
  if ('paddingBottom' in node && node.paddingBottom) {
    additionalStyle.paddingBottom = `${node.paddingBottom}px`;
  }
  if ('paddingLeft' in node && node.paddingLeft) {
    additionalStyle.paddingLeft = `${node.paddingLeft}px`;
  }

  if (
    'layoutMode' in parent &&
    (parent.layoutMode === 'HORIZONTAL' || parent.layoutMode === 'VERTICAL')
  ) {
    const childrenIds = parent.children.map(o => o.id);
    const index = childrenIds.findIndex(o => o === id);
    if (index !== childrenIds.length - 1) {
      if (parent.layoutMode === 'HORIZONTAL') {
        if (layoutGrow === 1) {
          additionalStyle.flex = 1;
        }
        if (parent.itemSpacing) {
          additionalStyle.marginRight = `${parent.itemSpacing}px`;
        }
      } else {
        if (parent.itemSpacing) {
          additionalStyle.marginBottom = `${parent.itemSpacing}px`;
        }
      }
    }
  }

  if (name === '卡片' || mainComponent?.name === '卡片') {
    /**
     * Component: Card
     */
    returnString = Card({node, generate, additionalStyle, useTailwind});
  } else if (name === '标题 + 描述文字') {
    returnString = CardHeader({node, generate, additionalStyle, useTailwind});
  } else if (name.includes('提醒') || mainComponent?.name.includes('提醒')) {
    /**
     * Component: Alert
     */
    returnString = Alert(node, additionalStyle);
  } else if (mainComponent?.parent?.name === '按钮组') {
    /**
     * Component: Button.Group
     * 名称：按钮组
     * 不允许 detach
     */
    returnString = ButtonGroup(node, generate, additionalStyle);
  } else if (
    mainComponent?.parent?.name === '按钮' ||
    mainComponent?.parent?.name === '.按钮'
  ) {
    /**
     * Component: Button
     * 名称：按钮 | .按钮（按钮组中的情况）
     * 不允许 detach
     */
    returnString = Button({node, generate, additionalStyle, useTailwind});
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
    returnString = CheckboxGroup(node, generate, additionalStyle);
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
    returnString = Form({node, generate, additionalStyle, useTailwind});
  } else if (name === '表单' || mainComponent?.name === '表单') {
    /**
     * Component: FormItem
     */
    returnString = FormItem({node, generate, additionalStyle, useTailwind});
  } else if (
    node.type === 'TEXT' &&
    (name === '表单-tip' || mainComponent?.name === '表单-tip')
  ) {
    /**
     * Component: FormTip
     */
    returnString = FormTip(node, additionalStyle);
  } else if (
    /**
     * Component: Input
     * 名称：输入框
     * 不允许 detach
     */
    mainComponent?.parent?.name === '输入框'
  ) {
    returnString = Input(node, generate, additionalStyle);
  } else if (
    /**
     * Component: NumericInput
     * 名称：数字输入框
     * 不允许 detach
     */
    mainComponent?.parent?.name === '数字输入框'
  ) {
    returnString = NumericInput(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('分页器')) {
    /**
     * Component: Pagination
     * 名称：分页器
     * 不允许 detach
     */
    returnString = Pagination(node, additionalStyle);
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
    returnString = RadioGroup(node, generate, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('颜色选择器')) {
    /**
     * Component: ColorPicker
     * 名称：颜色选择器
     * 不允许 detach
     */
    returnString = ColorPicker(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('日期选择器')) {
    /**
     * Component: DatePicker
     * 名称：日期选择器
     * 不允许 detach
     */
    returnString = DatePicker(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('树形选择器')) {
    /**
     * Component: TreeSelect
     * 名称：树形选择器
     * 不允许 detach
     */
    returnString = TreeSelect(node, additionalStyle);
  } else if (name.includes('表格-') || mainComponent?.name.includes('表格-')) {
    /**
     * Component: Table
     */
    returnString = Table(node, generate, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('导航页签')) {
    /**
     * Component: Tabs
     * 名称：导航页签
     * 不允许 detach
     */
    returnString = Tabs(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('时间选择器')) {
    /**
     * Component: TimePicker
     * 名称：时间选择器
     * 不允许 detach
     */
    returnString = TimePicker(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('选择器')) {
    /**
     * Component: Select
     * 名称：选择器
     * 不允许 detach
     */
    returnString = Select(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('开关')) {
    /**
     * Component: Switch
     * 名称：开关
     * 不允许 detach
     */
    returnString = Switch(node, additionalStyle);
  } else if (mainComponent?.parent?.name.includes('上传')) {
    /**
     * Component: Upload
     * 名称：上传
     * 不允许 detach
     */
    returnString = Upload(node, additionalStyle);
  } else if (node.type === 'RECTANGLE') {
    /**
     * RectangleNode
     */
    returnString = RenderRectangleNode({
      node,
      additionalStyle,
      options,
    });
  } else if (node.type === 'LINE') {
    /**
     * RectangleNode
     */
    returnString = RenderLineNode(node, additionalStyle);
  } else if (node.type === 'TEXT') {
    /**
     * TextNode
     */
    returnString = RenderTextNode({
      node,
      additionalStyle,
      options,
    });
  } else if (mainComponent?.name.includes('/')) {
    /**
     * Component: Icon
     */
    returnString = Icon(node, additionalStyle);
  } else if ('parent' in node && node.parent.type === 'PAGE') {
    if (children) {
      childrenCodes = (layoutMode === 'NONE' ? reverseArr(children) : children)
        .map((o: SceneNode) => generate(o, options))
        .join('');
    }
    returnString = `<div>${childrenCodes}</div>`;
  } else if ('children' in node) {
    const childGenerated = (layoutMode === 'NONE'
      ? reverseArr(children)
      : children
    )
      .map(o => generate(o, options))
      .join('');
    if (childGenerated) {
      let styleString = Object.keys(additionalStyle).length
        ? `style={${stringifyStyle(additionalStyle)}}`
        : '';

      if (useTailwind) {
        styleString = Object.keys(additionalStyle).length
          ? `className="${styleObjectToTailwind(additionalStyle)}"`
          : '';
      }

      returnString = `<div
        ${styleString}>${childGenerated}</div>`;
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
    const codes_inline = (generate(selection[0]) || '').replace(
      /\n\s*\n/g,
      '\n'
    );
    const codes_react = (
      generate(selection[0], {useClassName: true}) || ''
    ).replace(/\n\s*\n/g, '\n');

    const codes_tailwind = (
      generate(selection[0], {useTailwind: true}) || ''
    ).replace(/\n\s*\n/g, '\n');

    figma.ui.postMessage({
      action: 'update',
      codes_inline,
      codes_react,
      codes_tailwind,
    });
  }
};

poll();

figma.ui.onmessage = (msg: {
  type: string;
  height: string;
  useClassName: boolean;
  useTailwind: boolean;
}) => {
  if (msg.type === 'generate') {
    additionalClassNames = '';
    poll();
  }
  if (msg.type === 'resize') {
    try {
      figma.ui.resize(700, parseInt(msg.height, 10));
    } catch (error) {}
  }
};
