import { contains, createRange, safeInstanceOf } from 'roosterjs-editor-dom';
import {
    NodePosition,
    PluginEventType,
    PositionType,
    Select,
    SelectionPath,
    SelectionRangeEx,
    SelectionRangeTypes,
    TableSelection,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Select content according to the given information.
 * There are a bunch of allowed combination of parameters. See IEditor.select for more details
 * @param core The editor core object
 * @param arg1 A DOM Range, or SelectionRangeEx, or NodePosition, or Node, or Selection Path
 * @param arg2 (optional) A NodePosition, or an offset number, or a PositionType, or a TableSelection
 * @param arg3 (optional) A Node
 * @param arg4 (optional) An offset number, or a PositionType
 */
export const select: Select = (core, arg1, arg2, arg3, arg4) => {
    let rangeEx: SelectionRangeEx | null = null;

    if (isSelectionRangeEx(arg1)) {
        rangeEx = arg1;
    } else if (safeInstanceOf(arg1, 'HTMLTableElement') && isTableSelectionOrNull(arg2)) {
        rangeEx = {
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            areAllCollapsed: false,
            table: arg1,
            coordinates: arg2 ?? undefined,
        };
    } else if (safeInstanceOf(arg1, 'HTMLImageElement') && typeof arg2 == 'undefined') {
        rangeEx = {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [],
            areAllCollapsed: false,
            image: arg1,
        };
    } else {
        let range = !arg1
            ? null
            : safeInstanceOf(arg1, 'Range')
            ? arg1
            : isSelectionPath(arg1)
            ? createRange(core.contentDiv, arg1.start, arg1.end)
            : isNodePosition(arg1) || safeInstanceOf(arg1, 'Node')
            ? createRange(
                  <Node>arg1,
                  <number | PositionType>arg2,
                  <Node>arg3,
                  <number | PositionType>arg4
              )
            : null;

        rangeEx = range
            ? {
                  type: SelectionRangeTypes.Normal,
                  ranges: [range],
                  areAllCollapsed: range.collapsed,
              }
            : null;
    }

    if (rangeEx) {
        switch (rangeEx.type) {
            case SelectionRangeTypes.TableSelection:
                if (contains(core.contentDiv, rangeEx.table)) {
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, null);
                    core.domEvent.tableSelectionRange = core.api.selectTable(
                        core,
                        rangeEx.table,
                        rangeEx.coordinates
                    );
                    rangeEx = core.domEvent.tableSelectionRange;
                }
                break;
            case SelectionRangeTypes.ImageSelection:
                if (contains(core.contentDiv, rangeEx.image)) {
                    core.domEvent.tableSelectionRange = core.api.selectTable(core, null);
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, rangeEx.image);
                    rangeEx = core.domEvent.imageSelectionRange;
                }
                break;
            case SelectionRangeTypes.Normal:
                core.domEvent.tableSelectionRange = core.api.selectTable(core, null);
                core.domEvent.imageSelectionRange = core.api.selectImage(core, null);

                if (contains(core.contentDiv, rangeEx.ranges[0])) {
                    core.api.selectRange(core, rangeEx.ranges[0]);
                } else {
                    rangeEx = null;
                }
                break;
        }

        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: rangeEx,
            },
            true /** broadcast **/
        );
    } else {
        core.domEvent.tableSelectionRange = core.api.selectTable(core, null);
        core.domEvent.imageSelectionRange = core.api.selectImage(core, null);
    }

    return !!rangeEx;
};

function isSelectionRangeEx(obj: any): obj is SelectionRangeEx {
    const rangeEx = obj as SelectionRangeEx;
    return (
        rangeEx &&
        typeof rangeEx == 'object' &&
        typeof rangeEx.type == 'number' &&
        Array.isArray(rangeEx.ranges)
    );
}

function isTableSelectionOrNull(obj: any): obj is TableSelection | null {
    const selection = obj as TableSelection | null;

    return (
        selection === null ||
        (selection &&
            typeof selection == 'object' &&
            typeof selection.firstCell == 'object' &&
            typeof selection.lastCell == 'object')
    );
}

function isSelectionPath(obj: any): obj is SelectionPath {
    const path = obj as SelectionPath;

    return path && typeof path == 'object' && Array.isArray(path.start) && Array.isArray(path.end);
}

function isNodePosition(obj: any): obj is NodePosition {
    const pos = obj as NodePosition;

    return (
        pos &&
        typeof pos == 'object' &&
        typeof pos.node == 'object' &&
        typeof pos.offset == 'number'
    );
}
