import createEntityClassNames from './createEntityClassNames';
import Editor from '../editor/Editor';
import getEntityFromElement from './getEntityFromElement';
import { wrap } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    Entity,
    NodePosition,
    PositionType,
} from 'roosterjs-editor-types';

export default function insertEntity(
    editor: Editor,
    type: string,
    contentNode: Node,
    isBlock: boolean,
    isReadonly: boolean,
    position?: NodePosition
): Entity {
    const wrapper = wrap(contentNode, isBlock ? 'DIV' : 'SPAN');
    wrapper.className = createEntityClassNames(editor, type, isReadonly);

    if (!isBlock) {
        wrapper.style.display = 'inline-block';
    }

    let currentRange: Range;

    if (position) {
        currentRange = editor.getSelectionRange();
        editor.select(position);
    }

    editor.insertNode(wrapper, {
        updateCursor: false,
        insertOnNewLine: isBlock,
        replaceSelection: true,
        position: ContentPosition.SelectionStart,
    });

    if (isBlock) {
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
