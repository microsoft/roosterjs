import { addSegment } from '../../modelApi/common/addSegment';
import { areSameFormats } from '../utils/areSameFormats';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { createText } from '../../modelApi/creators/createText';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';

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

        addSegment(group, createSelectionMarker(context.segmentFormat), context.blockFormat);

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        addTextSegment(group, txt.substring(0, txtEndOffset), context);

        if (!context.regularSelection!.isSelectionCollapsed) {
            addSegment(group, createSelectionMarker(context.segmentFormat), context.blockFormat);
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    addTextSegment(group, txt, context);
};

function addTextSegment(group: ContentModelBlockGroup, text: string, context: DomToModelContext) {
    if (text) {
        const paragraph = group.blocks[group.blocks.length - 1];
        const lastSegment =
            paragraph?.blockType == 'Paragraph' &&
            paragraph.segments[paragraph.segments.length - 1];

        if (
            lastSegment &&
            lastSegment.segmentType == 'Text' &&
            !!lastSegment.isSelected == !!context.isInSelection &&
            areSameFormats(lastSegment.format, context.segmentFormat)
        ) {
            lastSegment.text += text;
        } else {
            const textModel = createText(text, context.segmentFormat);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addSegment(group, textModel, context.blockFormat);
        }
    }
}
