const Popover = (popoverNode: SceneNode, str: string) => {
  const { name } = popoverNode
  const [placementStr, ...rest] = name.split(":")
  const placement = placementStr.split("-")[1]
  const popup = rest.join("")

  return `<Popover
      alignEdge={false}
      visible
      placement="${placement}"
      popup="${popup}"
    >${str}</Popover>`;
};

export default Popover;
