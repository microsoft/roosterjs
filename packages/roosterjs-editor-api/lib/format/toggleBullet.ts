import execFormatWithUndo from './execFormatWithUndo';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, browserData } from 'roosterjs-editor-core';
import { NodeType } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '&#8203;';

/**
 * Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
 * The space will be removed by Edge after toggle bullet
 * @param editor The editor instance
 * @returns The workaround span
 */
export function workaroundForEdge(editor: Editor): HTMLElement {
    if (browserData.isEdge) {
        let node = getNodeAtCursor(editor) as Element;
        if (node && node.nodeType == NodeType.Element && node.textContent == '') {
            let span = editor.getDocument().createElement('span');
            node.insertBefore(span, node.firstChild);
            span.innerHTML = ZERO_WIDTH_SPACE;
            return span;
        }
    }

    return null;
}

/**
 * Remove the workaroundSpan after toggling bullet in Edge
 * @param workaroundSpan The workaround span that was added
 */
export function removeWorkaroundForEdge(workaroundSpan: HTMLElement) {
    if (workaroundSpan && workaroundSpan.parentNode) {
        workaroundSpan.parentNode.removeChild(workaroundSpan);
    }
}

/**
 * Toggle bullet at selection
 * If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 * If selection contains number list, toggle bullet will convert the number list into bullet list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * browser execCommand API
 * @param editor The editor instance
 */
export default function toggleBullet(editor: Editor) {
    editor.focus();
    execFormatWithUndo(editor, () => {
        let workaroundSpan = workaroundForEdge(editor);
        editor.getDocument().execCommand('insertUnorderedList', false, null);
        removeWorkaroundForEdge(workaroundSpan);
    });
}
