import { addBlock } from './addBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { createParagraph } from '../creators/createParagraph';

/**
 * @internal
 */
export function addSegment(group: ContentModelBlockGroup, newSegment: ContentModelSegment) {
    const lastBlock = group.blocks[group.blocks.length - 1];
    let paragraph: ContentModelParagraph;

    if (lastBlock?.blockType == ContentModelBlockType.Paragraph) {
        paragraph = lastBlock;
    } else {
        paragraph = createParagraph(true);
        addBlock(group, paragraph);
    }

    paragraph.segments.push(newSegment);
}
