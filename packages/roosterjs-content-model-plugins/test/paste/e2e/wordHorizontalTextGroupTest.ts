import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word uncompressed horizontal text groups', () => {
    let editor: IEditor;
    let root: HTMLDivElement;
    beforeEach(() => {
        root = document.createElement('div');
        root.style.cssText = 'writing-mode:vertical-rl;height:200px;width:400px;font:24px Arial';
        document.body.appendChild(root);
        editor = new Editor(root, { plugins: [new PastePlugin()] });
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function member(text: string, id = '42', extra = '', tag = 'span') {
        return `<${tag} style="layout-flow:horizontal;mso-text-combine-id:${id};${extra}">${text}</${tag}>`;
    }
    function run(content: string, word = true) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }</head><body><!--StartFragment--><p>${content}</p><!--EndFragment--></body></html>`,
        });
    }
    function wrappers() {
        return root.querySelectorAll<HTMLElement>('word-horizontal-text');
    }
    function dimensions(element: Element = root.querySelector('p')!) {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect();
    }
    it('keeps an uncompressed native group horizontal at its natural width', () => {
        run(member('1234'));
        expect(wrappers().length).toBe(1);
        const rect = dimensions(wrappers()[0]);
        expect(rect.width).toBeGreaterThan(rect.height);
        expect(wrappers()[0]?.style.writingMode).toBe('horizontal-tb');
        expect(wrappers()[0]?.style.display).toBe('inline-block');
    });
    it('keeps adjacent same-ID differently formatted runs in one group', () => {
        run(member('12') + member('34', '42', '', 'b'));
        expect(wrappers().length).toBe(1);
        expect(wrappers()[0]?.textContent).toBe('1234');
        expect(wrappers()[0]?.querySelector('b')?.textContent).toBe('34');
        expect(dimensions(wrappers()[0]).width).toBeGreaterThan(40);
    });
    it('keeps different source group IDs separate', () => {
        run(member('12') + member('34', '43'));
        expect(wrappers().length).toBe(2);
        expect(wrappers()[0]?.textContent).toBe('12');
        expect(wrappers()[1]?.textContent).toBe('34');
    });
    it('does not cross a plain text boundary when grouping runs', () => {
        run(member('12') + 'boundary' + member('34'));
        expect(wrappers().length).toBe(2);
        expect(root.textContent).toBe('12boundary34');
    });
    it('does not wrap nested same-ID markers twice', () => {
        run(member('12' + member('34', '42', '', 'b')));
        expect(wrappers().length).toBe(1);
        expect(root.textContent).toBe('1234');
    });
    it('preserves the group after an uncached DOM parse and rewrite', () => {
        run(member('12') + member('34', '42', '', 'b'));
        editor.formatContentModel(() => true, undefined, { tryGetFromCache: false });
        expect(wrappers().length).toBe(1);
        expect(wrappers()[0]?.style.writingMode).toBe('horizontal-tb');
        expect(wrappers()[0]?.querySelector('b')?.textContent).toBe('34');
    });
    it('does not apply a font-em compression approximation to compressed groups', () => {
        run(member('1234', '42', 'mso-tny-compress:yes'));
        expect(wrappers().length).toBe(0);
    });
    it('does not partially wrap a mixed compressed source group', () => {
        run(member('12') + member('34', '42', 'mso-tny-compress:yes'));
        expect(wrappers().length).toBe(0);
    });
    it('requires a valid positive native grouping ID', () => {
        run(member('12', '0') + member('34', 'invalid'));
        expect(wrappers().length).toBe(0);
    });
    it('leaves non-Word clipboard markup unchanged', () => {
        run(member('1234'), false);
        expect(wrappers().length).toBe(0);
    });
    it('honors a live policy rejection of the inferred writing mode', () => {
        editor.dispose();
        editor = new Editor(root, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'writing-mode': false },
                }),
            ],
        });
        run(member('1234'));
        expect(wrappers()[0]?.style.writingMode).toBe('');
    });
    it('does not override a rejected group tag or discard its text', () => {
        editor.dispose();
        editor = new Editor(root, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: ['word-horizontal-text'],
                    attributeSanitizers: {},
                    styleSanitizers: {},
                }),
            ],
        });
        run(member('1234'));
        expect(wrappers().length).toBe(0);
        expect(root.textContent).toBe('1234');
    });
});
