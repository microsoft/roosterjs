import { addSegment } from '../utils/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { createText } from '../creators/createText';
import { FormatContext } from '../types/FormatContext';

/**
 * @internal
 */
export function textProcessor(group: ContentModelBlockGroup, text: string, context: FormatContext) {
    if (text) {
        const paragraph = group.blocks[group.blocks.length - 1];
        const lastSegment =
            paragraph?.blockType == ContentModelBlockType.Paragraph &&
            paragraph.segments[paragraph.segments.length - 1];

        if (
            lastSegment &&
            lastSegment.segmentType == ContentModelSegmentType.Text &&
            lastSegment.isSelected == context.isInSelection // TODO: Check if format is changed
        ) {
            lastSegment.text += text;
        } else {
            addSegment(group, context, createText(context, text));
        }
    }
}
