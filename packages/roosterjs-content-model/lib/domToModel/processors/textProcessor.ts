import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createText } from '../../modelApi/creators/createText';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export function textProcessor(
    group: ContentModelBlockGroup,
    text: string,
    context: DomToModelContext
) {
    if (text) {
        const paragraph = group.blocks[group.blocks.length - 1];
        const lastSegment =
            paragraph?.blockType == 'Paragraph' &&
            paragraph.segments[paragraph.segments.length - 1];

        if (
            lastSegment &&
            lastSegment.segmentType == 'Text' &&
            !!lastSegment.isSelected == !!context.isInSelection
        ) {
            lastSegment.text += text;
        } else {
            const textModel = createText(text);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addSegment(group, textModel);
        }
    }
}
