import {
  reverseArr,
  getChecked,
  getDisabled,
  getSize,
  stringifyStyle,
} from './utils';

const Tabs = (node: SceneNode, additionalStyle: IBaseObject) => {
  let size: TSize;
  let childrenNodes = '';
  let defaultValue = '';

  if ('children' in node) {
    const children = node.children.filter(
      o => o.visible && o.name.includes('导航页签/')
    );

    childrenNodes = children
      .map(o => {
        const disabled = getDisabled(o);
        const checked = getChecked(o);
        let title = '';
        if ('children' in o) {
          const textNode = o.children.find(p => p.type === 'TEXT') as TextNode;
          if (!size) {
            size = getSize(textNode);
          }
          title = textNode?.characters;
          if (!defaultValue && checked) {
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
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
    >
      ${childrenNodes}
    </Tabs>
  `;
};

export default Tabs;
