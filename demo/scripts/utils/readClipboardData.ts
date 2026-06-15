import { extractClipboardItems } from 'roosterjs-content-model-dom';
import type { ClipboardData } from 'roosterjs-content-model-types';

interface ClipboardWithUnsanitized {
    read(options?: { unsanitized?: string[] }): Promise<ClipboardItems>;
}

/**
 * Read the system clipboard using the async Clipboard API and convert the result
 * into a {@link ClipboardData} object that the editor's paste pipeline expects.
 *
 * Returns `null` when the clipboard API is not available or the read fails (for
 * example, due to permissions or unsupported types).
 */
export async function readClipboardData(doc: Document): Promise<ClipboardData | null> {
    const clipboard = doc.defaultView?.navigator.clipboard as ClipboardWithUnsanitized | undefined;
    if (!clipboard || !clipboard.read) {
        return null;
    }

    try {
        const clipboardItems = await clipboard.read();
        console.log(clipboardItems);
        const dataTransferItems = await Promise.all(createDataTransferItems(clipboardItems));
        return await extractClipboardItems(dataTransferItems);
    } catch {
        return null;
    }
}

const createDataTransfer = (
    kind: 'string' | 'file',
    type: string,
    blob: Blob
): DataTransferItem => {
    const file = blob as File;
    return {
        kind,
        type,
        getAsFile: () => file,
        getAsString: (callback: (data: string) => void) => {
            blob.text().then(callback);
        },
        webkitGetAsEntry: () => null,
    };
};

const createDataTransferItems = (data: ClipboardItems) => {
    const isTEXT = (type: string) => type.startsWith('text/') || type === 'vscode-editor-data';
    const dataTransferItems: Promise<DataTransferItem>[] = [];
    data.forEach(item => {
        item.types.forEach(type => {
            dataTransferItems.push(
                item
                    .getType(type)
                    .then(blob => createDataTransfer(isTEXT(type) ? 'string' : 'file', type, blob))
            );
        });
    });
    return dataTransferItems;
};
