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

declare function require(path: string): any;

class App extends React.Component {
  state = {
    codesStringOriginal: '',
    codesString: '',
  };

  componentDidMount = () => {
    window.onmessage = (event: any) => {
      const {codes} = event.data.pluginMessage;
      try {
        this.setState({
          codesStringOriginal: codes,
          codesString: prettier
            .format(codes, {
              parser: 'babel',
              plugins: [parserBabel],
            })
            .slice(0, -2),
        });
      } catch (error) {
        console.log(error, 'prettier error');
        this.setState({codesString: codes, codesStringOriginal: codes});
      }
    };

    window.addEventListener('click', e => {
      if (
        [...e.target.classList].includes('adui-dialog-close') ||
        [...e.target.parentNode?.classList].includes('adui-dialog-close')
      ) {
        const dialog = document.getElementsByClassName(
          'adui-dialog-wrapper'
        )[0];
        dialog.style.display = 'none';
      }
    });
  };

  render() {
    const {activeIndex, codesString, codesStringOriginal} = this.state;

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
          <Button
            style={{marginRight: '8px'}}
            onClick={() => {
              parent.postMessage({pluginMessage: {type: 'order'}}, '*');
            }}
          >
            调整图层顺序
          </Button>
          <Button
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
            padding: '8px',
            overflow: 'auto',
            resize: 'both',
            border: '1px solid #eee',
          }}
        >
          <div style={{transform: 'scale(0.9)'}}>
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
              jsx={codesStringOriginal
                .replace(/(\r\n|\n|\r)/gm, '')
                .replace(/\s+/g, ' ')}
            />
          </div>
        </div>
        <div style={{marginTop: '16px', marginBottom: '8px', fontSize: '13px'}}>
          React：
        </div>
        <Input.Textarea
          value={codesString}
          style={{
            width: '100%',
            height: '250px',
            fontFamily: 'SF Mono',
            fontSize: '12px!important',
          }}
          resize="vertical"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `.adui-dialog-inner { transform: scale(0.8); }`,
          }}
        />
      </div>
    );
  }
}

export default App;
