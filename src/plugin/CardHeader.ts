import {getPadding, reverseArr, stringifyStyle} from './utils';
const CardHeader = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
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

    childString = (layoutMode === "NONE" ? reverseArr(childs) : childs)
      .map(o => generate(o))
      .join('');
  }

  const padding = getPadding(node);
  if (padding !== '16px 16px 20px 24px') {
    additionalStyle.padding = padding;
  }

  if ('effects' in node && node.effects.length) {
    additionalStyle.boxShadow = 'rgba(0, 0, 0, 0.06) 0 1px 0 0';
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
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
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
