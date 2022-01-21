import { contains, createRange, safeInstanceOf, VTable } from 'roosterjs-editor-dom';
import {
    EditorCore,
    GetSelectionRangeEx,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const TABLE_SELECTED = '_tableSelected';

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

        if (shadowRange.collapsed) {
            const tableSelected = getTableSelected(core.contentDiv);

            if (tableSelected) {
                return createTableSelectionEx(tableSelected);
            }
        }

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
        areAllCollapsed: ranges.filter(range => range.collapsed).length == ranges.length,
    };
}

function createTableSelectionEx(vTable: VTable): SelectionRangeEx {
    const ranges = vTable.getSelectedRanges();
    return {
        type: SelectionRangeTypes.TableSelection,
        ranges: ranges,
        vTable: vTable,
        areAllCollapsed: ranges.filter(range => range.collapsed).length == ranges.length,
    };
}

function getTableSelected(container: HTMLElement | DocumentFragment) {
    const table = container.querySelector('table.' + TABLE_SELECTED);

    let vTable: VTable = null;
    if (safeInstanceOf(table, 'HTMLTableElement')) {
        vTable = new VTable(table, false);
    }

    return vTable;
}
