import { createDomToModelContextForSanitizing } from '../createModelFromHtml/createDomToModelContextForSanitizing';
import {
    ChangeSource,
    cloneModel,
    domToContentModel,
    getSegmentTextFormat,
    getSelectedSegments,
    mergeModel,
} from 'roosterjs-content-model-dom';
import type {
    BeforePasteEvent,
    ClipboardData,
    CloneModelOptions,
    ContentModelDocument,
    ContentModelSegmentFormat,
    IEditor,
    MergeModelOption,
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

const CloneOption: CloneModelOptions = {
    includeCachedElement: (node, type) => (type == 'cache' ? undefined : node),
};

/**
 * @internal
 */
export function cloneModelForPaste(model: ContentModelDocument) {
    return cloneModel(model, CloneOption);
}

/**
 * @internal
 */
export function mergePasteContent(
    editor: IEditor,
    eventResult: BeforePasteEvent,
    clipboardData: ClipboardData
) {
    const { fragment, domToModelOption, customizedMerge, pasteType } = eventResult;

    editor.formatContentModel(
        (model, context) => {
            if (clipboardData.modelBeforePaste) {
                const clonedModel = cloneModelForPaste(clipboardData.modelBeforePaste);
                model.blocks = clonedModel.blocks;
            }

            const selectedSegment = getSelectedSegments(model, true /*includeFormatHolder*/)[0];
            const domToModelContext = createDomToModelContextForSanitizing(
                editor.getDocument(),
                undefined /*defaultFormat*/,
                editor.getEnvironment().domToModelSettings.customized,
                domToModelOption
            );

            domToModelContext.segmentFormat = selectedSegment
                ? getSegmentTextFormat(selectedSegment)
                : {};

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

            return true;
        },
        {
            changeSource: ChangeSource.Paste,
            getChangeData: () => clipboardData,
            scrollCaretIntoView: true,
            apiName: 'paste',
        }
    );
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
