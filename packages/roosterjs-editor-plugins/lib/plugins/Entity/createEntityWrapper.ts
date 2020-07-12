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

    // For inline & readonly entity, we need to set display to "inline-block" otherwise
    // there will be some weird behavior when move cursor around the entity node.
    // And we should only do this for readonly entity since "inline-block" has some side effect
    // in IE that there will be a resize border around the inline-block element. We made some
    // workaround for readonly entity for this issue but for editable entity, keep it as "inline"
    // will just work fine.
    if (!isBlock && isReadonly) {
        wrapper.style.display = 'inline-block';
    }

    return wrapper;
}
