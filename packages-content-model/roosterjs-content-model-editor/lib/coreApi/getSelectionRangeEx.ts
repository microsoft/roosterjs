import { contains } from 'roosterjs-editor-dom';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import type { GetSelectionRangeEx } from 'roosterjs-content-model-types';
import type { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * @internal
 * Get current or cached selection range
 * @param core The StandaloneEditorCore object
 * @returns A Range object of the selection range
 */
export const getSelectionRangeEx: GetSelectionRangeEx = core => {
    const result: SelectionRangeEx | null = null;
    if (core.lifecycle.shadowEditFragment) {
        return createNormalSelectionEx([]);
    } else {
        if (core.api.hasFocus(core)) {
            if (core.domEvent.tableSelectionRange) {
                return core.domEvent.tableSelectionRange;
            }

            if (core.domEvent.imageSelectionRange) {
                return core.domEvent.imageSelectionRange;
            }

            const selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
            if (!result && selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (contains(core.contentDiv, range)) {
                    return createNormalSelectionEx([range]);
                }
            }
        }

        return (
            core.domEvent.tableSelectionRange ??
            core.domEvent.imageSelectionRange ??
            createNormalSelectionEx(
                core.domEvent.selectionRange ? [core.domEvent.selectionRange] : []
            )
        );
    }
};

function createNormalSelectionEx(ranges: Range[]): SelectionRangeEx {
    return {
        type: SelectionRangeTypes.Normal,
        ranges: ranges,
        areAllCollapsed: checkAllCollapsed(ranges),
    };
}

function checkAllCollapsed(ranges: Range[]): boolean {
    return ranges.filter(range => range?.collapsed).length == ranges.length;
}
