import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { clearFormat } from 'roosterjs-content-model-api';
import { createText, getSegmentTextFormat } from 'roosterjs-content-model-dom';

describe('Word run language paste', () => {
    let root: HTMLDivElement;
    let editor: Editor;

    beforeEach(() => {
        root = document.createElement('div');
        document.body.appendChild(root);
        editor = new Editor(root, { plugins: [new PastePlugin()] });
    });

    afterEach(() => {
        editor.dispose();
        root.remove();
    });

    function pasteFragment(fragment: string) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
    }

    function languages() {
        const result: [string, string | null][] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent) {
                result.push([
                    node.textContent,
                    node.parentElement!.closest('[lang]')?.getAttribute('lang') ?? null,
                ]);
            }
        }
        return result;
    }

    it('preserves mixed language inheritance, nested reset, and the following run', () => {
        pasteFragment(
            '<p lang="en-US">English<span lang="fr-FR">bonjour<span lang="en-US">hello</span>salut</span>again</p>'
        );
        expect(languages()).toEqual([
            ['English', 'en-US'],
            ['bonjour', 'fr-FR'],
            ['hello', 'en-US'],
            ['salut', 'fr-FR'],
            ['again', 'en-US'],
        ]);
    });

    it('preserves empty lang as unknown rather than inheriting another language', () => {
        pasteFragment('<p lang="fr-FR">bonjour<span lang="">unknown</span></p>');
        expect(languages()).toEqual([
            ['bonjour', 'fr-FR'],
            ['unknown', ''],
        ]);
    });

    it('copies language without requiring emphasis formats', () => {
        const format = { lang: 'fr-FR' };
        expect(getSegmentTextFormat(createText('bonjour', format))).toEqual(format);
    });

    it('clears language to unknown when there is no language default', () => {
        pasteFragment('<p lang="fr-FR">bonjour</p>');
        const range = document.createRange();
        range.selectNodeContents(root.querySelector('p')!);
        editor.setDOMSelection({ type: 'range', range });
        clearFormat(editor);
        expect(languages()).toEqual([['bonjour', '']]);
    });

    it('resets cleared language to the editor default', () => {
        editor.dispose();
        root.innerHTML = '';
        const defaultSegmentFormat = { lang: 'en-US' };
        editor = new Editor(root, {
            plugins: [new PastePlugin()],
            defaultSegmentFormat,
        });
        pasteFragment('<p><span lang="fr-FR">bonjour</span></p>');
        const range = document.createRange();
        range.selectNodeContents(root.querySelector('p')!);
        editor.setDOMSelection({ type: 'range', range });
        clearFormat(editor);
        expect(languages()).toEqual([['bonjour', 'en-US']]);
    });
});
