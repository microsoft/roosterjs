import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { addSelectionMarker } from '../utils/addSelectionMarker';
import { createText } from '../../modelApi/creators/createText';
import { ensureParagraph } from 'roosterjs-content-model-dom';
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

    if (txtStartOffset >= 0) {
        addTextSegment(group, txt.substring(0, txtStartOffset), context);
        context.isInSelection = true;

        addSelectionMarker(group, context);

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        addTextSegment(group, txt.substring(0, txtEndOffset), context);

        if (context.rangeEx && !context.rangeEx.areAllCollapsed) {
            addSelectionMarker(group, context);
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    addTextSegment(group, txt, context);
};

// When we see these values of white-space style, need to preserve spaces and line-breaks and let browser handle it for us.
const WhiteSpaceValuesNeedToHandle = ['pre', 'pre-wrap', 'pre-line', 'break-spaces'];

function addTextSegment(group: ContentModelBlockGroup, text: string, context: DomToModelContext) {
    if (text) {
        const paragraph = ensureParagraph(group, context.blockFormat);

        if (
            !hasSpacesOnly(text) ||
            (paragraph?.segments.length ?? 0) > 0 ||
            WhiteSpaceValuesNeedToHandle.indexOf(paragraph?.format.whiteSpace || '') >= 0
        ) {
            const textModel = createText(text, context.segmentFormat);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addDecorators(textModel, context);

            addSegment(group, textModel, context.blockFormat);
        }
    }
}
