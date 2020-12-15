import {getValueFromNode, stringifyStyle} from './utils';

const Upload = (node: SceneNode, additionalStyle: IBaseObject) => {
  const type = getValueFromNode('类型', node);
  const status = getValueFromNode('状态', node);
  additionalStyle.width = `${node.width}px`;
  additionalStyle.height = `${node.height}px`;

  if (type === '图片') {
    const src = status === '常态' ? "" : `https://source.unsplash.com/random/${node.width}x${node.height}?nature`
    return `
    <Upload.Img
      src='${src}'
      onIconClick={() => {}}
      onUpload={() => {}}
      ${
        Object.keys(additionalStyle).length
          ? `style={${stringifyStyle(additionalStyle)}}`
          : ''
      }
      />
    `;
  }
};

export default Upload;
