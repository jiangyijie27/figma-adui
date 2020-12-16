/* eslint-disable */
// @ts-nocheck
import * as React from 'react';
import JsxParser from 'react-jsx-parser';
import {
  Affix,
  Alert,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  ColorPicker,
  ConfigProvider,
  DatePicker,
  Dialog,
  Drawer,
  Form,
  Grid,
  Icon,
  Input,
  Layout,
  Menu,
  Message,
  Motion,
  Nav,
  NumericInput,
  Pagination,
  Popconfirm,
  Popover,
  PopTrigger,
  Radio,
  ResizeObserver,
  Select,
  Slider,
  Spinner,
  Suggest,
  Switch,
  Tabs,
  Table,
  Tag,
  TimePicker,
  Tooltip,
  TreeSelect,
  Upload,
} from 'adui';

import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babylon';
import parseCSS from 'prettier/parser-postcss';

declare function require(path: string): any;

class App extends React.Component {
  state = {
    codes_inline_original: '',
    codes_inline: '',
    codes_react_original: '',
    codes_react: '',
    codes_css: '',
    zoom: 1,
    height: '700',
    useClassName: true,
  };

  componentDidMount = () => {
    window.onmessage = (event: any) => {
      const {codes_inline, codes_react, codes_css} = event.data.pluginMessage;
      try {
        this.setState({
          codes_inline_original: codes_inline,
          codes_inline: prettier
            .format(codes_inline, {
              parser: 'babel',
              plugins: [parserBabel],
            })
            .slice(0, -2),
          codes_react_original: codes_react,
          codes_react: prettier
            .format(codes_react, {
              parser: 'babel',
              plugins: [parserBabel],
            })
            .slice(0, -2),
          codes_css: prettier.format(codes_css, {
            parser: 'css',
            plugins: [parseCSS],
          }),
        });
      } catch (error) {
        console.log(error, 'prettier error');
        this.setState({
          codes_inline_original: codes_inline,
          codes_inline,
          codes_react_original: codes_react,
          codes_react,
          codes_css,
        });
      }
    };
    window.addEventListener('click', e => {
      if (
        [...(e.target?.classList || [])].includes('adui-dialog-close') ||
        [...(e.target.parentNode?.classList || [])].includes(
          'adui-dialog-close'
        )
      ) {
        const dialog = document.getElementsByClassName(
          'adui-dialog-wrapper'
        )[0];
        dialog.style.display = 'none';
      }
    });
  };

  render() {
    const {
      activeIndex,
      codes_inline_original,
      codes_inline,
      codes_react_original,
      codes_react,
      codes_css,
      zoom,
      height,
      useClassName,
    } = this.state;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '13px',
          }}
        >
          <Button.Group size="mini">
            {[0.25, 0.5, 1].map(o => (
              <Button
                key={o}
                active={zoom === o}
                onClick={() => {
                  this.setState({zoom: o});
                }}
              >
                {o}x
              </Button>
            ))}
          </Button.Group>
          <Button
            size="mini"
            intent="primary"
            onClick={() => {
              parent.postMessage({pluginMessage: {type: 'generate'}}, '*');
            }}
          >
            生成代码
          </Button>
        </div>
        <div
          style={{
            padding: '40px',
            overflow: 'auto',
            resize: 'both',
            backgroundColor: '#e5e5e5',
            border: '1px solid #eee',
          }}
        >
          <div style={{zoom}}>
            <JsxParser
              ref={cpn => (this.parser = cpn)}
              components={{
                Affix,
                Alert,
                Breadcrumb,
                Button,
                Card,
                Checkbox,
                ColorPicker,
                ConfigProvider,
                DatePicker,
                Dialog,
                Drawer,
                Form,
                Grid,
                Icon,
                Input,
                Layout,
                Menu,
                Message,
                Motion,
                Nav,
                NumericInput,
                Pagination,
                Popconfirm,
                Popover,
                PopTrigger,
                Radio,
                ResizeObserver,
                Select,
                Slider,
                Spinner,
                Suggest,
                Switch,
                Tabs,
                Table,
                Tag,
                TimePicker,
                Tooltip,
                TreeSelect,
                Upload,
              }}
              jsx={codes_inline_original
                .replace(/(\r\n|\n|\r)/gm, '')
                .replace(/\s+/g, ' ')}
            />
          </div>
        </div>
        <Button.Group
          size="mini"
          style={{marginTop: '16px', marginBottom: '8px'}}
        >
          <Button
            active={useClassName}
            onClick={() => {
              this.setState({useClassName: true});
            }}
          >
            React + 类名
          </Button>
          <Button
            active={!useClassName}
            onClick={() => {
              this.setState({useClassName: false});
            }}
          >
            React + 内联样式
          </Button>
        </Button.Group>
        <div style={{fontSize: '12px', lineHeight: '28px'}}>React 代码：</div>
        <Input.Textarea
          value={useClassName ? codes_react : codes_inline}
          className="app-textarea"
          style={{
            width: '100%',
            height: '250px',
            fontFamily: 'SF Mono',
            fontSize: '12px!important',
          }}
          resize="vertical"
        />
        {useClassName && (
          <>
            <div style={{fontSize: '12px', lineHeight: '28px'}}>CSS 代码：</div>
            <Input.Textarea
              value={codes_css}
              className="app-textarea"
              style={{
                width: '100%',
                height: '250px',
                fontFamily: 'SF Mono',
                fontSize: '12px!important',
              }}
              resize="vertical"
            />
          </>
        )}
        <div style={{marginTop: '16px', marginBottom: '8px', fontSize: '12px'}}>
          调整视窗大小：
        </div>
        <Input
          size="mini"
          placeholder="调整视窗大小"
          style={{height: '30px'}}
          value={height}
          onChange={(_, val) => {
            this.setState({height: val});
          }}
          onPressEnter={() => {
            parent.postMessage({pluginMessage: {type: 'resize', height}}, '*');
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `.adui-dialog-inner { transform: scale(${zoom}); }`,
          }}
        />
      </div>
    );
  }
}

export default App;
