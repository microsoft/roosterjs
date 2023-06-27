import { addDelimiters, commitEntity, isBlockElement } from 'roosterjs-editor-dom';
import { applyFormat } from '../utils/applyFormat';
import { Entity } from 'roosterjs-editor-types';
import { keysOf } from '../../domUtils/keysOf';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { wrapWithTag } from '../../domUtils/wrapWithTag';
import {
    ContentModelBlockHandler,
    ContentModelEntity,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

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
    const { wrapper, id, type, isReadonly, format } = entityModel;
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

    if (isInlineEntity && keysOf(format).length > 0) {
        const span = wrapWithTag(wrapper, 'span');

        applyFormat(span, context.formatAppliers.segment, format, context);
    }

    if (context.addDelimiterForEntity && isInlineEntity && isReadonly) {
        const [after] = addDelimiters(wrapper);

        context.regularSelection.current.segment = after;
    }

    context.onNodeCreated?.(entityModel, wrapper);

    return refNode;
};
