import { DocumentCommand, NodePosition, PendableFormatState } from 'roosterjs-editor-types/lib';
import { PendableFormatCommandMap, PendableFormatNames, Position } from 'roosterjs-editor-dom/lib';

export function getPendingFormatState(
    range: Range,
    pendableFormatState: PendableFormatState,
    cachedPosition: NodePosition
): PendableFormatState {
    const currentPostion = range && Position.getStart(range);
    if (range && pendableFormatState && range.collapsed && currentPostion.equalTo(cachedPosition)) {
        console.log('cached', pendableFormatState);
        return pendableFormatState;
    } else {
        console.log('executando', getPendableFormatState());
        return getPendableFormatState();
    }
}

function isAPendableFormat(element: HTMLElement, format: string): boolean {
    switch (format) {
        case DocumentCommand.Bold:
            return isBold(element);
        case DocumentCommand.Underline:
            return isUnderline(element);
        case DocumentCommand.Italic:
            return isItalic(element);
        case DocumentCommand.Superscript:
            return isSuperscript(element);
        case DocumentCommand.Subscript:
            return isSubscript(element);
        case DocumentCommand.StrikeThrough:
            return isStrikeThrough(element);
        default:
            return false;
    }
}

function isBold(element: HTMLElement): boolean {
    return getComputedStyle(element).fontWeight >= '700' || element.nodeName === 'B' ? true : false;
}

function isUnderline(element: HTMLElement): boolean {
    return getComputedStyle(element).textDecoration.indexOf('underline') >= 0 ||
        element.nodeName === 'U'
        ? true
        : false;
}

function isItalic(element: HTMLElement): boolean {
    return getComputedStyle(element).fontStyle === 'italic' || element.nodeName === 'I'
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
        document.queryCommandState(PendableFormatCommandMap[key]);
        state[key] = queryCommandState(PendableFormatCommandMap[key]);
        return state;
    }, <PendableFormatState>{});
}
