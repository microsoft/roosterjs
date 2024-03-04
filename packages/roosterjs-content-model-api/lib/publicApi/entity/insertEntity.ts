import { ChangeSource } from 'roosterjs-content-model-core';
import { insertEntityModel } from '../../modelApi/entity/insertEntityModel';
import {
    createEntity,
    normalizeContentModel,
    parseEntityFormat,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelEntity,
    DOMSelection,
    InsertEntityPosition,
    InsertEntityOptions,
    IEditor,
    EntityState,
} from 'roosterjs-content-model-types';

const BlockEntityTag = 'div';
const InlineEntityTag = 'span';

/**
 * Insert an entity into editor
 * @param editor The editor object
 * @param type Type of entity
 * @param isBlock True to insert a block entity, false to insert an inline entity
 * @param position Position of the entity to insert. It can be
 * Value of InsertEntityPosition: see InsertEntityPosition
 * selectionRangeEx: Use this range instead of current focus position to insert. After insert, focus will be moved to
 * the beginning of this range (when focusAfterEntity is not set to true) or after the new entity (when focusAfterEntity is set to true)
 * @param options Move options to insert. See InsertEntityOptions
 */
export default function insertEntity(
    editor: IEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end' | DOMSelection,
    options?: InsertEntityOptions
): ContentModelEntity | null;

/**
 * Insert a block entity into editor
 * @param editor The editor object
 * @param type Type of entity
 * @param isBlock Must be true for a block entity
 * @param position Position of the entity to insert. It can be
 * Value of InsertEntityPosition: see InsertEntityPosition
 * selectionRangeEx: Use this range instead of current focus position to insert. After insert, focus will be moved to
 * the beginning of this range (when focusAfterEntity is not set to true) or after the new entity (when focusAfterEntity is set to true)
 * @param options Move options to insert. See InsertEntityOptions
 */
export default function insertEntity(
    editor: IEditor,
    type: string,
    isBlock: true,
    position: InsertEntityPosition | DOMSelection,
    options?: InsertEntityOptions
): ContentModelEntity | null;

export default function insertEntity(
    editor: IEditor,
    type: string,
    isBlock: boolean,
    position?: InsertEntityPosition | DOMSelection,
    options?: InsertEntityOptions
): ContentModelEntity | null {
    const { contentNode, focusAfterEntity, wrapperDisplay, skipUndoSnapshot, initialEntityState } =
        options || {};
    const document = editor.getDocument();
    const wrapper = document.createElement(isBlock ? BlockEntityTag : InlineEntityTag);
    const display = wrapperDisplay ?? (isBlock ? undefined : 'inline-block');

    wrapper.style.setProperty('display', display || null);

    if (display == undefined && isBlock) {
        wrapper.style.setProperty('width', '100%');
        wrapper.style.setProperty('display', 'inline-block');
    }

    if (contentNode) {
        wrapper.appendChild(contentNode);
    }

    const entityModel = createEntity(wrapper, true /* isReadonly */, undefined /*format*/, type);

    if (!skipUndoSnapshot) {
        editor.takeSnapshot();
    }

    editor.formatContentModel(
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

            context.skipUndoSnapshot = true;
            context.newEntities.push(entityModel);

            return true;
        },
        {
            selectionOverride: typeof position === 'object' ? position : undefined,
            changeSource: ChangeSource.InsertEntity,
            getChangeData: () => ({
                wrapper,
                type,
                id: '',
                isReadonly: true,
            }),
            apiName: 'insertEntity',
        }
    );

    if (!skipUndoSnapshot) {
        let entityState: EntityState | undefined;

        if (initialEntityState) {
            const format = parseEntityFormat(wrapper);
            const { id, entityType } = format;

            entityState =
                id && entityType
                    ? {
                          id: id,
                          type: entityType,
                          state: initialEntityState,
                      }
                    : undefined;
        }

        editor.takeSnapshot(entityState);
    }

    return entityModel;
}
