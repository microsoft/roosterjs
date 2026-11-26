import { initEditor } from './testUtils';
import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import type { IEditor, ValueSanitizer } from 'roosterjs-content-model-types';

describe('Word nested absolute list indentation', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-nested-list-indent');
        root = document.getElementById('word-nested-list-indent')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function paragraph(level: number, margin = '', rtl = false, tag = 'p') {
        return `<${tag} class="MsoListParagraphCxSpMiddle" style="direction:${
            rtl ? 'rtl' : 'ltr'
        };${
            margin ? `margin-${rtl ? 'right' : 'left'}:${margin};` : ''
        }mso-list:l0 level${level} lfo1"><span style="mso-list:Ignore">1. </span>Level ${level}</${tag}>`;
    }
    function run(content: string, rtl = false) {
        root.dir = rtl ? 'rtl' : 'ltr';
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>
                @list l0:level1{mso-level-number-format:decimal;mso-level-text:"%1.";}
                @list l0:level2{mso-level-number-format:decimal;mso-level-text:"%2.";}
                @list l0:level3{mso-level-number-format:decimal;mso-level-text:"%3.";}
                </style></head><body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }
    function indents(rtl = false) {
        const bounds = root.getBoundingClientRect();
        return Array.from(root.querySelectorAll('li'))
            .filter(li => li.firstChild?.nodeType == Node.TEXT_NODE)
            .map(li => {
                const range = document.createRange();
                range.selectNode(li.firstChild!);
                const rect = range.getBoundingClientRect();
                return rtl ? bounds.right - rect.right : rect.left - bounds.left;
            });
    }
    function expectIndents(expected: number[], rtl = false) {
        const actual = indents(rtl);
        expect(actual.length).toBe(expected.length);
        expected.forEach((value, index) => expect(actual[index]).toBeCloseTo(value, 1));
    }
    function configure(policy: ValueSanitizer) {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'margin-left': policy },
                }),
            ],
        });
    }
    it('preserves distinct absolute source margins across three levels', () => {
        run(paragraph(1, '36pt') + paragraph(2, '72pt') + paragraph(3, '90pt'));
        expectIndents([48, 96, 120]);
    });
    it('does not add ancestor item margins to nested wrapper offsets', () => {
        run(paragraph(1, '54pt') + paragraph(2, '72pt'));
        expectIndents([72, 96]);
    });
    it('accounts for implicit parent wrapper padding when the parent has no margin', () => {
        run(paragraph(1) + paragraph(2, '72pt'));
        expectIndents([40, 96]);
    });
    it('accounts for synthesized ancestors when a fragment starts at level two', () => {
        run(paragraph(2, '72pt'));
        expectIndents([96]);
    });
    it('accounts for a skipped intermediate level', () => {
        run(paragraph(1, '36pt') + paragraph(3, '90pt'));
        expectIndents([48, 120]);
    });
    it('keeps different nested item margins independent on a shared wrapper', () => {
        run(paragraph(1, '36pt') + paragraph(2, '72pt') + paragraph(2, '90pt'));
        expectIndents([48, 96, 120]);
        expect(root.querySelectorAll('ol').length).toBe(2);
    });
    it('works when a missing-margin item establishes the nested wrapper first', () => {
        run(paragraph(1, '36pt') + paragraph(2) + paragraph(2, '72pt'));
        expectIndents([48, 40, 96]);
    });
    it('preserves a nested zero absolute margin using a negative relative offset', () => {
        run(paragraph(1, '36pt') + paragraph(2, '0pt'));
        expectIndents([48, 0]);
    });
    it('preserves fractional centimeter lengths without rounding or unsupported conversion', () => {
        run(paragraph(2, '0.5cm'));
        expectIndents([96 / 2.54 / 2]);
    });
    it('preserves DIV pseudo-list indentation', () => {
        run(paragraph(2, '72pt', false, 'div'));
        expectIndents([96]);
    });
    it('preserves native RTL absolute margins without counting the ancestor item copy', () => {
        run(paragraph(1, '54pt', true) + paragraph(2, '108pt', true), true);
        expectIndents([144, 144], true);
    });
    it('keeps the corrected indentation through a model round-trip', () => {
        run(paragraph(1, '36pt') + paragraph(2, '72pt'));
        editor.formatContentModel(() => true);
        expectIndents([48, 96]);
    });
    it('honors a transformed nested source margin', () => {
        configure(() => '12px');
        run(paragraph(2, '72pt'));
        expectIndents([12]);
    });
    it('does not restore a rejected nested source margin', () => {
        configure(false);
        run(paragraph(2, '72pt'));
        expectIndents([80]);
    });
    it('honors a sanitizer transformation to unitless zero', () => {
        configure(() => '0');
        run(paragraph(2, '72pt'));
        expectIndents([0]);
    });
    it('preserves an automatic margin supplied by policy instead of creating an invalid calc', () => {
        configure(() => 'auto');
        run(paragraph(2, '72pt'));
        const items = root.querySelectorAll('li');
        expect(items[items.length - 1].style.marginLeft).toBe('auto');
    });
    it('leaves missing native margins at their existing browser defaults', () => {
        run(paragraph(1) + paragraph(2));
        expectIndents([40, 80]);
    });
    it('leaves ordinary structural HTML nested lists unchanged', () => {
        run('<ol><li>Parent<ol><li>Child</li></ol></li></ol>');
        expectIndents([40, 80]);
    });
});
