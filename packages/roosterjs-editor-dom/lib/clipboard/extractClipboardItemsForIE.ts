import readFile from '../utils/readFile';
import toArray from '../jsUtils/toArray';
import {
    ClipboardData,
    ContentTypePrefix,
    ExtractClipboardItemsForIEOptions,
} from 'roosterjs-editor-types';

/**
 * Extract clipboard items to be a ClipboardData object for IE
 * @param dataTransfer The clipboard items retrieve from a DataTransfer object
 * @param callback Callback function when data is ready
 * @returns An object with the following properties:
 *  types: Available types from the clipboard event
 *  text: Plain text from the clipboard event
 *  image: Image file from the clipboard event
 *  html: Html string from the clipboard event. When set to null, it means there's no HTML found from the event.
 *   When set to undefined, it means can't retrieve HTML string, there may be HTML string but direct retrieving is
 *   not supported by browser.
 */
export default function extractClipboardItemsForIE(
    dataTransfer: DataTransfer,
    callback: (data: ClipboardData) => void,
    options?: ExtractClipboardItemsForIEOptions
) {
    const clipboardData: ClipboardData = {
        types: dataTransfer.types ? toArray(dataTransfer.types) : [],
        text: dataTransfer.getData('text'),
        image: null,
        files: [],
        rawHtml: null,
        customValues: {},
    };

    for (let i = 0; i < (dataTransfer.files ? dataTransfer.files.length : 0); i++) {
        let file = dataTransfer.files.item(i);
        if (file?.type?.indexOf(ContentTypePrefix.Image) == 0) {
            clipboardData.image = file;
            break;
        }
    }

    const nextStep = () => {
        if (clipboardData.image) {
            readFile(clipboardData.image, dataUrl => {
                clipboardData.imageDataUri = dataUrl;
                callback(clipboardData);
            });
        } else {
            callback(clipboardData);
        }
    };

    if (options?.getTempDiv && options?.removeTempDiv) {
        const div = options.getTempDiv();
        div.contentEditable = 'true';
        div.innerHTML = '';
        div.focus();
        div.ownerDocument?.defaultView?.setTimeout(() => {
            clipboardData.rawHtml = div.innerHTML;
            options.removeTempDiv?.(div);
            nextStep();
        }, 0);
    } else {
        clipboardData.rawHtml = undefined;
        nextStep();
    }
}
