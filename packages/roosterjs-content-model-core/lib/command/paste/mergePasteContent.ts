import { createDomToModelContextForSanitizing } from '../createModelFromHtml/createDomToModelContextForSanitizing';
import {
    ChangeSource,
    EmptySegmentFormat,
    cloneModel,
    domToContentModel,
    getSegmentTextFormat,
    getSelectedSegments,
    mergeModel,
} from 'roosterjs-content-model-dom';
import type {
    BeforePasteEvent,
    CloneModelOptions,
    ContentModelDocument,
    ContentModelSegmentFormat,
    IEditor,
    MergeModelOption,
    PasteType,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

const BlackColor = 'rgb(0,0,0)';

const CloneOption: CloneModelOptions = {
    includeCachedElement: (node, type) => (type == 'cache' ? undefined : node),
};

/**
 * @internal
 */
export function cloneModelForPaste(model: ReadonlyContentModelDocument) {
    return cloneModel(model, CloneOption);
}

/**
 * @internal
 */
export function mergePasteContent(
    editor: IEditor,
    eventResult: BeforePasteEvent,
    isFirstPaste: boolean
) {
    const {
        fragment,
        domToModelOption,
        customizedMerge,
        pasteType,
        clipboardData,
        containsBlockElements,
    } = eventResult;

    editor.formatContentModel(
        (model, context) => {
            if (!isFirstPaste && clipboardData.modelBeforePaste) {
                const clonedModel = cloneModelForPaste(clipboardData.modelBeforePaste);
                model.blocks = clonedModel.blocks;
            }

            const domToModelContext = createDomToModelContextForSanitizing(
                editor.getDocument(),
                undefined /*defaultFormat*/,
                editor.getEnvironment().domToModelSettings.customized,
                domToModelOption
            );

            domToModelContext.segmentFormat = getSegmentFormatForPaste(model, pasteType);

            const pasteModel = domToContentModel(fragment, domToModelContext);
            const mergeOption: MergeModelOption = {
                mergeFormat: pasteType == 'mergeFormat' ? 'keepSourceEmphasisFormat' : 'none',
                mergeTable: shouldMergeTable(pasteModel),
                addParagraphAfterMergedContent: containsBlockElements,
            };

            const insertPoint = customizedMerge
                ? customizedMerge(model, pasteModel)
                : mergeModel(model, pasteModel, context, mergeOption);

            if (insertPoint) {
                const modelFormat = model.format || {};
                context.newPendingFormat = {
                    ...EmptySegmentFormat,
                    ...modelFormat,
                    ...(pasteType == 'normal' && !containsBlockElements
                        ? getLastSegmentFormat(pasteModel, modelFormat)
                        : insertPoint.marker.format),
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

function getSegmentFormatForPaste(
    model: ShallowMutableContentModelDocument,
    pasteType: PasteType
): ContentModelSegmentFormat {
    const selectedSegment = getSelectedSegments(model, true /*includeFormatHolder*/)[0];

    if (selectedSegment) {
        const result = getSegmentTextFormat(selectedSegment);
        if (pasteType == 'normal') {
            // When using normal paste (Keep source formatting) set the default text color to black when creating the
            // Model from the clipboard content, so the elements that do not contain any text color in their style
            // Are set to black. Otherwise, These segments would get the selected segments format or the default text set in the content.
            result.textColor = BlackColor;
        }

        return result;
    }

    return {};
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

function getLastSegmentFormat(
    pasteModel: ContentModelDocument,
    originalFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    if (pasteModel.blocks.length == 1) {
        const [firstBlock] = pasteModel.blocks;

        if (firstBlock.blockType == 'Paragraph') {
            const segment = firstBlock.segments[firstBlock.segments.length - 1];
            const hasLink = segment.segmentType === 'Text' && segment.link;
            
            // If the last segment is a link, preserve the original text color
            if (hasLink && originalFormat.textColor) {
                return {
                    ...segment.format,
                    textColor: originalFormat.textColor,
                };
            } else {
                return {
                    ...segment.format,
                };
            }
        }
    }

    return {};
}
