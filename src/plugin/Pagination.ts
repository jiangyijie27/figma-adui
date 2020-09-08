import {getSize} from './utils';

const Pagination = (node: SceneNode) => {
  const {name} = node;
  const size = getSize(node);
  let showButtonJumper = true;
  let showInputJumper = false;
  let theme: TTheme = null;

  let mainComponent: ComponentNode;
  if ('mainComponent' in node.parent) {
    mainComponent = node.parent.mainComponent;
  }

  if (name.includes('轻量') || mainComponent?.name.includes('轻量')) {
    theme = 'light';
  }

  if ('children' in node) {
    const found = node.children.find(o => o.name === '分页器');
    if (found && 'children' in found) {
      const btns = found.children.filter(({visible}) => !visible);
      if (btns.length || found.children.length === 1) {
        showButtonJumper = false
      }
    }

    const input = node.children.find(o => o.name === "快捷跳转")
    if (input?.visible) {
      showInputJumper = true
    }
  }

  return `
    <Pagination
      defaultCurrent={1}
      pageSize={10}
      ${showButtonJumper ? `showButtonJumper` : ''}
      ${showInputJumper ? `showInputJumper` : ''}
      ${size ? `size="${size}"` : ''}
      ${theme ? `theme="${theme}"` : ''}
      total={99}
    />
  `;
};

export default Pagination;