import { initEditor } from './testUtils';
import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor, ValueSanitizer } from 'roosterjs-content-model-types';

describe('Word stylesheet list indentation', () => {
    let editor: IEditor;
    let root: HTMLElement;

    beforeEach(() => {
        editor = initEditor('word-list-style-indent');
        root = document.getElementById('word-list-style-indent')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });

    function run(css: string, content = paragraph(), word = true) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>@list l0:level1{mso-level-number-format:decimal;mso-level-text:"%1.";}
            ${css}</style></head><body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }
    function paragraph(className = 'MsoListParagraph', extraStyle = '') {
        return `<p class="${className}" style="mso-list:l0 level1 lfo1;text-indent:-18pt;${extraStyle}"><span style="mso-list:Ignore">1. </span>List text</p>`;
    }
    function textIndent(element: Element, rtl = false) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const rect = range.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        return rtl ? rootRect.right - rect.right : rect.left - rootRect.left;
    }
    function configure(sanitizers: Record<string, ValueSanitizer>) {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: sanitizers,
                }),
            ],
        });
    }

    it('recovers the complete class margin instead of the browser default', () => {
        run('p.MsoListParagraph{margin-left:54pt}');
        const li = root.querySelector('li')!;
        expect(li.style.marginLeft).toBe('54pt');
        expect(li.parentElement!.style.paddingLeft).toBe('0px');
        expect(textIndent(li)).toBeCloseTo(72, 1);
    });
    it('avoids adding shared wrapper padding to a following explicitly indented item', () => {
        run(
            'p.MsoListParagraph{margin-left:54pt}',
            paragraph() + paragraph('MsoListParagraphCxSpFirst', 'margin-left:54pt')
        );
        const items = root.querySelectorAll('li');
        expect(items.length).toBe(2);
        expect(textIndent(items[0])).toBeCloseTo(72, 1);
        expect(textIndent(items[1])).toBeCloseTo(72, 1);
        expect(items[0].parentElement).toBe(items[1].parentElement);
    });
    it('recovers the horizontal part of a shorthand without losing vertical spacing', () => {
        run('p.MsoListParagraph{margin:6pt 0 9pt 1in}');
        const li = root.querySelector('li')!;
        expect(textIndent(li)).toBeCloseTo(96, 1);
        expect(li.style.marginTop).toBe('6pt');
        expect(li.style.marginBottom).toBe('9pt');
    });
    it('honors a stylesheet zero indentation rather than adding 40px', () => {
        run('p.MsoListParagraph{margin:0}');
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(0, 1);
    });
    it('recovers right-side indentation for native bidi paragraph styles', () => {
        run('p.MsoListParagraph{direction:rtl;margin:0 54pt 0 0}');
        const li = root.querySelector('li')!;
        expect(li.style.direction).toBe('rtl');
        expect(textIndent(li, true)).toBeCloseTo(72, 1);
    });
    it('retains source-order priority for repeated native class rules', () => {
        run('p.MsoListParagraph{margin-left:18pt}p.MsoListParagraph{margin-left:54pt}');
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(72, 1);
    });
    it('retains important class declarations when a later rule has normal priority', () => {
        run('p.MsoListParagraph{margin-left:54pt!important}p.MsoListParagraph{margin-left:18pt}');
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(72, 1);
    });
    it('preserves the non-list side of mixed selector rules', () => {
        run(
            'p.MsoListParagraph,p.Control{margin-left:54pt}',
            paragraph() + '<p class="Control">Paragraph control</p>'
        );
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(72, 1);
        expect(textIndent(root.querySelector('p')!)).toBeCloseTo(72, 1);
    });
    it('preserves explicit paragraph indentation instead of replacing it from the class', () => {
        run(
            'p.MsoListParagraphCxSpFirst{margin-left:54pt}',
            paragraph('MsoListParagraphCxSpFirst', 'margin-left:18pt')
        );
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(24, 1);
    });
    it('does not change structural list-class compensation', () => {
        run(
            'li.MsoListParagraph{margin-left:54pt}',
            '<ol><li class="MsoListParagraph">Structural list</li></ol>'
        );
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(72, 1);
    });
    it('does not reintroduce margins cleared by higher-level Word list processing', () => {
        run('p.MsoListParagraph{margin-left:54pt}', paragraph().replace('level1', 'level2'));
        const items = root.querySelectorAll('li');
        expect(items[items.length - 1].style.marginLeft).toBe('');
        expect(textIndent(items[items.length - 1])).toBeCloseTo(80, 1);
    });
    it('does not reinterpret non-Word paragraphs bearing the same class name', () => {
        run(
            'p.MsoListParagraph{margin-left:54pt}',
            '<p class="MsoListParagraph">Ordinary HTML</p>',
            false
        );
        expect(root.querySelector('li')).toBeNull();
        expect(textIndent(root.querySelector('p')!)).toBeCloseTo(72, 1);
    });
    it('honors a margin sanitizer instead of recovering a rejected class value', () => {
        configure({ 'margin-left': false });
        run('p.MsoListParagraph{margin-left:54pt}');
        expect(root.querySelector('li')!.style.marginLeft).toBe('');
    });
    it('applies a live margin transformation once', () => {
        const sanitizer = jasmine.createSpy('margin').and.returnValue('18pt');
        configure({ 'margin-left': sanitizer });
        run('p.MsoListParagraph{margin-left:54pt}');
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(24, 1);
        expect(sanitizer).toHaveBeenCalledTimes(1);
    });
    it('honors rejected inferred padding', () => {
        configure({ 'padding-left': false });
        run('p.MsoListParagraph{margin-left:54pt}');
        const li = root.querySelector('li')!;
        expect(li.parentElement!.style.paddingLeft).toBe('');
        expect(li.style.marginLeft).toBe('54pt');
    });
    it('honors transformed inferred padding', () => {
        configure({ 'padding-left': () => '10px' });
        run('p.MsoListParagraph{margin-left:54pt}');
        expect(textIndent(root.querySelector('li')!)).toBeCloseTo(82, 1);
    });
    it('keeps recovered item margins and neutral wrapper padding through model round-trip', () => {
        run('p.MsoListParagraph{margin-left:54pt}');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        const li = output.querySelector('li')!;
        expect(li.style.marginLeft).toBe('54pt');
        expect(li.parentElement!.style.paddingLeft).toBe('0px');
    });
});
