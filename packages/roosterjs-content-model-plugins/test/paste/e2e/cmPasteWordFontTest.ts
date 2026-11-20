import { IEditor } from 'roosterjs-content-model-types';
import { initEditor } from './testUtils';
import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';
import { paste } from 'roosterjs-content-model-core';

const ID = 'CM_Paste_Word_Font';

describe(ID, () => {
    let editor: IEditor = undefined!;

    beforeEach(() => {
        editor = initEditor(ID);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(ID)?.remove();
    });

    itChromeOnly('E2E preserve Word class fonts over a later generic paragraph fallback', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>
                <meta name="ProgId" content="Word.Document">
                <style>
                    p.MsoNormal { font-family:Calibri, sans-serif; font-size:11pt; }
                    p { font-family:"Times New Roman", serif; font-size:12pt; }
                </style>
                </head><body><!--StartFragment-->
                <p class="MsoNormal"><span style="font-size:12pt">Word body</span></p>
                <p class="MsoNormal" style="font-family:Aptos, sans-serif">Explicit font</p>
                <!--EndFragment--></body></html>`,
        });

        const paragraphs = document.getElementById(ID)!.querySelectorAll('p');
        const body = paragraphs[0].querySelector('span')!;
        const explicit = paragraphs[1].querySelector('span')!;

        expect(getComputedStyle(body).fontFamily).toBe('Calibri, sans-serif');
        expect(getComputedStyle(body).fontSize).toBe('16px');
        expect(getComputedStyle(explicit).fontFamily).toBe('Aptos, sans-serif');
    });
});
