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
import RenderContainer from './RenderContainer';
import RenderRectangleNode from './RenderRectangleNode';
import RenderTextNode from './RenderTextNode';
import TreeSelect from './TreeSelect';

figma.showUI(__html__, {width: 700, height: 1200});

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
  let returnString = '';
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
    let children: readonly SceneNode[];

    if (parent.name === '对话框') {
      children = parent.children.filter(
        o => !['卡片标题', '底栏'].includes(o.name)
      );
    } else if (parent.name === '卡片') {
      children = parent.children.filter(
        o => !['标题 + 描述文字'].includes(o.name)
      );
    } else {
      children = parent.children;
    }
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
     * 卡片比较特殊，标题 + 描述文字下的一个元素计算 marginTop
     */
    if (index === children.length - 1 && parent.name === '卡片') {
      const cardHeader = parent.children.find(
        o => o.name === '标题 + 描述文字'
      );
      marginTop = y - (cardHeader ? cardHeader.height : 0);
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
    if ('width' in parent && !isContainer(parent.name)) {
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
    }
  }

  if ('children' in node && ['对话框', '卡片'].includes(node.name)) {
    const paddingBottom =
      node.height - node.children[0].y - node.children[0].height;

    if (paddingBottom > 0) {
      style.paddingBottom = `${paddingBottom}px`;
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
      returnString = RenderTextNode(node, additionalStyle, 'div');
    } else {
      returnString = RenderContainer(node, generate, additionalStyle);
    }
  } else if (name === '卡片' || mainComponent?.name === '卡片') {
    /**
     * Component: Card
     */
    returnString = Card(node, generate, additionalStyle);
  } else if (name === '标题 + 描述文字') {
    returnString = CardHeader(node, generate, additionalStyle);
  } else if (name.includes('提醒') || mainComponent?.name.includes('提醒')) {
    /**
     * Component: Alert
     */
    returnString = Alert(node, additionalStyle);
  } else if (
    /**
     * Component: Button.Group
     */
    name.includes('/按钮组') ||
    mainComponent?.name.includes('/按钮组')
  ) {
    returnString = ButtonGroup(node, generate, additionalStyle);
  } else if (
    /**
     * Component: Button
     * 不允许 detach
     */
    mainComponent?.parent?.name === '按钮'
  ) {
    returnString = Button(node, additionalStyle);
  } else if (name.includes('勾选/') || mainComponent?.name.includes('勾选/')) {
    /**
     * Component: Checkbox
     */
    returnString = Checkbox(node);
  } else if (
    /**
     * Component: CheckboxGroup
     */
    name.includes('勾选组') ||
    mainComponent?.name.includes('勾选组')
  ) {
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
     * Component: FormItem
     */
    returnString = Form(node, generate, additionalStyle);
  } else if (name === '表单' || mainComponent?.name === '表单') {
    /**
     * Component: FormItem
     */
    returnString = FormItem(node, generate, additionalStyle);
  } else if (
    /**
     * Component: FormTip
     */
    node.type === 'TEXT' &&
    (name === '表单-tip' || mainComponent?.name === '表单-tip')
  ) {
    returnString = FormTip(node, additionalStyle);
  } else if (
    /**
     * Component: Input
     */
    name.includes('输入框/') ||
    mainComponent?.name.includes('输入框/')
  ) {
    returnString = Input(node, generate, additionalStyle);
  } else if (
    /**
     * Component: NumericInput
     */
    name.includes('数字输入框') ||
    mainComponent?.name.includes('数字输入框')
  ) {
    returnString = NumericInput(node, additionalStyle);
  } else if (
    /**
     * Component: Pagination
     */
    name.includes('/分页器') ||
    mainComponent?.name.includes('/分页器')
  ) {
    returnString = Pagination(node, additionalStyle);
  } else if (name.includes('单选/') || mainComponent?.name.includes('单选/')) {
    /**
     * Component: Radio
     */
    returnString = Radio(node);
  } else if (
    /**
     * Component: RadioGroup
     */
    name.includes('单选组') ||
    mainComponent?.name.includes('单选组')
  ) {
    returnString = RadioGroup(node, generate, additionalStyle);
  } else if (
    /**
     * Component: ColorPicker
     */
    name.includes('颜色选择器') ||
    mainComponent?.name.includes('颜色选择器')
  ) {
    returnString = ColorPicker(node, additionalStyle);
  } else if (
    /**
     * Component: DatePicker DatePicker.RangePicker
     */
    name.includes('日期选择器') ||
    mainComponent?.name.includes('日期选择器')
  ) {
    returnString = DatePicker(node, additionalStyle);
  } else if (
    /**
     * Component: TreeSelect
     */
    name.includes('树形选择器') ||
    mainComponent?.name.includes('树形选择器')
  ) {
    returnString = TreeSelect(node, additionalStyle);
  } else if (name.includes('表格-') || mainComponent?.name.includes('表格-')) {
    /**
     * Component: Table
     */
    returnString = Table(node, generate, additionalStyle);
  } else if (
    /**
     * Component: Tabs
     */
    name.includes('导航页签') ||
    mainComponent?.name.includes('导航页签')
  ) {
    returnString = Tabs(node, additionalStyle);
  } else if (
    /**
     * Component: TimePicker
     */
    name.includes('时间选择器') ||
    mainComponent?.name.includes('时间选择器')
  ) {
    returnString = TimePicker(node, additionalStyle);
  } else if (
    /**
     * Component: Select
     */
    name.includes('选择器') ||
    mainComponent?.name.includes('选择器')
  ) {
    returnString = Select(node, additionalStyle);
  } else if (
    /**
     * Component: Switch
     */
    ['开', '关', '禁用-开', '禁用-关'].includes(name) ||
    ['开', '关', '禁用-开', '禁用-关'].includes(mainComponent?.name)
  ) {
    returnString = Switch(node, additionalStyle);
  } else if (node.type === 'RECTANGLE') {
    /**
     * RectangleNode
     */
    returnString = RenderRectangleNode(node, additionalStyle);
  } else if (node.type === 'TEXT') {
    /**
     * TextNode
     */
    returnString = RenderTextNode(node, additionalStyle);
  } else if (mainComponent?.name.includes(' / ')) {
    /**
     * Component: Icon
     */
    returnString = Icon(node, additionalStyle);
  } else if ('parent' in node && node.parent.type === 'PAGE') {
    returnString = `<div>${childrenCodes}</div>`;
  } else if ('children' in node) {
    const childGenerated = reverseArr(node.children)
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
figma.on('selectionchange', poll);

figma.ui.onmessage = (msg: {type: string}) => {
  if (msg.type === 'order') {
    const order = (n: SceneNode) => {
      let startingIndex = 100000;
      if ('children' in n) {
        n.children
          .map(node => {
            startingIndex = Math.min(startingIndex, n.children.indexOf(node));
            return node;
          })
          .sort((a, b) => {
            if (n.name.includes('Container: flex')) {
              return b.x - a.x;
            } else {
              return b.y - a.y;
            }
          })
          .forEach((obj, i) => {
            n.insertChild(startingIndex + i, obj);
          });
      }
    };
    const {selection} = figma.currentPage;

    if (selection.length === 1) {
      order(selection[0]);
      poll();
    }
  }
  
  if (msg.type === 'generate') {
    poll();
  }
};
