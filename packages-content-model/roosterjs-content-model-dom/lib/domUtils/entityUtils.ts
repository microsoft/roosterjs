import { isElementOfType } from './isElementOfType';
import { isNodeOfType } from './isNodeOfType';
import type { ContentModelEntityFormat } from 'roosterjs-content-model-types';

const ENTITY_INFO_NAME = '_Entity';
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_ID_PREFIX = '_EId_';
const ENTITY_READONLY_PREFIX = '_EReadonly_';
const ZERO_WIDTH_SPACE = '\u200B';
const DELIMITER_BEFORE = 'entityDelimiterBefore';
const DELIMITER_AFTER = 'entityDelimiterAfter';

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

/**
 * @internal
 */
export function isEntityDelimiter(element: HTMLElement): boolean {
    return (
        isElementOfType(element, 'span') &&
        (element.classList.contains(DELIMITER_AFTER) ||
            element.classList.contains(DELIMITER_BEFORE)) &&
        element.textContent === ZERO_WIDTH_SPACE
    );
}

/**
 * @internal
 * Adds delimiters to the element provided. If the delimiters already exists, will not be added
 * @param element the node to add the delimiters
 */
export function addDelimiters(doc: Document, element: HTMLElement): HTMLElement[] {
    return [
        insertDelimiter(doc, element, true /*isAfter*/),
        insertDelimiter(doc, element, false /*isAfter*/),
    ];
}

function insertDelimiter(doc: Document, element: Element, isAfter: boolean) {
    const span = doc.createElement('span');

    span.className = isAfter ? DELIMITER_AFTER : DELIMITER_BEFORE;
    span.appendChild(doc.createTextNode(ZERO_WIDTH_SPACE));
    element.parentNode?.insertBefore(span, isAfter ? element.nextSibling : element);

    return span;
}
