import { createBr } from '../creators/createBr';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { deleteBlock } from './deleteBlock';
import { deleteSegment } from './deleteSegment';
import { getSegmentTextFormat } from './getSegmentTextFormat';
import { iterateSelections } from '../selection/iterateSelections';
import { mutateBlock } from '../common/mutate';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';
import type {
    DeleteSelectionContext,
    FormatContentModelContext,
    InsertPoint,
    IterateSelectionsOption,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSelectionMarker,
    ReadonlyTableSelectionContext,
} from 'roosterjs-content-model-types';

const DeleteSelectionIteratingOptions: IterateSelectionsOption = {
    contentUnderSelectedTableCell: 'ignoreForTableOrCell', // When a table cell is selected, we replace all content for this cell, so no need to go into its content
    contentUnderSelectedGeneralElement: 'generalElementOnly', // When a general element is selected, we replace the whole element so no need to go into its content
    includeListFormatHolder: 'never',
};

/**
 * @internal
 * Iterate the model and find all selected content if any, delete them, and keep/create an insert point
 * at the first deleted position so that we know where to put cursor to after delete
 */
export function deleteExpandedSelection(
    model: ReadonlyContentModelDocument,
    formatContext?: FormatContentModelContext
): DeleteSelectionContext {
    const context: DeleteSelectionContext = {
        deleteResult: 'notDeleted',
        insertPoint: null,
        formatContext,
    };

    iterateSelections(
        model,
        (path, tableContext, block, segments) => {
            // Set paragraph, format and index for default position where we will put cursor to.
            // Later we can overwrite these info when process the selections
            let paragraph: ReadonlyContentModelParagraph = createParagraph(
                true /*implicit*/,
                undefined /*blockFormat*/,
                model.format
            );
            let markerFormat = model.format;
            let insertMarkerIndex = 0;

            if (segments) {
                // Delete segments inside a paragraph
                if (segments[0] && block?.blockType == 'Paragraph') {
                    // Now that we have found a paragraph with selections, we can overwrite the default paragraph with this one
                    // so we can put cursor here after delete
                    paragraph = block;
                    insertMarkerIndex = paragraph.segments.indexOf(segments[0]);
                    markerFormat = getSegmentTextFormat(segments[0]);

                    context.lastParagraph = paragraph;
                    context.lastTableContext = tableContext;

                    segments.forEach((segment, i) => {
                        if (
                            i == 0 &&
                            !context.insertPoint &&
                            segment.segmentType == 'SelectionMarker'
                        ) {
                            // First time we hit a selection and it is a selection marker, just mark it and not need to delete
                            // because this is possible a collapsed selection, then it will be handled later
                            context.insertPoint = createInsertPoint(
                                segment,
                                block,
                                path,
                                tableContext
                            );
                        } else if (deleteSegment(block, segment, context.formatContext)) {
                            context.deleteResult = 'range';
                        }
                    });

                    // Since we are operating on this paragraph and it possible we delete everything from this paragraph,
                    // Need to make it "not implicit" so that it will always have a container element, so that when we do normalization
                    // of this paragraph, a BR can be added if need
                    if (context.deleteResult == 'range') {
                        setParagraphNotImplicit(block);
                    }
                }
            } else if (block) {
                // Delete a whole block (divider, table, ...)
                if (deleteBlock(path[0], block, paragraph, context.formatContext)) {
                    context.deleteResult = 'range';
                }
            } else if (tableContext) {
                // Delete a whole table cell
                const { table, colIndex, rowIndex } = tableContext;
                const mutableTable = mutateBlock(table);
                const row = mutableTable.rows[rowIndex];
                const cell = mutateBlock(row.cells[colIndex]);
                const mutableParagraph = mutateBlock(paragraph);

                path = [cell, ...path];
                mutableParagraph.segments.push(createBr(model.format));
                cell.blocks = [mutableParagraph];

                context.deleteResult = 'range';
            }

            if (!context.insertPoint) {
                // If we have not got a insert point after delete and we have a paragraph to put an insert point in, create insert point now
                const marker = createSelectionMarker(markerFormat);
                const mutableParagraph = mutateBlock(paragraph);

                setParagraphNotImplicit(mutableParagraph);
                mutableParagraph.segments.splice(insertMarkerIndex, 0, marker);
                context.insertPoint = createInsertPoint(marker, paragraph, path, tableContext);
            }
        },
        DeleteSelectionIteratingOptions
    );

    return context;
}

function createInsertPoint(
    marker: ReadonlyContentModelSelectionMarker,
    paragraph: ReadonlyContentModelParagraph,
    path: ReadonlyContentModelBlockGroup[],
    tableContext: ReadonlyTableSelectionContext | undefined
): InsertPoint {
    return {
        marker,
        paragraph,
        path,
        tableContext,
    };
}
