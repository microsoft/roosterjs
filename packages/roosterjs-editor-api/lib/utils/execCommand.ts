import {
    ContentTraverser,
    findClosestElementAncestor,
    getSelectedTableCells,
    PendableFormatCommandMap,
    PendableFormatNames,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    DocumentCommand,
    IEditor,
    NodePosition,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Execute a document command
 * @param editor The editor instance
 * @param command The command to execute
 * @param addUndoSnapshotWhenCollapsed Optional, set to true to always add undo snapshot even current selection is collapsed.
 * Default value is false.
 * @param doWorkaroundForList Optional, set to true to do workaround for list in order to keep current format.
 * Default value is false.
 */
export default function execCommand(editor: IEditor, command: DocumentCommand) {
    editor.focus();

    let formatter = () => editor.getDocument().execCommand(command, false, null);
    let range = editor.getSelectionRange();
    if (range && range.collapsed) {
        editor.addUndoSnapshot();
        const formatState = editor.getPendableFormatState(false /* forceGetStateFromDom */);
        formatter();
        const formatName = Object.keys(PendableFormatCommandMap).filter(
            (x: PendableFormatNames) => PendableFormatCommandMap[x] == command
        )[0] as PendableFormatNames;

        if (formatName) {
            formatState[formatName] = !formatState[formatName];
            editor.triggerPluginEvent(PluginEventType.PendingFormatStateChanged, {
                formatState: formatState,
            });
        }
    } else {
        const handler = (start: NodePosition, end: NodePosition) => {
            const selectedCells = Array.from(getSelectedTableCells(editor));
            if (selectedCells.length == 0) {
                formatter();
            } else {
                const selection = editor.getDocument().defaultView.getSelection();

                let range = new Range();
                range.setStart(
                    findClosestElementAncestor(start.node, null, 'table')
                        ? start.node.parentNode
                        : start.node,
                    0
                );
                range.setEnd(end.node, end.offset);

                let startNode: Node;
                let endNode: Node;

                const contentTraverser = ContentTraverser.createSelectionTraverser(
                    range.commonAncestorContainer,
                    range
                );
                let inlineElement = contentTraverser && contentTraverser.currentInlineElement;
                while (inlineElement) {
                    let nextInlineElement = contentTraverser.getNextInlineElement();

                    const element = inlineElement.getContainerNode();
                    const findClosestTD = findClosestElementAncestor(
                        element,
                        range.commonAncestorContainer,
                        'TD'
                    );

                    let tempRange = new Range();
                    if (selectedCells.indexOf(findClosestTD) > -1) {
                        startNode = null;
                        endNode = null;

                        tempRange.setStartBefore(findClosestTD);
                        tempRange.setEndAfter(findClosestTD);
                        selection.removeAllRanges();
                        selection.addRange(tempRange);
                        formatter();
                    } else if (!findClosestTD) {
                        startNode = startNode || element;
                        endNode = element;

                        if (
                            findClosestElementAncestor(
                                element,
                                range.commonAncestorContainer,
                                'TD'
                            ) ||
                            !nextInlineElement
                        ) {
                            tempRange.setStartBefore(startNode);
                            if (endNode == range.endContainer) {
                                tempRange.setEnd(endNode, range.endOffset);
                            } else {
                                tempRange.setEndAfter(endNode);
                            }

                            selection.removeAllRanges();
                            selection.addRange(tempRange);
                            formatter();
                        }
                    }
                    inlineElement = nextInlineElement;
                }
                console.log(editor.getSelectionRange(true));
                console.log(range);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };
        editor.addUndoSnapshot(handler, ChangeSource.Format);
    }
}
