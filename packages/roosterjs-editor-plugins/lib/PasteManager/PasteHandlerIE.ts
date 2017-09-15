import ClipboardData from './ClipboardData';
import pasteInterceptor from './PasteInterceptor';
import { Editor } from 'roosterjs-editor-core';
import { validateFileType } from './PasteUtility';

interface WindowForIE extends Window {
    clipboardData: DataTransfer;
}

function getImageFileFromDataTransfer(dataTransfer: DataTransfer): File {
    let dataTransferFileCount = dataTransfer && dataTransfer.files ? dataTransfer.files.length : 0;
    if (dataTransferFileCount > 0) {
        for (let i = 0; i < dataTransferFileCount; i++) {
            let file = dataTransfer.files.item(i);
            if (file.type.indexOf('image/') == 0 && file.size > 0 && validateFileType(file)) {
                return file;
            }
        }
    }

    return null;
}

export default function onPasteIE(
    editor: Editor,
    pasteEvent: ClipboardEvent,
    completeCallback: (clipboardData: ClipboardData) => void,
    dataTransfer: DataTransfer,
    clipboardData: ClipboardData
) {
    dataTransfer = (window as WindowForIE).clipboardData;
    let imageFile: File = null;

    let plaintext = dataTransfer.getData('text');
    if (!plaintext) {
        // the clipboard API for IE provide access to image and text (not html)
        // if any text exists (e.g. copying html containing images from Word/OneNote), call into pasteInterceptor;
        // else, paste as image file
        imageFile = getImageFileFromDataTransfer(dataTransfer);
    }

    if (imageFile) {
        clipboardData.imageData.file = imageFile;
        pasteEvent.preventDefault();
        completeCallback(clipboardData);
    } else {
        pasteInterceptor(editor, clipboardData, completeCallback);
    }
}
