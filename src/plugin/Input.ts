import {getValueFromNode, stringifyStyle} from './utils';

const Input = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  // @ts-ignore
  const {layoutAlign, layoutGrow} = node;

  if (layoutGrow === 1 || layoutAlign === 'STRETCH') {
    additionalStyle.display = 'block';
    additionalStyle.width = '100%';
  } else {
    additionalStyle.width = `${node.width}px`;
  }
  let leftElement: string;
  let rightElement: string;
  let limit: number;
  let placeholder: string;

  const size = getValueFromNode('尺寸', node);
  const theme = getValueFromNode('风格', node);
  const intent = getValueFromNode('类型', node);
  const disabled = getValueFromNode('状态', node) === '禁用';

  if ('children' in node) {
    const children = node.children;
    const leftNode = children.find(o => o.name === '左图标 + 文字');
    const rightIcon = children.find(o => o.name === '右图标');
    const limitNode = children.find(o => o.name === '字数限制');

    if (leftNode && 'children' in leftNode) {
      const text = leftNode.children.find(o => o.name === '文字');
      if (text && 'characters' in text) {
        placeholder = text.characters;
      }

      const icon = leftNode.children.find(o => o.name === '左图标');
      if (icon?.visible && 'mainComponent' in icon) {
        leftElement = `<Icon icon="${icon.mainComponent.name
          .split('/')[1]
          .trim()}" />`;
      }

      /**
       * 另外一个 child 进行递归
       */
      if (!icon && leftNode.children.length === 2) {
        leftElement = generate(
          leftNode.children.filter(o => o.name !== '文字')[0]
        );
      }
    }

    if (rightIcon?.visible && 'mainComponent' in rightIcon) {
      rightElement = `<Icon icon="${rightIcon.mainComponent.name
        .split('/')[1]
        .trim()}" />`;
    }

    /**
     * 另外一个 child 进行递归
     */
    const rightNodes = children.filter(
      o => !['字数限制', '左图标 + 文字', '右图标'].includes(o.name)
    );
    if (!rightIcon && rightNodes.length) {
      rightElement = generate(rightNodes[0]);
    }

    if (
      limitNode?.visible &&
      'children' in limitNode &&
      'characters' in limitNode.children[0]
    ) {
      const texts = limitNode.children[0].characters.split('/');
      limit = parseInt(texts[1]?.trim() || texts[0]?.trim(), 10);
    }
  }

  /**
   * 大于 50 时判断为 TextArea
   */
  if (node.height > 50) {
    additionalStyle.height = `${node.height}px`;

    return `<Input.Textarea
      ${disabled ? 'disabled' : ''}
      ${intent ? `intent="${intent}"` : ''}
      ${placeholder ? `placeholder="${placeholder}"` : ''}
      style={${stringifyStyle(additionalStyle)}}
    />`;
  }

  return `<Input
    ${disabled ? 'disabled' : ''}
    ${intent ? `intent="${intent}"` : ''}
    ${leftElement ? `leftElement={${leftElement}}` : ''}
    ${limit ? `limit={${limit}}` : ''}
    ${placeholder ? `placeholder="${placeholder}"` : ''}
    ${rightElement ? `rightElement={${rightElement}}` : ''}
    ${size ? `size="${size}"` : ''}
    style={${stringifyStyle(additionalStyle)}}
    ${theme ? `theme="${theme}"` : ''}
  />`;
};

export default Input;
