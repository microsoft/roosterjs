import { editTable } from 'roosterjs-editor-api';
import {
    BuildInEditFeature,
    IEditor,
    Keys,
    NodeType,
    PluginEvent,
    PositionType,
    TableFeatureSettings,
    TableOperation,
    PluginKeyboardEvent,
} from 'roosterjs-editor-types';
import {
    Browser,
    cacheGetEventData,
    contains,
    getTagOfNode,
    isVoidHtmlElement,
    Position,
    VTable,
} from 'roosterjs-editor-dom';

/**
 * TabInTable edit feature, provides the ability to jump between cells when user press TAB in table
 */
const TabInTable: BuildInEditFeature<PluginKeyboardEvent> = {
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
                if (row < 0) {
                    editor.select(vtable.table, PositionType.Before);
                    break;
                } else if (row >= vtable.cells.length) {
                    editTable(editor, TableOperation.InsertBelow);
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
const UpDownInTable: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.UP, Keys.DOWN],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        const td = cacheGetTableCell(event, editor);
        const vtable = new VTable(td);
        const isUp = event.rawEvent.which == Keys.UP;
        const step = isUp ? -1 : 1;
        const hasShiftKey = event.rawEvent.shiftKey;
        const selection = editor.getDocument().defaultView?.getSelection();
        let targetTd: HTMLTableCellElement = null;

        if (selection) {
            let { anchorNode, anchorOffset } = selection;

            for (let row = vtable.row; row >= 0 && row < vtable.cells.length; row += step) {
                let cell = vtable.getCell(row, vtable.col);
                if (cell.td && cell.td != td) {
                    targetTd = cell.td;
                    break;
                }
            }

            editor.runAsync(editor => {
                let newContainer = editor.getElementAtCursor();
                if (
                    contains(vtable.table, newContainer) &&
                    !contains(td, newContainer, true /*treatSameNodeAsContain*/)
                ) {
                    let newPos = targetTd
                        ? new Position(targetTd, PositionType.Begin)
                        : new Position(
                              vtable.table,
                              isUp ? PositionType.Before : PositionType.After
                          );
                    if (hasShiftKey) {
                        newPos =
                            newPos.node.nodeType == NodeType.Element &&
                            isVoidHtmlElement(newPos.node)
                                ? new Position(
                                      newPos.node,
                                      newPos.isAtEnd ? PositionType.After : PositionType.Before
                                  )
                                : newPos;
                        const selection = editor.getDocument().defaultView?.getSelection();
                        selection?.setBaseAndExtent(
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
        }
    },
    defaultDisabled: !Browser.isChrome && !Browser.isSafari,
};

function cacheGetTableCell(event: PluginEvent, editor: IEditor): HTMLTableCellElement {
    return cacheGetEventData(event, 'TABLECELL_FOR_TABLE_FEATURES', () => {
        let pos = editor.getFocusedPosition();
        let firstTd = pos && editor.getElementAtCursor('TD,TH,LI', pos.node);
        return (
            firstTd && (getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement))
        );
    });
}

/**
 * @internal
 */
export const TableFeatures: Record<
    keyof TableFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    tabInTable: TabInTable,
    upDownInTable: UpDownInTable,
};
