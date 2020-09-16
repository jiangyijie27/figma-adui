import {reverseArr, stringifyStyle} from './utils';
const CardHeader = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
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
      topContent = `${topContentChild.children
        .map((o: SceneNode) => generate(o))
        .join('')}`;
    }

    childString = reverseArr(
      node.children.filter(o => {
        return (
          titleChild?.id !== o.id &&
          subTitleChild?.id !== o.id &&
          topContentChild?.id !== o.id
        );
      })
    )
      .map(o => generate(o))
      .join('');
  }

  additionalStyle.paddingLeft = 0

  delete additionalStyle.display;

  return `<Card.Header
      ${title ? `title={<div style={{ paddingLeft: "24px" }}>${title}</div>}` : ''}
      ${subTitle ? `subTitle={<div style={{ paddingLeft: "24px" }}>${subTitle}</div>}` : ''}
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
