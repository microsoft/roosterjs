import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word glyph outlines', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-stroke');
        root = document.getElementById('word-stroke')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const native =
        'mso-style-textoutline-type:solid;mso-style-textoutline-fill-color:#0066CC;mso-style-textoutline-fill-alpha:50%;mso-style-textoutline-outlinestyle-dpiwidth:1.5pt;mso-style-textoutline-outlinestyle-dash:solid;mso-style-textoutline-outlinestyle-align:center;mso-style-textoutline-outlinestyle-compound:simple;mso-style-textoutline-outlinestyle-join:miter';
    function run(content: string, sheet = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p style="font:40px Calibri;color:black">${content}</p><!--EndFragment--></body></html>`,
        });
    }
    function style(text: string) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == text) return getComputedStyle(node.parentElement!);
        }
        throw new Error('Missing fixture text');
    }
    it('retains native solid glyph outline width and resolved alpha/color', () => {
        run(`<span style="${native}">Outline</span>`);
        expect(style('Outline').getPropertyValue('-webkit-text-stroke-width')).toBe('2px');
        expect(style('Outline').getPropertyValue('-webkit-text-stroke-color')).toBe(
            'rgba(0, 102, 204, 0.5)'
        );
    });
    it('recovers supplied native outline stylesheets', () => {
        run('<span class="Outline">Sheet</span>', `.Outline{${native}}`);
        expect(style('Sheet').getPropertyValue('-webkit-text-stroke-width')).toBe('2px');
    });
    it('retains nested no-outline without erasing surrounding outlines', () => {
        run(
            `<span style="${native}">Outer<span style="mso-style-textoutline-type:none">Inner</span></span>`
        );
        expect(style('Outer').getPropertyValue('-webkit-text-stroke-width')).toBe('2px');
        expect(style('Inner').getPropertyValue('-webkit-text-stroke-width')).toBe('0px');
    });
    it('keeps explicit browser outline authoritative', () => {
        run(`<span style="${native};-webkit-text-stroke:3px red">Explicit</span>`);
        expect(style('Explicit').getPropertyValue('-webkit-text-stroke-width')).toBe('3px');
        expect(style('Explicit').getPropertyValue('-webkit-text-stroke-color')).toBe(
            'rgb(255, 0, 0)'
        );
    });
    it('retains inherited unset and explicit initial outline resets', () => {
        run(
            '<span style="-webkit-text-stroke:2px red"><span style="-webkit-text-stroke:unset">Unset</span><span style="-webkit-text-stroke:initial">Initial</span></span>'
        );
        expect(style('Unset').getPropertyValue('-webkit-text-stroke-width')).toBe('2px');
        expect(style('Initial').getPropertyValue('-webkit-text-stroke-width')).toBe('0px');
    });
    it('does not approximate unsupported compound or dashed native outlines', () => {
        run(
            `<span style="${native};mso-style-textoutline-outlinestyle-compound:double">Control</span>`
        );
        expect(style('Control').getPropertyValue('-webkit-text-stroke-width')).toBe('0px');
    });
});
