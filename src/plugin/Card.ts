import {reverseArr, stringifyStyle} from './utils';

const Card = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let size: TSize;
  let childrenNodes = '';

  if ('children' in node) {
    childrenNodes = reverseArr(node.children)
      .map(o => generate(o))
      .join('');
  }

  return `
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
};

export default Card;
