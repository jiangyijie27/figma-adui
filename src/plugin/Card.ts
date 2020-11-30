import {reverseArr, stringifyStyle} from './utils';

const Card = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  const wrapperStyle: React.CSSProperties = {};
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  let layoutGrow: 0 | 1;
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  if ('layoutGrow' in node) {
    const {layoutGrow: lg} = node;
    layoutGrow = lg;
  }
  let size: TSize;
  let childrenNodes = '';

  if ('children' in node) {
    childrenNodes = (layoutMode === 'NONE'
      ? reverseArr(node.children)
      : node.children
    )
      .map(o => generate(o))
      .join('');
  }

  const {parent, width} = node;
  if (
    layoutGrow !== 1 &&
    (layoutMode === 'VERTICAL'
      ? node.counterAxisSizingMode === 'FIXED'
      : node.primaryAxisSizingMode === 'FIXED') &&
    ['HORIZONTAL', 'VERTICAL'].includes(parent.layoutMode)
  ) {
    wrapperStyle.flex = 'none';
    wrapperStyle.width = `${width}px`;
  }

  const cardNodes = `
    <Card
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenNodes}
    </Card>
  `;

  if (Object.keys(wrapperStyle).length) {
    return `<div
      style={${stringifyStyle(wrapperStyle)}}
    >
      ${cardNodes}
    </div>`;
  }

  return cardNodes;
};

export default Card;
