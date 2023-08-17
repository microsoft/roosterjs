import hasSelectionInBlock from '../selection/hasSelectionInBlock';
import {
    createBr,
    createParagraph,
    createSelectionMarker,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import { setSelection } from 'roosterjs-content-model-editor/lib/modelApi/selection/setSelection';
import {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function ensureTableSelection(
    model: ContentModelDocument,
    path: ContentModelBlockGroup[],
    table: ContentModelTable
) {
    if (!hasSelectionInBlock(table)) {
        let paragraph: ContentModelParagraph | undefined;
        const firstCell = table.rows.filter(row => row.cells.length > 0)[0]?.cells[0];

        if (firstCell) {
            paragraph = firstCell.blocks.filter(
                (block): block is ContentModelParagraph => block.blockType == 'Paragraph'
            )[0];

            if (!paragraph) {
                paragraph = createEmptyParagraph(model);
                firstCell.blocks.push(paragraph);
            }
        } else {
            let block: ContentModelBlock = table;
            let parent: ContentModelBlockGroup | undefined;

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

        if (paragraph) {
            const marker = createSelectionMarker(model.format);

            paragraph.segments.unshift(marker);
            setParagraphNotImplicit(paragraph);
            setSelection(model, marker);
        }
    }
}

function createEmptyParagraph(model: ContentModelDocument) {
    const newPara = createParagraph(false /*isImplicit*/, undefined /*blockFormat*/, model.format);
    const br = createBr(model.format);

    newPara.segments.push(br);

    return newPara;
}
