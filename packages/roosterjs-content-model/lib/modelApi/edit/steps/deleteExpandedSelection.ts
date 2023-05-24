import { ContentModelDocument } from '../../../publicTypes/group/ContentModelDocument';
import { createBr } from '../../creators/createBr';
import { createInsertPoint } from '../utils/createInsertPoint';
import { createParagraph } from '../../creators/createParagraph';
import { createSelectionMarker } from '../../creators/createSelectionMarker';
import { deleteBlock } from '../utils/deleteBlock';
import { deleteSegment } from '../utils/deleteSegment';
import { EditContext, EditOptions } from '../utils/EditStep';
import { iterateSelections, IterateSelectionsOption } from '../../selection/iterateSelections';
import { setParagraphNotImplicit } from '../../block/setParagraphNotImplicit';

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
    options: EditOptions,
    model: ContentModelDocument
): EditContext {
    const { onDeleteEntity } = options;
    const context: EditContext = {
        isChanged: false,
    };

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            // Set paragraph, format and index for default position where we will put cursor to.
            // Later we can overwrite these info when process the selections
            let paragraph = createParagraph(true /*implicit*/);
            let markerFormat = model.format;
            let insertMarkerIndex = 0;

            if (segments) {
                // Delete segments inside a paragraph
                if (segments[0] && block?.blockType == 'Paragraph') {
                    // Now that we have found a paragraph with selections, we can overwrite the default paragraph with this one
                    // so we can put cursor here after delete
                    paragraph = block;
                    insertMarkerIndex = paragraph.segments.indexOf(segments[0]);
                    markerFormat = segments[0].format;

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
                        } else {
                            context.isChanged =
                                deleteSegment(block, segment, onDeleteEntity) || context.isChanged;
                        }
                    });
                }
            } else if (block) {
                // Delete a whole block (divider, table, ...)
                const blocks = path[0].blocks;
                context.isChanged =
                    deleteBlock(blocks, block, onDeleteEntity, paragraph) || context.isChanged;
            } else if (tableContext) {
                // Delete a whole table cell
                const { table, colIndex, rowIndex } = tableContext;
                const row = table.rows[rowIndex];
                const cell = row.cells[colIndex];

                path = [cell, ...path];
                paragraph.segments.push(createBr(model.format));
                cell.blocks = [paragraph];

                delete cell.cachedElement;
                delete row.cachedElement;
                context.isChanged = true;
            }

            // When delete whole selection, we should add an undo snapshot immediately
            context.addUndoSnapshot = context.isChanged;

            if (!context.insertPoint) {
                // If we have not got a insert point after delete and we have a paragraph to put an insert point in, create insert point now
                const marker = createSelectionMarker(markerFormat);

                setParagraphNotImplicit(paragraph);
                paragraph.segments.splice(insertMarkerIndex, 0, marker);
                context.insertPoint = createInsertPoint(marker, paragraph, path, tableContext);
            }
        },
        DeleteSelectionIteratingOptions
    );

    return context;
}
