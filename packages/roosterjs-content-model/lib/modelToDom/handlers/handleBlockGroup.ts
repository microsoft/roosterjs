import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';

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
            const newParent = group.element.cloneNode();
            parent.appendChild(newParent);

            context.modelHandlers.blockGroupChildren(doc, newParent, group, context);

            if (
                isGeneralSegment(group) &&
                isNodeOfType(newParent, NodeType.Element) &&
                !group.element.firstChild
            ) {
                context.regularSelection.current.segment = newParent;
            }

            break;

        case 'Quote':
            context.modelHandlers.quote(doc, parent, group, context);
            break;

        case 'ListItem':
            context.modelHandlers.listItem(doc, parent, group, context);
            break;

        default:
            context.modelHandlers.blockGroupChildren(doc, parent, group, context);
            break;
    }
};

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
