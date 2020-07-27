import getEntityFromElement from './getEntityFromElement';
import safeInstanceOf from '../typeUtils/safeInstanceOf';
import wrap from '../utils/wrap';
import { EntityClasses } from 'roosterjs-editor-types';

/**
 * Wrap a node and make the wrapper element an entity element
 * @param type Type of the entity
 * @param isBlock Whether the entity will be shown as a block
 * @param isReadonly Whether the entity will be a readonly entity
 * @param contentNode Root element of the entity
 */
export default function createEntityWrapper(
    isBlock: boolean,
    type: string,
    isReadonly: boolean,
    contentNode: Node
): HTMLElement;

/**
 * Given an existing element, make it an entity wrapper
 * @param wrapper The existing element
 * @param type Type of the entity
 * @param isReadonly Whether the entity will be a readonly entity
 */
export default function createEntityWrapper(
    wrapper: HTMLElement,
    type: string,
    isReadonly: boolean,
    id?: string
): HTMLElement;

export default function createEntityWrapper(
    blockOrWrapper: HTMLElement | boolean,
    type: string,
    isReadonly: boolean,
    contentNodeOrId?: Node | string
): HTMLElement {
    let wrapper: HTMLElement;
    let id: string;

    if (safeInstanceOf(blockOrWrapper, 'Node')) {
        wrapper = blockOrWrapper;
        id = (contentNodeOrId as string) || getEntityFromElement(wrapper)?.id;
    } else {
        const isBlock = blockOrWrapper;
        wrapper = wrap(contentNodeOrId as Node, isBlock ? 'DIV' : 'SPAN');

        // For inline & readonly entity, we need to set display to "inline-block" otherwise
        // there will be some weird behavior when move cursor around the entity node.
        // And we should only do this for readonly entity since "inline-block" has some side effect
        // in IE that there will be a resize border around the inline-block element. We made some
        // workaround for readonly entity for this issue but for editable entity, keep it as "inline"
        // will just work fine.
        if (!isBlock && isReadonly) {
            wrapper.style.display = 'inline-block';
        }
    }

    wrapper.className = `${EntityClasses.ENTITY_INFO_NAME} ${
        EntityClasses.ENTITY_TYPE_PREFIX
    }${type} ${id ? `${EntityClasses.ENTITY_ID_PREFIX}${id} ` : ''}${
        EntityClasses.ENTITY_READONLY_PREFIX
    }${isReadonly ? '1' : '0'}`;

    return wrapper;
}
