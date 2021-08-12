import { DocumentCommand, NodePosition, PendableFormatState } from 'roosterjs-editor-types';
import { PendableFormatCommandMap, PendableFormatNames } from 'roosterjs-editor-dom';

export function getPendingFormatState(
    range: Range,
    pendableFormatState: PendableFormatState,
    cachedPosition: NodePosition
): PendableFormatState {
    if (range && pendableFormatState && range.collapsed) {
        return pendableFormatState;
    } else {
        return getPendableFormatState();
    }
}

function isAPendableFormat(element: HTMLElement, format: string): boolean {
    switch (format) {
        case DocumentCommand.Bold:
            return element.nodeName === 'B' || element.style.fontWeight >= '700';
        case DocumentCommand.Underline:
            return (
                element.nodeName === 'U' || element.style.textDecoration.indexOf('underline') >= 0
            );
        case DocumentCommand.Italic:
            return element.nodeName === 'I' || element.style.fontStyle === 'italic';
        case DocumentCommand.Superscript:
            return element.nodeName === 'SUP';
        case DocumentCommand.Subscript:
            return element.nodeName === 'SUB';
        case DocumentCommand.StrikeThrough:
            return (
                element.nodeName === 'STRIKE' ||
                element.style.textDecoration.indexOf('line-through') >= 0
            );
        default:
            return false;
    }
}

function queryCommandState(format: string) {
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

function getPendableFormatState(): PendableFormatState {
    let keys = Object.keys(PendableFormatCommandMap) as PendableFormatNames[];
    return keys.reduce((state, key) => {
        state[key] = queryCommandState(PendableFormatCommandMap[key]);
        return state;
    }, <PendableFormatState>{});
}
