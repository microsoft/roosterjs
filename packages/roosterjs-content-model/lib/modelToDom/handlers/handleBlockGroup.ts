import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { handleBlock } from './handleBlock';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';

/**
 * @internal
 */
export function handleBlockGroup(
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext
) {
    switch (group.blockGroupType) {
        case 'General':
            const newParent = group.element.cloneNode();
            parent.appendChild(newParent);

            handleBlockGroupChildren(doc, newParent, group, context);

            if (isGeneralSegment(group) && isNodeOfType(newParent, NodeType.Element)) {
                if (!group.element.firstChild) {
                    context.regularSelection.current.segment = newParent;
                }

                applyFormat(newParent, SegmentFormatHandlers, group.format, context);
            }

            break;

        default:
            handleBlockGroupChildren(doc, parent, group, context);
            break;
    }
}

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
