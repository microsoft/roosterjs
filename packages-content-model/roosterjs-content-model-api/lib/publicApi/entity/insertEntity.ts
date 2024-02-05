import { addDelimiters, createEntity, normalizeContentModel } from 'roosterjs-content-model-dom';
import { ChangeSource } from 'roosterjs-content-model-core';
import { insertEntityModel } from '../../modelApi/entity/insertEntityModel';
import type {
    ContentModelEntity,
    DOMSelection,
    InsertEntityPosition,
    InsertEntityOptions,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';

const InlineEntityTag = 'span';
const BlockEntityTag = 'div';

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
    editor: IStandaloneEditor,
    type: string,
    isBlock: boolean,
    position: 'focus' | 'begin' | 'end' | DOMSelection,
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
    editor: IStandaloneEditor,
    type: string,
    isBlock: true,
    position: InsertEntityPosition | DOMSelection,
    options?: InsertEntityOptions
): ContentModelEntity | null;

export default function insertEntity(
    editor: IStandaloneEditor,
    type: string,
    isBlock: boolean,
    position?: InsertEntityPosition | DOMSelection,
    options?: InsertEntityOptions
): ContentModelEntity | null {
    const { contentNode, focusAfterEntity, wrapperDisplay, skipUndoSnapshot } = options || {};
    const document = editor.getDocument();
    const wrapper = document.createElement(isBlock ? BlockEntityTag : InlineEntityTag);
    const display = wrapperDisplay ?? (isBlock ? undefined : 'inline-block');
    wrapper.style.setProperty('display', display || null);
    const isReadonly = !isBlock;

    if (isBlock && display == undefined) {
        const wrapper2 = editor.getDocument().createElement(InlineEntityTag);
        wrapper2.style.setProperty('width', '100%');
        wrapper2.style.setProperty('display', 'inline-block');
        wrapper2.contentEditable = 'false';
        wrapper2.classList.add('_Entity');
        wrapper.appendChild(wrapper2);
        wrapper.contentEditable = 'true';

        addDelimiters(document, wrapper2);

        if (contentNode) {
            wrapper2.appendChild(contentNode);
        }
    } else if (contentNode) {
        wrapper.appendChild(contentNode);
    }

    const entityModel = createEntity(wrapper, isReadonly, undefined /*format*/, type);

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

            context.skipUndoSnapshot = skipUndoSnapshot;
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

    return entityModel;
}
