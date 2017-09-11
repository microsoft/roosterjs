import ClipboardData from './ClipboardData';
import pasteInterceptor from './PasteInterceptor';
import { Editor } from 'roosterjs-core';
import { validateFileType } from './PasteUtility';

function getContentByTypeFromDataTransfer(
    dataTransfer: DataTransfer,
    contentType: string
): DataTransferItem {
    let dataTransferItemCount = dataTransfer && dataTransfer.items ? dataTransfer.items.length : 0;
    if (dataTransferItemCount > 0) {
        for (let i = 0; i < dataTransferItemCount; i++) {
            let item = dataTransfer.items[i];
            if (item.type.indexOf(contentType) == 0) {
                return item;
            }
        }
    }

    return null;
}

export default function onPaste(
    editor: Editor,
    pasteEvent: ClipboardEvent,
    completeCallback: (clipboardData: ClipboardData) => void,
    dataTransfer: DataTransfer,
    clipboardData: ClipboardData
) {
    let imageItem = getContentByTypeFromDataTransfer(dataTransfer, 'image/');
    let imageFile = imageItem ? imageItem.getAsFile() : null;
    if (imageFile && imageFile.size > 0 && validateFileType(imageFile)) {
        clipboardData.imageData.file = imageFile;
    }

    pasteInterceptor(editor, clipboardData, completeCallback);
}
