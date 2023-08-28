import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { addSelectionMarker } from '../utils/addSelectionMarker';
import { createText } from '../../modelApi/creators/createText';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { hasSpacesOnly } from '../../modelApi/common/hasSpacesOnly';
import {
    ContentModelBlockGroup,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textProcessor: ElementProcessor<Text> = (
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContext
) => {
    let txt = textNode.nodeValue || '';
    let [txtStartOffset, txtEndOffset] = getRegularSelectionOffsets(context, textNode);

    context.callbacks.onNewTextNode?.(textNode);

    if (txtStartOffset >= 0) {
        addTextSegment(group, txt.substring(0, txtStartOffset), context, textNode);
        context.isInSelection = true;

        addSelectionMarker(group, context);

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        addTextSegment(group, txt.substring(0, txtEndOffset), context, textNode);

        if (context.rangeEx && !context.rangeEx.areAllCollapsed) {
            addSelectionMarker(group, context);
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    addTextSegment(group, txt, context, textNode);
};

// When we see these values of white-space style, need to preserve spaces and line-breaks and let browser handle it for us.
const WhiteSpaceValuesNeedToHandle = ['pre', 'pre-wrap', 'pre-line', 'break-spaces'];

function addTextSegment(
    group: ContentModelBlockGroup,
    text: string,
    context: DomToModelContext,
    textNode: Text
) {
    if (text) {
        const lastBlock = group.blocks[group.blocks.length - 1];
        const lastPara = lastBlock?.blockType == 'Paragraph' ? lastBlock : null;

        if (
            !hasSpacesOnly(text) ||
            (lastPara?.segments.length ?? 0) > 0 ||
            WhiteSpaceValuesNeedToHandle.indexOf(lastPara?.format.whiteSpace || '') >= 0
        ) {
            const textModel = createText(text, context.segmentFormat);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addDecorators(textModel, context);

            const para = addSegment(group, textModel, context.blockFormat);

            context.callbacks.onNewTextSegment?.(para, textModel, textNode);
        }
    }
}
