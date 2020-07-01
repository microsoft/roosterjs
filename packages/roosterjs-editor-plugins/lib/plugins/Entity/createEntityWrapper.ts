import { Editor } from 'roosterjs-editor-core';
import { serializeEntityInfo } from './EntityInfo';
import { wrap } from 'roosterjs-editor-dom';

/**
 * Wrap a node and become an entity element
 * @param editor The editor to insert entity into.
 * @param type Type of the entity
 * @param contentNode Root element of the entity
 * @param isBlock Whether the entity will be shown as a block
 * @param isReadonly Whether the entity will be a readonly entity
 */
export default function createEntityWrapper(
    editor: Editor,
    type: string,
    contentNode: Node,
    isBlock: boolean,
    isReadonly: boolean
): HTMLElement {
    const wrapper = wrap(contentNode, isBlock ? 'DIV' : 'SPAN');
    wrapper.className = serializeEntityInfo(editor, type, isReadonly);

    if (!isBlock) {
        wrapper.style.display = 'inline-block';
    }

    return wrapper;
}
