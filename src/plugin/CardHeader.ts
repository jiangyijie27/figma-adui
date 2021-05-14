import {reverseArr, stringifyStyle, styleObjectToTailwind} from './utils';
const CardHeader = (props: IRenderProps) => {
  const {node, generate, additionalStyle = {}, useTailwind} = props;
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
      topContent = generate(topContentChild, {useTailwind});
    }

    const childs = node.children.filter(o => {
      return (
        titleChild?.id !== o.id &&
        subTitleChild?.id !== o.id &&
        topContentChild?.id !== o.id
      );
    });

    childString = (layoutMode === 'NONE' ? reverseArr(childs) : childs)
      .map(o => generate(o, {useTailwind}))
      .join('');
  }

  if ('effects' in node && node.effects.length) {
    additionalStyle.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.06)';
  }

  let styleString = Object.keys(additionalStyle).length
    ? `style={${stringifyStyle(additionalStyle)}}`
    : '';

  if (useTailwind) {
    styleString = Object.keys(additionalStyle).length
      ? `className="${styleObjectToTailwind(additionalStyle)}"`
      : '';
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
      ${styleString}
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
