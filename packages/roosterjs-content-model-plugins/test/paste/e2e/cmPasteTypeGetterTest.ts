import { getDocumentSource } from '../../../lib/paste/pasteSourceValidations/getDocumentSource';
import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { KnownPasteSourceType } from '../../../lib/paste/pasteSourceValidations/getDocumentSource';
import { ClipboardData, IEditor, PasteTypeGetter } from 'roosterjs-content-model-types';

const ID = 'CM_Paste_TypeGetter_E2E';

describe(ID, () => {
    let editor: IEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID);
    });

    afterEach(() => {
        editor.dispose();
        editor = undefined!;
        document.getElementById(ID)?.remove();
    });

    it('getDocumentSource can be called inside a PasteTypeGetter', () => {
        let receivedDocument: Document | null | undefined;
        let detectedSource: KnownPasteSourceType | undefined;

        const getter: PasteTypeGetter = (doc, clipboardData, environment, htmlAttributes) => {
            receivedDocument = doc;
            detectedSource = getDocumentSource({
                htmlAttributes,
                fragment: doc || document.createDocumentFragment(),
                clipboardItemTypes: clipboardData.types,
                htmlFirstLevelChildTags: clipboardData.htmlFirstLevelChildTags,
                environment,
                rawHtml: clipboardData.rawHtml,
            });

            return detectedSource === 'wordDesktop' ? 'mergeFormat' : 'normal';
        };

        const clipboardData = <ClipboardData>(<any>{
            types: ['text/html'],
            text: 'Hello',
            image: null,
            files: [],
            rawHtml:
                '<html xmlns:w="urn:schemas-microsoft-com:office:word"><body><!--StartFragment--><p>Hello</p><!--EndFragment--></body></html>',
            customValues: {},
        });

        paste(editor, clipboardData, getter);

        expect(receivedDocument).toBeTruthy();
        expect(detectedSource).toBe('wordDesktop');
    });

    it('PasteTypeGetter receives htmlAttributes and environment', () => {
        let receivedAttributes: Record<string, string> | undefined;
        let hasEnvironment = false;

        const getter: PasteTypeGetter = (_doc, _clipboardData, environment, htmlAttributes) => {
            receivedAttributes = htmlAttributes;
            hasEnvironment = !!environment;

            return 'normal';
        };

        const clipboardData = <ClipboardData>(<any>{
            types: ['text/html'],
            text: 'World',
            image: null,
            files: [],
            rawHtml:
                '<html xmlns:w="urn:schemas-microsoft-com:office:word"><body><!--StartFragment--><p>World</p><!--EndFragment--></body></html>',
            customValues: {},
        });

        paste(editor, clipboardData, getter);

        expect(hasEnvironment).toBeTrue();
        expect(receivedAttributes?.['xmlns:w']).toBe('urn:schemas-microsoft-com:office:word');
    });
});
