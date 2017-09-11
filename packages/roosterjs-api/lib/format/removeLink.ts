import execFormatWithUndo from './execFormatWithUndo';
import { ContentScope, NodeType } from 'roosterjs-types';
import { LinkInlineElement, PartialInlineElement, unwrap } from 'roosterjs-dom';
import { Editor } from 'roosterjs-core';

export default function removeLink(editor: Editor): void {
    editor.focus();
    let range = editor.getSelectionRange();
    if (!range) {
        return;
    }

    let formatter: () => void = null;
    if (range.collapsed) {
        // when range is not collapsed, browser execCommand won't do the 'unlink'
        let node = range.startContainer;
        if (node.nodeType == NodeType.Text) {
            node = node.parentNode;
        }
        let inlineElement = editor.getInlineElementAtNode(node);
        if (inlineElement instanceof LinkInlineElement) {
            formatter = () => {
                // The unwrap may change the selection, record the original selection and do the restore after the unwrap
                let startContainer = range.startContainer;
                let startOffset = range.startOffset;
                // Now do the unwrap and restore selection. As we restore, need to make sure the node still falls in editor
                unwrap(inlineElement.getContainerNode());
                if (editor.contains(startContainer)) {
                    range.setStart(startContainer, startOffset);
                    range.collapse(true /*toStart*/);
                    editor.updateSelection(range);
                }
            };
        }
    } else {
        // Check if selection contains any link
        let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
        let startInline = contentTraverser.currentInlineElement;
        let hasLink = false;
        while (startInline) {
            if (
                startInline instanceof LinkInlineElement ||
                (startInline instanceof PartialInlineElement &&
                    (startInline as PartialInlineElement).getDecoratedInline() instanceof
                        LinkInlineElement)
            ) {
                hasLink = true;
                break;
            }
            startInline = contentTraverser.getNextInlineElement();
        }

        if (hasLink) {
            formatter = () => editor.getDocument().execCommand('unlink', false, null);
        }
    }

    if (formatter) {
        execFormatWithUndo(editor, formatter);
    }
}
