import type { ContentModelBlock } from 'roosterjs-content-model-types';

/**
 * Check if a block and all its descendants are fully cached (not mutated),
 * meaning the block can be reused in DOM without any modifications.
 * @param block The block to check
 * @returns True if the block and all its descendants have valid cached elements
 * @internal
 */
export function isBlockFullyCached(block: ContentModelBlock): boolean {
    switch (block.blockType) {
        case 'Paragraph':
            return (
                !!block.cachedElement &&
                block.segments.every(s => s.segmentType !== 'General' && !s.isSelected)
            );

        case 'Table':
            return (
                !!block.cachedElement &&
                block.rows.every(
                    row =>
                        !!row.cachedElement &&
                        row.cells.every(
                            cell =>
                                // Span cells have no DOM element of their own — skip them
                                cell.spanAbove ||
                                cell.spanLeft ||
                                (!!cell.cachedElement &&
                                    !cell.isSelected &&
                                    cell.blocks.every(isBlockFullyCached))
                        )
                )
            );

        case 'Divider':
            return !!block.cachedElement && !block.isSelected;

        case 'Entity':
            return false;

        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'FormatContainer':
                    // Require at least one block: an empty blocks array with a cachedElement could
                    // have orphaned DOM children that need blockGroupChildren to clean up.
                    return (
                        !!block.cachedElement &&
                        block.blocks.length > 0 &&
                        block.blocks.every(isBlockFullyCached)
                    );

                case 'ListItem':
                    return (
                        !!block.cachedElement &&
                        block.levels.every(l => !!l.cachedElement) &&
                        block.blocks.length > 0 &&
                        block.blocks.every(isBlockFullyCached)
                    );

                default:
                    return false;
            }

        default:
            return false;
    }
}
