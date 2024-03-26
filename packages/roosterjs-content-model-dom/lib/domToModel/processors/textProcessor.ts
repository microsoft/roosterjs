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
    SelectionOffsets,
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
    const { start, end, shadow } = offsets;
    const segments: (ContentModelText | undefined)[] = [];
    const paragraph = ensureParagraph(group, context.blockFormat);

    const adjustForShadowInsertPoint = (offsets: SelectionOffsets) => {
        const subText = txt.substring(0, offsets.shadow);

        segments.push(addTextSegment(group, subText, paragraph, context));

        // Must use offsets[2] here as the unchanged offset value, cannot use txtEndOffset since it has been modified
        // Same for the rest
        addSelectionMarker(group, context, textNode, shadow, true /*isShadowMarker*/);

        txt = txt.substring(offsets.shadow);
        offsets.start -= offsets.shadow;
        offsets.end -= offsets.shadow;
        offsets.shadow = -1;
    };

    const adjustForRegularSelection = (
        offsets: SelectionOffsets,
        offset: number,
        markerOffset: number
    ) => {
        const subText = txt.substring(0, offset);

        segments.push(addTextSegment(group, subText, paragraph, context));
        addSelectionMarker(group, context, textNode, markerOffset);

        txt = txt.substring(offset);
        offsets.start -= offset;
        offsets.end -= offset;
        offsets.shadow -= offset;
    };

    if (
        offsets.shadow >= 0 &&
        (offsets.shadow <= offsets.start || offsets.start < 0) &&
        (offsets.shadow < offsets.end || offsets.end < 0)
    ) {
        adjustForShadowInsertPoint(offsets);
    }

    if (offsets.start >= 0) {
        adjustForRegularSelection(offsets, offsets.start, start);

        context.isInSelection = true;
    }

    if (
        offsets.shadow >= 0 &&
        offsets.shadow > offsets.start &&
        (offsets.shadow < offsets.end || offsets.end < 0)
    ) {
        adjustForShadowInsertPoint(offsets);
    }

    if (offsets.end >= 0) {
        adjustForRegularSelection(offsets, offsets.end, end);

        context.isInSelection = false;
    }

    if (offsets.shadow >= 0 && offsets.shadow >= offsets.end) {
        adjustForShadowInsertPoint(offsets);
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
