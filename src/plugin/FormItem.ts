import {reverseArr, stringifyStyle} from './utils';

const FormItem = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
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
      if (labelNode.x > 0) {
        additionalStyle.marginLeft = `${labelNode.x}px`;
      }
    }
    if (helperNode) {
      labelHelper = '表单说明';
    }
    controlNode = node.children.filter(
      o => !['表单-label', '反馈  / help-circle'].includes(o.name)
    );
  }

  delete additionalStyle.display;

  if (!additionalStyle.marginBottom) {
    additionalStyle.marginBottom = 0
  }

  return `
    <Form.Item
      ${label ? `label="${label}"` : ''}
      ${labelHelper ? `labelHelper="${labelHelper}"` : ''}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${reverseArr(controlNode)
        .map(o => generate(o))
        .join('')}
    </Form.Item>
  `;
};

export default FormItem;
