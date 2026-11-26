import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word numeric spacing', () => {
    const id = 'word-number-spacing';
    const ones = '11111111';
    const eights = '88888888';
    let editor: IEditor;
    beforeEach(() => {
        editor = initEditor(id);
    });
    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });
    const pasteRun = (style: string, content = ones, sheet = '') => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p><span class="WordSpacing" style="font-family:Calibri;font-size:24pt;${style}">${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };
    const run = (root: HTMLElement, value = ones) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            const start = node.textContent?.indexOf(value) ?? -1;
            if (start >= 0 && node.parentElement) {
                const range = document.createRange();
                range.setStart(node, start);
                range.setEnd(node, start + value.length);
                return {
                    numeric: getComputedStyle(node.parentElement).fontVariantNumeric,
                    width: range.getBoundingClientRect().width,
                };
            }
        }
        throw new Error('Missing numeric sample: ' + value);
    };
    it('preserves proportional spacing and genuine unequal digit widths', () => {
        const root = pasteRun('mso-number-spacing:proportional', ones + '<br>' + eights);
        expect(run(root).numeric).toBe('proportional-nums');
        expect(Math.abs(run(root).width - run(root, eights).width)).toBeGreaterThan(2);
    });
    it('preserves tabular spacing and equal digit widths', () => {
        const root = pasteRun('mso-number-spacing:tabular', ones + '<br>' + eights);
        expect(run(root).numeric).toBe('tabular-nums');
        expect(run(root).width).toBeCloseTo(run(root, eights).width, 1);
    });
    it('restores font-default spacing in a nested run', () => {
        const root = pasteRun(
            'mso-number-spacing:proportional',
            'Parent<span style="mso-number-spacing:default">Child</span>'
        );
        expect(run(root, 'Parent').numeric).toBe('proportional-nums');
        expect(run(root, 'Child').numeric).toBe('normal');
    });
    it('preserves Word stylesheet metadata', () => {
        expect(
            run(pasteRun('', ones, '.WordSpacing{mso-number-spacing:proportional}')).numeric
        ).toBe('proportional-nums');
    });
    it('keeps explicit standard CSS authoritative', () => {
        expect(
            run(pasteRun('mso-number-spacing:proportional;font-variant-numeric:tabular-nums'))
                .numeric
        ).toBe('tabular-nums');
    });
    it('changes spacing without erasing inherited numeral form', () => {
        const root = pasteRun(
            'font-variant-numeric:oldstyle-nums',
            'Parent<span style="mso-number-spacing:tabular">Child</span>'
        );
        expect(run(root, 'Child').numeric).toContain('oldstyle-nums');
        expect(run(root, 'Child').numeric).toContain('tabular-nums');
    });
    it('resets only spacing while retaining inherited numeral form', () => {
        const root = pasteRun(
            'font-variant-numeric:oldstyle-nums proportional-nums',
            'Parent<span style="mso-number-spacing:default">Child</span>'
        );
        expect(run(root, 'Child').numeric).toBe('oldstyle-nums');
    });
    it('keeps native spacing through caps and inherited CSS values', () => {
        const root = pasteRun(
            'mso-number-spacing:proportional',
            'Parent<span style="font-variant:small-caps">Caps</span><span style="font-variant-numeric:unset">Unset</span>'
        );
        expect(run(root, 'Caps').numeric).toBe('proportional-nums');
        expect(run(root, 'Unset').numeric).toBe('proportional-nums');
    });
    it('does not invent a spacing choice for an unknown value', () => {
        expect(run(pasteRun('mso-number-spacing:unknown')).numeric).toBe('normal');
    });
});
