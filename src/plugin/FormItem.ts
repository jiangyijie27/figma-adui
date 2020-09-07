import {reverseArr} from './utils';

const FormItem = (node: SceneNode, generate: IGenerate) => {
  let label = '';
  let labelHelper = '';
  let controlNode: SceneNode[];
  if ('children' in node) {
    const labelNode = node.children.find(
      o => o.name === '表单-label'
    ) as TextNode;
    const helperNode = node.children.find(
      o => o.name === '反馈  / help-circle'
    );
    if (labelNode) {
      label = labelNode.characters;
    }
    if (helperNode) {
      labelHelper = '表单说明';
    }
    controlNode = node.children.filter(
      o => !['表单-label', '反馈  / help-circle'].includes(o.name)
    );
  }

  return `
    <Form.Item
      ${label ? `label="${label}"` : ''}
      ${labelHelper ? `labelHelper="${labelHelper}"` : ''}
    >
      ${reverseArr(controlNode)
        .map(o => generate(o))
        .join('')}
    </Form.Item>
  `;
};

export default FormItem;
