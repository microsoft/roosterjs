import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { addSelectionMarker } from '../utils/addSelectionMarker';
import { createText } from '../../modelApi/creators/createText';
import { ensureParagraph } from '../../modelApi/common/ensureParagraph';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { hasSpacesOnly } from '../../modelApi/common/hasSpacesOnly';
import { isWhiteSpacePreserved } from '../../domUtils/isWhiteSpacePreserved';
import { stackFormat } from '../utils/stackFormat';
import type {
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
    if (context.formatParsers.text.length > 0) {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            context.formatParsers.text.forEach(parser => {
                parser(context.segmentFormat, textNode, context);
                internalTextProcessor(group, textNode, context);
            });
        });
    } else {
        internalTextProcessor(group, textNode, context);
    }
};

function internalTextProcessor(
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContext
) {
    let txt = textNode.nodeValue || '';
    const offsets = getRegularSelectionOffsets(context, textNode);
    let [txtStartOffset, txtEndOffset, shadowOffset] = offsets;
    const segments: (ContentModelText | undefined)[] = [];
    const paragraph = ensureParagraph(group, context.blockFormat);

    if (
        shadowOffset >= 0 &&
        (shadowOffset <= txtStartOffset || txtStartOffset < 0) &&
        (shadowOffset < txtEndOffset || txtEndOffset < 0)
    ) {
        const subText = txt.substring(0, shadowOffset);

        segments.push(addTextSegment(group, subText, paragraph, context));

        // Must use offsets[2] here as the unchanged offset value, cannot use txtEndOffset since it has been modified
        // Same for the rest
        addSelectionMarker(group, context, textNode, offsets[2], true /*isShadowMarker*/);

        txt = txt.substring(shadowOffset);
        txtStartOffset -= shadowOffset;
        txtEndOffset -= shadowOffset;
        shadowOffset = -1;
    }

    if (txtStartOffset >= 0) {
        const subText = txt.substring(0, txtStartOffset);
        segments.push(addTextSegment(group, subText, paragraph, context));
        context.isInSelection = true;

        addSelectionMarker(group, context, textNode, offsets[0]);

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
        shadowOffset -= txtStartOffset;
        txtStartOffset = 0;
    }

    if (
        shadowOffset >= 0 &&
        shadowOffset > txtStartOffset &&
        (shadowOffset < txtEndOffset || txtEndOffset < 0)
    ) {
        const subText = txt.substring(0, shadowOffset);

        segments.push(addTextSegment(group, subText, paragraph, context));

        addSelectionMarker(group, context, textNode, offsets[2], true /*isShadowMarker*/);

        txt = txt.substring(shadowOffset);
        txtEndOffset -= shadowOffset;
        shadowOffset = -1;
    }

    if (txtEndOffset >= 0) {
        const subText = txt.substring(0, txtEndOffset);
        segments.push(addTextSegment(group, subText, paragraph, context));

        if (
            context.selection &&
            (context.selection.type != 'range' || !context.selection.range.collapsed)
        ) {
            addSelectionMarker(group, context, textNode, offsets[1]);
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
        shadowOffset -= txtEndOffset;
        txtEndOffset = 0;
    }

    if (shadowOffset >= 0 && shadowOffset >= txtEndOffset) {
        const subText = txt.substring(0, shadowOffset);

        segments.push(addTextSegment(group, subText, paragraph, context));

        addSelectionMarker(group, context, textNode, offsets[2], true /*isShadowMarker*/);

        txt = txt.substring(shadowOffset);
    }

    segments.push(addTextSegment(group, txt, paragraph, context));
    context.domIndexer?.onSegment(
        textNode,
        paragraph,
        segments.filter((x): x is ContentModelText => !!x)
    );
}

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
            isWhiteSpacePreserved(paragraph?.format.whiteSpace)
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
