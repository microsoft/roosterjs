import { isNodeOfType } from './isNodeOfType';
import type { ContentModelEntityFormat } from 'roosterjs-content-model-types';

const ENTITY_INFO_NAME = '_Entity';
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_ID_PREFIX = '_EId_';
const ENTITY_READONLY_PREFIX = '_EReadonly_';
const CONTENT_EDITABLE = 'contenteditable';

/**
 * @internal
 */
export function isEntityElement(node: Node): boolean {
    return isNodeOfType(node, 'ELEMENT_NODE') && node.classList.contains(ENTITY_INFO_NAME);
}

/**
 * @internal
 */
export function parseEntityClasses(element: HTMLElement): ContentModelEntityFormat | null {
    let isEntity = false;
    const format: ContentModelEntityFormat = {};

    element.classList.forEach(name => {
        if (name == ENTITY_INFO_NAME) {
            isEntity = true;
        } else if (name.indexOf(ENTITY_TYPE_PREFIX) == 0) {
            format.type = name.substring(ENTITY_TYPE_PREFIX.length);
        } else if (name.indexOf(ENTITY_ID_PREFIX) == 0) {
            format.id = name.substring(ENTITY_ID_PREFIX.length);
        } else if (name.indexOf(ENTITY_READONLY_PREFIX) == 0) {
            format.isReadonly = name.substring(ENTITY_READONLY_PREFIX.length) == '1';
        }
    });

    return isEntity
        ? format
        : {
              isFakeEntity: true,
              isReadonly: !element.isContentEditable,
          };
}

/**
 * @internal
 */
export function applyEntityClasses(element: HTMLElement, format: ContentModelEntityFormat) {
    if (!format.isFakeEntity) {
        element.className = `${ENTITY_INFO_NAME} ${ENTITY_TYPE_PREFIX}${format.type} ${
            format.id ? `${ENTITY_ID_PREFIX}${format.id} ` : ''
        }${ENTITY_READONLY_PREFIX}${format.isReadonly ? '1' : '0'}`;
    }

    if (format.isReadonly) {
        element.contentEditable = 'false';
    } else {
        element.removeAttribute(CONTENT_EDITABLE);
    }
}
