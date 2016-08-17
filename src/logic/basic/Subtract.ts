/// <reference path="../../breezeflow.ts" />
module BreezeFlow {

    export class Subtract extends BaseLogic2 {
        constructor(block: Block) {
            super(block);
        }

        run(val: any): any {
            let v0 = this._input0._value;
            let v1 = this._input1._value;
            if (v0 == null || v1 == null) {
                this._out.updateValue(null);
            } else {
                this._out.updateValue(v0 - v1);
            }
        };
    }
    Add.prototype.name = '-';
    Types.add('-', Subtract);
}
