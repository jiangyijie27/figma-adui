import {reverseArr, stringifyStyle, styleObjectToTailwind} from './utils';

const Card = (props: IRenderProps) => {
  const {node, generate, additionalStyle = {}, useTailwind} = props;
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
      .map(o => generate(o, {useTailwind}))
      .join('');
  }

  let styleString = Object.keys(additionalStyle).length
    ? `style={${stringifyStyle(additionalStyle)}}`
    : '';

  if (useTailwind) {
    styleString = Object.keys(additionalStyle).length
      ? `className="${styleObjectToTailwind(additionalStyle)}"`
      : '';
  }

  const cardNodes = `
    <Card
      ${size ? `size="${size}"` : ''}
      ${styleString}
    >
      ${childrenNodes}
    </Card>
  `;

  return cardNodes;
};

export default Card;
