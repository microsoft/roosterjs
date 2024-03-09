import {
    convertInlineCss,
    CssRule,
} from '../../../lib/editorCommand/createModelFromHtml/convertInlineCss';

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
