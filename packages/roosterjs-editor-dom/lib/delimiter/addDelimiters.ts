import createElement from '../utils/createElement';
import getDelimiterFromElement from './getDelimiterFromElement';
import { DelimiterClasses } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Adds delimiters to the element provided. If the delimiters already exists, will not be added
 * @param node the node to add the delimiters
 */
export default function addDelimiters(node: Element) {
    let [delimiterAfter, delimiterBefore] = getDelimiters(node);

    if (!delimiterAfter) {
        delimiterAfter = insertDelimiter(node, DelimiterClasses.DELIMITER_AFTER);
    }
    if (!delimiterBefore) {
        delimiterBefore = insertDelimiter(node, DelimiterClasses.DELIMITER_BEFORE);
    }
    return { delimiterAfter, delimiterBefore };
}

function getDelimiters(entityWrapper: Element): (Element | undefined)[] {
    return [entityWrapper.nextElementSibling, entityWrapper.previousElementSibling].map(el =>
        el && getDelimiterFromElement(el) ? el : undefined
    );
}

function insertDelimiter(element: Element, delimiterClass: DelimiterClasses) {
    const span = createElement(
        {
            tag: 'span',
            className: delimiterClass,
            children: [ZERO_WIDTH_SPACE],
        },
        element.ownerDocument
    );
    if (span) {
        const insertPosition: InsertPosition =
            delimiterClass == DelimiterClasses.DELIMITER_AFTER ? 'afterend' : 'beforebegin';
        element.insertAdjacentElement(insertPosition, span);
    }

    return element;
}
