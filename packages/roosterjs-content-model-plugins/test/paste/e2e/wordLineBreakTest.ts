import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word strict Japanese line breaking', () => {
    const id = 'word-line-break';
    const sample = '\u3042\u3042\u3042\u3041\u3042\u3042';
    let editor: IEditor;
    let root: HTMLElement;
    let defaultLineBreak: string;
    beforeEach(() => {
        editor = initEditor(id);
        root = document.getElementById(id)!;
        root.lang = 'ja';
        root.style.width = '97px';
        defaultLineBreak = getComputedStyle(root).getPropertyValue('line-break');
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const pasteRun = (
        style = '',
        content = sample,
        bodyStyle = 'line-break:strict',
        sheet = '',
        word = true
    ) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${word ? '<meta name="ProgId" content="Word.Document">' : ''}
                <style>${sheet}</style></head><body style="${bodyStyle}">
                <!--StartFragment--><p class="Breaking" style="font-family:Yu Gothic;font-size:24pt;${style}">
                ${content}</p><!--EndFragment--></body></html>`,
        });
    };
    const run = (text = sample) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent?.includes(text) && node.parentElement) {
                return getComputedStyle(node.parentElement).getPropertyValue('line-break');
            }
        }
        throw new Error('Missing line-breaking text');
    };
    it('retains the native document-level strict setting after fragment extraction', () => {
        pasteRun();
        expect(run()).toBe('strict');
    });
    it('retains a supplied paragraph-level setting', () => {
        pasteRun('line-break:strict', sample, '');
        expect(run()).toBe('strict');
    });
    it('retains the native default in list items', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head>
                <body style="line-break:strict"><!--StartFragment-->
                <ul><li style="font-family:Yu Gothic;font-size:24pt">${sample}</li></ul>
                <!--EndFragment--></body></html>`,
        });
        expect(run()).toBe('strict');
    });
    it('keeps a standard paragraph override over the Word document default', () => {
        pasteRun('line-break:normal');
        expect(run()).toBe('normal');
    });
    it('preserves supplied standard stylesheet rules', () => {
        pasteRun('', sample, '', '.Breaking{line-break:strict}');
        expect(run()).toBe('strict');
    });
    it('resolves standard inherited values before flattening', () => {
        pasteRun('line-break:strict', '<span style="line-break:unset">Inherited</span>');
        expect(run('Inherited')).toBe('strict');
    });
    it('keeps strict rules through nested bold wrappers', () => {
        pasteRun('', '<b>Inherited</b>');
        expect(run('Inherited')).toBe('strict');
    });
    it('preserves standard rules outside Word', () => {
        pasteRun('line-break:strict', sample, '', '', false);
        expect(run()).toBe('strict');
    });
    it('keeps small kana off the beginning of the line without changing text', () => {
        pasteRun();
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            const offset = node.textContent?.indexOf(sample) ?? -1;
            if (offset >= 0) {
                const tops = [0, 2, 3].map(index => {
                    const range = document.createRange();
                    range.setStart(node!, offset + index);
                    range.setEnd(node!, offset + index + 1);
                    return range.getBoundingClientRect().top;
                });
                expect(tops[1]).toBeGreaterThan(tops[0]);
                expect(tops[2]).toBe(tops[1]);
                expect(root.textContent).toContain(sample);
                return;
            }
        }
        throw new Error('Missing kana sample');
    });
    it('does not force strict rules when the native kinsoku override is unsupported', () => {
        pasteRun('mso-line-break-override:restrictions');
        expect(run()).toBe(defaultLineBreak);
    });
    it('recovers a stylesheet kinsoku opt-out without guessing its native metrics', () => {
        pasteRun(
            '',
            sample,
            'line-break:strict',
            '.Breaking{mso-line-break-override:restrictions}'
        );
        expect(run()).toBe(defaultLineBreak);
    });
    it('does not infer a document setting when it was not supplied', () => {
        pasteRun('', sample, '');
        expect(run()).toBe(defaultLineBreak);
    });
});
