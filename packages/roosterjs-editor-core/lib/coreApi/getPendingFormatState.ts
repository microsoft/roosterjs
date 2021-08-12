import { DocumentCommand, NodePosition, PendableFormatState } from 'roosterjs-editor-types';
import { PendableFormatCommandMap, PendableFormatNames, Position } from 'roosterjs-editor-dom';

/**
 *
 * @param range The range of the cursor.
 * @param cachedPendableFormatState The format state cached by PendingFormatStatePlugin.
 * @param cachedPosition The position cached by PendingFormatStatePlugin.
 * @returns The cached format state if it exists. If the cached postion do not exist, search for    pendable elements in the DOM tree and return the pendable format state.
 */

export function getPendingFormatState(
    range: Range,
    cachedPendableFormatState: PendableFormatState,
    cachedPosition: NodePosition
): PendableFormatState {
    const currentPosition = range && Position.getStart(range).normalize();
    const isSamePosition = range && currentPosition.equalTo(cachedPosition);
    if (range && cachedPendableFormatState && range.collapsed && isSamePosition) {
        return cachedPendableFormatState;
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
