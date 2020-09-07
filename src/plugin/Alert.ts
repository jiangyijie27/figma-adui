import {stringifyStyle, getTheme, getIntent} from './utils';

const Alert = (node: SceneNode, additionalStyle: IBaseObject) => {
  const theme = getTheme(node);
  const intent = getIntent(node);
  let expandContent = '';
  let text = '';
  let closable = false;

  if ('children' in node) {
    const textNode = node.children.find(o => o.type === 'TEXT') as TextNode;
    if (textNode) {
      text = textNode.characters;
    }

    const closeNode = node.children.find(o => o.name === '编辑 / cancel');
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

  return `
    <Alert
      ${expandContent ? 'expandContent="这里是展开内容。"' : ''}
      ${closable ? 'closable' : ''}
      ${text ? `text="${text}"` : ''}
      ${intent ? `intent="${intent}"` : ''}
      ${theme ? `theme="${theme}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    />
  `;
};

export default Alert;
