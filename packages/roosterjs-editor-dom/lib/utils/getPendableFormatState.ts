import { DocumentCommand, PendableFormatState } from 'roosterjs-editor-types';

/**
 * Names of Pendable formats
 */
export type PendableFormatNames = keyof PendableFormatState;

/**
 * A map from pendable format name to document command
 */
export const PendableFormatCommandMap: { [key in PendableFormatNames]: DocumentCommand } = {
    /**
     * Bold
     */
    isBold: DocumentCommand.Bold,

    /**
     * Italic
     */
    isItalic: DocumentCommand.Italic,

    /**
     * Underline
     */
    isUnderline: DocumentCommand.Underline,

    /**
     * StrikeThrough
     */
    isStrikeThrough: DocumentCommand.StrikeThrough,

    /**
     * Subscript
     */
    isSubscript: DocumentCommand.Subscript,

    /**
     * Superscript
     */
    isSuperscript: DocumentCommand.Superscript,
};

/**
 * Get Pendable Format State at cursor.
 * @param document The HTML Document to get format state from
 * @returns A PendableFormatState object which contains the values of pendable format states
 */

function isAPendableFormat(element: HTMLElement, format: string): boolean {
    switch (format) {
        case 'bold':
            return isBold(element);
        case 'underline':
            return isUnderline(element);
        case 'italic':
            return isItalic(element);
        case 'superscript':
            return isSuperscript(element);
        case 'subscript':
            return isSubscript(element);
        case 'strikeThrough':
            return isStrikeThrough(element);
        default:
            return false;
    }
}

function isBold(element: HTMLElement): boolean {
    return window.getComputedStyle(element).fontWeight >= '700' || element.nodeName === 'B'
        ? true
        : false;
}

function isUnderline(element: HTMLElement): boolean {
    return window.getComputedStyle(element).textDecoration.indexOf('underline') >= 0 ||
        element.nodeName === 'U'
        ? true
        : false;
}

function isItalic(element: HTMLElement): boolean {
    return window.getComputedStyle(element).fontStyle === 'italic' || element.nodeName === 'I'
        ? true
        : false;
}

function isSuperscript(element: HTMLElement): boolean {
    return element.nodeName === 'SUP' ? true : false;
}

function isSubscript(element: HTMLElement): boolean {
    return element.nodeName === 'SUB' ? true : false;
}

function isStrikeThrough(element: HTMLElement): boolean {
    return window.getComputedStyle(element).textDecoration.indexOf('line-through') >= 0 ||
        element.nodeName === 'STRIKE'
        ? true
        : false;
}

function queryCommandState(document: Document, format: string) {
    let currentElement = document.getSelection().focusNode?.parentElement ?? null;
    let isFormatted = false;
    if (currentElement) {
        while (currentElement) {
            if (isAPendableFormat(currentElement, format)) {
                isFormatted = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }
    }

    return isFormatted;
}

//How do I know execCommand was trigger??

export default function getPendableFormatState(document: Document): PendableFormatState {
    let keys = Object.keys(PendableFormatCommandMap) as PendableFormatNames[];
    return keys.reduce((state, key) => {
        state[key] = document.queryCommandState(PendableFormatCommandMap[key]);
        queryCommandState(document, PendableFormatCommandMap[key]);
        return state;
    }, <PendableFormatState>{});
}
