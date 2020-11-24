import {getValueFromNode, stringifyStyle} from './utils';

const Button = (node: SceneNode, additionalStyle: IBaseObject) => {
  const size = getValueFromNode('尺寸', node);
  const theme = getValueFromNode('风格', node);
  const intent = getValueFromNode('类型', node);
  const active = getValueFromNode('状态', node) === 'active';
  const disabled = getValueFromNode('状态', node) === 'disabled';

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

    const [leftIconChild, rightIconChild] = icons;

    if (leftIconChild?.visible && 'mainComponent' in leftIconChild) {
      leftIcon = leftIconChild.mainComponent.name.split('/')[1].trim();
    }
    if (rightIconChild?.visible && 'mainComponent' in rightIconChild) {
      rightIcon = rightIconChild.mainComponent.name.split('/')[1].trim();
    }
  }

  if (
    node.parent.name.includes('/按钮组') ||
    ('mainComponent' in node.parent &&
      node.parent.mainComponent?.name.includes('/按钮组'))
  ) {
    delete additionalStyle.display;
    delete additionalStyle.marginLeft;
  }

  return `<Button
    ${active ? 'active' : ''}
    ${disabled ? 'disabled' : ''}
    ${intent ? `intent="${intent}"` : ''}
    ${leftIcon ? `leftIcon="${leftIcon}"` : ''}
    ${rightIcon ? `rightIcon="${rightIcon}"` : ''}
    ${size ? `size="${size}"` : ''}
    ${theme ? `theme="${theme}"` : ''}
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
