import toArray from './toArray';
import { isElementOfType } from './isElementOfType';
import { isNodeOfType } from './isNodeOfType';
import type { HtmlSanitizerOptions } from 'roosterjs-editor-types';
import type { ContentModelEntityFormat } from 'roosterjs-content-model-types';

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
 * Get all entity wrapper elements under the given root element
 * @param root The root element to query from
 * @returns An array of entity wrapper elements
 */
export function getAllEntityWrappers(root: HTMLElement): HTMLElement[] {
    return toArray(root.querySelectorAll('.' + ENTITY_INFO_NAME)) as HTMLElement[];
}

/**
 * Parse entity class names from entity wrapper element
 * @param className Class names of entity
 * @param format The output entity format object
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

/**
 * Add allow CSS classes to HTML Sanitizer options so they can be preserved during sanitization
 * TODO: Revisit the HTML sanitization approach when paste
 * @param options HTML Sanitizer options
 */
export function addEntityClassesForForHtmlSanitizer(options: HtmlSanitizerOptions) {
    if (!options.additionalAllowedCssClasses) {
        options.additionalAllowedCssClasses = [];
    }

    options.additionalAllowedCssClasses.push(
        '^' + ENTITY_INFO_NAME + '$',
        '^' + ENTITY_ID_PREFIX,
        '^' + ENTITY_TYPE_PREFIX,
        '^' + ENTITY_READONLY_PREFIX
    );
}
