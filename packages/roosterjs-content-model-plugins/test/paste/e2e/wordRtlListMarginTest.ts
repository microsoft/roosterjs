import { initEditor } from './testUtils';
import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word pseudo-list right margin duplication', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-rtl-list-margin');
        root = document.getElementById('word-rtl-list-margin')!;
        root.dir = 'rtl';
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, bullet = false) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>
                @list l0:level1{mso-level-number-format:${
                    bullet ? 'bullet' : 'decimal'
                };mso-level-text:"${bullet ? 'o' : '%1.'}";}
                @list l0:level2{mso-level-number-format:decimal;mso-level-text:"%2.";}
                </style></head><body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }
    function paragraph(margin: string, tag = 'p', className = 'MsoListParagraph', level = 1) {
        return `<${tag} class="${className}" style="direction:rtl;margin-right:${margin};text-indent:-18pt;mso-list:l0 level${level} lfo1"><span style="mso-list:Ignore">1. </span>Native list text</${tag}>`;
    }
    function indent(item = root.querySelector('li')!) {
        const range = document.createRange();
        range.selectNodeContents(item);
        return root.getBoundingClientRect().right - range.getBoundingClientRect().right;
    }
    [
        'MsoListParagraph',
        'MsoListParagraphCxSpFirst',
        'MsoListParagraphCxSpMiddle',
        'MsoListParagraphCxSpLast',
    ].forEach(className => {
        it(`keeps the full right margin once for ${className}`, () => {
            run(paragraph('54pt', 'p', className));
            expect(indent()).toBeCloseTo(72, 1);
            expect(root.querySelector('ol')!.style.marginRight).toBe('');
            expect(root.querySelector('li')!.style.marginRight).toBe('54pt');
        });
    });
    it('keeps a DIV pseudo-list margin once', () => {
        run(paragraph('54pt', 'div'));
        expect(indent()).toBeCloseTo(72, 1);
    });
    it('keeps the full right margin once for unordered pseudo-lists', () => {
        run(paragraph('54pt'), true);
        expect(indent()).toBeCloseTo(72, 1);
        expect(root.querySelector('ul')!.style.marginRight).toBe('');
    });
    it('keeps negative margins once', () => {
        run(paragraph('-18pt'));
        expect(indent()).toBeCloseTo(-24, 1);
    });
    it('keeps different item margins on a shared wrapper', () => {
        run(paragraph('54pt') + paragraph('18pt'));
        const items = root.querySelectorAll('li');
        expect(root.querySelectorAll('ol').length).toBe(1);
        expect(indent(items[0])).toBeCloseTo(72, 1);
        expect(indent(items[1])).toBeCloseTo(24, 1);
    });
    it('preserves the correction through another model-to-DOM cycle', () => {
        run(paragraph('54pt'));
        editor.formatContentModel(() => true);
        expect(indent()).toBeCloseTo(72, 1);
    });
    it('honors a transformed item margin without retaining the wrapper copy', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'margin-right': () => '12px' },
                }),
            ],
        });
        run(paragraph('54pt'));
        expect(indent()).toBeCloseTo(12, 1);
    });
    it('keeps real Word structural list-wrapper margins', () => {
        run(
            '<ol dir="rtl" style="margin-right:54pt;padding-right:0"><li>Structural item</li></ol>'
        );
        expect(indent()).toBeCloseTo(72, 1);
        expect(root.querySelector('ol')!.style.marginRight).toBe('54pt');
    });
    it('does not restore a rejected item margin', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'margin-right': false },
                }),
            ],
        });
        run(paragraph('54pt'));
        expect(indent()).toBeCloseTo(0, 1);
        expect(root.querySelector('li')!.style.marginRight).toBe('');
        expect(root.querySelector('ol')!.style.marginRight).toBe('');
    });
    it('keeps heading margins on wrappers when ordered heading items reset them', () => {
        run(paragraph('54pt', 'h1'));
        expect(root.querySelector('ol')!.style.marginRight).toBe('54pt');
        expect(root.querySelector('li')!.style.marginRight).toBe('0px');
    });
    it('keeps higher-level wrapper margins when item margins are removed', () => {
        run(paragraph('54pt', 'p', 'MsoListParagraph', 2));
        const items = root.querySelectorAll('li');
        const last = items[items.length - 1];
        expect(last.style.marginRight).toBe('');
        expect(last.parentElement!.style.marginRight).toBe('54pt');
    });
    it('keeps plain paragraph indentation unchanged', () => {
        run('<p dir="rtl" style="margin-right:54pt">Paragraph control</p>');
        expect(indent(root.querySelector('p')!)).toBeCloseTo(72, 1);
        expect(root.querySelector('ol')).toBeNull();
    });
});
