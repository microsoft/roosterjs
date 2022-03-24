import extractClipboardItems from '../../lib/clipboard/extractClipboardItems';
import { EdgeLinkPreview } from 'roosterjs-editor-types';

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

    function createFile(type: string, fileNameAndExtension: string, stringValue: string) {
        const byteString = atob(stringValue);
        const arrayBuilder = new ArrayBuffer(byteString.length);
        const unit8Array = new Uint8Array(arrayBuilder);

        for (let i = 0; i < byteString.length; i++) {
            unit8Array[i] = byteString.charCodeAt(i);
        }

        return new File([arrayBuilder], fileNameAndExtension, { type: type });
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
            files: [],
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
            files: [],
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
            files: [],
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
            files: [],
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with image', async () => {
        const stringValue = 'AAAABBBBCCCC';
        const type = 'image/png';
        const file = createFile(type, 'image.png', stringValue);
        const clipboardData = await extractClipboardItems([createFileItem(type, file)]);
        expect(clipboardData).toEqual({
            types: [type],
            text: '',
            image: file,
            files: [],
            imageDataUri: `data:${type};base64,${stringValue}`,
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with file', async () => {
        const stringValue = 'AAAABBBBCCCC';
        const type = 'application/pdf';
        const file = createFile(type, 'document.pdf', stringValue);
        const clipboardData = await extractClipboardItems([createFileItem(type, file)]);
        expect(clipboardData).toEqual({
            types: [type],
            text: '',
            image: null,
            files: [file],
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with null file', async () => {
        const type = 'application/pdf';
        const transferItem: DataTransferItem = {
            kind: 'file',
            type,
            getAsFile: () => null,
            getAsString: throwError,
            webkitGetAsEntry: throwError,
        };
        const clipboardData = await extractClipboardItems([transferItem]);
        expect(clipboardData).toEqual({
            types: [],
            text: '',
            image: null,
            files: [],
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with multiple files', async () => {
        const stringValue1 = 'AAAABBBBCCCC';
        const stringValue2 = 'DDDDEEEEFFFF';
        const pdfType = 'application/pdf';
        const textType = 'text/plain';
        const pdfFile = createFile(pdfType, 'document.pdf', stringValue1);
        const textFile = createFile(textType, 'hello.txt', stringValue2);
        const clipboardData = await extractClipboardItems([
            createFileItem(pdfType, pdfFile),
            createFileItem(textType, textFile),
        ]);
        expect(clipboardData).toEqual({
            types: [pdfType, textType],
            text: '',
            image: null,
            files: [pdfFile, textFile],
            rawHtml: null,
            customValues: {},
        });
    });

    it('input with text,html,image,file', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const stringValue1 = 'AAAABBBBCCCC';
        const stringValue2 = 'DDDDEEEEFFFF';
        const imageType = 'image/png';
        const imageFile = createFile(imageType, 'image.png', stringValue1);
        const pdfType = 'application/pdf';
        const pdfFile = createFile(pdfType, 'document.pdf', stringValue2);
        const clipboardData = await extractClipboardItems([
            createStringItem('text/html', html),
            createStringItem('text/plain', text),
            createFileItem(imageType, imageFile),
            createFileItem(pdfType, pdfFile),
        ]);
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain', imageType, pdfType],
            text: text,
            image: imageFile,
            files: [pdfFile],
            imageDataUri: `data:${imageType};base64,${stringValue1}`,
            rawHtml: html,
            customValues: {},
        });
    });

    it('input with text,html, multiple images and multiple files', async () => {
        const text = 'This is a text';
        const html = '<div>html</div>';
        const stringValue1 = 'AAAABBBBCCCC';
        const stringValue2 = 'DDDDEEEEFFFF';
        const stringValue3 = 'GGGGHHHHIIII';
        const stringValue4 = 'JJJJKKKKLLLL';

        const imageType = 'image/png';
        const file1 = createFile(imageType, 'image.png', stringValue1);
        const file2 = createFile(imageType, 'image.png', stringValue2);

        const textType = 'text/plain';
        const file3 = createFile(textType, 'hello.txt', stringValue3);

        const pdfType = 'application/pdf';
        const file4 = createFile(pdfType, 'document.pdf', stringValue4);

        const clipboardData = await extractClipboardItems([
            createStringItem('text/html', html),
            createStringItem('text/plain', text),
            createFileItem(imageType, file1),
            createFileItem(imageType, file2),
            createFileItem(textType, file3),
            createFileItem(pdfType, file4),
        ]);
        expect(clipboardData).toEqual({
            types: ['text/html', 'text/plain', imageType, imageType, textType, pdfType],
            text: text,
            image: file1,
            files: [file2, file3, file4],
            imageDataUri: `data:${imageType};base64,${stringValue1}`,
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
            files: [],
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
            files: [],
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
            files: [],
            rawHtml: html,
            customValues: {
                ['link-preview']: customValue,
            },
            linkPreview: linkPreview,
        });
    });

    it('input with svg text', async () => {
        const svg = '<svg>test</svg>';
        const clipboardData = await extractClipboardItems([createStringItem('image/svg+xml', svg)]);
        expect(clipboardData).toEqual({
            types: [],
            text: '',
            image: null,
            files: [],
            rawHtml: null,
            customValues: {},
        });
    });
});
