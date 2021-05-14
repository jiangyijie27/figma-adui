import {getValueFromNode, stringifyStyle} from './utils';

const Button = (props: IRenderProps) => {
  const {
    node,
    generate,
    additionalStyle: additionalStyleParam = {},
    useTailwind,
  } = props;

  console.log(node, 'Button');
  const additionalStyle = {};
  const size = getValueFromNode('尺寸', node);
  const theme = getValueFromNode('轻量风格', node);
  const intent = getValueFromNode('类型', node);
  const active = ['点击', '选中'].includes(getValueFromNode('状态', node));
  const disabled = getValueFromNode('禁用', node) === 'on';

  let buttonContent = '';
  let leftIcon = '';
  let rightIcon = '';

  if ('children' in node) {
    const children = node.children.filter(o => o.visible);

    const buttonContentChild = children.find(
      o => o.type === 'TEXT'
    ) as TextNode;
    if (buttonContentChild) {
      /**
       * 没有 icon 的情况
       */
      buttonContent = buttonContentChild?.characters;
    } else {
      /**
       * 有 icon 的情况
       */
      const buttonChild = children.find(o => o.name === '文字 + 间距');
      if (
        buttonChild?.visible &&
        'children' in buttonChild &&
        buttonChild.children[0] &&
        'characters' in buttonChild.children[0]
      ) {
        buttonContent = buttonChild.children[0].characters;
      }
    }

    const icons = children.filter(
      o => 'mainComponent' in o && o.mainComponent.name.includes('/')
    );

    let leftIconChild: SceneNode;
    let rightIconChild: SceneNode;

    if (icons.length > 1) {
      [leftIconChild, rightIconChild] = icons;
    } else if (icons.length === 1) {
      if (node.children.findIndex(o => o.id === icons[0].id) === 0) {
        [leftIconChild] = icons;
      } else {
        [rightIconChild] = icons;
      }
    }

    if (leftIconChild?.visible && 'mainComponent' in leftIconChild) {
      leftIcon = leftIconChild.mainComponent.name.split('/')[1].trim();
    }
    if (rightIconChild?.visible && 'mainComponent' in rightIconChild) {
      rightIcon = rightIconChild.mainComponent.name.split('/')[1].trim();
    }
  }

  return `<Button
    ${active ? 'active' : ''}
    ${disabled ? 'disabled' : ''}
    ${intent ? `intent="${intent}"` : ''}
    ${leftIcon ? `leftIcon="${leftIcon}"` : ''}
    ${rightIcon ? `rightIcon="${rightIcon}"` : ''}
    ${size ? `size="${size}"` : ''}
    ${theme === 'on' ? `theme="light"` : ''}
    ${
      Object.keys(additionalStyle).length
        ? `style={${stringifyStyle(additionalStyle)}}`
        : ''
    }
    ${
      buttonContent
        ? `>
    ${buttonContent}
  </Button>`
        : '/>'
    }`;
};

export default Button;
