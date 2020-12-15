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
import RenderFlex from './RenderFlex';
import TreeSelect from './TreeSelect';
import {getPadding, reverseArr} from './utils';

figma.showUI(__html__, {width: 700, height: 700});

const generate: IGenerate = node => {
  let returnString = '';
  if (!node || !node.visible) {
    return '';
  }
  let {id, name, parent} = node;
  let mainComponent: ComponentNode;
  let children: readonly SceneNode[];
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('children' in node) {
    children = node.children;
  }
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }
  let childrenCodes = '';
  let additionalStyle: React.CSSProperties = {};

  /**
   * 父元素是 auto layout 时，子元素添加 margin
   */
  if ('itemSpacing' in parent) {
    const {itemSpacing, layoutMode} = parent;
    let primaryAxisAlignItems: string;
    if ('primaryAxisAlignItems' in parent) {
      ({primaryAxisAlignItems} = parent);
    }
    let marginValue = itemSpacing;
    if (
      parent.children.findIndex(o => o.id === id) !==
        parent.children.length - 1 &&
      marginValue &&
      primaryAxisAlignItems !== 'SPACE_BETWEEN'
    ) {
      if (layoutMode === 'HORIZONTAL') {
        additionalStyle.marginRight = `${marginValue}px`;
      } else if (layoutMode === 'VERTICAL') {
        additionalStyle.marginBottom = `${marginValue}px`;
      }
    }
  }

  if (name === '卡片' || mainComponent?.name === '卡片') {
    /**
     * Component: Card
     * 作为容器，additionalStyle 会加入自身默认没有的 padding
     */
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
    returnString = Card(node, generate, additionalStyle);
  } else if (name === '标题 + 描述文字') {
    returnString = CardHeader(node, generate, additionalStyle);
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
     * 作为容器，additionalStyle 会加入自身默认没有的 padding
     */
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
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
    returnString = Button(node, additionalStyle);
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
     * 作为容器，additionalStyle 会加入自身默认没有的 padding
     */
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
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
     * 作为容器，additionalStyle 会加入自身默认没有的 padding
     */
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
    returnString = Form(node, generate, additionalStyle);
  } else if (name === '表单' || mainComponent?.name === '表单') {
    /**
     * Component: FormItem
     * 作为容器，additionalStyle 会加入自身默认没有的 padding
     */
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
    returnString = FormItem(node, generate, additionalStyle);
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
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
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
     * 作为容器，additionalStyle 会加入自身默认没有的 padding
     */
    const padding = getPadding(node);
    if (padding) {
      additionalStyle.padding = padding;
    }
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
    returnString = RenderRectangleNode(node, additionalStyle);
  } else if (node.type === 'LINE') {
    /**
     * RectangleNode
     */
    returnString = RenderLineNode(node, additionalStyle);
  } else if (node.type === 'TEXT') {
    /**
     * TextNode
     */
    returnString = RenderTextNode(node, additionalStyle);
  } else if (mainComponent?.name.includes('/')) {
    /**
     * Component: Icon
     */
    returnString = Icon(node, additionalStyle);
  } else if (['HORIZONTAL', 'VERTICAL'].includes(layoutMode)) {
    /**
     * Component: Flex
     */
    returnString = RenderFlex(node, generate, additionalStyle);
  } else if ('parent' in node && node.parent.type === 'PAGE') {
    if (children) {
      childrenCodes = (layoutMode === 'NONE' ? reverseArr(children) : children)
        .map((o: SceneNode) => generate(o))
        .join('');
    }
    returnString = `<div>${childrenCodes}</div>`;
  } else if ('children' in node) {
    const childGenerated = (layoutMode === 'NONE'
      ? reverseArr(children)
      : children
    )
      .map(o => generate(o))
      .join('');
    if (childGenerated) {
      returnString = `<div>${childGenerated}</div>`;
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
  const selection = figma.currentPage.selection;
  if (selection.length === 1) {
    figma.ui.postMessage({
      action: 'update',
      codes: (generate(selection[0]) || '').replace(/\n\s*\n/g, '\n'),
    });
  }
};

poll();
// figma.on('selectionchange', poll);

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
