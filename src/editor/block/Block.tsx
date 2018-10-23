import * as React from "react";
import {ClientConnection} from "../../common/connect/ClientConnection";
import {DataMap} from "../../common/util/Types";
import {DataRendererItem, PureDataRenderer} from "../../ui/component/DataRenderer";
import {TIcon} from "../icon/Icon";
import {FunctionDesc} from "../../common/block/Descriptor";
import {compareArray} from "../../common/util/Compare";


export interface Stage {
  _blocks: Map<string, BlockItem>;
  _links: Map<string, LinkItem>;
  _fields: Map<string, FieldItem>;
}

export class FieldItem extends DataRendererItem {
  block: BlockItem;
  name: string;
  key: string;
  isInput: boolean;
  isOutput: boolean;
  outLink: LinkItem;
  inLink: LinkItem;
  bindBlock?: BlockItem;

  conn() {
    return this.block.conn;
  }


  constructor(block: BlockItem, name: string) {
    super();
    this.name = name;
    this.block = block;
    this.key = `${block.key}.name`;
  }

  render(): React.ReactNode {
    return <FieldView item={this}/>;
  }
}

export class LinkItem {
  fromProp: FieldItem;
  toProp: FieldItem;
}

export class BlockItem extends DataRendererItem {
  conn: ClientConnection;
  x: number = 0;
  y: number = 0;
  w: number = 0;
  key: string;
  name: string;
  fields: string[] = [];
  fieldItems: Map<string, FieldItem> = new Map<string, FieldItem>();
  selected: boolean = false;

  constructor(connection: ClientConnection, key: string) {
    super();
    this.conn = connection;
    this.key = key;
    this.name = key.substr(key.indexOf('.') + 1);
  }

  setXYW(x: number, y: number, w: number) {
    if (x !== this.x || y !== this.y || w !== this.y) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.updateFieldPosition();
      this._renderer.forceUpdate();
    }
  }

  setP(fields: string[]) {
    if (!compareArray(fields, this.fields)) {
      for (let f of this.fields) {
        if (!fields.includes(f)) {
          this.fieldItems.delete(f);
        }
      }
      this.fields = fields;
      for (let f of fields) {
        if (!this.fieldItems.has(f)) {
          this.fieldItems.set(f, new FieldItem(this, f));
        }
      }
      this.updateFieldPosition();
      this._renderer.forceUpdate();
    }
  }

  updateFieldPosition() {

  }

  render(): React.ReactNode[] {
    let result: React.ReactNode[] = [];
    for (let field of this.fields) {
      result.push(this.fieldItems.get(field).render());
    }
    return result;
  }
}

interface FieldViewProps {
  item: FieldItem;
}

interface FieldViewState {

}


export class FieldView extends PureDataRenderer<FieldViewProps, FieldViewState> {
  listener = {
    onUpdate: (response: DataMap) => {
      let {value} = response;
      let {item} = this.props;

    }
  };

  constructor(props: FieldViewProps) {
    super(props);
    this.state = {funcDesc: defaultFuncDesc};
    let {item} = props;
    item.conn().subscribe(item.key, this.listener);

  }

  render(): React.ReactNode {
    return <div className='ticl-block-row'/>;
  }
}


interface BlockViewProps {
  item: BlockItem;
}

interface BlockViewState {
  funcDesc: FunctionDesc;
}

const defaultFuncDesc = {
  id: '',
  icon: ''
};


export class BlockView extends PureDataRenderer<BlockViewProps, BlockViewState> {
  isListener = {
    onUpdate: (response: DataMap) => {
      let {value} = response;
      let {item} = this.props;
      if (typeof value === 'string') {
        item.conn.watchDesc(value, this.descListener);
      }
    }
  };
  xywListener = {
    onUpdate: (response: DataMap) => {
      let {value} = response;
      let {item} = this.props;
      if (Array.isArray(value)) {
        item.setXYW(...value as [number, number, number]);
      }
    }
  };
  pListener = {
    onUpdate: (response: DataMap) => {
      if (Array.isArray(response.value)) {
        this.props.item.setP(response.value);
      }
    }
  };
  descListener = (funcDesc: FunctionDesc) => {
    if (funcDesc) {
      this.setState({funcDesc});
    } else {
      this.setState({funcDesc: defaultFuncDesc});
    }
  };

  constructor(props: BlockViewProps) {
    super(props);
    this.state = {funcDesc: defaultFuncDesc};
    let {item} = props;
    item.conn.subscribe(`${item.key}.#is`, this.isListener);
    item.conn.subscribe(`${item.key}.@b-xyw`, this.xywListener);
    item.conn.subscribe(`${item.key}.@b-p`, this.pListener);
  }

  getFuncStyle(): string {
    let {style, priority} = this.state.funcDesc;
    if (style) {
      return 'ticl-block-pr' + style.substr(0, 1);
    }
    if (priority > -1) {
      return 'ticl-block-pr' + priority;
    }
    return '';
  }

  render() {
    let {item} = this.props;
    let {funcDesc} = this.state;
    return (
      <div
        className={`ticl-block ${this.getFuncStyle()}${item.selected ? ' ticl-block-selected' : ''}`}
        style={{top: item.y, left: item.x, width: item.w}}
      >
        <div className='ticl-block-head'>
          <TIcon icon={funcDesc.icon}/>
          {item.name}
        </div>
        <div className='ticl-block-body'>
          {item.render()}
        </div>
        <div className='ticl-block-foot'/>
      </div>
    );
  }

  componentWillUnmount() {
    let {item} = this.props;
    item.conn.unsubscribe(`${item.key}.#is`, this.isListener);
    item.conn.unsubscribe(`${item.key}.@b-xyw`, this.xywListener);
    item.conn.unsubscribe(`${item.key}.@b-p`, this.pListener);
    item.conn.unwatchDesc(this.descListener);
  }
}
