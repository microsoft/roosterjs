import extractClipboardItems from './extractClipboardItems';
import extractClipboardItemsForIE from './extractClipboardItemsForIE';
import toArray from '../jsUtils/toArray';
import { Browser } from '../utils/Browser';
import { ClipboardData, ExtractClipboardEventOption } from 'roosterjs-editor-types';

interface WindowForIE extends Window {
    clipboardData: DataTransfer;
}

/**
 * @deprecated Use extractClipboardItems and extractClipboardItemsForIE instead
 * Extract a Clipboard event
 * @param event The paste event
 * @param callback Callback function when data is ready
 * @param options Options to retrieve more items from the event, including HTML string and other customized items
 * @param rangeBeforePaste Optional range to be removed when pasting in Android
 * @returns An object with the following properties:
 *  types: Available types from the clipboard event
 *  text: Plain text from the clipboard event
 *  image: Image file from the clipboard event
 *  html: Html string from the clipboard event. When set to null, it means there's no HTML found from the event.
 *   When set to undefined, it means can't retrieve HTML string, there may be HTML string but direct retrieving is
 *   not supported by browser.
 */
export default function extractClipboardEvent(
    event: ClipboardEvent,
    callback: (clipboardData: ClipboardData) => void,
    options?: ExtractClipboardEventOption,
    rangeBeforePaste?: Range
) {
    const dataTransfer =
        event.clipboardData ||
        (<WindowForIE>(<unknown>(<Node>event.target).ownerDocument?.defaultView)).clipboardData;

    if (dataTransfer.items) {
        event.preventDefault();
        extractClipboardItems(toArray(dataTransfer.items), options).then(
            (clipboardData: ClipboardData) => {
                removeContents(rangeBeforePaste);
                callback(clipboardData);
            }
        );
    } else {
        extractClipboardItemsForIE(dataTransfer, callback, options);
    }
}

function removeContents(range?: Range) {
    if (Browser.isAndroid && range) {
        range.deleteContents();
    }
}
