import type { DOMSelection, Position } from 'roosterjs-content-model-types';

/**
 * Gets the focused position using the DOM Selection provided.
 * @param selection DOM Selection to use when extracting the focused position
 * @returns container and offset of the focused position
 */
export function getFocusedPosition(selection: DOMSelection): Position | undefined {
    if (selection.type == 'range') {
        const container = selection.isReverted
            ? selection.range.startContainer
            : selection.range.endContainer;
        const offset = selection.isReverted
            ? selection.range.startOffset
            : selection.range.endOffset;

        return { container, offset };
    }

    return undefined;
}
