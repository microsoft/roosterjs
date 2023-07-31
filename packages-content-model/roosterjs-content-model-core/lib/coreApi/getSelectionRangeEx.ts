import { contains, createRange, findClosestElementAncestor } from 'roosterjs-editor-dom';
import { GetSelectionRangeEx } from '../coreEditor/ContentModelEditor2Core';
import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const getSelectionRangeEx: GetSelectionRangeEx = core => {
    return core.cachedRangeEx ?? getSelectionRangeExOriginal(core);
};

/**
 * @internal
 * Get current or cached selection range
 * @param core The EditorCore object
 * @returns A Range object of the selection range
 */
const getSelectionRangeExOriginal: GetSelectionRangeEx = core => {
    let result: SelectionRangeEx | null = null;
    if (core.isInShadowEdit) {
        const {
            shadowEditTableSelectionPath,
            shadowEditSelectionPath,
            shadowEditImageSelectionPath,
        } = core.lifecycle;

        if ((shadowEditTableSelectionPath?.length || 0) > 0) {
            const ranges = core.lifecycle.shadowEditTableSelectionPath!.map(path =>
                createRange(core.contentDiv, path.start, path.end)
            );

            return {
                type: SelectionRangeTypes.TableSelection,
                ranges,
                areAllCollapsed: checkAllCollapsed(ranges),
                table: findClosestElementAncestor(
                    ranges[0].startContainer,
                    core.contentDiv,
                    'table'
                ) as HTMLTableElement,
                coordinates: undefined,
            };
        } else if ((shadowEditImageSelectionPath?.length || 0) > 0) {
            const ranges = core.lifecycle.shadowEditImageSelectionPath!.map(path =>
                createRange(core.contentDiv, path.start, path.end)
            );
            return {
                type: SelectionRangeTypes.ImageSelection,
                ranges,
                areAllCollapsed: checkAllCollapsed(ranges),
                image: findClosestElementAncestor(
                    ranges[0].startContainer,
                    core.contentDiv,
                    'img'
                ) as HTMLImageElement,
                imageId: undefined,
            };
        } else {
            const shadowRange =
                shadowEditSelectionPath &&
                createRange(
                    core.contentDiv,
                    shadowEditSelectionPath.start,
                    shadowEditSelectionPath.end
                );

            return createNormalSelectionEx(shadowRange ? [shadowRange] : []);
        }
    } else {
        if (core.api.hasFocus(core)) {
            if (core.domEvent.tableSelectionRange) {
                return core.domEvent.tableSelectionRange;
            }

            if (core.domEvent.imageSelectionRange) {
                return core.domEvent.imageSelectionRange;
            }

            let selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
            if (!result && selection && selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
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
