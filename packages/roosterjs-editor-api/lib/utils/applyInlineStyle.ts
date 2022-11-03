import formatUndoSnapshot from './formatUndoSnapshot';
import { getTagOfNode } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    IEditor,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param callback The callback function to apply style
 */
export default function applyInlineStyle(
    editor: IEditor,
    callback: (element: HTMLElement, isInnerNode?: boolean) => any,
    apiName: string
) {
    editor.focus();
    let selection = editor.getSelectionRangeEx();

    const safeCallback = (element: HTMLElement, isInnerNode?: boolean) =>
        element.isContentEditable && callback(element, isInnerNode);

    if (selection && selection.areAllCollapsed) {
        const range = selection.ranges[0];
        let node = range.startContainer;
        let isEmptySpan =
            getTagOfNode(node) == 'SPAN' &&
            (!node.firstChild ||
                (getTagOfNode(node.firstChild) == 'BR' && !node.firstChild.nextSibling));
        if (isEmptySpan) {
            editor.addUndoSnapshot();
            safeCallback(node as HTMLElement);
        } else {
            editor.triggerPluginEvent(PluginEventType.PendingFormatStateChanged, {
                formatState: {},
                formatCallback: safeCallback,
            });
            editor.triggerContentChangedEvent(ChangeSource.Format);
        }
    } else {
        // This is start and end node that get the style. The start and end needs to be recorded so that selection
        // can be re-applied post-applying style
        formatUndoSnapshot(
            editor,
            () => {
                let firstNode: Node;
                let lastNode: Node;
                selection.ranges.forEach(range => {
                    let contentTraverser = editor.getSelectionTraverser(range);
                    let inlineElement = contentTraverser && contentTraverser.currentInlineElement;
                    while (inlineElement) {
                        let nextInlineElement = contentTraverser.getNextInlineElement();
                        inlineElement.applyStyle((element, isInnerNode) => {
                            safeCallback(element, isInnerNode);
                            firstNode = firstNode || element;
                            lastNode = element;
                        });
                        inlineElement = nextInlineElement;
                    }
                });

                if (firstNode && lastNode && selection.type == SelectionRangeTypes.Normal) {
                    editor.select(firstNode, PositionType.Before, lastNode, PositionType.After);
                }
            },
            apiName
        );
    }
}
