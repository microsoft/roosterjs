import { ChangeSource, Entity, SelectionRangeEx } from 'roosterjs-editor-types';
import { ContentModelEntity } from 'roosterjs-content-model-types';
import { createEntity, normalizeContentModel } from 'roosterjs-content-model-dom';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { insertEntityModel } from '../../modelApi/entity/insertEntityModel';
import {
    InsertEntityOptions,
    InsertEntityPosition,
} from '../../publicTypes/parameter/InsertEntityOptions';

const BlockEntityTag = 'div';
const InlineEntityTag = 'span';

/**
 * Insert an entity into editor
 * @param editor The Content Model editor
 * @param type Type of entity
 * @param isBlock True to insert a block entity, false to insert an inline entity
 * @param position Position of the entity to insert. It can be
 * Value of InsertEntityPosition: see InsertEntityPosition
 * selectionRangeEx: Use this range instead of current focus position to insert. After insert, focus will be moved to
 * the beginning of this range (when focusAfterEntity is not set to true) or after the new entity (when focusAfterEntity is set to true)
 * @param options Move options to insert. See InsertEntityOptions
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end' | SelectionRangeEx,
    options?: InsertEntityOptions
): ContentModelEntity | null;

/**
 * Insert a block entity into editor
 * @param editor The Content Model editor
 * @param type Type of entity
 * @param isBlock Must be true for a block entity
 * @param position Position of the entity to insert. It can be
 * Value of InsertEntityPosition: see InsertEntityPosition
 * selectionRangeEx: Use this range instead of current focus position to insert. After insert, focus will be moved to
 * the beginning of this range (when focusAfterEntity is not set to true) or after the new entity (when focusAfterEntity is set to true)
 * @param options Move options to insert. See InsertEntityOptions
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: true,
    position: InsertEntityPosition | SelectionRangeEx,
    options?: InsertEntityOptions
): ContentModelEntity | null;

export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position?: InsertEntityPosition | SelectionRangeEx,
    options?: InsertEntityOptions
): ContentModelEntity | null {
    const { contentNode, focusAfterEntity, wrapperDisplay, skipUndoSnapshot } = options || {};
    const wrapper = editor.getDocument().createElement(isBlock ? BlockEntityTag : InlineEntityTag);
    const display = wrapperDisplay ?? (isBlock ? undefined : 'inline-block');

    wrapper.style.setProperty('display', display || null);

    if (contentNode) {
        wrapper.appendChild(contentNode);
    }

    const entityModel = createEntity(wrapper, undefined /*format*/, true /*isReadonly*/, type);

    formatWithContentModel(
        editor,
        'insertEntity',
        (model, context) => {
            insertEntityModel(
                model,
                entityModel,
                typeof position == 'string' ? position : 'focus',
                isBlock,
                focusAfterEntity,
                context
            );

            normalizeContentModel(model);

            context.skipUndoSnapshot = skipUndoSnapshot;
            context.newEntities.push(entityModel);

            return true;
        },
        {
            selectionOverride: typeof position === 'object' ? position : undefined,
            changeSource: ChangeSource.InsertEntity,
            getChangeData: () => {
                // TODO: Remove this entity when we have standalone editor
                const entity: Entity = {
                    wrapper,
                    type,
                    id: '',
                    isReadonly: true,
                };

                return entity;
            },
        }
    );

    return entityModel;
}
