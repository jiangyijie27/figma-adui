import {reverseArr, stringifyStyle} from './utils';

const Dialog = (node: SceneNode, generate: IGenerate) => {
  const {width} = node;
  let title = '';
  let headerContent = [];
  let headerStyle: React.CSSProperties = {
    paddingBottom: 0,
  };
  let childrenNodes = '';
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }

  if ('children' in node) {
    const {children} = node;
    const childrenFiltered = children.filter(
      o => !['卡片标题', '底栏'].includes(o.name)
    );
    childrenNodes = (layoutMode === 'NONE'
      ? reverseArr(childrenFiltered)
      : childrenFiltered
    )
      .map(o => generate(o))
      .join('');
    const header = children.find(o => o.name === '卡片标题');

    if (
      header &&
      'effects' in header &&
      header.effects &&
      header.effects[0]?.visible
    ) {
      headerStyle.boxShadow = '0 -1px 0 rgba(0, 0, 0, 0.06) inset';
    }

    if (header && 'children' in header) {
      const {children} = header;
      headerContent = children.filter(
        o => o.name !== '对话框-title' && o.name !== '编辑/cancel'
      );
      const titleNode = children.find(
        o => o.name === '对话框-title'
      ) as TextNode;
      if (titleNode?.characters) {
        title = titleNode.characters;
      }
    }
  }

  return `<Dialog
      visible
      onConfirm={() => {}}
      onCancel={() => {}}
      ${title ? `title="${title}"` : ''}
      style={{ width: "${width}px" }}
      ${
        Object.keys(headerStyle).length
          ? `headerStyle={${stringifyStyle(headerStyle)}}`
          : ''
      }
      headerContent={
        ${headerContent.length > 1 ? '<div>' : ''}
          ${reverseArr(headerContent)
            .map(o => generate(o))
            .join('')}   
        ${headerContent.length > 1 ? '</div>' : ''}
      }
      bodyStyle={{ padding: 0 }}
    >
      ${childrenNodes}
    </Dialog>`;
};

export default Dialog;
