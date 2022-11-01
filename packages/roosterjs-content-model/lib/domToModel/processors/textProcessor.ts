import { addSegment } from '../../modelApi/common/addSegment';
import { addSelectionMarker } from '../utils/addSelectionMarker';
import { areSameFormats } from '../utils/areSameFormats';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createText } from '../../modelApi/creators/createText';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { hasSpacesOnly } from '../../domUtils/hasSpacesOnly';

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

        if (!context.regularSelection!.isSelectionCollapsed) {
            addSelectionMarker(group, context);
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    addTextSegment(group, txt, context);
};

function addTextSegment(group: ContentModelBlockGroup, text: string, context: DomToModelContext) {
    if (text) {
        // When there is only CR/Space in the text, we may not need it. Even we need, it will only be rendered as a space.
        // So replace it as a space here
        if (hasSpacesOnly(text)) {
            text = ' ';
        }

        const lastBlock = group.blocks[group.blocks.length - 1];
        const paragraph = lastBlock?.blockType == 'Paragraph' ? lastBlock : null;
        const lastSegment = paragraph?.segments[paragraph.segments.length - 1];

        if (
            lastSegment?.segmentType == 'Text' &&
            !!lastSegment.isSelected == !!context.isInSelection &&
            areSameFormats(lastSegment.format, context.segmentFormat) &&
            areSameFormats(lastSegment.link || {}, context.linkFormat.format || {})
        ) {
            lastSegment.text += text;
        } else if (text != ' ' || (paragraph && !paragraph.isImplicit)) {
            text = text == ' ' ? '\u00A0' /*&nbsp;*/ : text;
            const textModel = createText(text, context.segmentFormat, context.linkFormat.format);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addSegment(group, textModel, context.blockFormat);
        }
    }
}
