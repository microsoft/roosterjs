import { ChangeSource } from '../../constants/ChangeSource';
import { createDomToModelContextForSanitizing } from '../createDomToModelContextForSanitizing';
import { domToContentModel } from 'roosterjs-content-model-dom';
import { getSegmentTextFormat } from '../../publicApi/domUtils/getSegmentTextFormat';
import { getSelectedSegments } from '../../publicApi/selection/collectSelections';
import { mergeModel } from '../../publicApi/model/mergeModel';

import type { MergeModelOption } from '../../publicApi/model/mergeModel';
import type {
    BeforePasteEvent,
    ClipboardData,
    ContentModelDocument,
    ContentModelSegmentFormat,
    EditorCore,
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
    core: EditorCore,
    eventResult: BeforePasteEvent,
    clipboardData: ClipboardData
) {
    const { fragment, domToModelOption, customizedMerge, pasteType } = eventResult;

    core.api.formatContentModel(
        core,
        (model, context) => {
            const selectedSegment = getSelectedSegments(model, true /*includeFormatHolder*/)[0];
            const domToModelContext = createDomToModelContextForSanitizing(
                core.physicalRoot.ownerDocument,
                undefined /*defaultFormat*/,
                core.domToModelSettings.customized,
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
