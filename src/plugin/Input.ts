import {getValueFromNode} from './utils';

const Input = (props: IRenderProps) => {
  let {node, generate, additionalClassNames = []} = props;
  additionalClassNames = additionalClassNames.filter(o => !o.startsWith('p'));

  // @ts-ignore
  const {layoutAlign, layoutGrow} = node;

  if (layoutGrow === 1) {
    additionalClassNames.push('flex-1');
  } else {
    additionalClassNames.push(`w-${node.width}`);
  }
  let leftElement: string;
  let rightElement: string;
  let limit: number;
  let placeholder: string;

  const size = getValueFromNode('尺寸', node);
  const theme = getValueFromNode('轻量风格', node);
  const intent = getValueFromNode('类型', node);
  const disabled = getValueFromNode('禁用', node) === 'on';
  const leftElementType = getValueFromNode('左元素', node);
  const rightElementType = getValueFromNode('右元素', node);

  if ('children' in node) {
    const children = node.children;

    const text = children.find(o => o.type === 'TEXT');
    if (text && 'characters' in text) {
      placeholder = text.characters;
    }

    switch (leftElementType) {
      case '图标':
        const icon = children.find(o => o.name === '左图标');
        if (icon?.visible && 'mainComponent' in icon) {
          leftElement = `<Icon icon="${icon.mainComponent.name
            .split('/')[1]
            .trim()}" />`;
        }
        break;
      case '按钮':
        const buttonChild = children.find(o => o.name.includes('按钮'));
        if (buttonChild) {
          leftElement = generate(buttonChild);
        }
        break;
      case '选择器':
        leftElement = '<Select />';
        break;
      default:
    }

    switch (rightElementType) {
      case '图标':
        const icon = children.find(o => o.name === '右图标');
        if (icon?.visible && 'mainComponent' in icon) {
          rightElement = `<Icon icon="${icon.mainComponent.name
            .split('/')[1]
            .trim()}" />`;
        }
        break;
      case '按钮':
        const buttonChild = children.find(o => o.name.includes('按钮'));
        if (buttonChild) {
          rightElement = generate(buttonChild);
        }
        break;
      case '选择器':
        rightElement = '<Select />';
        break;
      case '字数限制':
        try {
          const limitChild = children.find(o => o.name.includes('字数限制'));
          // @ts-ignore
          const texts = limitChild.children[0].characters.split('/');
          limit = parseInt(texts[1]?.trim() || texts[0]?.trim(), 10);
        } catch (error) {}
      default:
    }
  }

  let classNameString = '';

  /**
   * 大于 50 时判断为 TextArea
   */
  if (node.height > 50) {
    additionalClassNames.push(`h-${node.height}`);

    if (additionalClassNames.length) {
      classNameString = `className="${additionalClassNames.join(' ')}"`;
    }

    return `<Input.Textarea
      ${disabled ? 'disabled' : ''}
      ${intent ? `intent="${intent}"` : ''}
      ${placeholder ? `placeholder="${placeholder}"` : ''}
      ${classNameString}
    />`;
  }

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  return `<Input
    ${disabled ? 'disabled' : ''}
    ${intent ? `intent="${intent}"` : ''}
    ${leftElement ? `leftElement={${leftElement}}` : ''}
    ${limit ? `limit={${limit}}` : ''}
    ${placeholder ? `placeholder="${placeholder}"` : ''}
    ${rightElement ? `rightElement={${rightElement}}` : ''}
    ${size ? `size="${size}"` : ''}
    ${classNameString}
    ${theme === 'on' ? `theme="light"` : ''}
  />`;
};

export default Input;
