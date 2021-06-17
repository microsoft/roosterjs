import extractClipboardItems from '../../lib/clipboard/extractClipboardItems';
import { EdgeLinkPreview } from 'roosterjs/lib';

describe('extractClipboardItems', () => {
    function throwError(): any {
        throw new Error('Should never call');
    }

    function createStringItem(type: string, textValue: string): DataTransferItem {
        return {
            kind: 'string',
            type,
            getAsFile: throwError,
            getAsString: (callback: FunctionStringCallback) => {
                callback(textValue);
            },
            webkitGetAsEntry: throwError,
        };
    }

    function createFile(type: string, stringValue: string) {
        const byteString = atob(stringValue);
        const arrayBuilder = new ArrayBuffer(byteString.length);
        const unit8Array = new Uint8Array(arrayBuilder);

        for (let i = 0; i < byteString.length; i++) {
            unit8Array[i] = byteString.charCodeAt(i);
        }

        return new File([arrayBuilder], 'image.png', { type: type });
    }

    function createFileItem(type: string, file: File): DataTransferItem {
        return {
            kind: 'file',
            type,
            getAsFile: () => file,
            getAsString: throwError,
            webkitGetAsEntry: throwError,
        };
    }

    it('null input', async () => {
        const clipboardData = await extractClipboardItems(null);
        expect(clipboardData).toEqual({
            types: [],
            text: '',
            image: null,
            rawHtml: null,
            customValues: {},
        });
    });

    it('empty array input', async () => {
        const clipboardData = await extractClipboardItems([]);
        expect(clipboardData).toEqual({
            types: [],
            text: '',
            image: null,
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with HTML', async () => {
        const html = '<div>html</div>';
        const clipboardData = await extractClipboardItems([createStringItem('text/html', html)]);
        expect(clipboardData).toEqual({
            types: ['text/html'],
            text: '',
            image: null,
            rawHtml: html,
            customValues: {},
        });
    });

    it('input with text', async () => {
        const text = 'This is a test';
        const clipboardData = await extractClipboardItems([createStringItem('text/plain', text)]);
        expect(clipboardData).toEqual({
            types: ['text/plain'],
            text: text,
            image: null,
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with image', async () => {
        const stringValue = 'AAAABBBBCCCC';
        const type = 'image/png';
        const file = createFile(type, stringValue);
        const clipboardData = await extractClipboardItems([createFileItem(type, file)]);
        expect(clipboardData).toEqual({
            types: [type],
            text: '',
            image: file,
            imageDataUri: `data:${type};base64,${stringValue}`,
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with text,html,image', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const stringValue = 'AAAABBBBCCCC';
        const type = 'image/png';
        const file = createFile(type, stringValue);
        const clipboardData = await extractClipboardItems([
            createStringItem('text/html', html),
            createStringItem('text/plain', text),
            createFileItem(type, file),
        ]);
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain', type],
            text: text,
            image: file,
            imageDataUri: `data:${type};base64,${stringValue}`,
            rawHtml: html,
            customValues: {},
        });
    });

    it('input with text,html, and multiple images', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const stringValue1 = 'AAAABBBBCCCC';
        const stringValue2 = 'DDDDEEEEFFFF';
        const type = 'image/png';
        const file1 = createFile(type, stringValue1);
        const file2 = createFile(type, stringValue2);
        const clipboardData = await extractClipboardItems([
            createStringItem('text/html', html),
            createStringItem('text/plain', text),
            createFileItem(type, file1),
            createFileItem(type, file2),
        ]);
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain', type],
            text: text,
            image: file1,
            imageDataUri: `data:${type};base64,${stringValue1}`,
            rawHtml: html,
            customValues: {},
        });
    });

    it('input with text,html, and unrecognized type', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const clipboardData = await extractClipboardItems([
            createStringItem('text/html', html),
            createStringItem('text/plain', text),
            createStringItem('text/unknown', 'test'),
        ]);
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain'],
            text: text,
            image: null,
            rawHtml: html,
            customValues: {},
        });
    });

    it('input with text,html,and known custom type', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const customInput = 'This is a known custom type';
        const customType = 'text/known';
        const clipboardData = await extractClipboardItems(
            [
                createStringItem('text/html', html),
                createStringItem('text/plain', text),
                createStringItem(customType, customInput),
            ],
            { allowedCustomPasteType: ['known'] }
        );
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain', customType],
            text: text,
            image: null,
            rawHtml: html,
            customValues: {
                known: customInput,
            },
        });
    });

    it('input with text,html,and edge link preview', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const linkPreview: EdgeLinkPreview = {
            domain: 'test.com',
            preferred_format: 'text/html',
            title: 'Test',
            type: 'website',
            url: 'test url',
        };
        const customType = 'text/link-preview';
        const customValue = JSON.stringify(linkPreview);
        const clipboardData = await extractClipboardItems(
            [
                createStringItem('text/html', html),
                createStringItem('text/plain', text),
                createStringItem(customType, customValue),
            ],
            { allowLinkPreview: true }
        );
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain', customType],
            text: text,
            image: null,
            rawHtml: html,
            customValues: {
                ['link-preview']: customValue,
            },
            linkPreview: linkPreview,
        });
    });
});
