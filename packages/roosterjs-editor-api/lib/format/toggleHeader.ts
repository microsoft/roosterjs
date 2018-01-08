import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import wrap from 'roosterjs-editor-dom/lib/utils/wrap';
import { Editor } from 'roosterjs-editor-core';
import { ContentScope, NodeType } from 'roosterjs-editor-types';
import { unwrap } from 'roosterjs-editor-dom';

/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level
 */
export default function toggleHeader(editor: Editor, level: number) {
    level = Math.min(Math.max(Math.round(level), 0), 6);
    let headerNodes: Node[] = [];
    for (let i = 1; i <= 6; i++) {
        headerNodes = headerNodes.concat(queryNodesWithSelection(editor, 'H' + i));
    }

    execFormatWithUndo(
        editor,
        () => {
            headerNodes.forEach(header => {
                wrap(header, '<div></div>');
                unwrap(header);
            });

            if (level > 0) {
                let traverser = editor.getContentTraverser(ContentScope.Selection);
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
                editor.getDocument().execCommand('formatBlock', false, `<H${level}>`);

                let nodes = queryNodesWithSelection(editor, 'H' + level);
                return nodes.length == 1 ? nodes[0] : null;
            }
        },
        true /*preserveSelection*/
    );
}
