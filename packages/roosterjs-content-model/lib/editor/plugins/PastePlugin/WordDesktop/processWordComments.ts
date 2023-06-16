import { safeInstanceOf } from 'roosterjs-editor-dom';

const MSO_COMMENT_ANCHOR_HREF_REGEX = /#_msocom_/;
const MSO_SPECIAL_CHARACTER = 'mso-special-character';
const MSO_SPECIAL_CHARACTER_COMMENT = 'comment';
const MSO_ELEMENT = 'mso-element';
const MSO_ELEMENT_COMMENT_LIST = 'comment-list';

/**
 * @internal
 * Check whether the element contain Word attributes related to comments and if it does we should no process
 * this element.
 * @returns
 */
export function processWordComments(styles: Record<string, string>, element: HTMLElement) {
    return (
        styles[MSO_SPECIAL_CHARACTER] == MSO_SPECIAL_CHARACTER_COMMENT ||
        (safeInstanceOf(element, 'HTMLAnchorElement') &&
            MSO_COMMENT_ANCHOR_HREF_REGEX.test(element.href)) ||
        styles[MSO_ELEMENT] == MSO_ELEMENT_COMMENT_LIST
    );
}
