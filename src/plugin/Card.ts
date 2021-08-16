import {reverseArr} from './utils';

const Card = (props: IRenderProps) => {
  const {node, generate, additionalClassNames = []} = props;
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
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

  let classNameString = '';

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  const cardNodes = `
    <Card
      ${size ? `size="${size}"` : ''}
      ${classNameString}
    >
      ${childrenNodes}
    </Card>
  `;

  return cardNodes;
};

export default Card;
