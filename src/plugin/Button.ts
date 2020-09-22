import {
  getDisabled,
  getSize,
  getIntent,
  getTheme,
  stringifyStyle,
} from './utils';

const Button = (node: SceneNode, additionalStyle: IBaseObject) => {
  let {name} = node;
  let mainComponent: ComponentNode;
  let active: boolean;
  let disabled = getDisabled(node);
  let intent = getIntent(node);
  let size = getSize(node);
  let theme = getTheme(node);

  let buttonContent = '';
  let leftIcon = '';
  let rightIcon = '';

  if ('children' in node) {
    const {children} = node;
    const buttonChild = children.find(o => o.name === '文字');
    const icons = children.filter(
      o => 'mainComponent' in o && o.mainComponent.name.includes(' / ')
    );
    const [leftIconChild, rightIconChild] = icons;
    if (
      buttonChild?.visible &&
      'children' in buttonChild &&
      buttonChild.children[0] &&
      'characters' in buttonChild.children[0]
    ) {
      buttonContent = buttonChild.children[0].characters;
    }

    if (leftIconChild?.visible && 'mainComponent' in leftIconChild) {
      leftIcon = leftIconChild.mainComponent.name.split('/')[1].trim();
    }
    if (rightIconChild?.visible && 'mainComponent' in rightIconChild) {
      rightIcon = rightIconChild.mainComponent.name.split('/')[1].trim();
    }
  }

  if (
    name.includes('点击') ||
    mainComponent?.name.includes('点击') ||
    name.includes('选中') ||
    mainComponent?.name.includes('选中')
  ) {
    active = true;
  }

  if (
    node.parent.name.includes('/按钮组') ||
    ('mainComponent' in node.parent &&
      node.parent.mainComponent?.name.includes('/按钮组'))
  ) {
    delete additionalStyle.display
    delete additionalStyle.marginLeft
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
