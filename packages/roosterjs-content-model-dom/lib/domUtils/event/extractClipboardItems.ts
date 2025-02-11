import { readFile } from '../readFile';
import type { ClipboardData, EdgeLinkPreview } from 'roosterjs-content-model-types';

const ContentHandlers: {
    [contentType: string]: (data: ClipboardData, value: string, type?: string) => void;
} = {
    ['text/html']: (data, value) => (data.rawHtml = value),
    ['text/plain']: (data, value) => (data.text = value),
    ['text/*']: (data, value, type?) => !!type && (data.customValues[type] = value),
    ['text/link-preview']: tryParseLinkPreview,
    ['text/uri-list']: (data, value) => (data.text = value),
};

/**
 * Extract clipboard items to be a ClipboardData object for IE
 * @param items The clipboard items retrieve from a DataTransfer object
 * @param allowedCustomPasteType Allowed custom content type when paste besides text/plain, text/html and images
    Only text types are supported, and do not add "text/" prefix to the type values
 */
export function extractClipboardItems(
    items: DataTransferItem[],
    allowedCustomPasteType?: string[]
): Promise<ClipboardData> {
    const data: ClipboardData = {
        types: [],
        text: '',
        image: null,
        files: [],
        rawHtml: null,
        customValues: {},
        pasteNativeEvent: true,
    };

    return Promise.all(
        (items || []).map(item => {
            const type = item.type;

            if (type.indexOf('image/') == 0 && !data.image && item.kind == 'file') {
                data.types.push(type);
                data.image = item.getAsFile();
                return new Promise<void>(resolve => {
                    if (data.image) {
                        readFile(data.image, dataUrl => {
                            data.imageDataUri = dataUrl;
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            } else if (item.kind == 'file') {
                return new Promise<void>(resolve => {
                    const file = item.getAsFile();
                    if (!!file) {
                        data.types.push(type);
                        data.files!.push(file);
                    }
                    resolve();
                });
            } else {
                const customType = getAllowedCustomType(type, allowedCustomPasteType);
                const handler =
                    ContentHandlers[type] || (customType ? ContentHandlers['text/*'] : null);
                return new Promise<void>(resolve =>
                    handler
                        ? item.getAsString(value => {
                              data.types.push(type);
                              handler(data, value, customType);
                              resolve();
                          })
                        : resolve()
                );
            }
        })
    ).then(() => data);
}

function tryParseLinkPreview(data: ClipboardData, value: string) {
    try {
        data.customValues['link-preview'] = value;
        data.linkPreview = JSON.parse(value) as EdgeLinkPreview;
    } catch {}
}

function getAllowedCustomType(type: string, allowedCustomPasteType?: string[]) {
    const textType = type.indexOf('text/') == 0 ? type.substring('text/'.length) : null;
    const index =
        allowedCustomPasteType && textType ? allowedCustomPasteType.indexOf(textType) : -1;
    return textType && index >= 0 ? textType : undefined;
}
