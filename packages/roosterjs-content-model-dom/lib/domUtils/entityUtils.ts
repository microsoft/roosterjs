import { isElementOfType } from './isElementOfType';
import { isNodeOfType } from './isNodeOfType';
import { toArray } from './toArray';
import type { ContentModelEntityFormat, DOMHelper } from 'roosterjs-content-model-types';

const ENTITY_INFO_NAME = '_Entity';
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_ID_PREFIX = '_EId_';
const ENTITY_READONLY_PREFIX = '_EReadonly_';
const ZERO_WIDTH_SPACE = '\u200B';
const DELIMITER_BEFORE = 'entityDelimiterBefore';
const DELIMITER_AFTER = 'entityDelimiterAfter';

/**
 * Check if the given DOM Node is an entity wrapper element
 */
export function isEntityElement(node: Node): boolean {
    return isNodeOfType(node, 'ELEMENT_NODE') && node.classList.contains(ENTITY_INFO_NAME);
}

/**
 * Find the closest entity wrapper element from a given DOM node
 * @param node The node to start looking for entity wrapper
 * @param domHelper The DOM helper to use
 */
export function findClosestEntityWrapper(
    startNode: Node,
    domHelper: DOMHelper
): HTMLElement | null {
    return domHelper.findClosestElementAncestor(startNode, `.${ENTITY_INFO_NAME}`);
}

/**
 * Get all entity wrapper elements under the given root element
 * @param root The root element to query from
 * @returns An array of entity wrapper elements
 */
export function getAllEntityWrappers(root: HTMLElement): HTMLElement[] {
    return toArray(root.querySelectorAll('.' + ENTITY_INFO_NAME)) as HTMLElement[];
}

/**
 * Parse entity format from entity wrapper element
 * @param wrapper The wrapper element to parse entity format from
 * @returns Entity format
 */
export function parseEntityFormat(wrapper: HTMLElement): ContentModelEntityFormat {
    let isEntity = false;
    const format: ContentModelEntityFormat = {};

    wrapper.classList.forEach(name => {
        isEntity = parseEntityClassName(name, format) || isEntity;
    });

    if (!isEntity) {
        format.isFakeEntity = true;
        format.isReadonly = !wrapper.isContentEditable;
    }

    return format;
}

/**
 * Parse entity class names from entity wrapper element
 * @param className Class names of entity
 * @param format The output entity format object
 */
function parseEntityClassName(
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
 * Generate Entity class names for an entity wrapper
 * @param format The source entity format object
 * @returns A combined CSS class name string for entity wrapper
 */
export function generateEntityClassNames(format: ContentModelEntityFormat): string {
    return format.isFakeEntity
        ? ''
        : `${ENTITY_INFO_NAME} ${ENTITY_TYPE_PREFIX}${format.entityType ?? ''} ${
              format.id ? `${ENTITY_ID_PREFIX}${format.id} ` : ''
          }${ENTITY_READONLY_PREFIX}${format.isReadonly ? '1' : '0'}`;
}

/**
 * Checks whether the node provided is a Entity delimiter
 * @param node the node to check
 * @return true if it is a delimiter
 */
export function isEntityDelimiter(element: HTMLElement): boolean {
    return (
        isElementOfType(element, 'span') &&
        (element.classList.contains(DELIMITER_AFTER) ||
            element.classList.contains(DELIMITER_BEFORE)) &&
        element.textContent === ZERO_WIDTH_SPACE
    );
}
