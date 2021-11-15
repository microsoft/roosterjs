import {
    ContentTraverser,
    findClosestElementAncestor,
    getSelectedTableCells,
    getTagOfNode,
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
                let range = new Range();
                range.setStart(
                    findClosestElementAncestor(start.node, null, 'table')
                        ? start.node.parentNode
                        : start.node,
                    0
                );
                range.setEnd(end.node, end.offset);

                const contentTraverser = ContentTraverser.createSelectionTraverser(
                    editor.getScrollContainer(),
                    range
                );
                let inlineElement = contentTraverser && contentTraverser.currentInlineElement;
                while (inlineElement) {
                    let nextInlineElement = contentTraverser.getNextInlineElement();

                    const element = inlineElement.getContainerNode();
                    const findClosestTD = findClosestElementAncestor(element, null, 'TD');

                    let tempRange = new Range();
                    if (selectedCells.indexOf(findClosestTD) > -1) {
                        tempRange.selectNode(findClosestTD as Node);
                        editor.getDocument().defaultView.getSelection().removeAllRanges();
                        editor.getDocument().defaultView.getSelection().addRange(tempRange);
                        formatter();
                    } else if (getTagOfNode(findClosestTD) != 'TD') {
                        if (element == start.node) {
                            tempRange.setStart(element, start.offset);
                        } else {
                            tempRange.setStartBefore(element as Node);
                        }

                        if (element == start.node) {
                            tempRange.setEnd(element, end.offset);
                        } else {
                            tempRange.setEndAfter(element as Node);
                        }

                        editor.getDocument().defaultView.getSelection().removeAllRanges();
                        editor.getDocument().defaultView.getSelection().addRange(tempRange);
                        formatter();
                    }

                    editor.getDocument().defaultView.getSelection().removeAllRanges();
                    editor.getDocument().defaultView.getSelection().addRange(range);
                    inlineElement = nextInlineElement;
                }
            }
        };
        editor.addUndoSnapshot(handler, ChangeSource.Format);
    }
}
