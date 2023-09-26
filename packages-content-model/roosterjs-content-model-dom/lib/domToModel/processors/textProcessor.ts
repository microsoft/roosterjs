import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { addSelectionMarker } from '../utils/addSelectionMarker';
import { createText } from '../../modelApi/creators/createText';
import { ensureParagraph } from '../../modelApi/common/ensureParagraph';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { hasSpacesOnly } from '../../modelApi/common/hasSpacesOnly';
import {
    ContentModelBlockGroup,
    ContentModelParagraph,
    ContentModelText,
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
    const segments: (ContentModelText | undefined)[] = [];
    const paragraph = ensureParagraph(group, context.blockFormat);

    if (txtStartOffset >= 0) {
        const subText = txt.substring(0, txtStartOffset);
        segments.push(addTextSegment(group, subText, paragraph, context));
        context.isInSelection = true;

        addSelectionMarker(group, context);

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        const subText = txt.substring(0, txtEndOffset);
        segments.push(addTextSegment(group, subText, paragraph, context));

        if (
            context.selection &&
            (context.selection.type != 'range' || !context.selection.range.collapsed)
        ) {
            addSelectionMarker(group, context);
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    segments.push(addTextSegment(group, txt, paragraph, context));
    context.domIndexer?.onSegment(
        textNode,
        paragraph,
        segments.filter((x): x is ContentModelText => !!x)
    );
};

// When we see these values of white-space style, need to preserve spaces and line-breaks and let browser handle it for us.
const WhiteSpaceValuesNeedToHandle = ['pre', 'pre-wrap', 'pre-line', 'break-spaces'];

function addTextSegment(
    group: ContentModelBlockGroup,
    text: string,
    paragraph: ContentModelParagraph,
    context: DomToModelContext
): ContentModelText | undefined {
    let textModel: ContentModelText | undefined;

    if (text) {
        if (
            !hasSpacesOnly(text) ||
            (paragraph?.segments.length ?? 0) > 0 ||
            WhiteSpaceValuesNeedToHandle.indexOf(paragraph?.format.whiteSpace || '') >= 0
        ) {
            textModel = createText(text, context.segmentFormat);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addDecorators(textModel, context);

            addSegment(group, textModel, context.blockFormat);
        }
    }

    return textModel;
}
