import { createBr, createParagraph, mutateBlock } from 'roosterjs-content-model-dom';
import type { ReadonlyContentModelTableCell } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function copyPreviousCellSegmentFormat(
    cell: ReadonlyContentModelTableCell,
    newCell: ReadonlyContentModelTableCell
) {
    const block = cell.blocks[0];
    if (block && block?.blockType == 'Paragraph') {
        const firstSegment = block.segments[0];
        if (
            firstSegment &&
            (firstSegment.segmentType == 'Text' ||
                firstSegment.segmentType == 'Br' ||
                firstSegment.segmentType == 'SelectionMarker')
        ) {
            const newCellParagraph = createParagraph(
                false /* isImplicit */,
                block.format,
                block.segmentFormat
            );
            const br = createBr(firstSegment.format);
            newCellParagraph.segments.push(br);
            mutateBlock(newCell).blocks.push(newCellParagraph);
        }
    }
}
