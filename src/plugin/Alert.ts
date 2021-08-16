import {getValueFromNode, getIntent} from './utils';

const Alert = (props: IRenderProps) => {
  const {node, additionalClassNames = []} = props;
  const theme =
    getValueFromNode('轻量风格', node) === 'on' ||
    getValueFromNode('风格', node) === 'light'
      ? 'theme="light"'
      : '';
  const intent = getIntent(node);
  let expandContent = '';
  let text = '';
  let closable = false;

  if (node.layoutAlign !== 'STRETCH') {
    additionalClassNames.push(`w-${node.width}`);
  }

  if ('children' in node) {
    const textNode = node.children.find(o => o.name === 'Text');
    if (textNode) {
      // @ts-ignore
      text = textNode.children[0].characters;
    }

    const closeNode = node.children.find(o => o.name === '编辑/cancel');
    if (closeNode?.visible) {
      closable = true;
    }

    const expandNode = node.children.find(
      o => o.type === 'TEXT' && o.characters === '展开'
    );
    if (expandNode?.visible) {
      expandContent = '这里是展开内容。';
    }
  }

  let classNameString = '';

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  return `
    <Alert
      ${expandContent ? 'expandContent="这里是展开内容。"' : ''}
      ${closable ? 'closable' : ''}
      ${text ? `text="${text}"` : ''}
      ${intent ? `intent="${intent}"` : ''}
      ${theme ? `theme="${theme}"` : ''}
      ${classNameString}
    />
  `;
};

export default Alert;
