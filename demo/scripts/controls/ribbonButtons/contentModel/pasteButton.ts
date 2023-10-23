import ContentModelRibbonButton from './ContentModelRibbonButton';
// import { extractClipboardItems } from 'roosterjs-editor-dom';
// import { paste } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Paste" button on the format ribbon
 */
export const pasteButton: ContentModelRibbonButton<'buttonNamePaste'> = {
    key: 'buttonNamePaste',
    unlocalizedText: 'Paste',
    iconName: 'Paste',
    onClick: async editor => {
        const doc = editor.getDocument();
        const clipboard = doc.defaultView.navigator.clipboard;
        if (clipboard && clipboard.read) {
            try {
                // const clipboardItems = await clipboard.read();
                // const dataTransferItems = await Promise.all(
                //     createDataTransferItems(clipboardItems)
                // );
                // const clipboardData = await extractClipboardItems(dataTransferItems);
                // paste(editor, clipboardData);
            } catch {}
        }
        return true;
    },
};

// const createDataTransfer = (
//     kind: 'string' | 'file',
//     type: string,
//     blob: Blob
// ): DataTransferItem => {
//     const file = blob as File;
//     return {
//         kind,
//         type,
//         getAsFile: () => file,
//         getAsString: (callback: (data: string) => void) => {
//             blob.text().then(callback);
//         },
//         webkitGetAsEntry: () => null,
//     };
// };

// const createDataTransferItems = (data: ClipboardItems) => {
//     const isTEXT = (type: string) => type.startsWith('text/');
//     const isIMAGE = (type: string) => type.startsWith('image/');
//     const dataTransferItems: Promise<DataTransferItem>[] = [];
//     data.forEach(item => {
//         item.types.forEach(type => {
//             if (isTEXT(type) || isIMAGE(type)) {
//                 dataTransferItems.push(
//                     item
//                         .getType(type)
//                         .then(blob =>
//                             createDataTransfer(isTEXT(type) ? 'string' : 'file', type, blob)
//                         )
//                 );
//             }
//         });
//     });
//     return dataTransferItems;
// };
