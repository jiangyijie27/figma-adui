import {getSize, stringifyStyle} from './utils';

const RadioGroup = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let size: TSize;
  let childrenString = '';

  if ('children' in node) {
    const {children} = node;
    let mainComponent: ComponentNode;
    if ('mainComponent' in node) {
      mainComponent = node.mainComponent;
    }
    const radios = children.filter(
      o =>
        (o.name.includes('选项') ||
          o.name.includes('单选/') ||
          mainComponent?.name.includes('单选/')) &&
        o.visible
    );
    childrenString = radios.map(o => generate(o)).join('');

    if (radios.length) {
      const firstRadio = radios[0];
      if ('children' in firstRadio) {
        const radioTextNode = firstRadio.children.find(
          o => o.type === 'TEXT'
        ) as TextNode;
        if (radioTextNode) {
          size = getSize(radioTextNode);
        }
      }
    }
  }

  return `
    <Radio.Group
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenString}
    </Radio.Group>
  `;
};

export default RadioGroup;
