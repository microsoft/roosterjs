import { createRange, safeInstanceOf } from 'roosterjs-editor-dom';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import type { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import type {
    NodePosition,
    PositionType,
    SelectionPath,
    SelectionRangeEx,
    TableSelection,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export function buildRangeEx(
    core: ContentModelEditorCore,
    arg1: Range | SelectionRangeEx | NodePosition | Node | SelectionPath | null,
    arg2?: NodePosition | number | PositionType | TableSelection | null,
    arg3?: Node,
    arg4?: number | PositionType
): SelectionRangeEx {
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
        const range = !arg1
            ? null
            : safeInstanceOf(arg1, 'Range')
            ? arg1
            : isSelectionPath(arg1)
            ? createRange(core.standaloneEditorCore.contentDiv, arg1.start, arg1.end)
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
            : {
                  type: SelectionRangeTypes.Normal,
                  ranges: [],
                  areAllCollapsed: true,
              };
    }

    return rangeEx;
}

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
