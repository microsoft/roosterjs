import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word list padding compensation', () => {
    let editor: IEditor;
    let root: HTMLElement;

    beforeEach(() => {
        editor = initEditor('word-list-padding');
        root = document.getElementById('word-list-padding')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });

    function run(content: string, word = true) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>@list l0:level1{mso-level-number-format:decimal;mso-level-text:"%1.";}
            @list l0:level2{mso-level-number-format:decimal;mso-level-text:"%2.";}</style></head>
            <body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }

    function paragraph(className: string, margin: string, level = 1) {
        return `<p class="${className}" style="margin-left:${margin};text-indent:-18pt;mso-list:l0 level${level} lfo1">
            <span style="mso-list:Ignore">1. </span>List text</p>`;
    }

    ['54pt', '1in', '96px'].forEach(margin => {
        it(`preserves ${margin} rather than subtracting padding that is already zero`, () => {
            run(paragraph('MsoListParagraph', margin));
            const li = root.querySelector('li')!;
            expect(li.style.marginLeft).toBe(margin);
            expect(li.parentElement!.style.paddingLeft).toBe('0px');
        });
    });

    it('keeps contextual-style indentation and numbering consistent with ordinary styles', () => {
        run(paragraph('MsoListParagraph', '54pt') + paragraph('MsoListParagraphCxSpFirst', '54pt'));
        const items = root.querySelectorAll('li');
        expect(items.length).toBe(2);
        expect(items[0].style.marginLeft).toBe('54pt');
        expect(items[1].style.marginLeft).toBe('54pt');
        expect(items[0].parentElement).toBe(items[1].parentElement);
        expect(items[0].parentElement!.tagName).toBe('OL');
    });

    it('still compensates structural Word lists that retain their browser padding', () => {
        run(
            '<ol style="padding-left:40px"><li class="MsoListParagraph" style="margin-left:72px">Structural list</li></ol>'
        );
        const li = root.querySelector('li')!;
        expect(li.style.marginLeft).toBe('32px');
        expect(getComputedStyle(li.parentElement!).paddingLeft).toBe('40px');
    });

    it('does not compensate ordinary non-Word list margins', () => {
        run(
            '<ol style="padding-left:40px"><li style="margin-left:72px">HTML list</li></ol>',
            false
        );
        const li = root.querySelector('li')!;
        expect(li.style.marginLeft).toBe('72px');
        expect(getComputedStyle(li.parentElement!).paddingLeft).toBe('40px');
    });

    it('keeps higher-level Word list margins cleared', () => {
        run(paragraph('MsoListParagraph', '108pt', 2));
        const items = root.querySelectorAll('li');
        expect(items[items.length - 1].style.marginLeft).toBe('');
    });
});
