import { addDelimiters } from '../../domUtils/entityUtils';
import { applyFormat } from '../utils/applyFormat';
import { getObjectKeys } from '../../domUtils/getObjectKeys';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import { wrap } from '../../domUtils/wrap';
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
    doc,
    parent,
    entityModel,
    context,
    refNode
) => {
    const { entityFormat, wrapper } = entityModel;

    applyFormat(wrapper, context.formatAppliers.entity, entityFormat, context);

    refNode = reuseCachedElement(parent, wrapper, refNode);
    context.onNodeCreated?.(entityModel, wrapper);

    if (context.addDelimiterForEntity && entityFormat.isReadonly) {
        addDelimiterForEntity(doc, wrapper, context);
    }

    return refNode;
};

/**
 * @internal
 */
export const handleEntitySegment: ContentModelSegmentHandler<ContentModelEntity> = (
    doc,
    parent,
    entityModel,
    context,
    newSegments
) => {
    const { entityFormat, wrapper, format } = entityModel;

    parent.appendChild(wrapper);
    newSegments?.push(wrapper);

    if (getObjectKeys(format).length > 0) {
        const span = wrap(doc, wrapper, 'span');

        applyFormat(span, context.formatAppliers.segment, format, context);
    }

    applyFormat(wrapper, context.formatAppliers.entity, entityFormat, context);

    if (context.addDelimiterForEntity && entityFormat.isReadonly) {
        const [after, before] = addDelimiterForEntity(doc, wrapper, context);

        newSegments?.push(after, before);
        context.regularSelection.current.segment = after;
    } else {
        context.regularSelection.current.segment = wrapper;
    }

    context.onNodeCreated?.(entityModel, wrapper);
};

function addDelimiterForEntity(doc: Document, wrapper: HTMLElement, context: ModelToDomContext) {
    const [after, before] = addDelimiters(doc, wrapper);

    const format = {
        ...context.pendingFormat?.format,
        ...context.defaultFormat,
    };

    applyFormat(after, context.formatAppliers.segment, format, context);
    applyFormat(before, context.formatAppliers.segment, format, context);

    return [after, before];
}
