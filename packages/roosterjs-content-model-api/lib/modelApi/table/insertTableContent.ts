import {
    createParagraph,
    createTableCell,
    createTableRow,
    iterateSelections,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelTable,
    ContentModelTableCellFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function insertTableContent(
    model: ContentModelDocument,
    table: ContentModelTable,
    colNumber: number,
    customCellFormat?: ContentModelTableCellFormat
) {
    let index = 0;
    let lastBlock: ContentModelBlockGroup | undefined = undefined;

    iterateSelections(model, (path, _tableContext, block, segments) => {
        if (!table.rows[index]) {
            const row = createTableRow();
            for (let i = 0; i < colNumber; i++) {
                const cell = createTableCell(
                    undefined /*spanLeftOrColSpan */,
                    undefined /*spanAboveOrRowSpan */,
                    undefined /* isHeader */,
                    customCellFormat
                );
                row.cells.push(cell);
            }
            table.rows.push(row);
        }

        if (path.length == 1 && block) {
            const contentBlock = getContentBlockFromSelection(block, segments);
            table.rows[index].cells[0].blocks = [contentBlock];
            index++;
        } else if (
            block &&
            path[0].blockGroupType !== 'TableCell' &&
            path[0].blockGroupType !== 'Document' &&
            path[0] !== lastBlock
        ) {
            table.rows[index].cells[0].blocks = [path[0]];
            lastBlock = path[0];
            index++;
        }
    });
}

function getContentBlockFromSelection(
    block: ContentModelBlock,
    segments?: ContentModelSegment[]
): ContentModelBlock {
    if (block.blockType === 'Paragraph' && segments && segments.length > 0) {
        const paragraph = block as ContentModelParagraph;
        const newParagraph = createParagraph(
            paragraph.isImplicit,
            paragraph.format,
            paragraph.segmentFormat,
            paragraph.decorator
        );
        newParagraph.segments = [...segments];
        return newParagraph;
    }
    return block;
}
