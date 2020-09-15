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
import Input from './Input';
import NumericInput from './NumericInput';
import Pagination from './Pagination';
import Radio from './Radio';
import RadioGroup from './RadioGroup';
import Select from './Select';
import Switch from './Switch';
import Table from './Table';
import Tabs from './Tabs';
import TimePicker from './TimePicker';
import RenderContainer from './RenderContainer';
import RenderTextNode from './RenderTextNode';
import TreeSelect from './TreeSelect';

figma.showUI(__html__, {width: 700, height: 800});

const reverseArr = (input: readonly any[]) => {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
};

const isContainer = (name: string) =>
  [
    'Container',
    'Container: flex',
    'Container: flex-c',
    'Container: flex-sb',
    '表单-wrap',
    '表单',
    'Pagination',
  ].includes(name);

const generate: IGenerate = node => {
  if (!node || !node.visible) {
    return '';
  }
  let {
    id,
    name,
    children,
    mainComponent,
    x,
    y,
    width,
    height,
    layoutMode,
  } = node;
  let childrenCodes = '';
  let style: React.CSSProperties = {};
  let additionalStyle: IBaseObject = {};
  if (children) {
    // auto layout 时子元素会倒序；array.prototype.reverse 会报错
    // childrenCodes = (layoutMode === 'NONE' && name !== '卡片'
    //   ? children
    //   : reverseArr(children)
    // )
    childrenCodes = reverseArr(children)
      .map((o: SceneNode) => generate(o))
      .join('');
  }

  /**
   * 如果本身是 Container 且父级不是 Container，这时候代表是一个独立的块状元素
   * 那么 marginLeft 和 marginRight 都要计算，
   * 并且判断 marginTop，如果是第一项则需要 marginTop
   * 并且判断 marginBottom，如果是最后一项则不需要 marginBottom
   */
  if (
    node.parent?.name !== 'Container: flex' &&
    node.parent?.name !== 'Container: flex-c' &&
    node.parent?.name !== 'Container: flex-sb' &&
    node.parent?.type !== 'PAGE'
  ) {
    style.display = 'block';
    const {parent} = node;
    let marginTop = 0;
    let marginBottom = 0;
    let marginLeft = x - (node.parent.name === '卡片标题' ? 24 : 0);
    let marginRight = 'width' in parent ? parent.width - marginLeft - width : 0;
    let children =
      parent.name === '对话框'
        ? parent.children.filter(o => !['卡片标题', '底栏'].includes(o.name))
        : parent.children;
    let index = children.findIndex(o => o.id === id);
    /**
     * 代表是第一项
     */
    if (
      index === children.length - 1 &&
      !parent.name.includes('数据项') &&
      !parent.name.includes('单元格')
    ) {
      marginTop = y;
    }

    /**
     * 对话框比较特殊，卡片标题下的一个元素计算 marginTop
     */
    if (index === children.length - 1 && parent.name === '对话框') {
      const dialogHeader = parent.children.find(o => o.name === '卡片标题');
      marginTop = y - (dialogHeader ? dialogHeader.height : 0);
    }

    /**
     * 代表不是最后一项
     */
    if (index > 0) {
      const nextElement = children[index - 1];
      if (nextElement) {
        marginBottom = nextElement.y - node.y - node.height;
      }
    }
    if (marginTop > 0) {
      style.marginTop = `${marginTop}px`;
    }
    if (node.type === 'TEXT' && marginRight > 0) {
      style.marginRight = `${marginRight}px`;
    }
    if (marginBottom > 0) {
      style.marginBottom = `${marginBottom}px`;
    }
    if (
      marginLeft > 0 &&
      node.parent?.name !== '表单' &&
      !parent.name.includes('数据项') &&
      !parent.name.includes('单元格')
    ) {
      style.marginLeft = `${marginLeft}px`;
    }
  }

  /**
   * 如果父级是 Container（除去 Container 和 space-between），则代表里面的元素是横向排列的，这时候就需要计算横向 padding
   */
  if (
    node.parent?.name === 'Container: flex' ||
    node.parent?.name === 'Container: flex-c'
  ) {
    const {parent} = node;
    const index = parent.children.findIndex(o => o.id === id);
    // children 是倒序的，parent.children.length - 1 为第一个
    if (index < parent.children.length - 1) {
      const prevSibling = parent.children[index + 1];
      const marginLeft = node.x - prevSibling.x - prevSibling.width;
      if (marginLeft > 0) {
        style.marginLeft = `${marginLeft}px`;
      }
    } else if (node.parent?.name !== 'Container: flex-c') {
      const marginLeft = node.x;
      if (marginLeft > 0) {
        style.marginLeft = `${marginLeft}px`;
      }
    }
  }

  if (isContainer(name)) {
    const {parent} = node;
    if ('width' in parent && parent.name !== '表单') {
      let newX = 0;
      let newWidth = parent.width;
      let newHeight = 0;
      let newY = 0;
      let minYOffset;

      if ('children' in node) {
        node.children.forEach(o => {
          if (o.height > newHeight) {
            // 说明 Container 的高度不足
            newHeight = o.height;
          }
          if (minYOffset === undefined) {
            minYOffset = o.y;
          } else {
            minYOffset = Math.min(minYOffset, o.y);
          }
        });

        newY = minYOffset + node.y;

        node.children.forEach(o => {
          o.y = o.y - newY + node.y;
          newHeight = Math.max(o.y + o.height, newHeight);
        });
      }

      try {
        node.resize(newWidth, newHeight);
        node.x = newX;
        node.y = newY;
      } catch (error) {
        console.log(error, 'resize error');
      }
      // style.height = `${newHeight}px`;
    }
  }

  if (Object.keys(style).length) {
    additionalStyle = {...additionalStyle, ...style};
  }

  /**
   * Component: Container
   */
  if (name.includes('Container')) {
    if (node.type === 'TEXT') {
      return RenderTextNode(node, additionalStyle, 'div');
    }
    return RenderContainer(node, generate, additionalStyle);
  }

  /**
   * Component: Card
   */
  if (name === '卡片' || mainComponent?.name === '卡片') {
    return Card(node, generate, additionalStyle);
  }
  if (name === '标题 + 描述文字') {
    return CardHeader(node, generate, additionalStyle);
  }

  /**
   * Component: Alert
   */
  if (name.includes('提醒') || mainComponent?.name.includes('提醒')) {
    return Alert(node, additionalStyle);
  }

  /**
   * Component: Button.Group
   */
  if (name.includes('/按钮组') || mainComponent?.name.includes('/按钮组')) {
    return ButtonGroup(node, generate, additionalStyle);
  }

  /**
   * Component: Button
   */
  if (
    name.includes('按钮') ||
    mainComponent?.name.includes('按钮') ||
    name === '尾部按钮' ||
    name === '头部按钮'
  ) {
    return Button(node, additionalStyle);
  }

  /**
   * Component: Checkbox
   */
  if (name.includes('勾选/') || mainComponent?.name.includes('勾选/')) {
    return Checkbox(node);
  }

  /**
   * Component: CheckboxGroup
   */
  if (name.includes('勾选组') || mainComponent?.name.includes('勾选组')) {
    return CheckboxGroup(node, generate, additionalStyle);
  }

  /**
   * Component: Dialog
   */
  if (name.includes('对话框') || mainComponent?.name.includes('对话框')) {
    return Dialog(node, generate);
  }

  /**
   * Component: FormItem
   */
  if (name === '表单-wrap' || mainComponent?.name === '表单-wrap') {
    return Form(node, generate, additionalStyle);
  }

  /**
   * Component: FormItem
   */
  if (name === '表单' || mainComponent?.name === '表单') {
    return FormItem(node, generate, additionalStyle);
  }

  /**
   * Component: FormTip
   */
  if (
    node.type === 'TEXT' &&
    (name === '表单-tip' || mainComponent?.name === '表单-tip')
  ) {
    return FormTip(node, additionalStyle);
  }

  /**
   * Component: Input
   */
  if (name.includes('输入框/') || mainComponent?.name.includes('输入框/')) {
    return Input(node, generate, additionalStyle);
  }

  /**
   * Component: NumericInput
   */
  if (
    name.includes('数字输入框') ||
    mainComponent?.name.includes('数字输入框')
  ) {
    return NumericInput(node, additionalStyle);
  }

  /**
   * Component: Pagination
   */
  if (name.includes('/分页器') || mainComponent?.name.includes('/分页器')) {
    return Pagination(node, additionalStyle);
  }

  /**
   * Component: Radio
   */
  if (name.includes('单选/') || mainComponent?.name.includes('单选/')) {
    return Radio(node);
  }

  /**
   * Component: RadioGroup
   */
  if (name.includes('单选组') || mainComponent?.name.includes('单选组')) {
    return RadioGroup(node, generate, additionalStyle);
  }

  /**
   * Component: ColorPicker
   */
  if (
    name.includes('颜色选择器') ||
    mainComponent?.name.includes('颜色选择器')
  ) {
    return ColorPicker(node, additionalStyle);
  }

  /**
   * Component: DatePicker DatePicker.RangePicker
   */
  if (
    name.includes('日期选择器') ||
    mainComponent?.name.includes('日期选择器')
  ) {
    return DatePicker(node, additionalStyle);
  }

  /**
   * Component: TreeSelect
   */
  if (
    name.includes('树形选择器') ||
    mainComponent?.name.includes('树形选择器')
  ) {
    return TreeSelect(node, additionalStyle);
  }

  /**
   * Component: Table
   */
  if (name.includes('表格-') || mainComponent?.name.includes('表格-')) {
    return Table(node, generate, additionalStyle);
  }

  /**
   * Component: Tabs
   */
  if (name.includes('导航页签') || mainComponent?.name.includes('导航页签')) {
    return Tabs(node, additionalStyle);
  }

  /**
   * Component: TimePicker
   */
  if (
    name.includes('时间选择器') ||
    mainComponent?.name.includes('时间选择器')
  ) {
    return TimePicker(node, additionalStyle);
  }

  /**
   * Component: Select
   */
  if (name.includes('选择器') || mainComponent?.name.includes('选择器')) {
    return Select(node, additionalStyle);
  }

  /**
   * Component: Switch
   */
  if (
    ['开', '关', '禁用-开', '禁用-关'].includes(name) ||
    ['开', '关', '禁用-开', '禁用-关'].includes(mainComponent?.name)
  ) {
    return Switch(node, additionalStyle);
  }

  /**
   * TextNode
   */
  if (node.type === 'TEXT') {
    return RenderTextNode(node, additionalStyle);
  }

  if ('parent' in node && node.parent.type === 'PAGE') {
    return `<div>${childrenCodes}</div>`;
  }

  if ('children' in node) {
    const childGenerated = reverseArr(node.children)
      .map(o => generate(o))
      .join('');
    if (childGenerated) {
      return `<div>${childGenerated}</div>`;
    }
  }
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
figma.on('selectionchange', poll);


figma.ui.onmessage = (msg: {type: string}) => {
  if (msg.type === 'order') {

    const order = (n: SceneNode) => {
      let startingIndex = 100000;
      if ('children' in n && !n.name.includes("Container: flex")) {
        n.children
          .map(node => {
            startingIndex = Math.min(startingIndex, n.children.indexOf(node));
            return node;
          })
          .sort((a, b) => b.y - a.y)
          .forEach((obj, i) => {
            n.insertChild(startingIndex + i, obj);
          });
      }
    }
    const {selection} = figma.currentPage;

    if (selection.length === 1) {
      order(selection[0])
      poll()
    }
  }
};