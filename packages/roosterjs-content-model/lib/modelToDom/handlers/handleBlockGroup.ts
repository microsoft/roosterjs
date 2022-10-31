import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
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
