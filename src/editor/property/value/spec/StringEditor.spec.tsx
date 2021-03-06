import {assert} from "chai";
import SimulateEvent from "simulate-event";
import React from 'react';
import {removeLastTemplate, loadTemplate, querySingle} from "../../../../ui/util/test-util";
import {initEditor} from "../../../index";
import {StringEditor} from "../StringEditor";
import {shouldHappen} from "../../../../core/util/test-util";
import {blankPropDesc} from "../../../../core/block/Descriptor";
import {simulateInput} from "./simulate-input";

describe("StringEditor", function () {

  beforeEach(async function () {
    await initEditor();
  });

  afterEach(function () {
    removeLastTemplate();
  });

  it('basic', async function () {
    let editor: StringEditor;
    let getRef = (e: StringEditor): void => {
      editor = e;
    };
    let value: string = null;
    let onChange = (str: string) => {
      value = str;
    };
    let [component, div] = loadTemplate(
      <StringEditor ref={getRef} value='1' desc={blankPropDesc} onChange={onChange}/>, 'editor');

    await shouldHappen(() => editor && div.querySelector('textarea.ant-input'));

    simulateInput(editor, {key: 'A'}, 'A');
    assert.isNull(value);

    simulateInput(editor, {key: 'Enter'}, null);
    assert.equal(value, 'A');

    // test shift key
    simulateInput(editor, {key: 'Enter', shiftKey: true}, 'A\n');
    assert.equal(value, 'A');

    simulateInput(editor, {key: 'Enter'}, null);
    assert.equal(value, 'A\n');

    // test escape key
    simulateInput(editor, {key: 'B'}, 'AB');
    assert.equal(value, 'A\n');

    simulateInput(editor, {key: 'Escape'}, null);
    simulateInput(editor, {key: 'Enter'}, null);
    assert.equal(value, '1'); // blur back to the value from Props

    // onBlur
    simulateInput(editor, {key: 'C'}, 'ABC');
    assert.notEqual(value, 'ABC');

    editor.onBlur();
    assert.equal(value, 'ABC');

  });
});
