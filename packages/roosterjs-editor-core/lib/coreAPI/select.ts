import EditorCore, { Select } from '../editor/EditorCore';
import hasFocus from './hasFocus';
import { Browser, contains, createRange, Position } from 'roosterjs-editor-dom';
import { NodePosition, PositionType } from 'roosterjs-editor-types';

const select: Select = (core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any) => {
    let range: Range;

    if (!arg1) {
        return false;
    } else if (arg1 instanceof Range) {
        range = arg1;
    } else {
        if (arg1.node) {
            range = createRange(new Position(arg1), arg2 && arg2.node ? new Position(arg2) : null);
        } else if (arg1 instanceof Node) {
            let start: NodePosition;
            let end: NodePosition;
            if (arg2 == undefined) {
                start = new Position(<Node>arg1, PositionType.Before);
                end = new Position(<Node>arg1, PositionType.After);
            } else {
                start = new Position(<Node>arg1, <number | PositionType>arg2);
                end =
                    arg3 instanceof Node
                        ? new Position(<Node>arg3, <number | PositionType>arg4)
                        : null;
            }
            range = createRange(start, end);
        }
    }

    if (contains(core.contentDiv, range)) {
        let selection = core.document.defaultView.getSelection();
        if (selection) {
            let needAddRange = true;

            if (selection.rangeCount > 0) {
                // Workaround IE exception 800a025e
                try {
                    // Do not remove/add range if current selection is the same with target range
                    // Without this check, execCommand() may fail in Edge since we changed the selection
                    let currentRange =
                        Browser.isEdge && selection.rangeCount == 1
                            ? selection.getRangeAt(0)
                            : null;
                    if (
                        currentRange &&
                        currentRange.startContainer == range.startContainer &&
                        currentRange.startOffset == range.startOffset &&
                        currentRange.endContainer == range.endContainer &&
                        currentRange.endOffset == range.endOffset
                    ) {
                        needAddRange = false;
                    } else {
                        selection.removeAllRanges();
                    }
                } catch (e) {}
            }

            if (needAddRange) {
                selection.addRange(range);
            }

            if (!hasFocus(core)) {
                core.cachedSelectionRange = range;
            }

            return true;
        }
    }

    return false;
};

export default select;
