import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word hyphenation policy', () => {
    const id = 'word-hyphenation';
    const sample = 'hy\u00adphen\u00adation';
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor(id);
        root = document.getElementById(id)!;
        root.lang = 'en-US';
        root.style.width = '125px';
        root.style.hyphens = 'none';
        root.style.overflowWrap = 'normal';
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const pasteRun = (style: string, content = sample, sheet = '', xml = '', word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${word ? '<meta name="ProgId" content="Word.Document">' : ''}
                ${xml}<style>${sheet}</style></head><body><!--StartFragment-->
                <p class="Hyphen" style="font-family:Calibri;font-size:24pt;${style}">${content}</p>
                <!--EndFragment--></body></html>`,
        });
    };
    const run = (text = sample) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == text && node.parentElement) {
                return { node, hyphens: getComputedStyle(node.parentElement).hyphens };
            }
        }
        throw new Error('Missing hyphenation sample');
    };
    it('disables automatic hyphenation without discarding manual opportunities', () => {
        pasteRun('mso-hyphenate:none');
        expect(run().hyphens).toBe('manual');
    });
    it('recovers native hyphenation from original stylesheets', () => {
        pasteRun('', sample, '.Hyphen{mso-hyphenate:none}');
        expect(run().hyphens).toBe('manual');
    });
    it('enables native automatic policy only with the supplied document flag', () => {
        pasteRun(
            'mso-hyphenate:auto',
            sample,
            '',
            '<!--[if gte mso 9]><xml><w:WordDocument><w:AutoHyphenation/></w:WordDocument></xml><![endif]-->'
        );
        expect(run().hyphens).toBe('auto');
    });
    it('does not enable automatic policy from a paragraph default alone', () => {
        pasteRun('mso-hyphenate:auto');
        expect(run().hyphens).toBe('manual');
    });
    it('preserves explicit standard policy over native declarations', () => {
        pasteRun('mso-hyphenate:auto;hyphens:none');
        expect(run().hyphens).toBe('none');
    });
    it('keeps inline native opt-out over the matching stylesheet', () => {
        pasteRun(
            'mso-hyphenate:none',
            sample,
            '.Hyphen{mso-hyphenate:auto}',
            '<!--[if gte mso 9]><xml><w:WordDocument><w:AutoHyphenation/></w:WordDocument></xml><![endif]-->'
        );
        expect(run().hyphens).toBe('manual');
    });
    it('preserves nested standard reset and native inheritance', () => {
        pasteRun('mso-hyphenate:none', 'Parent<span style="hyphens:none">Child</span><b>Bold</b>');
        expect(run('Parent').hyphens).toBe('manual');
        expect(run('Child').hyphens).toBe('none');
        expect(run('Bold').hyphens).toBe('manual');
    });
    it('preserves standard manual policy outside Word', () => {
        pasteRun('hyphens:manual', sample, '', '', false);
        expect(run().hyphens).toBe('manual');
    });
    it('uses the supplied soft hyphen to wrap without inserting characters', () => {
        pasteRun('mso-hyphenate:none');
        const { node } = run();
        const tops = [0, sample.length - 1].map(offset => {
            const range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
            return range.getBoundingClientRect().top;
        });
        expect(tops[1]).toBeGreaterThan(tops[0]);
        expect(root.textContent).toContain(sample);
    });
    it('does not infer a native policy from unknown values', () => {
        pasteRun('mso-hyphenate:unknown');
        expect(run().hyphens).toBe('none');
    });
});
