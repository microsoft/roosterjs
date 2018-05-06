import EditorCore, { Select } from '../editor/EditorCore';
import hasFocus from './hasFocus';
import { Position, SelectionRange, contains } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';

const select: Select = (
    core: EditorCore,
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any
) => {
    let rawRange: Range;

    if (!arg1) {
        return false;
    } else if (arg1 instanceof Range) {
        rawRange = arg1;
    } else {
        let range: SelectionRange;
        if (arg1.start && arg1.end) {
            range = <SelectionRange>arg1;
        } else if (arg1.node) {
            range = new SelectionRange(
                new Position(arg1),
                arg2 && arg2.node ? new Position(arg2) : null
            );
        } else if (arg1 instanceof Node) {
            let start: Position;
            let end: Position;
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
            range = new SelectionRange(start, end);
        }
        rawRange = range.getRange();
    }

    if (contains(core.contentDiv, rawRange)) {
        let selection = core.document.defaultView.getSelection();
        if (selection) {
            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }

            selection.addRange(rawRange);

            if (!hasFocus(core)) {
                core.cachedRange = rawRange;
            }

            return true;
        }
    }

    return false;
};

export default select;
