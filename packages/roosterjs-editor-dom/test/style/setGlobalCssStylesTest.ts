import setGlobalCssStyles from '../../lib/style/setGlobalCssStyles';

describe('setGlobalCssStyles', () => {
    let div: HTMLDivElement;
    let span: HTMLSpanElement;
    beforeEach(() => {
        div = document.createElement('div');
        div.id = 'editorTest';
        span = document.createElement('span');
        span.id = 'test';
        div.appendChild(span);
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div.remove();
    });

    it('Should modify existing style ', () => {
        const styleid = 'oldStyle';
        const css1 = '#TestClass { color: red; }';
        const css2 = '#TestClass { color: blue; }';
        const oldStyle = document.createElement('style');
        oldStyle.id = styleid;
        document.head.appendChild(oldStyle);
        oldStyle.sheet?.insertRule(css1);
        expect(oldStyle.sheet?.cssRules.length).toBe(1);
        // Should add a new rule to existing style
        setGlobalCssStyles(document, css2, styleid);
        const styleTag = document.getElementById(styleid) as HTMLStyleElement;
        expect(styleTag?.tagName).toBe('STYLE');
        expect(styleTag.sheet?.cssRules.length).toBe(2);
    });

    it('Should add a new style ', () => {
        const styleid = 'newStyle';
        const css =
            '#' +
            'editorTest' +
            ' #' +
            'test' +
            ' { margin: -2px; border: 2px solid' +
            '#DB626C' +
            ' !important; }';
        // Should create a style tag with id newStyle, and the above rule
        setGlobalCssStyles(document, css, styleid);
        const styleTag = document.getElementById(styleid) as HTMLStyleElement;
        expect(styleTag?.tagName).toBe('STYLE');
    });

    it('Should not add a new style ', () => {
        const styleid = 'noStyle';
        const css = '';
        // Should no create a style tag with id noStyle
        setGlobalCssStyles(document, css, styleid);
        const styleTag = document.getElementById(styleid) as HTMLStyleElement;
        expect(styleTag).toBeNull();
    });
});
