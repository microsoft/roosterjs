import {
    convertInlineCss,
    CssRule,
} from '../../../lib/command/createModelFromHtml/convertInlineCss';

describe('convertInlineCss', () => {
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

describe('splitSelectors', () => {
    function splitSelectors(selectorText: string) {
        const regex = /(?![^(]*\)),/;
        return selectorText.split(regex).map(s => s.trim());
    }

    it('testing regex', () => {
        const inputSelector = 'div:not(.example, .sample), li:first-child';

        expect(splitSelectors(inputSelector)).toEqual([
            'div:not(.example, .sample)',
            'li:first-child',
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
