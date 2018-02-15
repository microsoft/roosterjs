import { Position, PositionType, SelectionRangeBase } from 'roosterjs-editor-types';
import EditorCore from '../editor/EditorCore';
import getSelection from './getSelection';
import hasFocus from './hasFocus';
import isRangeInContainer from '../utils/isRangeInContainer';

export default function select(core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any): boolean {
    let rawRange: Range;

    if (arg1 instanceof Range) {
        rawRange = <Range>arg1;
    } else {
        let selectionRangeBase: SelectionRangeBase;
        if (arg1.start && arg1.end) {
            selectionRangeBase = <SelectionRangeBase>arg1;
        } else if (arg1.node) {
            selectionRangeBase = SelectionRangeBase.create(
                Position.create(<Position>arg1),
                arg2 && arg2.node ? Position.create(<Position>arg2) : null
            );
        } else if (arg1 instanceof Node) {
            let start: Position;
            let end: Position;
            if (arg2 == undefined) {
                start = Position.create(<Node>arg1, Position.Before);
                end = Position.create(<Node>arg1, Position.After);
            } else {
                start = Position.create(<Node>arg1, <number|PositionType>arg2);
                end = arg3 instanceof Node ? Position.create(<Node>arg3, <number|PositionType>arg4) : null;
            }
            selectionRangeBase = SelectionRangeBase.create(start, end);
        }
        rawRange = SelectionRangeBase.toRange(core.document, selectionRangeBase);
    }

    if (isRangeInContainer(rawRange, core.contentDiv)) {
        let selection = getSelection(core);
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