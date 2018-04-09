import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { getElementOrParentElement } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level, can be a number from 0 to 6, in which 1 ~ 6 refers to
 * the HTML header element <H1> to <H6>, 0 means no header
 * if passed in param is outside the range, will be rounded to nearest number in the range
 */
export default function toggleHeader(editor: Editor, level: number) {
    level = Math.min(Math.max(Math.round(level), 0), 6);

    editor.formatWithUndo(() => {
        editor.focus();

        if (level > 0) {
            let traverser = editor.getSelectionTraverser();
            let inlineElement = traverser ? traverser.currentInlineElement : null;
            while (inlineElement) {
                let node = getElementOrParentElement(inlineElement.getContainerNode());
                if (node.nodeType == NodeType.Element) {
                    (<HTMLElement>node).style.fontSize = '';
                }
                inlineElement = traverser.getNextInlineElement();
            }
            editor.getDocument().execCommand('formatBlock', false, `<H${level}>`);
        } else {
            editor.getDocument().execCommand('formatBlock', false, '<DIV>');
            for (let i = 1; i <= 6; i++) {
                queryNodesWithSelection(editor, 'H' + i, false /*containsOnly*/, header => {
                    let div = editor.getDocument().createElement('div');
                    while (header.firstChild) {
                        div.appendChild(header.firstChild);
                    }
                    editor.replaceNode(header, div);
                });
            }
        }
    });
}
