import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelBlockHandler<ContentModelGeneralBlock> = (
    doc: Document,
    parent: Node,
    group: ContentModelGeneralBlock,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const element = group.element.cloneNode();

    parent.insertBefore(element, refNode);

    if (isGeneralSegment(group) && isNodeOfType(element, NodeType.Element)) {
        if (!group.element.firstChild) {
            context.regularSelection.current.segment = element;
        }

        applyFormat(element, context.formatAppliers.segment, group.format, context);

        context.modelHandlers.segmentDecorator(doc, element, group, context);
    }

    context.modelHandlers.blockGroupChildren(doc, element, group, context);
};

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
