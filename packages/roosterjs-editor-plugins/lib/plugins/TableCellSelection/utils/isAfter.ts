import { Nullable } from '../TableCellSelectionState';
import { Position } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function isAfter(node1: Nullable<Node>, node2: Nullable<Node>) {
    if (node1 && node2) {
        if (node2.contains(node1)) {
            const r1 = (node1 as Element).getBoundingClientRect?.();
            const r2 = (node2 as Element).getBoundingClientRect?.();
            if (r1 && r2) {
                return r1.top > r2.top && r1.bottom < r2.bottom;
            }
        }

        const position = new Position(node1, PositionType.End);
        return position.isAfter(new Position(node2, PositionType.End));
    }
    return false;
}
