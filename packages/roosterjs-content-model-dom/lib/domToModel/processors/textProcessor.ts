import { addSelectionMarker } from '../utils/addSelectionMarker';
import { addTextSegment } from '../../modelApi/common/addTextSegment';
import { ensureParagraph } from '../../modelApi/common/ensureParagraph';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelBlockGroup,
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
    const txtStartOffset = offsets[0];
    let txtEndOffset = offsets[1];
    const segments: (ContentModelText | undefined)[] = [];
    const paragraph = ensureParagraph(group, context.blockFormat);

    if (txtStartOffset >= 0) {
        const subText = txt.substring(0, txtStartOffset);
        segments.push(addTextSegment(group, subText, paragraph, context));
        context.isInSelection = true;

        addSelectionMarker(group, context, textNode, txtStartOffset);

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
            addSelectionMarker(group, context, textNode, offsets[1]); // Must use offsets[1] here as the unchanged offset value, cannot use txtEndOffset since it has been modified
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
}
