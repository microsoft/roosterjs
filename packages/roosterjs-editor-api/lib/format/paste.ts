import { ContentTypePrefix, IEditor } from 'roosterjs-editor-types';
import { extractClipboardItems } from 'roosterjs-editor-dom';

interface ClipboardItem {
    types: string[];
    getType: (type: string) => Promise<Blob>;
}

interface ChromeClipboard extends Clipboard {
    read: () => Promise<ClipboardItem[]>;
}

function isChromeClipboard(clipboard: Clipboard): clipboard is ChromeClipboard {
    return !!(<ChromeClipboard>clipboard)?.read;
}

function createDataTransferItem(
    kind: 'string' | 'file',
    type: string,
    blob: Blob
): DataTransferItem {
    const file = <any>blob;
    file.name = 'paste.png';
    file.lastModified = new Date();
    return {
        kind,
        type,
        getAsFile: () => file as File,
        getAsString: (callback: FunctionStringCallback) => {
            blob.text().then(text => callback(text));
        },
        webkitGetAsEntry: () => {},
    };
}

/**
 * Direct paste from clipboard
 * Currently only Chrome and Edge (Anaheim) is supported
 * @param editor The editor object
 */
export default function paste(editor: IEditor) {
    editor.focus();
    const clipboard = editor.getDocument().defaultView.navigator.clipboard;

    if (isChromeClipboard(clipboard)) {
        clipboard.read().then(clipboardDataList => {
            const promises: Promise<DataTransferItem>[] = [];

            clipboardDataList.forEach(item => {
                item.types.forEach(type => {
                    const isText = type.indexOf(ContentTypePrefix.TextTypePrefix) == 0;
                    const isFile = type.indexOf(ContentTypePrefix.ImageTypePrefix) == 0;
                    if (isText || isFile) {
                        promises.push(
                            item
                                .getType(type)
                                .then(blob =>
                                    createDataTransferItem(isText ? 'string' : 'file', type, blob)
                                )
                        );
                    }
                });
            });

            Promise.all(promises).then(values => {
                extractClipboardItems(values).then(clipboardData => {
                    if (!editor.isDisposed()) {
                        editor.paste(clipboardData);
                    }
                });
            });
        });
    }
}
