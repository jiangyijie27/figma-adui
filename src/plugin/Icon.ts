import {
  convertNumToPx,
  convertColorToCSS,
  toCamelCase,
  stringifyStyle,
} from './utils';

const Icon = (node: SceneNode, additionalStyle: IBaseObject) => {
  const {width} = node;
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

  delete additionalStyle.display;

  if (!name) {
    return '';
  }

  return `
    <Icon
      icon="${name}"
      ${width !== 18 ? `size={${width}}` : ''}
      ${color ? `color="${color}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    />
  `;
};

export default Icon;
