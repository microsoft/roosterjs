import execFormatWithUndo from './execFormatWithUndo';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, browserData } from 'roosterjs-editor-core';
import { NodeType, ContentScope } from 'roosterjs-editor-types';
import { fromHtml } from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '&#8203;';
const WORKAROUND_CLASS = 'ROOSTER_WORKAROUND';
const WORKAROUND_HTML = `<img class="${WORKAROUND_CLASS}">`;
const WORKAROUND_SELECTOR = 'img.' + WORKAROUND_CLASS;

/**
 * Toggle bullet/numbering at selection
 * @param editor The editor instance
 * @param isNumbering Whether this is to toggle numbering or bullet
 */
export function toggleList(editor: Editor, isNumbering: boolean) {
    editor.focus();
    execFormatWithUndo(editor, () => {
        let workaroundSpan: HTMLElement;

        // Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
        if (browserData.isEdge) {
            let node = getNodeAtCursor(editor) as Element;
            if (node && node.nodeType == NodeType.Element && node.textContent == '') {
                workaroundSpan = editor.getDocument().createElement('span');
                node.insertBefore(workaroundSpan, node.firstChild);
                workaroundSpan.innerHTML = ZERO_WIDTH_SPACE;
            }
        } else if (browserData.isChrome) {
            // Chrome may lose the inline styles after toggle bullet, workaround it by add an empty IMG before each line
            let workaroundPrototype = fromHtml(WORKAROUND_HTML, editor.getDocument())[0];
            let traverser = editor.getContentTraverser(ContentScope.Selection);
            let block = traverser.currentBlockElement;
            while (block) {
                let workaroundNode = workaroundPrototype.cloneNode(true);
                let startNode = block.getStartNode();
                if (startNode.nodeType == NodeType.Element) {
                    startNode.insertBefore(workaroundNode, startNode.firstChild);
                } else if (startNode.nodeType == NodeType.Text) {
                    startNode.parentNode.insertBefore(workaroundNode, startNode);
                }
                block = traverser.getNextBlockElement();
            }
        }

        editor
            .getDocument()
            .execCommand(isNumbering ? 'insertOrderedList' : 'insertUnorderedList', false, null);

        editor.deleteNode(workaroundSpan);
        editor.queryElements(WORKAROUND_SELECTOR, img => editor.deleteNode(img));
    });
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
    toggleList(editor, false /*isNumbering*/);
}
