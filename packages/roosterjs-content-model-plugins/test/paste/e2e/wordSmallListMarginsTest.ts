import { initEditor } from './testUtils';
import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import type { IEditor, ValueSanitizer } from 'roosterjs-content-model-types';

describe('Word zero and sub-point list margins', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-small-list-margins');
        root = document.getElementById('word-small-list-margins')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(style: string, rtl = false, word = true, level = 1, css = '') {
        root.dir = rtl ? 'rtl' : 'ltr';
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>@list l0:level1{mso-level-number-format:decimal;mso-level-text:"%1.";}${css}</style>
            </head><body><!--StartFragment-->
            <p class="MsoListParagraph" style="text-indent:-18pt;${style};${
                word ? `mso-list:l0 level${level} lfo1` : ''
            }"><span style="mso-list:Ignore">1. </span>List text</p>
            <!--EndFragment--></body></html>`,
        });
    }
    function indent(rtl = false) {
        const range = document.createRange();
        range.selectNodeContents(root.querySelector('li')!);
        const rect = range.getBoundingClientRect();
        const bounds = root.getBoundingClientRect();
        return rtl ? bounds.right - rect.right : rect.left - bounds.left;
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
    [
        { margin: '0pt', expected: 0 },
        { margin: '0.5pt', expected: 2 / 3 },
        { margin: '0.75pt', expected: 1 },
        { margin: '-0.5pt', expected: -2 / 3 },
        { margin: '0.5in', expected: 48 },
        { margin: '0.5cm', expected: 96 / 2.54 / 2 },
    ].forEach(({ margin, expected }) => {
        it(`honors explicit ${margin} without browser padding`, () => {
            run(`margin-left:${margin}`);
            expect(indent()).toBeCloseTo(expected, 1);
        });
    });
    it('honors explicit zero indentation in a bidi editor', () => {
        run('direction:rtl;margin-right:0pt', true);
        expect(indent(true)).toBeCloseTo(0, 1);
        expect(root.querySelector('ol')!.style.paddingRight).toBe('0px');
    });
    it('keeps large fractional units correct without adding their wrapper padding to a smaller neighbor', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>
                @list l0:level1{mso-level-number-format:decimal;mso-level-text:"%1.";}
                </style></head><body><!--StartFragment-->
                <p class="MsoListParagraph" style="margin-left:0.5in;mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">1. </span>Large margin</p>
                <p class="MsoListParagraph" style="margin-left:0.5pt;mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">2. </span>Small margin</p>
                <!--EndFragment--></body></html>`,
        });
        const items = root.querySelectorAll('li');
        const range = document.createRange();
        range.selectNodeContents(items[1]);
        expect(indent()).toBeCloseTo(48, 1);
        expect(range.getBoundingClientRect().left - root.getBoundingClientRect().left).toBeCloseTo(
            2 / 3,
            1
        );
    });
    it('keeps implicit browser padding when no source margin is supplied', () => {
        run('');
        expect(indent()).toBeCloseTo(40, 1);
    });
    it('does not mistake a global paragraph reset for explicit zero list indentation', () => {
        run('', false, true, 1, 'p{margin:0}');
        expect(indent()).toBeCloseTo(40, 1);
    });
    it('honors a sanitizer transformation of an explicit source margin to zero', () => {
        configure({ 'margin-left': () => '0px' });
        run('margin-left:18pt');
        expect(indent()).toBeCloseTo(0, 1);
    });
    it('does not restore a source margin rejected by a sanitizer', () => {
        configure({ 'margin-left': false });
        run('margin-left:0pt');
        expect(indent()).toBeCloseTo(40, 1);
        expect(root.querySelector('li')!.style.marginLeft).toBe('');
    });
    it('honors rejected inferred padding', () => {
        configure({ 'padding-left': false });
        run('margin-left:0pt');
        expect(root.querySelector('ol')!.style.paddingLeft).toBe('');
        expect(indent()).toBeCloseTo(40, 1);
    });
    it('honors transformed inferred padding', () => {
        configure({ 'padding-left': () => '10px' });
        run('margin-left:0pt');
        expect(indent()).toBeCloseTo(10, 1);
    });
    it('does not clear structural non-Word list padding', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: '<ol><li style="margin-left:0px">HTML list</li></ol>',
        });
        expect(indent()).toBeCloseTo(40, 1);
    });
    it('keeps higher-level wrapper padding and item margin cleanup', () => {
        run('margin-left:0.5pt', false, true, 2);
        const items = root.querySelectorAll('li');
        expect(items[items.length - 1].style.marginLeft).toBe('');
        expect(getComputedStyle(items[items.length - 1].parentElement!).paddingLeft).toBe('40px');
    });
});
