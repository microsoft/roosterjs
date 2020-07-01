import createEntityWrapper from './createEntityWrapper';
import getEntityElement from './getEntityElement';
import getEntityFromElement from './getEntityFromElement';
import { Editor } from 'roosterjs-editor-core';
import { Position } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    Entity,
    NodePosition,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * Insert an entity into editor.
 * @param editor The editor to insert entity into.
 * @param type Type of the entity
 * @param contentNode Root element of the entity
 * @param isBlock Whether the entity will be shown as a block
 * @param isReadonly Whether the entity will be a readonly entity
 * @param position (Optional) The position to insert into. If not specified, current position will be used.
 * If isBlock is true, entity will be insert below this position
 */
export default function insertEntity(
    editor: Editor,
    type: string,
    contentNode: Node,
    isBlock: boolean,
    isReadonly: boolean,
    position?: NodePosition
): Entity {
    const wrapper = createEntityWrapper(editor, type, contentNode, isBlock, isReadonly);

    let currentRange: Range;

    if (position) {
        currentRange = editor.getSelectionRange();
        const node = position.normalize().node;
        const existingEntity = getEntityElement(editor, node);

        // Do not insert entity into another entity
        if (existingEntity) {
            position = new Position(existingEntity, PositionType.After);
        }

        editor.select(position);
    }

    editor.insertNode(wrapper, {
        updateCursor: false,
        insertOnNewLine: isBlock,
        replaceSelection: true,
        position: ContentPosition.SelectionStart,
    });

    if (isBlock) {
        // Insert an extra empty line for block entity to make sure
        // user can still put cursor below the entity.
        const br = editor.getDocument().createElement('BR');
        wrapper.parentNode.insertBefore(br, wrapper.nextSibling);
    }

    if (currentRange) {
        editor.select(currentRange);
    } else if (!isBlock) {
        editor.select(wrapper, PositionType.After);
    }

    const entity = getEntityFromElement(wrapper);
    editor.triggerContentChangedEvent(ChangeSource.InsertEntity, entity);

    return entity;
}
