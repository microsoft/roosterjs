import { containerSizeFormatParser } from '../../override/containerSizeFormatParser';
import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import { createPasteEntityProcessor } from '../../override/pasteEntityProcessor';
import { createPasteGeneralProcessor } from '../../override/pasteGeneralProcessor';
import { getSegmentTextFormat } from '../../publicApi/domUtils/getSegmentTextFormat';
import { getSelectedSegments } from '../../publicApi/selection/collectSelections';
import { mergeModel } from '../../publicApi/model/mergeModel';
import { pasteDisplayFormatParser } from '../../override/pasteDisplayFormatParser';
import { pasteTextProcessor } from '../../override/pasteTextProcessor';
import type { MergeModelOption } from '../../publicApi/model/mergeModel';
import type {
    BeforePasteEvent,
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
    FormatWithContentModelContext,
} from 'roosterjs-content-model-types';

const EmptySegmentFormat: Required<ContentModelSegmentFormat> = {
    backgroundColor: '',
    fontFamily: '',
    fontSize: '',
    fontWeight: '',
    italic: false,
    letterSpacing: '',
    lineHeight: '',
    strikethrough: false,
    superOrSubScriptSequence: '',
    textColor: '',
    underline: false,
};

/**
 * @internal
 */
export function mergePasteContent(
    model: ContentModelDocument,
    context: FormatWithContentModelContext,
    eventResult: BeforePasteEvent,
    defaultDomToModelOptions: DomToModelOption
) {
    const { fragment, domToModelOption, customizedMerge, pasteType } = eventResult;
    const selectedSegment = getSelectedSegments(model, true /*includeFormatHolder*/)[0];
    const domToModelContext = createDomToModelContext(
        undefined /*editorContext*/,
        defaultDomToModelOptions,
        {
            processorOverride: {
                '#text': pasteTextProcessor,
                entity: createPasteEntityProcessor(domToModelOption),
                '*': createPasteGeneralProcessor(domToModelOption),
            },
            formatParserOverride: {
                display: pasteDisplayFormatParser,
            },
            additionalFormatParsers: {
                container: [containerSizeFormatParser],
            },
        },
        domToModelOption
    );

    domToModelContext.segmentFormat = selectedSegment ? getSegmentTextFormat(selectedSegment) : {};

    const pasteModel = domToContentModel(fragment, domToModelContext);
    const mergeOption: MergeModelOption = {
        mergeFormat: pasteType == 'mergeFormat' ? 'keepSourceEmphasisFormat' : 'none',
        mergeTable: shouldMergeTable(pasteModel),
    };

    const insertPoint = customizedMerge
        ? customizedMerge(model, pasteModel)
        : mergeModel(model, pasteModel, context, mergeOption);

    if (insertPoint) {
        context.newPendingFormat = {
            ...EmptySegmentFormat,
            ...model.format,
            ...insertPoint.marker.format,
        };
    }
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
