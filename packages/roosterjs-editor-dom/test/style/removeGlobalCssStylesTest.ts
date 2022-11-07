import removeGlobalCssStyle from '../../lib/style/removeGlobalCssStyle';
import setGlobalCssStyles from '../../lib/style/setGlobalCssStyles';

describe('removeGlobalCssStyle', () => {
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
        div = null;
    });

    it('should add an style ', () => {
        const css =
            '#' +
            'editorTest' +
            ' #' +
            'test' +
            ' { margin: -2px; border: 2px solid' +
            '#DB626C' +
            ' !important; }';
        setGlobalCssStyles(document, css, div.id + span.id);
        removeGlobalCssStyle(document, div.id + span.id);
        const styleTag = document.getElementById('editorTesttest');
        expect(styleTag).toBe(null);
    });
});
