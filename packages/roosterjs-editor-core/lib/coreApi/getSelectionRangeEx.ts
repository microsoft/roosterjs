import { contains, createRange, safeInstanceOf } from 'roosterjs-editor-dom';
import {
    EditorCore,
    GetSelectionRangeEx,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const TABLE_SELECTED = '_tableSelected';
const TABLE_CELL_SELECTED_CLASS = '_tableCellSelected';
const TABLE_CELL_SELECTOR = `td.${TABLE_CELL_SELECTED_CLASS},th.${TABLE_CELL_SELECTED_CLASS}`;

/**
 * @internal
 * Get current or cached selection range
 * @param core The EditorCore object
 * @returns A Range object of the selection range
 */
export const getSelectionRangeEx: GetSelectionRangeEx = (core: EditorCore) => {
    let result: SelectionRangeEx = null;
    if (core.lifecycle.shadowEditFragment) {
        const shadowRange =
            core.lifecycle.shadowEditSelectionPath &&
            createRange(
                core.contentDiv,
                core.lifecycle.shadowEditSelectionPath.start,
                core.lifecycle.shadowEditSelectionPath.end
            );

        return createNormalSelectionEx([shadowRange]);
    } else {
        if (core.api.hasFocus(core)) {
            const tableSelected = getTableSelected(core.contentDiv);
            if (tableSelected) {
                return createTableSelectionEx(tableSelected);
            }

            let selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
            if (!result && selection && selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
                if (contains(core.contentDiv, range)) {
                    return createNormalSelectionEx([range]);
                }
            }
        }

        return createNormalSelectionEx([core.domEvent.selectionRange]);
    }
};

function createNormalSelectionEx(ranges: Range[]): SelectionRangeEx {
    return {
        type: SelectionRangeTypes.Normal,
        ranges: ranges,
        areAllCollapsed: checkAllCollapsed(ranges),
    };
}

function createTableSelectionEx(table: HTMLTableElement): SelectionRangeEx {
    const ranges: Range[] = getRangesFromTable(table);

    return {
        type: SelectionRangeTypes.TableSelection,
        ranges: ranges,
        table: table,
        areAllCollapsed: checkAllCollapsed(ranges),
    };
}

function getRangesFromTable(table: HTMLTableElement) {
    const ranges: Range[] = [];
    table.querySelectorAll('tr').forEach(row => {
        const rowRange = new Range();
        let firstSelected: HTMLTableCellElement = null;
        let lastSelected: HTMLTableCellElement = null;
        row.querySelectorAll(TABLE_CELL_SELECTOR).forEach(cell => {
            if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
                firstSelected = firstSelected || cell;
                lastSelected = cell;
            }
        });

        if (firstSelected) {
            rowRange.setStartBefore(firstSelected);
            rowRange.setEndAfter(lastSelected);
            ranges.push(rowRange);
        }
    });

    return ranges;
}

function checkAllCollapsed(ranges: Range[]): boolean {
    return ranges.filter(range => range?.collapsed).length == ranges.length;
}

function getTableSelected(container: HTMLElement | DocumentFragment): HTMLTableElement {
    const table = container.querySelector('table.' + TABLE_SELECTED);

    if (safeInstanceOf(table, 'HTMLTableElement')) {
        return table;
    }

    return null;
}
