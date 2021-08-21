import {getValueFromNode} from './utils';

const Tabs = (node: SceneNode) => {
  let size = getValueFromNode('尺寸', node);
  let childrenNodes = '';
  let defaultValue = '';

  if ('children' in node) {
    const children = node.children.filter(
      o => o.visible && o.name.includes('页签')
    );

    childrenNodes = children
      .map(o => {
        const active = getValueFromNode('选中', o) === 'on';
        const disabled = getValueFromNode('禁用', o) === 'on';

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
    >
      ${childrenNodes}
    </Tabs>
  `;
};

export default Tabs;
