import {BlockIO, BlockProperty} from "./BlockProperty";
import {FunctionDesc} from "./Descriptor";
import {BlockMode, Block} from "./Block";
import {Event, EventType} from "./Event";

export interface FunctionOutput {
  // field is 'output' by default
  output(value: any, field?: string): void;
}

export interface FunctionInput {

  getValue(field: string): any;

  getLength(): number;
}

export interface FunctionData extends FunctionInput, FunctionOutput {
  // get the property when it's a block, otherwise return null
  getProperty(field: string, create: boolean): BlockProperty;
}

export class BaseFunction {
  _data: FunctionData;
  priority: 0 | 1 | 2 | 3;
  defaultMode: BlockMode;
  useLength: boolean;

  constructor(block?: FunctionData) {
    this._data = block;
  }

  // return true when it needs to be put in queue
  inputChanged(input: BlockIO, val: any): boolean {
    return true;
  }

  // return stream output
  run(): any {
    // to be overridden
  }

  // cancel any async operation
  cancel(reason: EventType = EventType.TRIGGER): void {
    // to be overridden
  }

  blockCommand(command: string, params: {[key: string]: any}): void {
    // to be overridden
  }

  destroy(): void {
    this._data = undefined;
  }
}

BaseFunction.prototype.priority = 0;
BaseFunction.prototype.useLength = false;
BaseFunction.prototype.defaultMode = 'onLoad';

export const PureFunction = BaseFunction;

export class BlockFunction implements BaseFunction {
  _data: Block;
  priority: 0 | 1 | 2 | 3;
  defaultMode: BlockMode;
  useLength: boolean;

  constructor(block?: Block) {
    this._data = block;
  }

  descriptor: FunctionDesc;

  // return true when it needs to be put in queue
  inputChanged(input: BlockIO, val: any): boolean {
    return true;
  }

  // return stream output
  run(): any {
    // to be overridden
  }

  // cancel any async operation
  // explicitly will be true when #cancel is triggered
  cancel(reason: EventType = EventType.TRIGGER): void {
    // to be overridden
  }

  blockCommand(command: string, params: {[key: string]: any}): void {
    // to be overridden
  }

  destroy(): void {
    this._data = undefined;
  }

}

BlockFunction.prototype.priority = 1;
BaseFunction.prototype.useLength = false;
BlockFunction.prototype.defaultMode = 'onLoad';

export type FunctionGenerator = new (block: FunctionData) => BaseFunction;
