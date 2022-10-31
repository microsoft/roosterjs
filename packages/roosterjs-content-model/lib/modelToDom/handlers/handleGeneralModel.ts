import { applyFormat } from '../utils/applyFormat';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelHandler<ContentModelGeneralBlock> = (
    doc: Document,
    parent: Node,
    group: ContentModelGeneralBlock,
    context: ModelToDomContext
) => {
    const newParent = group.element.cloneNode();
    parent.appendChild(newParent);

    context.modelHandlers.blockGroupChildren(doc, newParent, group, context);

    if (isGeneralSegment(group) && isNodeOfType(newParent, NodeType.Element)) {
        if (!group.element.firstChild) {
            context.regularSelection.current.segment = newParent;
        }

        applyFormat(newParent, context.formatAppliers.segment, group.format, context);
    }
};

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
