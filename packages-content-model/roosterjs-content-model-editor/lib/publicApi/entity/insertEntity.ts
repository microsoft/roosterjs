import { ChangeSource, Entity, SelectionRangeEx } from 'roosterjs-editor-types';
import { commitEntity, getEntityFromElement } from 'roosterjs-editor-dom';
import { ContentModelEntity } from 'roosterjs-content-model-types';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { insertEntityModel } from '../../modelApi/entity/insertEntityModel';

const BlockEntityTag = 'div';
const InlineEntityTag = 'span';

/**
 * Options for insertEntity API
 */
export interface InsertEntityOptions {
    /**
     * Content node of the entity. If not passed, an empty entity will be created
     */
    contentNode?: Node;

    /**
     * Whether move focus after entity after insert
     */
    focusAfterEntity?: boolean;

    /**
     * "Display" value of the entity wrapper. By default, block entity will have no display, inline entity will have display: inline-block
     */
    wrapperDisplay?: 'inline' | 'block' | 'none' | 'inline-block';

    /**
     * Whether skip adding an undo snapshot around
     */
    skipUndoSnapshot?: boolean;
}

/**
 * Insert an entity into editor
 * @param editor The Content Model editor
 * @param type Type of entity
 * @param isBlock True to insert a block entity, false to insert an inline entity
 * @param position Position of the entity to insert. It can be
 * "focus": insert at current focus. If insert a block entity, it will be inserted under the paragraph where focus is
 * "begin": insert at beginning of content. When insert an inline entity, it will be wrapped with a paragraph.
 * "end": insert at end of content. When insert an inline entity, it will be wrapped with a paragraph.
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
): Entity | null;

/**
 * Insert a block entity into editor
 * @param editor The Content Model editor
 * @param type Type of entity
 * @param isBlock Must be true for a block entity
 * @param position Position of the entity to insert. It can be
 * "focus": insert at current focus. If insert a block entity, it will be inserted under the paragraph where focus is
 * "begin": insert at beginning of content. When insert an inline entity, it will be wrapped with a paragraph.
 * "end": insert at end of content. When insert an inline entity, it will be wrapped with a paragraph.
 * "root": insert at the root level of current region
 * selectionRangeEx: Use this range instead of current focus position to insert. After insert, focus will be moved to
 * the beginning of this range (when focusAfterEntity is not set to true) or after the new entity (when focusAfterEntity is set to true)
 * @param options Move options to insert. See InsertEntityOptions
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: true,
    position: 'focus' | 'begin' | 'end' | 'root' | SelectionRangeEx,
    options?: InsertEntityOptions
): Entity | null;

/**
 * Insert a block entity into editor
 */
export default function insertEntity(
    editor: IContentModelEditor,
    type: string,
    isBlock: boolean,
    position?: 'focus' | 'begin' | 'end' | 'root' | SelectionRangeEx,
    options?: InsertEntityOptions
): Entity | null {
    const { contentNode, focusAfterEntity, wrapperDisplay, skipUndoSnapshot } = options || {};
    const wrapper = editor.getDocument().createElement(isBlock ? BlockEntityTag : InlineEntityTag);
    const display = wrapperDisplay ?? (isBlock ? undefined : 'inline-block');

    wrapper.style.setProperty('display', display || null);

    if (contentNode) {
        wrapper.appendChild(contentNode);
    }

    commitEntity(wrapper, type, true /*isReadonly*/);

    const entityModel: ContentModelEntity = {
        blockType: 'Entity',
        segmentType: 'Entity',
        format: {},
        isReadonly: true,
        type,
        wrapper,
    };

    formatWithContentModel(
        editor,
        'insertEntity',
        (model, context) => {
            insertEntityModel(
                model,
                context,
                entityModel,
                typeof position == 'string' ? position : 'focus',
                isBlock,
                focusAfterEntity
            );

            context.skipUndoSnapshot = skipUndoSnapshot;

            return true;
        },
        {
            selectionOverride: typeof position === 'object' ? position : undefined,
        }
    );

    const newEntity = getEntityFromElement(wrapper);

    editor.triggerContentChangedEvent(ChangeSource.InsertEntity, newEntity);

    return newEntity;
}
