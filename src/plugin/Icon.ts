import {convertColorToCSS, stringifyStyle} from './utils';

const Icon = (node: SceneNode, additionalClassNames: IBaseObject) => {
  let {width} = node;
  width = Math.round(width);
  let mainComponent: ComponentNode;
  if ('mainComponent' in node) {
    mainComponent = node.mainComponent;
  }

  let children: readonly VectorNode[];
  let color: string;

  if ('children' in node) {
    children = node.children as VectorNode[];
  }

  if (
    children.length &&
    children[0].fills &&
    Array.isArray(children[0].fills) &&
    children[0].fills.length === 1 &&
    children[0].fills[0].type === 'SOLID'
  ) {
    color = convertColorToCSS(children[0].fills[0]);
  }

  const name = mainComponent?.name.split('/')[1];

  if (!name) {
    return '';
  }

  return `
    <Icon
      icon="${name.trim()}"
      ${width !== 18 ? `size={${width}}` : ''}
      ${color ? `color="${color}"` : ''}
      ${
        Object.keys(additionalClassNames).length
          ? `style={${stringifyStyle(additionalClassNames)}}`
          : ''
      }
    />
  `;
};

export default Icon;
