/* eslint-disable */
// @ts-nocheck
import * as React from 'react';
import JsxParser from 'react-jsx-parser';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
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
    codes_tailwind_original: '',
    codes_tailwind: '',
    zoom: 1,
    height: '1200',
    useType: 'tailwind',
    copied: false,
  };

  timer = 0;

  handleCopy = () => {
    this.textArea.select();
    document.execCommand('copy');
    this.setState({copied: true});
  };

  handleMouseEnter = () => {
    clearTimeout(this.timer);
  };

  handleMouseLeave = () => {
    this.timer = setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 1000);
  };

  componentDidMount = () => {
    window.onmessage = (event: any) => {
      const {
        codes_inline,
        codes_react,
        codes_tailwind,
      } = event.data.pluginMessage;
      try {
        this.setState({
          codes_inline_original: codes_inline,
          codes_inline: prettier
            .format(codes_inline, {
              parser: 'babel',
              plugins: [parserBabel],
            })
            .slice(0, -2),
          codes_tailwind_original: codes_tailwind,
          codes_tailwind: prettier
            .format(codes_tailwind, {
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
        });
      } catch (error) {
        console.log(error, 'prettier error');
        this.setState({
          codes_inline_original: codes_inline,
          codes_inline,
          codes_react_original: codes_react,
          codes_react,
          codes_tailwind_original: codes_tailwind,
          codes_tailwind,
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
      codes_tailwind_original,
      codes_tailwind,
      zoom,
      height,
      useType,
      copied,
    } = this.state;

    const value =
      useType === 'tailwind'
        ? codes_tailwind
        : useType === 'class'
        ? codes_react
        : codes_inline;

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
            backgroundColor: '#fafafa',
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
            active={useType === 'tailwind'}
            onClick={() => {
              this.setState({useType: 'tailwind'});
            }}
          >
            TailwindCSS
          </Button>
          <Button
            active={useType === 'inline'}
            onClick={() => {
              this.setState({useType: 'inline'});
            }}
          >
            InlineStyle
          </Button>
        </Button.Group>
        <div className="codesWrapper">
          <SyntaxHighlighter
            wrapLines
            customStyle={{backgroundColor: 'transparent'}}
            linenumberstyle={{color: '#bab6b6'}}
            className="highlight"
            language="jsx"
          >
            {value}
          </SyntaxHighlighter>
          <textarea
            ref={textarea => {
              this.textArea = textarea;
            }}
            value={value}
            readOnly
            style={{
              position: 'absolute',
              top: '-9999px',
            }}
          />
          <Button
            className="copyBtn"
            leftIcon={copied ? 'tick-circle' : 'copy-outlined'}
            intent={copied ? 'primary' : 'normal'}
            theme="light"
            onClick={this.handleCopy}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            {copied ? '已复制' : '复制代码'}
          </Button>
        </div>
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
