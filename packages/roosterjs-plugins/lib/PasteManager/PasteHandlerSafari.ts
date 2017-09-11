import ClipboardData from './ClipboardData';
import pasteInterceptor from './PasteInterceptor';
import { Editor } from 'roosterjs-core';
import { validateFileType } from './PasteUtility';

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

function doesDataTransferContainOnlyImage(dataTransfer: DataTransfer) {
    let hasImage = false;
    let hasText = false;
    if (dataTransfer && dataTransfer.types) {
        let dataTranferTypes = dataTransfer.types;
        for (let i = 0; i < dataTranferTypes.length; i++) {
            if (dataTranferTypes[i].indexOf('image/') === 0) {
                hasImage = true;
            } else if (dataTranferTypes[i].indexOf('text/') === 0) {
                hasText = true;
            }
        }
    }

    return hasImage && !hasText;
}

export default function onPasteSafari(
    editor: Editor,
    pasteEvent: ClipboardEvent,
    completeCallback: (clipboardData: ClipboardData) => void,
    dataTransfer: DataTransfer,
    clipboardData: ClipboardData
) {
    let imageFile = getImageFileFromDataTransfer(dataTransfer);
    if (imageFile) {
        clipboardData.imageData.file = imageFile;
        pasteEvent.preventDefault();
        completeCallback(clipboardData);
    } else if (doesDataTransferContainOnlyImage(dataTransfer)) {
        pasteEvent.preventDefault();
        completeCallback(clipboardData);
    } else {
        pasteInterceptor(editor, clipboardData, completeCallback);
    }
}
