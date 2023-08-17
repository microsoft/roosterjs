import { createBr, createParagraph } from 'roosterjs-content-model-dom';
import {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * After edit table, it maybe in a abnormal state, e.g. selected table cell is removed, or all rows are removed causes no place to put cursor.
 * We need to make sure table is in normal state, and there is a place to put cursor.
 * @returns a new paragraph that can but put focus in, or undefined if not needed
 */
export function normalizeTableAfterEdit(
    model: ContentModelDocument,
    path: ContentModelBlockGroup[],
    table: ContentModelTable
): ContentModelParagraph | undefined {
    let paragraph: ContentModelParagraph | undefined;
    const firstCell = table.rows.filter(row => row.cells.length > 0)[0]?.cells[0];

    if (firstCell) {
        // When there is a valid cell to put focus, use it
        paragraph = firstCell.blocks.filter(
            (block): block is ContentModelParagraph => block.blockType == 'Paragraph'
        )[0];

        if (!paragraph) {
            // If there is not a paragraph under this cell, create one
            paragraph = createEmptyParagraph(model);
            firstCell.blocks.push(paragraph);
        }
    } else {
        // No table cell at all, which means the whole table is deleted. So we need to remove it from content model.
        let block: ContentModelBlock = table;
        let parent: ContentModelBlockGroup | undefined;

        // If the table is the only block of its parent and parent is a FormatContainer, remove the parent as well.
        // We need to do this in a loop in case there are multiple layer of FormatContainer that match this case
        while ((parent = path.shift())) {
            const index = parent.blocks.indexOf(block) ?? -1;

            if (parent && index >= 0) {
                paragraph = createEmptyParagraph(model);
                parent.blocks.splice(index, 1, paragraph);
            }

            if (
                parent.blockGroupType == 'FormatContainer' &&
                parent.blocks.length == 1 &&
                parent.blocks[0] == paragraph
            ) {
                // If the new paragraph is the only child of parent format container, unwrap parent as well
                block = parent;
            } else {
                // Otherwise, just stop here and keep processing the new paragraph
                break;
            }
        }
    }

    return paragraph;
}

function createEmptyParagraph(model: ContentModelDocument) {
    const newPara = createParagraph(false /*isImplicit*/, undefined /*blockFormat*/, model.format);
    const br = createBr(model.format);

    newPara.segments.push(br);

    return newPara;
}
