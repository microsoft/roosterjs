import { isNodeOfType } from './isNodeOfType';
import type { ContentModelEntityFormat } from 'roosterjs-content-model-types';

const ENTITY_INFO_NAME = '_Entity';
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_ID_PREFIX = '_EId_';
const ENTITY_READONLY_PREFIX = '_EReadonly_';

/**
 * @internal
 */
export function isEntityElement(node: Node): boolean {
    return isNodeOfType(node, 'ELEMENT_NODE') && node.classList.contains(ENTITY_INFO_NAME);
}

/**
 * @internal
 */
export function parseEntityClassName(
    className: string,
    format: ContentModelEntityFormat
): boolean | undefined {
    if (className == ENTITY_INFO_NAME) {
        return true;
    } else if (className.indexOf(ENTITY_TYPE_PREFIX) == 0) {
        format.entityType = className.substring(ENTITY_TYPE_PREFIX.length);
    } else if (className.indexOf(ENTITY_ID_PREFIX) == 0) {
        format.id = className.substring(ENTITY_ID_PREFIX.length);
    } else if (className.indexOf(ENTITY_READONLY_PREFIX) == 0) {
        format.isReadonly = className.substring(ENTITY_READONLY_PREFIX.length) == '1';
    }
}

/**
 * @internal
 */
export function generateEntityClassNames(format: ContentModelEntityFormat): string {
    return format.isFakeEntity
        ? ''
        : `${ENTITY_INFO_NAME} ${ENTITY_TYPE_PREFIX}${format.entityType ?? ''} ${
              format.id ? `${ENTITY_ID_PREFIX}${format.id} ` : ''
          }${ENTITY_READONLY_PREFIX}${format.isReadonly ? '1' : '0'}`;
}
