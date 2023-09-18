import { applyFormat } from '../utils/applyFormat';
import { Entity } from 'roosterjs-editor-types';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import {
    ContentModelBlockHandler,
    ContentModelEntity,
    ModelToDomContext,
} from 'roosterjs-content-model-types';
import {
    addDelimiters,
    commitEntity,
    getObjectKeys,
    isBlockElement,
    wrap,
} from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const handleEntity: ContentModelBlockHandler<ContentModelEntity> = (
    doc: Document,
    parent: Node,
    entityModel: ContentModelEntity,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const { id, type, isReadonly, format } = entityModel;
    let wrapper = entityModel.wrapper;

    if (!context.allowCacheElement) {
        wrapper = wrapper.cloneNode(true /*deep*/) as HTMLElement;
        wrapper.style.color = wrapper.style.color || 'inherit';
        wrapper.style.backgroundColor = wrapper.style.backgroundColor || 'inherit';
    }

    const entity: Entity | null =
        id && type
            ? {
                  wrapper,
                  id,
                  type,
                  isReadonly: !!isReadonly,
              }
            : null;
    const isInlineEntity = !isBlockElement(wrapper);

    if (entity) {
        // Commit the entity attributes in case there is any change
        commitEntity(wrapper, entity.type, entity.isReadonly, entity.id);
    }

    refNode = reuseCachedElement(parent, wrapper, refNode);

    if (isInlineEntity && getObjectKeys(format).length > 0) {
        const span = wrap(wrapper, 'span');

        applyFormat(span, context.formatAppliers.segment, format, context);
    }

    if (context.addDelimiterForEntity && isInlineEntity && isReadonly) {
        const [after] = addDelimiters(wrapper);

        context.regularSelection.current.segment = after;
    } else if (isInlineEntity) {
        context.regularSelection.current.segment = wrapper;
    }

    context.onNodeCreated?.(entityModel, wrapper);

    return refNode;
};
