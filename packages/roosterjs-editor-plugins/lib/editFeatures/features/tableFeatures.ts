import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { NodeType, PluginEvent, PositionType } from 'roosterjs-editor-types';
import {
    Browser,
    contains,
    getTagOfNode,
    isVoidHtmlElement,
    Position,
    VTable,
} from 'roosterjs-editor-dom';

/**
 * TabInTable edit feature, provides the ability to jump between cells when user press TAB in table
 */
const TabInTable: ContentEditFeature = {
    keys: [Keys.TAB],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        let shift = event.rawEvent.shiftKey;
        let td = cacheGetTableCell(event, editor);
        for (
            let vtable = new VTable(td),
                step = shift ? -1 : 1,
                row = vtable.row,
                col = vtable.col + step;
            ;
            col += step
        ) {
            if (col < 0 || col >= vtable.cells[row].length) {
                row += step;
                if (row < 0 || row >= vtable.cells.length) {
                    editor.select(vtable.table, shift ? PositionType.Before : PositionType.After);
                    break;
                }
                col = shift ? vtable.cells[row].length - 1 : 0;
            }
            let cell = vtable.getCell(row, col);
            if (cell.td) {
                editor.select(cell.td, PositionType.Begin);
                break;
            }
        }
        event.rawEvent.preventDefault();
    },
};

/**
 * UpDownInTable edit feature, provides the ability to jump to cell above/below when user press UP/DOWN
 * in table
 */
const UpDownInTable: ContentEditFeature = {
    keys: [Keys.UP, Keys.DOWN],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        let td = cacheGetTableCell(event, editor);
        let vtable = new VTable(td);
        let isUp = event.rawEvent.which == Keys.UP;
        let step = isUp ? -1 : 1;
        let targetTd: HTMLTableCellElement = null;
        let hasShiftKey = event.rawEvent.shiftKey;
        let { anchorNode, anchorOffset } = editor.getDocument().defaultView.getSelection();

        for (let row = vtable.row; row >= 0 && row < vtable.cells.length; row += step) {
            let cell = vtable.getCell(row, vtable.col);
            if (cell.td && cell.td != td) {
                targetTd = cell.td;
                break;
            }
        }

        editor.runAsync(() => {
            let newContainer = editor.getElementAtCursor();
            if (
                contains(vtable.table, newContainer) &&
                !contains(td, newContainer, true /*treatSameNodeAsContain*/)
            ) {
                let newPos = targetTd
                    ? new Position(targetTd, PositionType.Begin)
                    : new Position(vtable.table, isUp ? PositionType.Before : PositionType.After);
                if (hasShiftKey) {
                    newPos =
                        newPos.node.nodeType == NodeType.Element && isVoidHtmlElement(newPos.node)
                            ? new Position(
                                  newPos.node,
                                  newPos.isAtEnd ? PositionType.After : PositionType.Before
                              )
                            : newPos;
                    const selection = editor.getDocument().defaultView.getSelection();
                    selection.setBaseAndExtent(
                        anchorNode,
                        anchorOffset,
                        newPos.node,
                        newPos.offset
                    );
                } else {
                    editor.select(newPos);
                }
            }
        });
    },
    defaultDisabled: !Browser.isChrome && !Browser.isSafari,
};

function cacheGetTableCell(event: PluginEvent, editor: Editor): HTMLTableCellElement {
    return cacheGetEventData(event, 'TABLECELL_FOR_TABLE_FEATURES', () => {
        let pos = editor.getFocusedPosition();
        let firstTd = pos && editor.getElementAtCursor('TD,TH,LI', pos.node);
        return (
            firstTd && (getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement))
        );
    });
}

/**
 * Settings for table features
 */
export default interface TableFeatureSettings {
    /**
     * When press TAB or SHIFT+TAB key in table cell, jump to next/previous table cell
     * @default true
     */
    tabInTable: boolean;

    /**
     * When press Up or Down in table cell, jump to the table cell above/below
     * @default true for Chrome and safari, false for other browsers since they arleady have correct behavior
     */
    upDownInTable: boolean;
}

/**
 * @internal
 */
export const TableFeatures: Record<keyof TableFeatureSettings, ContentEditFeature> = {
    tabInTable: TabInTable,
    upDownInTable: UpDownInTable,
};
