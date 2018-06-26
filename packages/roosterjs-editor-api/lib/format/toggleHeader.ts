import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';
import { DocumentCommand, NodeType } from 'roosterjs-editor-types';

/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level, can be a number from 0 to 6, in which 1 ~ 6 refers to
 * the HTML header element <H1> to <H6>, 0 means no header
 * if passed in param is outside the range, will be rounded to nearest number in the range
 */
export default function toggleHeader(editor: Editor, level: number) {
    level = Math.min(Math.max(Math.round(level), 0), 6);

    editor.addUndoSnapshot(() => {
        editor.focus();

        let wrapped = false;
        queryNodesWithSelection(editor, 'H1,H2,H3,H4,H5,H6', false, header => {
            if (!wrapped) {
                editor.getDocument().execCommand(DocumentCommand.FormatBlock, false, '<DIV>');
                wrapped = true;
            }

            let div = editor.getDocument().createElement('div');
            while (header.firstChild) {
                div.appendChild(header.firstChild);
            }
            editor.replaceNode(header, div);
        });

        if (level > 0) {
            let traverser = editor.getSelectionTraverser();
            let inlineElement = traverser ? traverser.currentInlineElement : null;
            while (inlineElement) {
                let node = inlineElement.getContainerNode();
                if (node.nodeType == NodeType.Text) {
                    node = node.parentNode;
                }
                if (node.nodeType == NodeType.Element) {
                    (<HTMLElement>node).style.fontSize = '';
                }
                inlineElement = traverser.getNextInlineElement();
            }
            editor.getDocument().execCommand(DocumentCommand.FormatBlock, false, `<H${level}>`);
        }
    });
}
