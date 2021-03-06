import React from "react";
import {ClientConnection} from "../../core/connect/ClientConnection";
import {Modal, Input, Icon} from "antd";
import {DragState} from "rc-dock/lib";


export function onDragBlockOver(conn: ClientConnection, e: DragState) {
  let blockData = DragState.getData('block', conn);

  if (blockData && blockData.hasOwnProperty('#is')) {
    e.accept('+');
  }
}

type CreateBlockCallback = (name: string, data: {[key: string]: any}) => void;

export function onDropBlock(conn: ClientConnection, e: DragState, createBlock: CreateBlockCallback, bgElement: HTMLElement) {
  let blockData = DragState.getData('block', conn);
  if (blockData && blockData.hasOwnProperty('#is')) {
    let rect = bgElement.getBoundingClientRect();
    let scaleX = bgElement.offsetWidth / Math.round(rect.width);
    let scaleY = bgElement.offsetHeight / Math.round(rect.height);
    let offsetX = (e.clientX - rect.left) * scaleX;
    let offsetY = (e.clientY - rect.top) * scaleY;

    let blockName = DragState.getData('name', conn) || blockData['#is'];

    let onConfirmedBlockName = (name: string) => {
      let width = 150;
      let xyw = [offsetX - 12, offsetY - 12, width];
      if (blockData.hasOwnProperty('@b-xyw')) {
        let dataXyw = blockData['@b-xyw'];
        if (Array.isArray(dataXyw)) {
          width = dataXyw[2];
          if (width > 80 && width < 9999) {
            xyw = [offsetX - 12, offsetY - 12, width];
          }
        }
      }
      blockData['@b-xyw'] = xyw;
      createBlock(name, blockData);
    };

    if (blockName === '' || e.event.shiftKey) {
      // drop with shift to force change name
      blockName = blockName || blockData['#is'];
      let onInputChange = (change: React.ChangeEvent<HTMLInputElement>) => {
        blockName = change.target.value;
      };
      let onEnter = () => {
        if (blockName) {
          Modal.destroyAll();
          onConfirmedBlockName(blockName);
        }
      };
      let onGetRef = (ref: Input) => {
        if (ref) {
          ref.select();
        }
      };
      Modal.confirm({
        title: "Block Name",
        content: (
          <Input defaultValue={blockName} autoFocus={true} onChange={onInputChange} onPressEnter={onEnter}
                 ref={onGetRef}
          />
        ),
        icon: <span/>, // hide icon
        autoFocusButton: null,
        centered: true,
        onOk() {
          if (blockName) {
            onConfirmedBlockName(blockName);
          }
        }
      });
    } else {
      onConfirmedBlockName(blockName);
    }

  }
}
