import Position from '../selection/Position';
import { EditorPoint, NodePosition } from 'roosterjs-editor-types';

/**
 * @deprecated Do not use
 */
export function toEditorPoint(position: NodePosition) {
    return {
        containerNode: position.node,
        offset: position.offset == 0 && position.isAtEnd ? 1 : position.offset,
    };
}

/**
 * @deprecated Do not use
 */
export function safeGetPosition(p: EditorPoint | NodePosition): NodePosition {
    return p && (<EditorPoint>p).containerNode
        ? new Position((<EditorPoint>p).containerNode, p.offset)
        : <NodePosition>p;
}
