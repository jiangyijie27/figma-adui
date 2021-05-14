import {reverseArr, stringifyStyle, styleObjectToTailwind} from './utils';

const FormItem = (props: IRenderProps) => {
  const {node, generate, additionalStyle = {}, useTailwind} = props;
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
        additionalStyle.marginLeft = `${labelNode.x}px`;
      }
    }
    if (helperNode) {
      labelHelper = '表单说明';
    }
    controlNode = node.children.filter(
      o => !['表单-label', '反馈/help-circle'].includes(o.name)
    );
  }

  if (!additionalStyle.marginBottom) {
    additionalStyle.marginBottom = 0;
  }

  let styleString = Object.keys(additionalStyle).length
    ? `style={${stringifyStyle(additionalStyle)}}`
    : '';

  if (useTailwind) {
    styleString = Object.keys(additionalStyle).length
      ? `className="${styleObjectToTailwind(additionalStyle)}"`
      : '';
  }

  return `
    <Form.Item
      ${label ? `label="${label}"` : ''}
      ${labelHelper ? `labelHelper="${labelHelper}"` : ''}
      ${styleString}
    >
      ${(layoutMode === 'NONE' ? reverseArr(controlNode) : controlNode)
        .map(o => generate(o, {useTailwind}))
        .join('')}
    </Form.Item>
  `;
};

export default FormItem;
