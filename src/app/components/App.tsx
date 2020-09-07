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
    codesString: '',
  };

  componentDidMount = () => {
    window.onmessage = (event: any) => {
      const {codes} = event.data.pluginMessage;
      try {
        this.setState({
          codesString: prettier
            .format(codes, {
              parser: 'babel',
              plugins: [parserBabel],
            })
            .slice(0, -2),
        });
      } catch (error) {
        console.log(error, "prettier error")
        this.setState({codesString: codes});
      }
    };
  };

  render() {
    const {codesString} = this.state;

    return (
      <div>
        <div style={{marginBottom: '8px', fontSize: '13px'}}>生成预览：</div>
        <JsxParser
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
          jsx={codesString.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ')}
        />
        <div style={{marginTop: '16px', marginBottom: '8px', fontSize: '13px'}}>
          React：
        </div>
        <Input.Textarea
          value={codesString}
          style={{width: '100%', height: '250px', fontFamily: 'SF Mono', fontSize: "12px"}}
        />
      </div>
    );
  }
}

export default App;
