import {getValueFromNode, stringifyStyle} from './utils';

const Upload = (node: SceneNode, additionalClassNames: IBaseObject) => {
  const type = getValueFromNode('类型', node);
  const status = getValueFromNode('状态', node);
  additionalClassNames.width = `${node.width}px`;
  additionalClassNames.height = `${node.height}px`;

  if (type === '图片') {
    const src =
      status === '常态'
        ? ''
        : `https://source.unsplash.com/random/${node.width}x${node.height}?nature`;
    return `
    <Upload.Img
      src='${src}'
      onIconClick={() => {}}
      onUpload={() => {}}
      ${
        Object.keys(additionalClassNames).length
          ? `style={${stringifyStyle(additionalClassNames)}}`
          : ''
      }
      />
    `;
  }
};

export default Upload;
