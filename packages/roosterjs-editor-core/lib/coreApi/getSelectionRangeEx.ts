import {
    EditorCore,
    GetSelectionRangeEx,
    SelectionRangeEx,
    TableSelectionPluginState,
} from 'roosterjs-editor-types';
import {
    contains,
    createRange,
    findClosestElementAncestor,
    NormalSelectionRange,
    safeInstanceOf,
    TableSelectionRange,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Get current or cached selection range
 * @param core The EditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export const getSelectionRangeEx: GetSelectionRangeEx = (
    core: EditorCore,
    tryGetFromCache: boolean
) => {
    let result: SelectionRangeEx = null;

    const tSelection = core.tableSelection;
    if (core.lifecycle.shadowEditFragment) {
        const shadowRange =
            core.lifecycle.shadowEditSelectionPath &&
            createRange(
                core.contentDiv,
                core.lifecycle.shadowEditSelectionPath.start,
                core.lifecycle.shadowEditSelectionPath.end
            );
        if (shadowRange.collapsed) {
            const table = findClosestElementAncestor(
                shadowRange.startContainer,
                core.contentDiv,
                'table'
            ) as HTMLTableElement;
            if (tSelection.vSelection && safeInstanceOf(table, 'HTMLTableElement')) {
                return createTableSelectionEx(table, tSelection);
            }
        }

        return createNormalSelectionEx([shadowRange]);
    } else {
        if (!tryGetFromCache || core.api.hasFocus(core)) {
            if (
                tSelection.vSelection &&
                safeInstanceOf(tSelection.firstTarget, 'HTMLTableCellElement')
            ) {
                return createTableSelectionEx(tSelection.firstTarget, tSelection);
            }

            let selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
            if (!result && selection && selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
                if (contains(core.contentDiv, range)) {
                    return createNormalSelectionEx([range]);
                }
            }
        }

        if (!result && tryGetFromCache) {
            return createNormalSelectionEx([core.domEvent.selectionRange]);
        }
    }
};

function createNormalSelectionEx(ranges: Range[]): SelectionRangeEx {
    return new NormalSelectionRange(ranges);
}

function createTableSelectionEx(
    element: HTMLTableElement | HTMLTableCellElement,
    state: TableSelectionPluginState
): SelectionRangeEx {
    return new TableSelectionRange(element, state.startRange, state.endRange);
}
