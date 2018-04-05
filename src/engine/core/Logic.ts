import {Block} from "./Block";
import {BlockProperty} from "./BlockProperty";
import {LogicDesc} from "./Descriptor";

export class Logic {
  _block: Block;
  class: string;
  priority: number;
  initRun: boolean;

  constructor(block: Block) {
    this._block = block;
  }

  descriptor: LogicDesc;

  // return true when it needs to be put in queue
  inputChanged(input: BlockProperty, val: any): boolean {
    return true;
  }

  // return stream output
  run(val: any): any {
    // to be overridden
  }

  checkInitRun(): boolean {
    return true;
  }

  checkInitTrigger(loading: boolean): void {
    // to be overridden
  }

  blockCommand(command: string, params: Object): void {
    // to be overridden
  }

  propCommand(command: string, field: string, params: Object): void {
    // to be overridden
  }

  destroy(): void {
    // to be overridden
  }


}

Logic.prototype.class = '';

Logic.prototype.priority = 0;

Logic.prototype.descriptor = {
  inputs: [], outputs: [], attributes: [],
};

/**
 * whether the logic should be run right after it's created
 */
Logic.prototype.initRun = false;

export type LogicGenerator = new (block: Block) => Logic;
