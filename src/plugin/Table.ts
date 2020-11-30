import {reverseArr, stringifyStyle} from './utils';

const Table = (
  node: SceneNode,
  generate: IGenerate,
  additionalStyle: IBaseObject
) => {
  let layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  if ('layoutMode' in node) {
    layoutMode = node.layoutMode;
  }
  let rowCount = 0;
  const columns: IBaseObject[] = [];
  const dataSourceObj: IBaseObject = {};
  let headerEmphasized = false;
  let selectMultiple = null;

  if (['卡片', '对话框'].includes(node.parent.name)) {
    additionalStyle.boxShadow =
      '0 1px 0 rgba(0, 0, 0, .08), 0 -1px 0 rgba(0, 0, 0, .08)';
  }

  if ('children' in node) {
    const columnsNode = node.children.filter(
      o => !['边框', '勾选'].includes(o.name) && o.visible
    );

    if (node.children.find(o => o.name === '勾选')?.visible) {
      selectMultiple = true;
    }

    /**
     * 判断几行的方法，是取一列的 children，看哪个 child 的 y > node.height，则说明自他开始，就被隐藏了
     */
    if (columnsNode[0] && 'children' in columnsNode[0]) {
      columnsNode[0].children.forEach((o, i) => {
        if (o.y > node.height && !rowCount) {
          rowCount = i - 1;
        }
      });
    }

    columnsNode.forEach((col, index) => {
      const columnObj: IBaseObject = {
        dataIndex: `data_${index}`,
      };

      if ('children' in col) {
        const theadNode = col.children[0];
        if (theadNode.layoutAlign === 'CENTER') {
          columnObj.align = 'center';
        }
        if ('children' in theadNode) {
          const theadInfoNode = theadNode.children.find(o =>
            ['文字 + 右图标', '表头 + 图标'].includes(o.name)
          );
          if (theadInfoNode && 'children' in theadInfoNode) {
            const titleNode =
              (theadInfoNode.children.find(
                o => o.type === 'TEXT'
              ) as TextNode) ||
              (theadNode.children.find(o => o.type === 'TEXT') as TextNode);

            if (titleNode) {
              columnObj.title = titleNode.characters;
              const fontName = titleNode.fontName as FontName;

              if (!headerEmphasized && fontName.style === 'Semibold') {
                headerEmphasized = true;
              }
            }

            const iconNode = theadInfoNode.children.find(
              o => o.name.includes('/') && o.visible
            );
            if (iconNode?.name.includes('filter')) {
              columnObj.filters = [
                {text: '分类 A', value: 1},
                {text: '分类 D', value: 2},
              ];
              columnObj.filterMultiple = false;
            } else if (iconNode?.name.includes('order')) {
              columnObj.sortOrder = '';
            }
          }
        }

        const firstTdNode = col.children[1];
        if (firstTdNode && 'children' in firstTdNode) {
          const {children} = firstTdNode;

          // 纯文字
          if (children.length === 1 && children[0].type === 'TEXT') {
            const firstChild = children[0] as TextNode;
            dataSourceObj[`data_${index}`] = firstChild.characters;
          }
          // 纯文字
          else if (
            children.length === 1 &&
            'children' in children[0] &&
            children[0].children.length === 1 &&
            children[0].children[0].type === 'TEXT'
          ) {
            const firstChild = children[0].children[0] as TextNode;
            dataSourceObj[`data_${index}`] = firstChild.characters;
          }
          // 单图
          else if (
            children.length === 1 &&
            'fills' in children[0] &&
            children[0].fills[0]
          ) {
            const fills = children[0].fills as Paint[];
            if (fills.find(o => o.type === 'IMAGE')) {
              const {cornerRadius, width, height} = children[0];
              dataSourceObj[
                `data_${index}`
              ] = `<img src='https://wxa.wxs.qq.com/images/preview/avatar-placeholder_40x40.png' style={{ width: '${width}px', height: '${height}px', ${
                cornerRadius ? `borderRadius: '${cornerRadius}px'` : ''
              } }} />`;
            } else {
              dataSourceObj[`data_${index}`] = `<div>${(layoutMode === 'NONE'
                ? reverseArr(children)
                : children
              )
                .map(o => generate(o))
                .join('')}</div>`;
            }
          } else {
            dataSourceObj[`data_${index}`] = `<div>${(layoutMode === 'NONE'
              ? reverseArr(children)
              : children
            )
              .map(o => generate(o))
              .join('')}</div>`;
          }
        }

        columns.push(columnObj);
      }
    });
  }

  const dataSource = Array.from(new Array(rowCount), (_, i) => ({
    key: i,
    ...dataSourceObj,
  }));

  const dataSourceString = JSON.stringify(dataSource)
    .replace(/  /g, '')
    .replace(/\\n ?/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/:"</g, ':<')
    .replace(/>"/g, '>')
    .replace(/{" "}/g, '')
    .replace(/ ?> ?/g, '>')
    .replace(/ ?< ?/g, '<');

  return `<Table
    dataSource={${dataSourceString}}
    verticalAlign="center"
    columns={${JSON.stringify(columns)}}
    getHeadCellStyle={(col, colIndex) =>
      !colIndex && { paddingLeft: "24px" }
    }
    getCellStyle={(row, col, rowIndex, colIndex) =>
      !colIndex && { paddingLeft: "24px" }
    }
    style={{ boxShadow: "0 1px 0 rgba(0, 0, 0, .08), 0 -1px 0 rgba(0, 0, 0, .08)" }}
    ${headerEmphasized ? 'headerEmphasized' : ''}
    ${
      Object.keys(additionalStyle).length
        ? `style={${stringifyStyle(additionalStyle)}}`
        : ''
    }
    ${
      selectMultiple !== null
        ? `
      selectMultiple={false}
      selectedRowKeys={[0]}
      onSelectChange={() => {}}
    `
        : ''
    }
  />`;
};

export default Table;
