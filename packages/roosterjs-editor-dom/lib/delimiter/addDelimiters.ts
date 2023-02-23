import { DelimiterClasses } from './DelimiterClasses';
import { DelimiterType } from 'roosterjs-editor-types';

let delimiterId = 0;
const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Adds delimiters to the element provided.
 * @param element element to be between delimiters
 */
export default function addDelimiters(element: HTMLElement) {
    function insertNode(
        text: string,
        scopeElement: HTMLElement,
        insertPosition: InsertPosition
    ): HTMLElement {
        const span = element.ownerDocument?.createElement('span');
        span.textContent = text;
        return scopeElement.insertAdjacentElement(insertPosition, span) as HTMLElement;
    }

    const elementBefore = insertNode(ZERO_WIDTH_SPACE, element, 'beforebegin');
    const elementAfter = insertNode(ZERO_WIDTH_SPACE, element, 'afterend');

    delimiterId++;
    setClasses(elementBefore, elementAfter);
}

function setClasses(elementBefore: HTMLElement, elementAfter: HTMLElement) {
    elementBefore.className = getClass(DelimiterType.Before);
    elementAfter.className = getClass(DelimiterType.After);
}

function getClass(delimiterType: DelimiterType) {
    return `${DelimiterClasses.DELIMITER} ${DelimiterClasses.DELIMITER_TYPE_PREFIX}${delimiterType} ${DelimiterClasses.DELIMITER_ID_PREFIX}${delimiterId}`;
}
