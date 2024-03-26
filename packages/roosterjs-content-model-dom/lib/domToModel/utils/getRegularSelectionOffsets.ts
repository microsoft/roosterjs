import type { DomToModelContext, SelectionOffsets } from 'roosterjs-content-model-types';

/**
 * Get offset numbers of a regular (range based) selection.
 * If the selection start/end position is not in the given node, it will return -1 for the related value
 * @param context DOM to Content Model context used for retrieve the selection
 * @param currentContainer The container node to check
 * @returns a tuple of start and end offsets. -1 means selection is not directly under the given node
 */
export function getRegularSelectionOffsets(
    context: DomToModelContext,
    currentContainer: Node
): SelectionOffsets {
    const range = context.selection?.type == 'range' ? context.selection.range : null;

    const start = range?.startContainer == currentContainer ? range.startOffset : -1;
    const end = range?.endContainer == currentContainer ? range.endOffset! : -1;
    const shadow =
        context.shadowInsertPoint?.input.node == currentContainer
            ? context.shadowInsertPoint.input.offset
            : -1;

    return { start, end, shadow };
}
