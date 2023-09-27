import { addDelimiters, getObjectKeys, wrap } from 'roosterjs-editor-dom';
import { applyFormat } from '../utils/applyFormat';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import {
    ContentModelBlockHandler,
    ContentModelEntity,
    ContentModelSegmentHandler,
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
    let { entityFormat, wrapper } = entityModel;

    applyFormat(wrapper, context.formatAppliers.entity, entityFormat, context);

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
    let { entityFormat, wrapper, format } = entityModel;

    applyFormat(wrapper, context.formatAppliers.entity, entityFormat, context);

    parent.appendChild(wrapper);
    newSegments?.push(wrapper);

    if (getObjectKeys(format).length > 0) {
        const span = wrap(wrapper, 'span');

        applyFormat(span, context.formatAppliers.segment, format, context);
    }

    if (context.addDelimiterForEntity && entityFormat.isReadonly) {
        const [after, before] = addDelimiters(wrapper);

        newSegments?.push(after, before);
        context.regularSelection.current.segment = after;
    } else {
        context.regularSelection.current.segment = wrapper;
    }

    context.onNodeCreated?.(entityModel, wrapper);
};
