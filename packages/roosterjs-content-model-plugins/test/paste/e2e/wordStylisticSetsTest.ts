import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word stylistic sets', () => {
    const id = 'word-stylistic-sets';
    const sample = 'AAA';
    let editor: IEditor;
    beforeEach(() => {
        editor = initEditor(id);
    });
    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });
    const pasteRun = (style: string, content = sample, sheet = '') => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p><span class="WordSet" style="font-family:Gabriola;font-size:48pt;${style.replace(
                    /"/g,
                    '&quot;'
                )}">${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };
    const run = (root: HTMLElement, text = sample) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            const start = node.textContent?.indexOf(text) ?? -1;
            if (start >= 0 && node.parentElement) {
                const range = document.createRange();
                range.setStart(node, start);
                range.setEnd(node, start + text.length);
                return {
                    features: getComputedStyle(node.parentElement).fontFeatureSettings,
                    width: range.getBoundingClientRect().width,
                };
            }
        }
        throw new Error('Missing stylistic-set sample: ' + text);
    };
    it('preserves set four and genuine glyph advances', () => {
        const reference = document.createElement('span');
        reference.textContent = sample;
        reference.style.cssText = 'font:48pt Gabriola;font-feature-settings:"ss04" 1';
        document.body.appendChild(reference);
        try {
            const expected = reference.getBoundingClientRect().width;
            reference.style.fontFeatureSettings = '"ss04" 0';
            expect(Math.abs(expected - reference.getBoundingClientRect().width)).toBeGreaterThan(1);
            const result = run(pasteRun('mso-stylistic-set:8'));
            expect(result.features).toContain('"ss04",');
            expect(result.features).toContain('"ss08" 0');
            expect(result.width).toBeCloseTo(expected, 1);
        } finally {
            reference.remove();
        }
    });
    it('decodes the exported bit rather than treating it as an index', () => {
        const result = run(pasteRun('mso-stylistic-set:4'));
        expect(result.features).toContain('"ss03",');
        expect(result.features).toContain('"ss04" 0');
    });
    it('preserves the twentieth stylistic set', () => {
        expect(run(pasteRun('mso-stylistic-set:524288')).features).toMatch(/"ss20"$/);
    });
    it('recovers set metadata from source stylesheets', () => {
        expect(run(pasteRun('', sample, '.WordSet{mso-stylistic-set:8}')).features).toContain(
            '"ss04",'
        );
    });
    it('resets native sets in a nested run', () => {
        const root = pasteRun(
            'mso-stylistic-set:8',
            'Parent<span style="mso-stylistic-set:0">Child</span>'
        );
        expect(run(root, 'Parent').features).toContain('"ss04",');
        expect(run(root, 'Child').features).toContain('"ss04" 0');
    });
    it('keeps explicit same-tag CSS priority and unrelated contextual features', () => {
        const result = run(
            pasteRun('mso-stylistic-set:8;font-feature-settings:"ss04" 0, "calt" 0')
        );
        expect(result.features).toContain('"ss04" 0');
        expect(result.features).toContain('"calt" 0');
    });
    it('replaces inherited sets without erasing other feature groups', () => {
        const root = pasteRun(
            'font-feature-settings:"ss05" 1, "calt" 0',
            'Parent<span style="mso-stylistic-set:8">Child</span>'
        );
        expect(run(root, 'Child').features).toContain('"ss04",');
        expect(run(root, 'Child').features).toContain('"ss05" 0');
        expect(run(root, 'Child').features).toContain('"calt" 0');
    });
    it('retains native sets through caps and font shorthands', () => {
        const root = pasteRun(
            'mso-stylistic-set:8',
            'Parent<span style="font-variant:small-caps">Caps</span><span style="font:48pt Gabriola">Font</span>'
        );
        expect(run(root, 'Caps').features).toContain('"ss04",');
        expect(run(root, 'Font').features).toContain('"ss04",');
    });
    it('does not guess invalid, multi-set or out-of-range values', () => {
        ['3', '-1', '1048576', 'unknown'].forEach(value => {
            expect(run(pasteRun('mso-stylistic-set:' + value)).features).toBe('normal');
        });
    });
});
