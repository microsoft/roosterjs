import { removeListParagraphMargins } from '../../../lib/paste/WordDesktop/removeListParagraphMargins';
import type { CssRule } from 'roosterjs-content-model-types';

describe('removeListParagraphMargins', () => {
    function runTest(input: CssRule[], expected: CssRule[]) {
        removeListParagraphMargins(input);
        expect(input).toEqual(expected);
    }

    it('no list paragraph selectors — rule is unchanged', () => {
        const rules: CssRule[] = [
            { selectors: ['div.SomeClass'], text: 'margin: 0pt; color: red;' },
        ];
        runTest(rules, [{ selectors: ['div.SomeClass'], text: 'margin: 0pt; color: red;' }]);
    });

    it('all selectors are list paragraph classes — margins removed', () => {
        const rules: CssRule[] = [
            {
                selectors: ['p.MsoListParagraph', 'p.MsoListParagraphCxSpFirst'],
                text: 'margin-top: 0pt; margin-bottom: 8pt; color: red; font-size: 11pt;',
            },
        ];
        runTest(rules, [
            {
                selectors: ['p.MsoListParagraph', 'p.MsoListParagraphCxSpFirst'],
                text: ' color: red; font-size: 11pt;',
            },
        ]);
    });

    it('single list paragraph selector — margins removed', () => {
        const rules: CssRule[] = [
            {
                selectors: ['p.MsoListParagraphCxSpMiddle'],
                text: 'margin: 0; font-family: Calibri;',
            },
        ];
        runTest(rules, [
            {
                selectors: ['p.MsoListParagraphCxSpMiddle'],
                text: ' font-family: Calibri;',
            },
        ]);
    });

    it('mixed selectors — rule is split, non-matching keeps original text', () => {
        const rules: CssRule[] = [
            {
                selectors: ['p.MsoListParagraph', 'div.Other'],
                text: 'margin-left: 10pt; color: blue;',
            },
        ];
        runTest(rules, [
            { selectors: ['div.Other'], text: 'margin-left: 10pt; color: blue;' },
            { selectors: ['p.MsoListParagraph'], text: ' color: blue;' },
        ]);
    });

    it('rule with no margin properties — text unchanged', () => {
        const rules: CssRule[] = [
            {
                selectors: ['p.MsoListParagraphCxSpLast'],
                text: 'color: red; font-size: 12pt;',
            },
        ];
        runTest(rules, [
            {
                selectors: ['p.MsoListParagraphCxSpLast'],
                text: 'color: red; font-size: 12pt;',
            },
        ]);
    });

    it('empty rules array — no error', () => {
        runTest([], []);
    });

    it('real-world Word Desktop stylesheet — p.* and div.* MsoListParagraph selectors have margins removed and rules split, li.* kept unchanged', () => {
        const rules: CssRule[] = [
            {
                selectors: ['p.MsoNormal', 'li.MsoNormal', 'div.MsoNormal'],
                text:
                    'margin: 0in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: ['h1'],
                text:
                    'margin: 22pt 0in 0in; break-after: avoid; font-size: 20pt; font-family: "Aptos Display", sans-serif; color: rgb(0, 55, 164); font-weight: normal;',
            },
            {
                selectors: ['p.MsoListParagraph', 'li.MsoListParagraph', 'div.MsoListParagraph'],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: [
                    'p.MsoListParagraphCxSpFirst',
                    'li.MsoListParagraphCxSpFirst',
                    'div.MsoListParagraphCxSpFirst',
                ],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: [
                    'p.MsoListParagraphCxSpMiddle',
                    'li.MsoListParagraphCxSpMiddle',
                    'div.MsoListParagraphCxSpMiddle',
                ],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: [
                    'p.MsoListParagraphCxSpLast',
                    'li.MsoListParagraphCxSpLast',
                    'div.MsoListParagraphCxSpLast',
                ],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: ['span.Heading1Char'],
                text: 'font-family: "Aptos Display", sans-serif; color: rgb(0, 55, 164);',
            },
            { selectors: ['.MsoChpDefault'], text: 'font-family: Aptos, sans-serif;' },
            { selectors: ['.MsoPapDefault'], text: 'margin-bottom: 8pt; line-height: 115%;' },
            { selectors: ['div.WordSection1'], text: 'page: WordSection1;' },
            { selectors: ['ol'], text: 'margin-bottom: 0in;' },
            { selectors: ['ul'], text: 'margin-bottom: 0in;' },
        ];

        const noMarginListText =
            ' font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);';

        runTest(rules, [
            {
                selectors: ['p.MsoNormal', 'li.MsoNormal', 'div.MsoNormal'],
                text:
                    'margin: 0in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: ['h1'],
                text:
                    'margin: 22pt 0in 0in; break-after: avoid; font-size: 20pt; font-family: "Aptos Display", sans-serif; color: rgb(0, 55, 164); font-weight: normal;',
            },
            {
                selectors: ['li.MsoListParagraph'],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            { selectors: ['p.MsoListParagraph', 'div.MsoListParagraph'], text: noMarginListText },
            {
                selectors: ['li.MsoListParagraphCxSpFirst'],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: ['p.MsoListParagraphCxSpFirst', 'div.MsoListParagraphCxSpFirst'],
                text: noMarginListText,
            },
            {
                selectors: ['li.MsoListParagraphCxSpMiddle'],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: ['p.MsoListParagraphCxSpMiddle', 'div.MsoListParagraphCxSpMiddle'],
                text: noMarginListText,
            },
            {
                selectors: ['li.MsoListParagraphCxSpLast'],
                text:
                    'margin: 0in 0in 0in 0.5in; font-size: 10pt; font-family: Aptos, sans-serif; color: rgb(25, 25, 25);',
            },
            {
                selectors: ['p.MsoListParagraphCxSpLast', 'div.MsoListParagraphCxSpLast'],
                text: noMarginListText,
            },
            {
                selectors: ['span.Heading1Char'],
                text: 'font-family: "Aptos Display", sans-serif; color: rgb(0, 55, 164);',
            },
            { selectors: ['.MsoChpDefault'], text: 'font-family: Aptos, sans-serif;' },
            { selectors: ['.MsoPapDefault'], text: 'margin-bottom: 8pt; line-height: 115%;' },
            { selectors: ['div.WordSection1'], text: 'page: WordSection1;' },
            { selectors: ['ol'], text: 'margin-bottom: 0in;' },
            { selectors: ['ul'], text: 'margin-bottom: 0in;' },
        ]);
    });

    it('multiple rules, only list paragraph ones modified', () => {
        const rules: CssRule[] = [
            { selectors: ['span.Normal'], text: 'margin: 5pt; color: black;' },
            {
                selectors: ['p.MsoListParagraph'],
                text: 'margin-top: 0pt; margin-bottom: 0pt; font-size: 11pt;',
            },
            { selectors: ['div.Section'], text: 'margin-right: 2pt; padding: 4pt;' },
        ];
        runTest(rules, [
            { selectors: ['span.Normal'], text: 'margin: 5pt; color: black;' },
            {
                selectors: ['p.MsoListParagraph'],
                text: ' font-size: 11pt;',
            },
            { selectors: ['div.Section'], text: 'margin-right: 2pt; padding: 4pt;' },
        ]);
    });
});
