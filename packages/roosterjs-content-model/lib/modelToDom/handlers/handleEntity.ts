import { applyFormat } from '../utils/applyFormat';
import { commitEntity, getObjectKeys, wrap } from 'roosterjs-editor-dom';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { Entity } from 'roosterjs-editor-types';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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

    if (entity) {
        // Commit the entity attributes in case there is any change
        commitEntity(wrapper, entity.type, entity.isReadonly, entity.id);
    }

    parent.insertBefore(wrapper, refNode);

    if (getObjectKeys(format).length > 0) {
        const span = wrap(wrapper, 'span');

        applyFormat(span, context.formatAppliers.segment, format, context);
    }
};
