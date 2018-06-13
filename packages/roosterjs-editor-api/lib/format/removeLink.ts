import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { normalizeEditorPoint, unwrap } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
export default function removeLink(editor: Editor) {
    editor.focus();
    let nodes = queryNodesWithSelection(editor, 'a[href]');
    if (nodes.length) {
        execFormatWithUndo(editor, () => {
            let range = editor.getSelectionRange();
            let startPoint = range
                ? normalizeEditorPoint(range.startContainer, range.startOffset)
                : null;
            let endPoint = range ? normalizeEditorPoint(range.endContainer, range.endOffset) : null;
            for (let node of nodes) {
                unwrap(node);
            }
            if (
                range &&
                editor.contains(startPoint.containerNode) &&
                editor.contains(endPoint.containerNode)
            ) {
                editor.select(startPoint.containerNode, startPoint.offset, endPoint.containerNode, endPoint.offset);
            }
        });
    }
}
