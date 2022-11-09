import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export function getRegularSelectionOffsets(
    context: DomToModelContext,
    currentContainer: Node
): [number, number] {
    let startOffset =
        context.regularSelection?.startContainer == currentContainer
            ? context.regularSelection.startOffset!
            : -1;
    let endOffset =
        context.regularSelection?.endContainer == currentContainer
            ? context.regularSelection.endOffset!
            : -1;

    return [startOffset, endOffset];
}
