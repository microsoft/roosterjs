import Position from '../selection/Position';
import { EditorPoint, InlineElement } from 'roosterjs-editor-types';
import {
    getInlineElementBefore,
    getInlineElementAfter,
} from '../inlineElements/getInlineElementBeforeAfter';
/**
 * @deprecated Use getInlineElementBefore instead
 */
export function getInlineElementBeforePoint(rootNode: Node, point: EditorPoint): InlineElement {
    return getInlineElementBefore(rootNode, Position.FromEditorPoint(point));
}

/**
 * @deprecated Use getInlineElementAfter instead
 */
export function getInlineElementAfterPoint(rootNode: Node, point: EditorPoint): InlineElement {
    return getInlineElementAfter(rootNode, Position.FromEditorPoint(point));
}
