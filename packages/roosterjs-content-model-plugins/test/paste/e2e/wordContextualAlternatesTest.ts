import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word contextual alternates', () => {
    const id = 'word-contextual-alternates';
    const sample = 'return return';
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
                <body><!--StartFragment--><p><span class="WordAlternates" style="font-family:Gabriola;font-size:48pt;${style.replace(
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
                    variant: getComputedStyle(node.parentElement).fontVariantLigatures,
                    width: range.getBoundingClientRect().width,
                };
            }
        }
        throw new Error('Missing alternate sample: ' + text);
    };
    it('disables contextual alternates and preserves actual font advances', () => {
        const reference = document.createElement('span');
        reference.textContent = sample;
        reference.style.cssText = 'font:48pt Gabriola;font-feature-settings:"calt" 0';
        document.body.appendChild(reference);
        try {
            const expected = reference.getBoundingClientRect().width;
            reference.style.fontFeatureSettings = '"calt" 1';
            expect(Math.abs(expected - reference.getBoundingClientRect().width)).toBeGreaterThan(1);
            const result = run(pasteRun('mso-contextual-alternates:no'));
            expect(result.features).toBe('"calt" 0');
            expect(result.width).toBeCloseTo(expected, 1);
        } finally {
            reference.remove();
        }
    });
    it('enables contextual alternates independently of ligatures', () => {
        expect(run(pasteRun('mso-contextual-alternates:yes')).features).toBe('"calt"');
    });
    it('restores alternates in a nested run', () => {
        const root = pasteRun(
            'mso-contextual-alternates:no',
            'Parent<span style="mso-contextual-alternates:yes">Child</span>'
        );
        expect(run(root, 'Parent').features).toBe('"calt" 0');
        expect(run(root, 'Child').features).toBe('"calt"');
    });
    it('recovers contextual alternates from source stylesheets', () => {
        expect(
            run(pasteRun('', sample, '.WordAlternates{mso-contextual-alternates:no}')).features
        ).toBe('"calt" 0');
    });
    it('preserves explicit CSS feature priority and unrelated features', () => {
        const root = pasteRun(
            'mso-contextual-alternates:no;font-feature-settings:"calt" 1, "liga" 0'
        );
        expect(run(root).features).toBe('"calt", "liga" 0');
    });
    it('preserves explicit high-level contextual CSS priority', () => {
        const result = run(
            pasteRun('mso-contextual-alternates:no;font-variant-ligatures:contextual')
        );
        expect(result.features).toBe('normal');
        expect(result.variant).toBe('contextual');
    });
    it('keeps native alternates through caps, font and inherited shorthands', () => {
        const root = pasteRun(
            'mso-contextual-alternates:no',
            'Parent<span style="font-variant:small-caps">Caps</span><span style="font:48pt Gabriola">Font</span>' +
                '<span style="font-variant-ligatures:unset;font-feature-settings:inherit">Inherited</span>'
        );
        ['Caps', 'Font', 'Inherited'].forEach(text => {
            expect(run(root, text).features).toBe('"calt" 0');
        });
    });
    it('does not suppress alternates for nonzero character spacing', () => {
        expect(run(pasteRun('mso-contextual-alternates:yes;letter-spacing:1px')).features).toBe(
            '"calt"'
        );
    });
    it('does not guess unknown Word descriptors', () => {
        expect(run(pasteRun('mso-contextual-alternates:unknown')).features).toBe('normal');
    });
    it('keeps Word required Ethiopic alternates enabled', () => {
        expect(run(pasteRun('mso-contextual-alternates:no', '\u1200'), '\u1200').features).toBe(
            '"calt"'
        );
    });
    it('forces only the Ethiopic script in a mixed native run', () => {
        const root = pasteRun('mso-contextual-alternates:no', 'Latin\u1200Tail');
        expect(run(root, 'Latin').features).toBe('"calt" 0');
        expect(run(root, '\u1200').features).toBe('"calt"');
        expect(run(root, 'Tail').features).toBe('"calt" 0');
    });
    it('keeps attached combining marks with the forced native script', () => {
        const text = '\u1200\u0301';
        const root = pasteRun('mso-contextual-alternates:no', 'Latin' + text + 'Tail');
        expect(run(root, text).features).toBe('"calt"');
        expect(root.textContent).toContain('Latin' + text + 'Tail');
    });
});
