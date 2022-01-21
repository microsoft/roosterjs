import { EditorCore, GetSelectionRangeEx, SelectionRangeEx } from 'roosterjs-editor-types';
import {
    contains,
    createRange,
    NormalSelectionRange,
    safeInstanceOf,
    TableMetadata,
    TableSelectionRange,
    VTable,
} from 'roosterjs-editor-dom';

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
    return new NormalSelectionRange(ranges);
}

function createTableSelectionEx(vTable: VTable): SelectionRangeEx {
    return new TableSelectionRange(vTable);
}

function getTableSelected(container: HTMLElement | DocumentFragment) {
    const table = container.querySelector('table.' + TableMetadata.TABLE_SELECTED);

    let vTable: VTable = null;
    if (safeInstanceOf(table, 'HTMLTableElement')) {
        vTable = new VTable(table, false, true);
    }

    return vTable;
}
