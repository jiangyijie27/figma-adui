import {getValueFromNode, stringifyStyle} from './utils';

const RadioGroup = (
  node: SceneNode,
  generate: IGenerate,
  additionalClassNames: IBaseObject
) => {
  const size = getValueFromNode('尺寸', node);
  let childrenString = '';

  if ('children' in node) {
    const radios = node.children.filter(
      o =>
        // @ts-ignore
        ['勾选', '勾选状态'].includes(o.mainComponent?.parent?.name) &&
        o.visible
    );
    childrenString = radios.map(o => generate(o)).join('');
  }

  return `
    <Checkbox.Group
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalClassNames).length
          ? `style={${stringifyStyle(additionalClassNames)}}`
          : ''
      }
    >
      ${childrenString}
    </Checkbox.Group>
  `;
};

export default RadioGroup;
