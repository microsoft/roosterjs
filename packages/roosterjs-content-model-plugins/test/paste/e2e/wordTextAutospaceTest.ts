import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word automatic spacing', () => {
    const id = 'word-text-autospace';
    const sample = '\u6f22A\u6f221\u6f22';
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor(id);
        root = document.getElementById(id)!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const pasteRun = (style: string, content = sample, sheet = '', word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${word ? '<meta name="ProgId" content="Word.Document">' : ''}
                <style>${sheet}</style></head><body><!--StartFragment-->
                <p class="Auto" style="font-family:Yu Gothic;font-size:36pt;${style}">${content}</p>
                <!--EndFragment--></body></html>`,
        });
    };
    const run = (text = sample) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == text && node.parentElement) {
                const range = document.createRange();
                range.selectNodeContents(node);
                return {
                    value: getComputedStyle(node.parentElement).getPropertyValue('text-autospace'),
                    width: range.getBoundingClientRect().width,
                };
            }
        }
        throw new Error('Missing automatic-spacing run');
    };
    it('preserves combined native alphabetic and numeric automatic spacing', () => {
        pasteRun('text-autospace:ideograph-numeric ideograph-other');
        expect(run().value).toBe('normal');
    });
    it('recovers native spacing from original stylesheet declarations', () => {
        pasteRun('', sample, '.Auto{text-autospace:ideograph-numeric ideograph-other}');
        expect(run().value).toBe('normal');
    });
    it('resolves nested native spacing opt-outs', () => {
        pasteRun(
            'text-autospace:ideograph-numeric ideograph-other',
            'Parent<span style="text-autospace:none">Child</span>'
        );
        expect(run('Parent').value).toBe('normal');
        expect(run('Child').value).toBe('no-autospace');
    });
    it('retains standard inline CSS over a matching native stylesheet', () => {
        pasteRun(
            'text-autospace:no-autospace',
            sample,
            '.Auto{text-autospace:ideograph-numeric ideograph-other}'
        );
        expect(run().value).toBe('no-autospace');
    });
    it('keeps inline legacy opt-out over a matching native stylesheet', () => {
        pasteRun(
            'text-autospace:none',
            sample,
            '.Auto{text-autospace:ideograph-numeric ideograph-other}'
        );
        expect(run().value).toBe('no-autospace');
    });
    it('preserves standard automatic spacing outside Word', () => {
        pasteRun('text-autospace:normal', sample, '', false);
        expect(run().value).toBe('normal');
    });
    it('retains spacing across inherited bold wrappers', () => {
        pasteRun('text-autospace:ideograph-numeric ideograph-other', '<b>Bold</b>');
        expect(run('Bold').value).toBe('normal');
    });
    it('resolves inherited standard values before DOM flattening', () => {
        pasteRun('text-autospace:normal', '<span style="text-autospace:unset">Inherited</span>');
        expect(run('Inherited').value).toBe('normal');
    });
    it('adds the actual boundary spacing without changing the text', () => {
        pasteRun('text-autospace:ideograph-numeric ideograph-other');
        const reference = document.createElement('span');
        reference.textContent = sample;
        reference.style.cssText = 'position:absolute;font:48px "Yu Gothic";white-space:nowrap';
        reference.style.setProperty('text-autospace', 'no-autospace');
        document.body.appendChild(reference);
        const width = reference.getBoundingClientRect().width;
        reference.remove();
        expect(run().width - width).toBeCloseTo(24, 1);
        expect(root.textContent).toContain(sample);
    });
    it('does not guess unknown Word spacing values', () => {
        pasteRun('text-autospace:unknown');
        expect(run().value).toBe('no-autospace');
    });
});
