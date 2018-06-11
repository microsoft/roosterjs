import execFormatWithUndo from './execFormatWithUndo';
import getFormatState from './getFormatState';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { DefaultFormat, DocumentCommand, NodeType } from 'roosterjs-editor-types';
import { Editor, browserData } from 'roosterjs-editor-core';
import { applyFormat } from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '&#8203;';

/**
 * Execute a document command
 * @param editor The editor instance
 * @param command The command to execute
 * @param addUndoSnapshotWhenCollapsed Optional, set to true to always add undo snapshot even current selection is collapsed.
 * Default value is false.
 * @param doWorkaroundForList Optional, set to true to do workaround for list in order to keep current format.
 * Default value is false.
 */
export default function execCommand(
    editor: Editor,
    command: DocumentCommand,
    addUndoSnapshotWhenCollapsed?: boolean,
    doWorkaroundForList?: boolean
) {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand(command, false, null);
    let callback = doWorkaroundForList ? () => workaroundForList(editor, formatter) : formatter;

    let range = editor.getSelectionRange();
    if (range && range.collapsed && !addUndoSnapshotWhenCollapsed) {
        callback();
    } else {
        execFormatWithUndo(editor, callback);
    }
}

/**
 * Browsers don't handle bullet/numbering list well, especially the formats when switching list statue
 * So we workaround it by always adding format to list element
 */
export function workaroundForList(editor: Editor, callback: () => void) {
    let workaroundSpan: HTMLElement;

    // Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
    if (browserData.isEdge) {
        let node = getNodeAtCursor(editor) as Element;
        if (node && node.nodeType == NodeType.Element && node.textContent == '') {
            workaroundSpan = editor.getDocument().createElement('span');
            node.insertBefore(workaroundSpan, node.firstChild);
            workaroundSpan.innerHTML = ZERO_WIDTH_SPACE;
        }
    }

    let ancestorFormats = getAncestorListFormats(editor);
    let currentFormat = getCurrentFormat(editor);

    callback();

    // Workaround for Chrome to avoid losing format when toggle bullet
    if (browserData.isChrome) {
        queryNodesWithSelection(editor, 'LI', false /*notContainedByRangeOnly*/, listNode => {
            if (
                listNode &&
                !listNode.getAttribute('style') &&
                !ancestorFormats.find(format => format.node == listNode)
            ) {
                applyFormat(listNode, currentFormat);
            }
        });

        ancestorFormats.forEach(
            nodeEntry =>
                nodeEntry.format &&
                editor.contains(nodeEntry.node) &&
                nodeEntry.node.setAttribute('style', nodeEntry.format)
        );
    }

    editor.deleteNode(workaroundSpan);
}

function getAncestorListFormats(editor: Editor) {
    let result: {
        node: HTMLElement;
        format: string;
    }[] = [];
    let node = getNodeAtCursor(editor, 'LI') as HTMLElement;

    while (node) {
        result.push({
            node: node,
            format: node.getAttribute('style'),
        });
        node = getNodeAtCursor(editor, 'LI', node.parentNode) as HTMLElement;
    }

    return result;
}

function getCurrentFormat(editor: Editor): DefaultFormat {
    let format = getFormatState(editor, null);
    return format
        ? {
              fontFamily: format.fontName,
              fontSize: format.fontSize,
              textColor: format.textColor,
              bold: format.isBold,
              italic: format.isItalic,
              underline: format.isUnderline,
          }
        : {};
}
