import {reverseArr, getTheme, stringifyStyle} from './utils';

const Dialog = (node: SceneNode, generate: IGenerate) => {
  const {width, height} = node;
  let title = '';
  let headerContent = [];
  let headerStyle: IBaseObject = {};
  let childrenNodes = '';

  if ('children' in node) {
    const {children} = node;
    childrenNodes = reverseArr(
      children.filter(o => !['卡片标题', '底栏'].includes(o.name))
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
        o => o.name !== '对话框-title' && o.name !== '编辑 / cancel'
      );
      const titleNode = children.find(
        o => o.name === '对话框-title'
      ) as TextNode;
      if (titleNode?.characters) {
        title = titleNode.characters;
      }
    }

    // 判断 headerStyle 的 paddingBottom
    if (headerContent.length) {
      // 注意倒序情况下 0 实际是最后一项
      const paddingBottom =
        header.height - headerContent[0].y - headerContent[0].height;
      // 默认 16
      if (paddingBottom !== 16) {
        headerStyle.paddingBottom = `${Math.max(paddingBottom, 0)}px`;
      }
    }
  }

  return `<Dialog
      visible
      onConfirm={() => {}}
      onCancel={() => {}}
      ${title ? `title="${title}"` : ''}
      style={{ width: "${width}px", height: "${height}px" }}
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
      bodyStyle={{ padding: "0 0 16px 0" }}
    >
      ${childrenNodes}
    </Dialog>`;
};

export default Dialog;
