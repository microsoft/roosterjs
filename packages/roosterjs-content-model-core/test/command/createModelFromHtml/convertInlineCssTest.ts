import type { CssRule } from 'roosterjs-content-model-types';
import { convertInlineCss } from '../../../lib/command/createModelFromHtml/convertInlineCss';
import { splitCssSelectorList } from '../../../lib/command/createModelFromHtml/getCssSelectorSpecificity';

describe('convertInlineCss', () => {
    [
        {
            name: 'class selector beats a later tag selector',
            html: '<p class="a">Text</p>',
            selectors: ['p.a', 'p'],
            expected: 'red',
        },
        {
            name: 'ID outweighs more than ten classes',
            html: '<p id="target" class="a">Text</p>',
            selectors: ['#target', 'p' + '.a'.repeat(11)],
            expected: 'red',
        },
        {
            name: 'attribute values do not contribute specificity',
            html: '<p class="a b" data-label="#fake .fake">Text</p>',
            selectors: ['.a.b', '[data-label="#fake .fake"]'],
            expected: 'red',
        },
        {
            name: 'escaped identifier characters do not add ID specificity',
            html: '<p class="a#b other">Text</p>',
            selectors: ['.a\\#b', '.other'],
            expected: 'blue',
        },
        {
            name: 'is uses its most specific argument even when that argument does not match',
            html: '<p class="a b">Text</p>',
            selectors: [':is(#missing, .a)', '.a.b'],
            expected: 'red',
        },
        {
            name: 'nested selector functions keep their argument specificity',
            html: '<p class="a c">Text</p>',
            selectors: [':is(.a, :not(#missing, .b))', 'p.a.c'],
            expected: 'red',
        },
        {
            name: 'where does not contribute specificity',
            html: '<p id="target" class="a">Text</p>',
            selectors: ['.a', ':where(#target)'],
            expected: 'red',
        },
        {
            name: 'not uses its argument specificity',
            html: '<p class="a b">Text</p>',
            selectors: [':not(#missing)', 'p.a.b'],
            expected: 'red',
        },
        {
            name: 'has uses its argument specificity',
            html: '<p class="a b"><span id="child">Text</span></p>',
            selectors: ['p:has(#child)', '.a.b'],
            expected: 'red',
        },
        {
            name: 'nth-child counts the pseudo-class and of selector',
            html: '<p class="a b">Text</p>',
            selectors: ['p:nth-child(1 of .a)', '.a.b'],
            expected: 'red',
        },
    ].forEach(({ name, html, selectors, expected }) => {
        it(name, () => {
            const root = document.createElement('div');
            root.innerHTML = html;

            convertInlineCss(root, [
                { selectors: [selectors[0]], text: 'color:red;' },
                { selectors: [selectors[1]], text: 'color:blue;' },
            ]);

            expect(root.querySelector('p')!.style.color).toBe(expected);
        });
    });

    it('uses specificity of matching selectors within a grouped rule', () => {
        const root = document.createElement('div');
        root.innerHTML = '<p id="target" class="a b">Text</p><p class="a b">Other</p>';

        convertInlineCss(root, [
            { selectors: ['#target', '.a'], text: 'color:red;' },
            { selectors: ['.a.b'], text: 'color:blue;' },
        ]);

        const paragraphs = root.querySelectorAll('p');
        expect(paragraphs[0].style.color).toBe('red');
        expect(paragraphs[1].style.color).toBe('blue');
    });

    it('preserves inline precedence and important declarations', () => {
        const root = document.createElement('div');
        root.innerHTML =
            '<p class="a" style="color:green!important">Text</p><p class="a">Other</p>';

        convertInlineCss(root, [
            { selectors: ['.a'], text: 'color:red!important;' },
            { selectors: ['p.a'], text: 'color:blue;' },
        ]);

        const paragraphs = root.querySelectorAll('p');
        expect(paragraphs[0].style.color).toBe('green');
        expect(paragraphs[0].style.getPropertyPriority('color')).toBe('important');
        expect(paragraphs[1].style.color).toBe('red');
        expect(paragraphs[1].style.getPropertyPriority('color')).toBe('important');
    });

    it('matches selectors before creating inline style attributes', () => {
        const root = document.createElement('div');
        root.innerHTML = '<p class="a b">Text</p>';

        convertInlineCss(root, [
            { selectors: ['[style]'], text: 'background-color:blue;' },
            { selectors: ['.a.b'], text: 'color:red;' },
        ]);

        expect(root.querySelector('p')!.style.backgroundColor).toBe('');
        expect(root.querySelector('p')!.style.color).toBe('red');
    });

    it('Empty DOM, empty CSS', () => {
        const root = document.createElement('div');
        const cssRules: CssRule[] = [];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual('');
    });

    it('Empty DOM, has CSS', () => {
        const root = document.createElement('div');
        const cssRules: CssRule[] = [
            {
                selectors: ['div'],
                text: '{color:red;}',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual('');
    });

    it('Has CSS, has node match selector', () => {
        const root = document.createElement('div');

        root.innerHTML = 'test<div>test2</div>test3';

        const cssRules: CssRule[] = [
            {
                selectors: ['div'],
                text: 'color:red;',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual('test<div style="color:red;">test2</div>test3');
    });

    it('Has CSS, has node match selector with existing CSS', () => {
        const root = document.createElement('div');

        root.innerHTML = 'test<div style="font-size:10pt">test2</div>test3';

        const cssRules: CssRule[] = [
            {
                selectors: ['div'],
                text: 'color:red;',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual(
            'test<div style="color:red;font-size:10pt">test2</div>test3'
        );
    });

    it('Has CSS, has node match selector with conflict CSS', () => {
        const root = document.createElement('div');

        root.innerHTML = 'test<div style="color:green">test2</div>test3';

        const cssRules: CssRule[] = [
            {
                selectors: ['div'],
                text: 'color:red;',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual('test<div style="color:red;color:green">test2</div>test3');
    });

    it('Has multiple CSS, has node match selector with conflict CSS', () => {
        const root = document.createElement('div');

        root.innerHTML =
            'test<div style="color:green">test2</div>test3<span class="test">test4</span>';

        const cssRules: CssRule[] = [
            {
                selectors: ['div', '.test'],
                text: 'color:red;',
            },
            {
                selectors: ['div'],
                text: 'color:blue;',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual(
            'test<div style="color:red;color:blue;color:green">test2</div>test3<span class="test" style="color:red;">test4</span>'
        );
    });

    it('Has multiple CSS with complex selector, has node match selector', () => {
        const root = document.createElement('div');

        root.innerHTML = '<div id="div1"><span>test</span></div><span>test2</span>';

        const cssRules: CssRule[] = [
            {
                selectors: ['#div1 span'],
                text: 'color:red;',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual(
            '<div id="div1"><span style="color:red;">test</span></div><span>test2</span>'
        );
    });
});

describe('splitCssSelectorList', () => {
    it('keeps pseudo-class arguments together', () => {
        const inputSelector = 'div:not(.example, .sample), li:first-child';

        expect(splitCssSelectorList(inputSelector)).toEqual([
            'div:not(.example, .sample)',
            'li:first-child',
        ]);
    });

    it('keeps nested arguments, attribute commas, and escaped commas together', () => {
        expect(splitCssSelectorList('p:is(.a, :not(.b, .c)), [data-label="a,b"], .a\\,b')).toEqual([
            'p:is(.a, :not(.b, .c))',
            '[data-label="a,b"]',
            '.a\\,b',
        ]);
    });

    it('Split pseudo-classes correctly, and avoid splitting whats inside parenthesis', () => {
        const root = document.createElement('div');

        root.innerHTML = '<div class="bar">test1<div class="baz">test2</div></div>';

        const cssRules: CssRule[] = [
            {
                selectors: ['div:not(.bar, .baz)'],
                text: 'color:green;',
            },
            {
                selectors: ['.baz'],
                text: 'color:blue;',
            },
            {
                selectors: ['div:not(.baz)'],
                text: 'color:red;',
            },
        ];

        convertInlineCss(root, cssRules);

        expect(root.innerHTML).toEqual(
            '<div class="bar" style="color:red;">test1<div class="baz" style="color:blue;">test2</div></div>'
        );
    });
});
