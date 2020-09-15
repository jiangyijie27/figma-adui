import {stringifyStyle} from './utils';
const CardHeader = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let title = '';
  let subTitle = '';
  let topContent = '';
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
    const topContentChild = children.find((o: any) => o.name === 'topContent');
    if (titleChild) {
      title = titleChild.characters;
    }
    if (subTitleChild) {
      subTitle = subTitleChild.characters;
    }
    if (topContentChild && "children" in topContentChild) {
      topContent = `${topContentChild.children
        .map((o: SceneNode) => generate(o))
        .join('')}`;
    }
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
    ></Card.Header>`;
};

export default CardHeader;
