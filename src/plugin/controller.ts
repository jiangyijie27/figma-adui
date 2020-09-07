import Alert from './Alert';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import ColorPicker from './ColorPicker';
import DatePicker from './DatePicker';
import FormItem from './FormItem';
import FormTip from './FormTip';
import Input from './Input';
import NumericInput from './NumericInput';
import Pagination from './Pagination';
import Radio from './Radio';
import RadioGroup from './RadioGroup';
import Select from './Select';
import Switch from './Switch';
import TimePicker from './TimePicker';
import RenderContainer from './RenderContainer';
import RenderTextNode from './RenderTextNode';
import TreeSelect from './TreeSelect';

figma.showUI(__html__, {width: 500, height: 1000});

let oldSelection: SceneNode[] = [];

const {selection} = figma.currentPage;

const reverseArr = (input: any[]) => {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
};

const isContainer = (name: string) =>
  [
    '卡片',
    'Container',
    'Container: flex',
    'Container: space-between',
    '标题 + 描述文字',
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
      .join('\n');
  }

  if (isContainer(name)) {
    const {parent} = node as any;
    if (parent) {
      let marginLeft = x;
      let marginRight = parent.width - marginLeft - width;
      let marginTop = 0;
      const index = parent.children.findIndex(o => o.id === id);
      const previousIndex =
        index + (layoutMode === 'NONE' && parent.name !== '卡片' ? -1 : 1);
      let previousElement;
      if (previousIndex > -1) {
        previousElement = parent.children[previousIndex];
      }
      if (previousElement && isContainer(previousElement.name)) {
        marginTop = y - previousElement.y + previousElement.height;
      }

      if (parent.name !== 'topContent') {
        if (marginTop) {
          style.marginTop = `${marginTop}px`;
        }

        if (marginLeft) {
          style.marginLeft = `${marginLeft}px`;
        }
        if (marginRight) {
          style.marginRight = `${marginRight}px`;
        }
      }
    }
  }

  if (isContainer(node.parent?.name)) {
    const {parent} = node;
    const index = parent.children.findIndex(o => o.id === id);
    // children 是倒序的，index 为 0 说明是最后一个
    if (index < parent.children.length - 1) {
      const prevSibling = parent.children[index + 1];
      const marginLeft = node.x - prevSibling.x - prevSibling.width;
      if (marginLeft) {
        style.marginLeft = `${marginLeft}px`;
      }
    }
  }

  if (Object.keys(style).length) {
    additionalStyle = {...additionalStyle, ...style};
  }

  /**
   * Component: Container
   */
  if (name.includes('Container')) {
    return RenderContainer(node, generate, additionalStyle);
  }

  /**
   * Component: Card
   */
  if (name === '卡片') {
    return `<Card
      ${additionalStyle ? `style={{ ${additionalStyle} }}` : ''}
    >
      ${childrenCodes}
    </Card>`;
  }
  if (name === '标题 + 描述文字') {
    let title = '';
    let subTitle = '';
    let topContent = '';
    const titleChild = children.find(
      ({type, name, fontSize, fontName}: any) =>
        type === 'TEXT' &&
        (name === 'title' || (fontSize === 14 && fontName.style === 'Semibold'))
    );
    const subTitleChild = children.find(
      ({type, name, fontSize, fontName}: any) =>
        type === 'TEXT' &&
        (name === 'subTitle' ||
          (fontSize === 13 && fontName.style === 'Regular'))
    );
    const topContentChild = children.find((o: any) => o.name === 'topContent');
    if (titleChild) {
      title = titleChild.characters;
    }
    if (subTitleChild) {
      subTitle = subTitleChild.characters;
    }
    if (topContentChild) {
      topContent = `${topContentChild.children
        .map((o: SceneNode) => generate(o))
        .join('')}`;
    }
    return `<Card.Header
      ${title ? `title="${title}"` : ''}
      ${subTitle ? `subTitle="${subTitle}"` : ''}
      ${
        topContent
          ? `topContent={
        ${topContent}
      }`
          : ''
      }
      ${additionalStyle ? `style={{ ${additionalStyle} }}` : ''}
    ></Card.Header>`;
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
  if (name === '对话框' || mainComponent?.name === '对话框') {
    let title = '';
    const header = children.find(o => o.name === '卡片标题');

    if (header) {
      const {children} = header;
      if (children && children.children) {
        children.children.find(o => o);
      }
    }

    return `<Dialog
      visible
      onConfirm={() => {}}
      onCancel={() => {}}
      style={{ width: "${width}px", height: "${height}px" }}
    >
      ${childrenCodes}
    </Dialog>`;
  }

  /**
   * Component: FormItem
   */
  if (name === '表单' || mainComponent?.name === '表单') {
    return FormItem(node, generate);
  }

  /**
   * Component: FormTip
   */
  if (
    node.type === 'TEXT' &&
    (name === '表单-tip' || mainComponent?.name === '表单-tip')
  ) {
    return FormTip(node);
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
    return Pagination(node);
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
    return Switch(node);
  }

  /**
   * TextNode
   */
  if (node.type === 'TEXT') {
    return RenderTextNode(node, additionalStyle);
  }
};

const poll = () => {
  const selection = figma.currentPage.selection;
  if (
    selection.length === 1 &&
    JSON.stringify(oldSelection) !== JSON.stringify(selection)
  ) {
    figma.ui.postMessage({
      action: 'update',
      codes: (generate(selection[0]) || '').replace(/\n\s*\n/g, '\n'),
    });
    oldSelection = JSON.parse(JSON.stringify(selection));
  }
  setTimeout(poll, 1000);
};

poll();
