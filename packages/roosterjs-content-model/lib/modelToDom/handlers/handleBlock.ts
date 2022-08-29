import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { handleParagraph } from './handleParagraph';
import { handleTable } from './handleTable';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';

/**
 * @internal
 */
export function handleBlock(
    doc: Document,
    parent: Node,
    block: ContentModelBlock,
    context: ModelToDomContext
) {
    switch (block.blockType) {
        case 'Table':
            handleTable(doc, parent, block, context);
            break;

        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'General':
                    const newParent = block.element.cloneNode();
                    parent.appendChild(newParent);

                    handleBlockGroup(doc, newParent, block, context);

                    if (isGeneralSegment(block) && isNodeOfType(newParent, NodeType.Element)) {
                        context.regularSelection.current.segment = newParent;
                        applyFormat(
                            newParent,
                            SegmentFormatHandlers,
                            block.format,
                            context.contentModelContext
                        );
                    }

                    break;
                default:
                    handleBlockGroup(doc, parent, block, context);
                    break;
            }

            break;
        case 'Paragraph':
            handleParagraph(doc, parent, block, context);
            break;
    }
}

function handleBlockGroup(
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext
) {
    group.blocks.forEach(childBlock => handleBlock(doc, parent, childBlock, context));
}

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
