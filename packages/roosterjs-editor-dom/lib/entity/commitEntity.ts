import { EntityClasses } from 'roosterjs-editor-types';

const CONTENT_EDITABLE = 'contenteditable';

/**
 * Commit information of an entity (type, isReadonly, id) into the wrapper node as CSS Classes
 * @param wrapper The entity wrapper element
 * @param type Entity type
 * @param isReadonly Whether this is a readonly entity
 * @param id Optional Id of the entity
 */
export default function commitEntity(
    wrapper: HTMLElement,
    type: string,
    isReadonly: boolean,
    id?: string
) {
    if (wrapper) {
        wrapper.className = `${EntityClasses.ENTITY_INFO_NAME} ${
            EntityClasses.ENTITY_TYPE_PREFIX
        }${type} ${id ? `${EntityClasses.ENTITY_ID_PREFIX}${id} ` : ''}${
            EntityClasses.ENTITY_READONLY_PREFIX
        }${isReadonly ? '1' : '0'}`;

        if (isReadonly) {
            wrapper.contentEditable = 'false';
        } else if (wrapper.getAttribute(CONTENT_EDITABLE)) {
            wrapper.removeAttribute(CONTENT_EDITABLE);
        }
    }
}
