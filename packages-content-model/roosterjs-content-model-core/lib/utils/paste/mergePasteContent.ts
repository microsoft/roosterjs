import { mergeModel } from '../../publicApi/model/mergeModel';
import type {
    ContentModelDocument,
    FormatWithContentModelContext,
    InsertPoint,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergePasteContent(
    model: ContentModelDocument,
    context: FormatWithContentModelContext,
    pasteModel: ContentModelDocument,
    applyCurrentFormat: boolean,
    customizedMerge:
        | undefined
        | ((source: ContentModelDocument, target: ContentModelDocument) => InsertPoint | null)
): InsertPoint | null {
    return customizedMerge
        ? customizedMerge(model, pasteModel)
        : mergeModel(model, pasteModel, context, {
              mergeFormat: applyCurrentFormat ? 'keepSourceEmphasisFormat' : 'none',
              mergeTable: shouldMergeTable(pasteModel),
          });
}

function shouldMergeTable(pasteModel: ContentModelDocument): boolean | undefined {
    // If model contains a table and a paragraph element after the table with a single BR segment, remove the Paragraph after the table
    if (
        pasteModel.blocks.length == 2 &&
        pasteModel.blocks[0].blockType === 'Table' &&
        pasteModel.blocks[1].blockType === 'Paragraph' &&
        pasteModel.blocks[1].segments.length === 1 &&
        pasteModel.blocks[1].segments[0].segmentType === 'Br'
    ) {
        pasteModel.blocks.splice(1);
    }
    // Only merge table when the document contain a single table.
    return pasteModel.blocks.length === 1 && pasteModel.blocks[0].blockType === 'Table';
}
