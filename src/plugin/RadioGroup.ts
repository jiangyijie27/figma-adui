import {getValueFromNode, stringifyStyle} from './utils';

const RadioGroup = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  const size = getValueFromNode('尺寸', node);
  let childrenString = '';

  if ('children' in node) {
    const radios = node.children.filter(
      o =>
        // @ts-ignore
        ['单选', '单选状态'].includes(o.mainComponent?.parent?.name) &&
        o.visible
    );
    childrenString = radios.map(o => generate(o)).join('');
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
