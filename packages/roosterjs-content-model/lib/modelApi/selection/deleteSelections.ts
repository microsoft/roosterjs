import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { iterateSelections, TableSelectionContext } from './iterateSelections';

/**
 * @internal
 */
export interface InsertPosition {
    marker: ContentModelSelectionMarker;
    paragraph: ContentModelParagraph;
    path: ContentModelBlockGroup[];
    tableContext?: TableSelectionContext;
}

/**
 * @internal
 */
export function deleteSelection(model: ContentModelDocument): InsertPosition | null {
    let insertPosition: InsertPosition | undefined;
    let lastParagraph: ContentModelParagraph | undefined;
    let lastTableContext: TableSelectionContext | undefined;

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            let paragraph: ContentModelParagraph | undefined;
            let markerFormat: ContentModelSegmentFormat | undefined;
            let insertMarkerIndex = 0;

            if (segments) {
                if (segments.length > 0 && block?.blockType == 'Paragraph') {
                    paragraph = block;
                    insertMarkerIndex = paragraph.segments.indexOf(segments[0]);
                    markerFormat = segments[0].format;

                    lastParagraph = paragraph;
                    lastTableContext = tableContext;

                    segments.forEach(segment => {
                        const index = block.segments.indexOf(segment);

                        if (index >= 0) {
                            block.segments.splice(index, 1);
                        }
                    });
                }
            } else if (block) {
                const blocks = path[0].blocks;

                paragraph = createParagraph(true /*implicit*/);
                const index = blocks.indexOf(block);

                if (index >= 0) {
                    // Always insert a new (dummy) paragraph when delete a block to keep the count of blocks not changed
                    // so that the loop iterateSelections() can keep working. This may need some improvement later.
                    blocks.splice(index, 1, paragraph);
                }
            } else if (tableContext) {
                const { table, colIndex, rowIndex } = tableContext;
                const cell = table.cells[rowIndex][colIndex];

                path = [cell, ...path];
                paragraph = createParagraph(true /*implicit*/);
                cell.blocks = [paragraph];
            }

            if (!insertPosition && paragraph && insertMarkerIndex >= 0) {
                const marker = createSelectionMarker(markerFormat);

                paragraph.segments.splice(insertMarkerIndex, 0, marker);
                insertPosition = { marker, paragraph, path, tableContext };
            }
        },
        {
            contentUnderSelectedTableCell: 'ignoreForTableOrCell', // When a table cell is selected, we replace all content for this cell, so no need to go into its content
            includeListFormatHolder: 'never',
        }
    );

    if (insertPosition && lastParagraph && lastParagraph != insertPosition.paragraph) {
        const { paragraph, marker, tableContext } = insertPosition;
        const { rowIndex, colIndex } = tableContext || {};
        const { rowIndex: lastRowIndex, colIndex: lastColIndex } = lastTableContext || {};

        if (
            paragraph != lastParagraph &&
            tableContext == lastTableContext &&
            rowIndex == lastRowIndex &&
            colIndex == lastColIndex
        ) {
            const markerIndex = paragraph.segments.indexOf(marker);

            if (markerIndex >= 0) {
                paragraph.segments.splice(markerIndex + 1, 0, ...lastParagraph.segments);
                lastParagraph.segments = [];
            }
        }
    }

    return insertPosition || null;
}
