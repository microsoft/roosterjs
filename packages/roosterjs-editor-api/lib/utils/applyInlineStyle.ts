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
                formatCallback: callback,
            });
            editor.triggerContentChangedEvent(ChangeSource.Format);

            // let isZWSNode =
            //     node &&
            //     node.nodeType == NodeType.Text &&
            //     node.nodeValue == ZERO_WIDTH_SPACE &&
            //     getTagOfNode(node.parentNode) == 'SPAN';

            // if (!isZWSNode) {
            //     editor.addUndoSnapshot();
            //     // Create a new text node to hold the selection.
            //     // Some content is needed to position selection into the span
            //     // for here, we inject ZWS - zero width space
            //     node = editor.getDocument().createTextNode(ZERO_WIDTH_SPACE);
            //     range.insertNode(node);
            // }

            // applyTextStyle(node, safeCallback);
            // editor.select(node, PositionType.End);
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
