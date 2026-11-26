import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import { clearFormat } from 'roosterjs-content-model-api';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word proofing metadata', () => {
    const id = 'word-no-proof';
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor(id);
        root = document.getElementById(id)!;
        root.spellcheck = true;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const pasteRun = (
        style: string,
        content = 'Unproofed',
        sheet = '',
        attributes = '',
        word = true
    ) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${word ? '<meta name="ProgId" content="Word.Document">' : ''}
                <style>${sheet}</style></head><body><!--StartFragment-->
                <p><span class="Proofing" style="${style}" ${attributes}>${content}</span></p>
                <!--EndFragment--></body></html>`,
        });
    };
    const run = (text = 'Unproofed') => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == text && node.parentElement) {
                return node.parentElement;
            }
        }
        throw new Error('Missing pasted proofing run: ' + text);
    };
    it('disables proofing for the native yes value', () => {
        pasteRun('mso-no-proof:yes');
        expect(run().spellcheck).toBeFalse();
    });
    it('preserves nested native proofing resets', () => {
        pasteRun('mso-no-proof:yes', 'Parent<span style="mso-no-proof:no">Child</span>');
        expect(run('Parent').spellcheck).toBeFalse();
        expect(run('Child').spellcheck).toBeTrue();
    });
    it('recovers a native opt-out from source stylesheets', () => {
        pasteRun('', 'Unproofed', '.Proofing{mso-no-proof:yes}');
        expect(run().spellcheck).toBeFalse();
    });
    it('keeps inline native declarations over matching rules', () => {
        root.spellcheck = false;
        pasteRun('mso-no-proof:no', 'Unproofed', '.Proofing{mso-no-proof:yes}');
        expect(run().spellcheck).toBeTrue();
    });
    it('preserves proofing through inherited bold wrappers', () => {
        pasteRun('mso-no-proof:yes', '<b>Unproofed</b>');
        expect(run().spellcheck).toBeFalse();
    });
    it('keeps explicit standard enablement authoritative', () => {
        root.spellcheck = false;
        pasteRun('mso-no-proof:yes', 'Unproofed', '', 'spellcheck="true"');
        expect(run().spellcheck).toBeTrue();
    });
    it('keeps explicit standard opt-out authoritative', () => {
        pasteRun('mso-no-proof:no', 'Unproofed', '', 'spellcheck="false"');
        expect(run().spellcheck).toBeFalse();
    });
    it('preserves standard proofing metadata outside Word', () => {
        pasteRun('', 'Unproofed', '', 'spellcheck="false"', false);
        expect(run().spellcheck).toBeFalse();
    });
    it('retains proofing metadata when clearing visual formatting', () => {
        pasteRun('mso-no-proof:yes', '<b>Unproofed</b>');
        const range = document.createRange();
        range.selectNodeContents(root.querySelector('p')!);
        editor.setDOMSelection({ type: 'range', range });
        clearFormat(editor);
        expect(run().spellcheck).toBeFalse();
        expect(getComputedStyle(run()).fontWeight).not.toBe('700');
    });
    it('does not opt into proofing when Word supplies no directive', () => {
        root.spellcheck = false;
        pasteRun('');
        expect(run().spellcheck).toBeFalse();
        expect(root.querySelector('[spellcheck]')).toBeNull();
    });
    it('ignores unknown native proofing values', () => {
        pasteRun('mso-no-proof:unknown');
        expect(root.querySelector('[spellcheck]')).toBeNull();
    });
});
