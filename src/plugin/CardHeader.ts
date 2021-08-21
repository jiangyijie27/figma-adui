import {reverseArr} from './utils';
const CardHeader = (props: IRenderProps) => {
  const {node, generate, additionalClassNames = []} = props;
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  let title = '';
  let subTitle = '';
  let topContent = '';
  let childString = '';
  if ('children' in node) {
    const {children} = node;
    const titleChild = children.find(
      ({type, name, fontSize, fontName}: any) =>
        type === 'TEXT' &&
        (name === 'title' || (fontSize === 14 && fontName.style === 'Semibold'))
    ) as TextNode;
    const subTitleChild = children.find(
      ({type, name, fontSize, fontName}: any) =>
        type === 'TEXT' &&
        (name === 'subTitle' ||
          (fontSize === 13 && fontName.style === 'Regular'))
    ) as TextNode;
    const topContentChild = children.find((o: any) => o.name === '卡片-top');
    if (titleChild) {
      title = titleChild.characters;
    }
    if (subTitleChild) {
      subTitle = subTitleChild.characters;
    }
    if (topContentChild && 'children' in topContentChild) {
      topContent = generate(topContentChild);
    }

    const childs = node.children.filter(o => {
      return (
        titleChild?.id !== o.id &&
        subTitleChild?.id !== o.id &&
        topContentChild?.id !== o.id
      );
    });

    childString = (layoutMode === 'NONE' ? reverseArr(childs) : childs)
      .map(o => generate(o))
      .join('');
  }

  if ('effects' in node && node.effects.length) {
    additionalClassNames.push('shadow-b-tp-gray-100');
  }

  /**
   * 如果没有 paddingBottom，则要加 pb-0，因为 cardHeader 默认有 paddingBottom
   */
  const pbFound = additionalClassNames.find(
    o => o.includes('py-') || o.includes('pb-')
  );
  if (!pbFound) {
    additionalClassNames.unshift('pb-0');
  }

  let classNameString = '';

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
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
      ${classNameString}
      ${
        childString
          ? `
        >
          ${childString}
        </Card.Header>
      `
          : '/>'
      }
  `;
};

export default CardHeader;
