import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import { createPasteGeneralProcessor } from '../../override/pasteGeneralProcessor';
import { mergeModel, MergeModelOption } from '../../publicApi/model/mergeModel';
import { pasteEntityProcessor } from '../../override/pasteEntityProcessor';
import { PasteType } from 'roosterjs-editor-types';
import type {
    ContentModelBeforePasteEvent,
    ContentModelDocument,
    DomToModelOption,
    FormatWithContentModelContext,
    InsertPoint,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergePasteContent(
    model: ContentModelDocument,
    context: FormatWithContentModelContext,
    eventResult: ContentModelBeforePasteEvent,
    defaultDomToModelOptions?: DomToModelOption
): InsertPoint | null {
    const { fragment, domToModelOption, customizedMerge, pasteType } = eventResult;
    const domToModelContext = createDomToModelContext(
        undefined /*editorContext*/,
        defaultDomToModelOptions,
        {
            processorOverride: {
                entity: pasteEntityProcessor,
                '*': createPasteGeneralProcessor(domToModelOption),
            },
        },
        domToModelOption
    );
    const pasteModel = domToContentModel(fragment, domToModelContext);
    const mergeOption: MergeModelOption = {
        mergeFormat: pasteType == PasteType.MergeFormat ? 'keepSourceEmphasisFormat' : 'none',
        mergeTable: shouldMergeTable(pasteModel),
    };

    return customizedMerge
        ? customizedMerge(model, pasteModel)
        : mergeModel(model, pasteModel, context, mergeOption);
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
