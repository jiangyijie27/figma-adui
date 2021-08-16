import {reverseArr} from './utils';

const FormItem = (props: IRenderProps) => {
  const {node, generate, additionalClassNames = []} = props;
  additionalClassNames.push('mb-0');

  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  let label = '';
  let labelHelper = '';
  let controlNode: SceneNode[];
  if ('children' in node) {
    const labelNode = node.children.find(
      o => o.name === '表单-label'
    ) as TextNode;
    const helperNode = node.children.find(o => o.name === '反馈/help-circle');
    if (labelNode) {
      label = labelNode.characters;
      if (labelNode.x > 0) {
        additionalClassNames.push(`ml-${labelNode.x}`);
      }
    }
    if (helperNode) {
      labelHelper = '表单说明';
    }
    controlNode = node.children.filter(
      o => !['表单-label', '反馈/help-circle'].includes(o.name)
    );
  }

  let classNameString = '';

  if (additionalClassNames.length) {
    classNameString = `className="${additionalClassNames.join(' ')}"`;
  }

  return `
    <Form.Item
      ${label ? `label="${label}"` : ''}
      ${labelHelper ? `labelHelper="${labelHelper}"` : ''}
      ${classNameString}
    >
      ${(layoutMode === 'NONE' ? reverseArr(controlNode) : controlNode)
        .map(o => generate(o))
        .join('')}
    </Form.Item>
  `;
};

export default FormItem;
