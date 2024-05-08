import { applyFormat } from '../modelToDom/utils/applyFormat';
import { isElementOfType } from './isElementOfType';
import { isNodeOfType } from './isNodeOfType';
import { toArray } from './toArray';
import type {
    ContentModelEntityFormatCommon,
    ContentModelSegmentFormatCommon,
    DOMHelper,
    ModelToDomContext,
    ReadonlyContentModelEntityFormat,
} from 'roosterjs-content-model-types';

const ENTITY_INFO_NAME = '_Entity';
const ENTITY_INFO_SELECTOR = '.' + ENTITY_INFO_NAME;
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_ID_PREFIX = '_EId_';
const ENTITY_READONLY_PREFIX = '_EReadonly_';
const ZERO_WIDTH_SPACE = '\u200B';
const DELIMITER_BEFORE = 'entityDelimiterBefore';
const DELIMITER_AFTER = 'entityDelimiterAfter';
const BLOCK_ENTITY_CONTAINER = '_E_EBlockEntityContainer';
const BLOCK_ENTITY_CONTAINER_SELECTOR = '.' + BLOCK_ENTITY_CONTAINER;

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
    return domHelper.findClosestElementAncestor(startNode, ENTITY_INFO_SELECTOR);
}

/**
 * Find the closest block entity wrapper element from a given DOM node
 * @param node The node to start looking for entity container
 * @param domHelper The DOM helper
 * @returns
 */
export function findClosestBlockEntityContainer(
    node: Node,
    domHelper: DOMHelper
): HTMLElement | null {
    return domHelper.findClosestElementAncestor(node, BLOCK_ENTITY_CONTAINER_SELECTOR);
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
export function parseEntityFormat(wrapper: HTMLElement): ContentModelEntityFormatCommon {
    let isEntity = false;
    const format: ContentModelEntityFormatCommon = {};

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
    format: ContentModelEntityFormatCommon
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
export function generateEntityClassNames(format: ReadonlyContentModelEntityFormat): string {
    return format.isFakeEntity
        ? ''
        : `${ENTITY_INFO_NAME} ${ENTITY_TYPE_PREFIX}${format.entityType ?? ''} ${
              format.id ? `${ENTITY_ID_PREFIX}${format.id} ` : ''
          }${ENTITY_READONLY_PREFIX}${format.isReadonly ? '1' : '0'}`;
}

/**
 * Checks whether the node provided is a Entity delimiter
 * @param node the node to check
 * @param isBefore True to match delimiter before entity only, false to match delimiter after entity, or undefined means match both
 * @return true if it is a delimiter
 */
export function isEntityDelimiter(element: HTMLElement, isBefore?: boolean): boolean {
    const matchBefore = isBefore === undefined || isBefore;
    const matchAfter = isBefore === undefined || !isBefore;

    return (
        isElementOfType(element, 'span') &&
        ((matchAfter && element.classList.contains(DELIMITER_AFTER)) ||
            (matchBefore && element.classList.contains(DELIMITER_BEFORE))) &&
        element.textContent === ZERO_WIDTH_SPACE
    );
}

/**
 * Check if the given element is a container element of block entity
 * @param element The element to check
 * @returns True if the element is a block entity container, otherwise false
 */
export function isBlockEntityContainer(element: HTMLElement): boolean {
    return isElementOfType(element, 'div') && element.classList.contains(BLOCK_ENTITY_CONTAINER);
}

/**
 * Adds delimiters to the element provided. If the delimiters already exists, will not be added
 * @param element the node to add the delimiters
 * @param format format to set to the delimiters, so when typing inside of one the format is not lost
 * @param context Model to Dom context to use.
 */
export function addDelimiters(
    doc: Document,
    element: HTMLElement,
    format?: ContentModelSegmentFormatCommon | null,
    context?: ModelToDomContext
): HTMLElement[] {
    let [delimiterAfter, delimiterBefore] = getDelimiters(element);

    if (!delimiterAfter) {
        delimiterAfter = insertDelimiter(doc, element, true /*isAfter*/);
        if (context && format) {
            applyFormat(delimiterAfter, context.formatAppliers.segment, format, context);
        }
    }

    if (!delimiterBefore) {
        delimiterBefore = insertDelimiter(doc, element, false /*isAfter*/);
        if (context && format) {
            applyFormat(delimiterBefore, context.formatAppliers.segment, format, context);
        }
    }

    return [delimiterAfter, delimiterBefore];
}

function getDelimiters(entityWrapper: HTMLElement): (HTMLElement | undefined)[] {
    const result: (HTMLElement | undefined)[] = [];
    const { nextElementSibling, previousElementSibling } = entityWrapper;
    result.push(
        isDelimiter(nextElementSibling, DELIMITER_AFTER),
        isDelimiter(previousElementSibling, DELIMITER_BEFORE)
    );

    return result;
}

function isDelimiter(el: Element | null, className: string): HTMLElement | undefined {
    return el?.classList.contains(className) && el.textContent == ZERO_WIDTH_SPACE
        ? (el as HTMLElement)
        : undefined;
}

function insertDelimiter(doc: Document, element: Element, isAfter: boolean) {
    const span = doc.createElement('span');

    span.className = isAfter ? DELIMITER_AFTER : DELIMITER_BEFORE;
    span.appendChild(doc.createTextNode(ZERO_WIDTH_SPACE));
    element.parentNode?.insertBefore(span, isAfter ? element.nextSibling : element);

    return span;
}
