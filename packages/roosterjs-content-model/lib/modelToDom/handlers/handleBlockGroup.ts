import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { handleBlock } from './handleBlock';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlockGroup: ContentModelHandler<ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext
) => {
    switch (group.blockGroupType) {
        case 'General':
            context.modelHandlers.general(doc, parent, group, context);
            break;

        default:
            context.modelHandlers.blockGroupChildren(doc, parent, group, context);
            break;
    }
};

/**
 * @internal
 */
export function handleBlockGroupChildren(
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext
) {
    group.blocks.forEach(childBlock => {
        handleBlock(doc, parent, childBlock, context);
    });
}

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
