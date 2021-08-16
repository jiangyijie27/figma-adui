const ButtonGroup = (props: IRenderProps) => {
  const {node, generate} = props;

  let childrenCodes = '';
  if ('children' in node) {
    const {children} = node;
    childrenCodes = children.map(o => generate(o)).join('\n');
  }
  return `
    <Button.Group>
      ${childrenCodes}
    </Button.Group>
  `;
};

export default ButtonGroup;
