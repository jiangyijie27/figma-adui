import {getValueFromNode, stringifyStyle} from './utils';

const Tabs = (node: SceneNode, additionalClassNames: IBaseObject) => {
  let size = getValueFromNode('尺寸', node);
  let childrenNodes = '';
  let defaultValue = '';

  if ('children' in node) {
    const children = node.children.filter(
      o => o.visible && o.name.includes('页签')
    );

    childrenNodes = children
      .map(o => {
        let active = false;
        let disabled = false;
        const status = getValueFromNode('状态', o);
        switch (status) {
          case '选中':
            active = true;
            break;
          case '禁用':
            disabled = true;
            break;
          default:
        }

        let title = '';
        if ('children' in o) {
          const textNode = o.children.find(p => p.type === 'TEXT') as TextNode;
          if (!size) {
            const childSize = getValueFromNode('尺寸', o);
            size = childSize;
          }
          title = textNode?.characters;
          if (!defaultValue && active) {
            defaultValue = title;
          }
        }
        return `
          <Tabs.Tab
            ${disabled ? 'disabled' : ''}
            title="${title}"
            value="${title}"
          />
        `;
      })
      .join('');
  }

  return `
    <Tabs
      defaultValue="${defaultValue}"
      ${size ? `size="${size}"` : ''}
      ${
        Object.keys(additionalClassNames).length
          ? `style={${stringifyStyle(additionalClassNames)}}`
          : ''
      }
    >
      ${childrenNodes}
    </Tabs>
  `;
};

export default Tabs;
