import { addDelimiters, commitEntity, getObjectKeys, wrap } from 'roosterjs-editor-dom';
import { applyFormat } from '../utils/applyFormat';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import type { Entity } from 'roosterjs-editor-types';
import type {
    ContentModelBlockHandler,
    ContentModelEntity,
    ContentModelSegmentHandler,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleEntityBlock: ContentModelBlockHandler<ContentModelEntity> = (
    _,
    parent,
    entityModel,
    context,
    refNode
) => {
    const wrapper = preprocessEntity(entityModel, context);

    refNode = reuseCachedElement(parent, wrapper, refNode);
    context.onNodeCreated?.(entityModel, wrapper);

    return refNode;
};

/**
 * @internal
 */
export const handleEntitySegment: ContentModelSegmentHandler<ContentModelEntity> = (
    _,
    parent,
    entityModel,
    context,
    newSegments
) => {
    const wrapper = preprocessEntity(entityModel, context);
    const { format, isReadonly } = entityModel;

    parent.appendChild(wrapper);
    newSegments?.push(wrapper);

    if (getObjectKeys(format).length > 0) {
        const span = wrap(wrapper, 'span');

        applyFormat(span, context.formatAppliers.segment, format, context);
    }

    if (context.addDelimiterForEntity && isReadonly) {
        const [after, before] = addDelimiters(wrapper);

        newSegments?.push(after, before);
        context.regularSelection.current.segment = after;
    } else {
        context.regularSelection.current.segment = wrapper;
    }

    context.onNodeCreated?.(entityModel, wrapper);
};

function preprocessEntity(entityModel: ContentModelEntity, context: ModelToDomContext) {
    let { id, type, isReadonly, wrapper } = entityModel;

    const entity: Entity | null =
        id && type
            ? {
                  wrapper,
                  id,
                  type,
                  isReadonly: !!isReadonly,
              }
            : null;

    if (entity) {
        // Commit the entity attributes in case there is any change
        commitEntity(wrapper, entity.type, entity.isReadonly, entity.id);
    }
    return wrapper;
}
