module bzflow {

    export class BaseLogic2 extends Logic {
        _input0: BlockInput;
        _input1: BlockInput;
        _out: BlockOutput;

        constructor(block: Block) {
            super(block);
            // cache properties
            this._input0 = block.getProp('>0') as BlockInput;
            this._input1 = block.getProp('>1') as BlockInput;
            this._out = block.getProp('<out');
        }
        
        checkInitRun(): boolean {
            return this._input0._value != null || this._input1._value != null;
        };

    }
    BaseLogic2.prototype.priority = 0;
    BaseLogic2.prototype.descriptor = {
        'inputs': [
            {'name': '>0', 'type': 'number'},
            {'name': '>1', 'type': 'number'}
        ],
        'outputs': [
            {'name': '<out', 'type': 'number'}
        ],
    };
}