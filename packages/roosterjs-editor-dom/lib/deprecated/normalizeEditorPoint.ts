import Position from '../selection/Position';
import { EditorPoint } from 'roosterjs-editor-types';

/**
 * @deprecated Use Position.normalize() instead
 */
export default function normalizeEditorPoint(container: Node, offset: number): EditorPoint {
    return new Position(container, offset).normalize().toEditorPoint();
}
