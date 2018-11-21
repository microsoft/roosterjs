import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    fromHtml,
    isVoidHtmlElement,
    isBlockElement,
    Browser,
    isNodeEmpty,
    getTagOfNode,
    getComputedStyles,
    applyFormat,
    getFirstLeafNode,
} from 'roosterjs-editor-dom';

const TEMP_NODE_CLASS = 'ROOSTERJS_TEMP_NODE_FOR_LIST';
const TEMP_NODE_HTML = `<img class="${TEMP_NODE_CLASS}">`;

/**
 * Browsers don't handle bullet/numbering list well, especially the formats when switching list statue
 * So we workaround it by always adding format to list element
 */
export default function processList(editor: Editor, command: DocumentCommand): Node {
    if (Browser.isChrome) {
        workaroundForChrome(editor);
    }

    let currentNode = editor.getElementAtCursor();
    let currentFormat = getComputedStyles(currentNode);
    let existingList = editor.getElementAtCursor('OL,UL');
    editor.getDocument().execCommand(command, false, null);
    editor.queryElements('.' + TEMP_NODE_CLASS, node => editor.deleteNode(node));
    let newList = editor.getElementAtCursor('OL,UL');
    if (newList == existingList) {
        newList = null;
    }

    // If this is in a new number list, need to adjust the format of numbers according to its content
    if (newList && getTagOfNode(newList) == 'OL') {
        let LIs = ([].slice.call(newList.childNodes) as Node[]).filter(
            node => getTagOfNode(node) == 'LI'
        );

        if (LIs.length == 1 && isNodeEmpty(LIs[0], true /*trim*/)) {
            // When there's only one LI child element which has empty content, it means this LI is just created.
            // We just format it with current format
            applyListFormat(LIs[0], currentFormat);
        } else {
            // Otherwise, apply the format of first child non-empty element (if any) to LI node
            for (let li of LIs) {
                let formatNode = getFirstLeafNode(li);
                if (formatNode) {
                    applyListFormat(li, getComputedStyles(formatNode));
                }
            }
        }
    }

    return newList;
}

function applyListFormat(node: Node, formats: string[]) {
    applyFormat(node as HTMLElement, {
        fontFamily: formats[0],
        fontSize: formats[1],
        textColor: formats[2],
        backgroundColor: formats[3],
    });
}

function workaroundForChrome(editor: Editor) {
    let traverser = editor.getSelectionTraverser();
    let block = traverser && traverser.currentBlockElement;
    while (block) {
        let container = block.getStartNode();

        if (container && !isNodeEmpty(container)) {
            // Add a temp <IMG> tag before all other nodes in the block to avoid Chrome remove existing format when toggle list
            let tempNode = fromHtml(TEMP_NODE_HTML, editor.getDocument())[0];
            if (isVoidHtmlElement(container) || !isBlockElement(container)) {
                container.parentNode.insertBefore(tempNode, container);
            } else {
                container.insertBefore(tempNode, container.firstChild);
            }
        }

        block = traverser.getNextBlockElement();
    }
}
