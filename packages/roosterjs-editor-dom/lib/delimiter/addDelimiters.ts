import createElement from '../utils/createElement';
import getDelimiterFromElement from './getDelimiterFromElement';
import { DelimiterClasses } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Adds delimiters to the element provided. If the delimiters already exists, will not be added
 * @param node the node to add the delimiters
 */
export default function addDelimiters(node: Element): Element[] {
    let [delimiterAfter, delimiterBefore] = getDelimiters(node);

    if (!delimiterAfter) {
        delimiterAfter = addDelimiterAfter(node);
    }
    if (!delimiterBefore) {
        delimiterBefore = addDelimiterBefore(node);
    }
    return [delimiterAfter, delimiterBefore];
}

/**
 * Adds delimiter after the element provided.
 * @param element element to use
 */
export function addDelimiterAfter(element: Element) {
    return insertDelimiter(element, DelimiterClasses.DELIMITER_AFTER);
}

/**
 * Adds delimiter before the element provided.
 * @param element element to use
 */
export function addDelimiterBefore(element: Element) {
    return insertDelimiter(element, DelimiterClasses.DELIMITER_BEFORE);
}

function getDelimiters(entityWrapper: Element): (Element | undefined)[] {
    const result: (Element | undefined)[] = [];
    const { nextElementSibling, previousElementSibling } = entityWrapper;
    result.push(
        isDelimiter(nextElementSibling, DelimiterClasses.DELIMITER_AFTER),
        isDelimiter(previousElementSibling, DelimiterClasses.DELIMITER_BEFORE)
    );

    return result;
}

function isDelimiter(el: Element | null, className: string): Element | undefined {
    return el && getDelimiterFromElement(el) && el.classList.contains(className) ? el : undefined;
}

function insertDelimiter(element: Element, delimiterClass: DelimiterClasses) {
    const span = createElement(
        {
            tag: 'span',
            className: delimiterClass,
            children: [ZERO_WIDTH_SPACE],
        },
        element.ownerDocument
    ) as HTMLElement;
    if (span) {
        const insertPosition: InsertPosition =
            delimiterClass == DelimiterClasses.DELIMITER_AFTER ? 'afterend' : 'beforebegin';
        element.insertAdjacentElement(insertPosition, span);
    }

    return span;
}
