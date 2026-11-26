import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word untransformed hard glyph shadows', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-shadow');
        root = document.getElementById('word-shadow')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const native =
        'mso-effects-shadow-color:#CC3300;mso-effects-shadow-alpha:50%;mso-effects-shadow-dpiradius:0pt;mso-effects-shadow-dpidistance:6pt;mso-effects-shadow-angledirection:0;mso-effects-shadow-pctsx:100%;mso-effects-shadow-pctsy:100%;mso-effects-shadow-anglekx:0;mso-effects-shadow-angleky:0';
    function run(content: string, sheet = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p style="font:40px Calibri">${content}</p><!--EndFragment--></body></html>`,
        });
    }
    function shadow(text: string) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == text) return getComputedStyle(node.parentElement!).textShadow;
        }
        throw new Error('Missing fixture text');
    }
    it('retains the native horizontal hard shadow and alpha', () => {
        run(`<span style="${native}">Shadow</span>`);
        expect(shadow('Shadow')).toBe('rgba(204, 51, 0, 0.5) 8px 0px 0px');
    });
    it('uses native angle units rather than treating raw values as degrees', () => {
        run(`<span style="${native};mso-effects-shadow-angledirection:5400000">Down</span>`);
        expect(shadow('Down')).toBe('rgba(204, 51, 0, 0.5) 0px 8px 0px');
    });
    it('recovers supplied native shadow stylesheets', () => {
        run('<span class="Shadow">Sheet</span>', `.Shadow{${native}}`);
        expect(shadow('Sheet')).toBe('rgba(204, 51, 0, 0.5) 8px 0px 0px');
    });
    it('resets the native shadow for a zeroed child effect', () => {
        run(
            `<span style="${native}">Outer<span style="${native};mso-effects-shadow-dpidistance:0pt;mso-effects-shadow-pctsx:0%;mso-effects-shadow-pctsy:0%">Reset</span></span>`
        );
        expect(shadow('Outer')).toBe('rgba(204, 51, 0, 0.5) 8px 0px 0px');
        expect(shadow('Reset')).toBe('none');
    });
    it('keeps explicit browser shadows and nested initial/unset behavior', () => {
        run(
            `<span style="${native};text-shadow:2px 3px red"><span style="text-shadow:unset">Unset</span><span style="text-shadow:initial">Initial</span></span>`
        );
        expect(shadow('Unset')).toBe('rgb(255, 0, 0) 2px 3px 0px');
        expect(shadow('Initial')).toBe('none');
    });
    it('does not guess blur metrics or flatten scaled native shadows', () => {
        run(`<span style="${native};mso-effects-shadow-dpiradius:3pt">Control</span>`);
        expect(shadow('Control')).toBe('none');
    });
});
