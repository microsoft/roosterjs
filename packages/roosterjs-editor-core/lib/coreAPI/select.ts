import EditorCore, { Select } from '../editor/EditorCore';
import hasFocus from './hasFocus';
import { Position, contains, createRange } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';

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
            range = createRange(start, end);
        }
    }

    if (contains(core.contentDiv, range)) {
        let selection = core.document.defaultView.getSelection();
        if (selection) {
            if (selection.rangeCount > 0) {
                // Workaround IE exception 800a025e
                try {
                    selection.removeAllRanges();
                } catch (e) {}
            }

            selection.addRange(range);

            if (!hasFocus(core)) {
                core.cachedSelectionRange = range;
            }

            return true;
        }
    }

    return false;
};

export default select;
