import { PositionType } from 'roosterjs-editor-types';
import { Position, SelectionRangeBase } from 'roosterjs-editor-dom';
import EditorCore from '../editor/EditorCore';
import hasFocus from './hasFocus';
import isRangeInContainer from '../utils/isRangeInContainer';

export default function select(
    core: EditorCore,
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any
): boolean {
    let rawRange: Range;

    if (arg1 instanceof Range) {
        rawRange = <Range>arg1;
    } else {
        let selectionRangeBase: SelectionRangeBase;
        if (arg1.start && arg1.end) {
            selectionRangeBase = <SelectionRangeBase>arg1;
        } else if (arg1.node) {
            selectionRangeBase = new SelectionRangeBase(
                new Position(arg1),
                arg2 && arg2.node ? new Position(arg2) : null
            );
        } else if (arg1 instanceof Node) {
            let start: Position;
            let end: Position;
            if (arg2 == undefined) {
                start = new Position(<Node>arg1, Position.Before);
                end = new Position(<Node>arg1, Position.After);
            } else {
                start = new Position(<Node>arg1, <number | PositionType>arg2);
                end =
                    arg3 instanceof Node
                        ? new Position(<Node>arg3, <number | PositionType>arg4)
                        : null;
            }
            selectionRangeBase = new SelectionRangeBase(start, end);
        }
        rawRange = selectionRangeBase.toRange();
    }

    if (isRangeInContainer(rawRange, core.contentDiv)) {
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
}
