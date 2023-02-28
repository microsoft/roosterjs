import { applyFormat } from '../utils/applyFormat';
import { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';
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
    const element = group.element.cloneNode();

    parent.appendChild(element);

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
