import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word font kerning', () => {
    const id = 'word-font-kerning';
    const text = 'AVATAR AVATAR AVATAR';
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(id);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });

    const pasteRun = (style: string, content = text) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head>
                <body><!--StartFragment--><p><span style="font-family:Arial;font-size:24pt;${style}">${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };

    const textElement = (root: HTMLElement, value = text) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == value && node.parentElement) {
                return node.parentElement;
            }
        }
        throw new Error('Pasted text was not found: ' + value);
    };

    const width = (element: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().width;
    };

    const referenceWidths = () => {
        const reference = document.createElement('span');
        reference.style.cssText = 'font:24pt Arial;position:fixed;left:-10000px;white-space:pre';
        reference.textContent = text;
        document.body.appendChild(reference);
        reference.style.fontKerning = 'normal';
        const normal = width(reference);
        reference.style.fontKerning = 'none';
        const none = width(reference);
        reference.remove();
        expect(none - normal).toBeGreaterThan(1);
        return { normal, none };
    };

    it('disables kerning for an explicit zero Word threshold', () => {
        const reference = referenceWidths();
        const run = textElement(pasteRun('mso-font-kerning:0pt'));

        expect(getComputedStyle(run).fontKerning).toBe('none');
        expect(width(run)).toBeCloseTo(reference.none, 1);
    });

    it('disables kerning below a supplied threshold', () => {
        const reference = referenceWidths();
        const run = textElement(pasteRun('mso-font-kerning:30pt'));

        expect(getComputedStyle(run).fontKerning).toBe('none');
        expect(width(run)).toBeCloseTo(reference.none, 1);
    });

    it('enables kerning at the inclusive threshold', () => {
        const reference = referenceWidths();
        const run = textElement(pasteRun('mso-font-kerning:24pt'));

        expect(getComputedStyle(run).fontKerning).toBe('normal');
        expect(width(run)).toBeCloseTo(reference.normal, 1);
    });

    it('reevaluates an inherited threshold for a smaller nested run', () => {
        const root = pasteRun(
            'mso-font-kerning:20pt',
            'Large<span style="font-size:12pt">Small</span>'
        );

        expect(getComputedStyle(textElement(root, 'Large')).fontKerning).toBe('normal');
        expect(getComputedStyle(textElement(root, 'Small')).fontKerning).toBe('none');
    });

    it('keeps explicit standard CSS authoritative over Word metadata', () => {
        const root = pasteRun(
            'mso-font-kerning:0pt;font-kerning:normal',
            'Standard<span style="font-kerning:none">Disabled</span>'
        );

        expect(getComputedStyle(textElement(root, 'Standard')).fontKerning).toBe('normal');
        expect(getComputedStyle(textElement(root, 'Disabled')).fontKerning).toBe('none');
    });
});
