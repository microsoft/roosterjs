import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word number forms', () => {
    const id = 'word-number-forms';
    const text = '0123456789';
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(id);
    });
    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });

    const pasteRun = (style: string, content = text, sheet = '', word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${word ? '<meta name="ProgId" content="Word.Document">' : ''}
                <style>${sheet}</style></head><body><!--StartFragment-->
                <p><span class="WordNumber" style="font-family:Calibri;font-size:24pt;${style}">${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };
    const variant = (root: HTMLElement, value = text) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent?.includes(value) && node.parentElement)
                return getComputedStyle(node.parentElement).fontVariantNumeric;
        }
        throw new Error('Missing pasted numeral text: ' + value);
    };

    it('preserves supplied old-style figures', () => {
        expect(variant(pasteRun('mso-number-form:oldstyle'))).toBe('oldstyle-nums');
    });
    it('preserves supplied lining figures', () => {
        expect(variant(pasteRun('mso-number-form:lining'))).toBe('lining-nums');
    });
    it('restores the font default in a nested run', () => {
        const root = pasteRun(
            'mso-number-form:oldstyle',
            'Parent<span style="mso-number-form:default">Child</span>'
        );
        expect(variant(root, 'Parent')).toBe('oldstyle-nums');
        expect(variant(root, 'Child')).toBe('normal');
    });
    it('preserves a Word stylesheet declaration', () => {
        expect(variant(pasteRun('', text, '.WordNumber{mso-number-form:oldstyle}'))).toBe(
            'oldstyle-nums'
        );
    });
    it('keeps explicit standard numeric CSS authoritative', () => {
        expect(variant(pasteRun('mso-number-form:oldstyle;font-variant-numeric:lining-nums'))).toBe(
            'lining-nums'
        );
    });
    it('changes form without erasing inherited numeric spacing', () => {
        const root = pasteRun(
            'font-variant-numeric:tabular-nums',
            'Parent<span style="mso-number-form:oldstyle">Child</span>'
        );
        expect(variant(root, 'Child')).toContain('oldstyle-nums');
        expect(variant(root, 'Child')).toContain('tabular-nums');
    });
    it('resets only form while retaining inherited numeric spacing', () => {
        const root = pasteRun(
            'font-variant-numeric:oldstyle-nums tabular-nums',
            'Parent<span style="mso-number-form:default">Child</span>'
        );
        expect(variant(root, 'Child')).toBe('tabular-nums');
    });
    it('preserves standard numeric CSS for non-Word paste', () => {
        expect(variant(pasteRun('font-variant-numeric:oldstyle-nums', text, '', false))).toBe(
            'oldstyle-nums'
        );
    });
    it('does not guess an unknown Word form', () => {
        expect(variant(pasteRun('mso-number-form:unknown'))).toBe('normal');
    });
    it('preserves native figures with a font shorthand', () => {
        expect(variant(pasteRun('font:24pt Calibri;mso-number-form:oldstyle'))).toBe(
            'oldstyle-nums'
        );
    });
    it('retains inherited native figures when small caps change', () => {
        const root = pasteRun(
            'mso-number-form:oldstyle',
            'Parent<span style="font-variant:small-caps">Child</span>'
        );
        expect(variant(root, 'Child')).toBe('oldstyle-nums');
    });
    it('inherits the complete native figure form for CSS inherit and unset', () => {
        const root = pasteRun(
            'mso-number-form:oldstyle',
            'Parent<span style="font-variant-numeric:inherit">Inherited</span><span style="font-variant-numeric:unset">Unset</span>'
        );
        expect(variant(root, 'Inherited')).toBe('oldstyle-nums');
        expect(variant(root, 'Unset')).toBe('oldstyle-nums');
    });
});
