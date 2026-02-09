import { createDOMHelper } from '../../../lib/editor/core/DOMHelperImpl';
import { getTextOffset } from '../../../lib/corePlugin/selection/getTextOffset';

describe('getTextOffset', () => {
    let container: HTMLDivElement;
    let domHelper: ReturnType<typeof createDOMHelper>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        domHelper = createDOMHelper(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    function createRange(node: Node, offset: number): Range {
        const range = document.createRange();
        range.setStart(node, offset);
        range.collapse(true);
        return range;
    }

    it('should return undefined when startContainer is not a text node', () => {
        container.innerHTML = '<div>hello</div>';
        const divElement = container.firstChild!;
        const range = createRange(divElement, 0);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBeUndefined();
    });

    it('should return offset at start of single text node', () => {
        container.innerHTML = '<div>hello</div>';
        const textNode = container.querySelector('div')!.firstChild!;
        const range = createRange(textNode, 0);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(0);
    });

    it('should return offset in middle of single text node', () => {
        container.innerHTML = '<div>hello</div>';
        const textNode = container.querySelector('div')!.firstChild!;
        const range = createRange(textNode, 3);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(3);
    });

    it('should return offset at end of single text node', () => {
        container.innerHTML = '<div>hello</div>';
        const textNode = container.querySelector('div')!.firstChild!;
        const range = createRange(textNode, 5);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(5);
    });

    it('should calculate offset across formatted text (bold)', () => {
        // Creates: <div>"hel" + <b>"lo"</b></div>
        container.innerHTML = '<div>hel<b>lo</b></div>';
        const boldTextNode = container.querySelector('b')!.firstChild!;
        const range = createRange(boldTextNode, 1);

        const result = getTextOffset(document, range, domHelper);

        // "hel" (3) + "l" (1) = 4
        expect(result).toBe(4);
    });

    it('should calculate offset in first text node when multiple exist', () => {
        container.innerHTML = '<div>hel<b>lo</b></div>';
        const firstTextNode = container.querySelector('div')!.firstChild!;
        const range = createRange(firstTextNode, 2);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(2);
    });

    it('should handle deeply nested formatted text', () => {
        // Creates: <div><span><b><i>"hello"</i></b></span></div>
        container.innerHTML = '<div><span><b><i>hello</i></b></span></div>';
        const textNode = container.querySelector('i')!.firstChild!;
        const range = createRange(textNode, 3);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(3);
    });

    it('should calculate offset with multiple formatted segments', () => {
        // Creates: <div><b>"hel"</b><i>"lo"</i><u>" world"</u></div>
        container.innerHTML = '<div><b>hel</b><i>lo</i><u> world</u></div>';
        const underlineTextNode = container.querySelector('u')!.firstChild!;
        const range = createRange(underlineTextNode, 3);

        const result = getTextOffset(document, range, domHelper);

        // "hel" (3) + "lo" (2) + " wo" (3) = 8
        expect(result).toBe(8);
    });

    it('should work within a paragraph inside a table cell', () => {
        container.innerHTML = '<table><tr><td><div>hello world</div></td></tr></table>';
        const textNode = container.querySelector('div')!.firstChild!;
        const range = createRange(textNode, 6);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(6);
    });

    it('should calculate offset with mixed text and formatting', () => {
        // Creates: <div>"plain "<b>"bold"</b>" more"</div>
        container.innerHTML = '<div>plain <b>bold</b> more</div>';
        const lastTextNode = container.querySelector('div')!.lastChild!;
        const range = createRange(lastTextNode, 3);

        const result = getTextOffset(document, range, domHelper);

        // "plain " (6) + "bold" (4) + " mo" (3) = 13
        expect(result).toBe(13);
    });

    it('should handle text node that is direct child of container', () => {
        container.innerHTML = 'direct text';
        const textNode = container.firstChild!;
        const range = createRange(textNode, 5);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(5);
    });

    it('should handle empty formatted elements', () => {
        container.innerHTML = '<div><b></b>hello</div>';
        const textNode = container.querySelector('div')!.lastChild!;
        const range = createRange(textNode, 2);

        const result = getTextOffset(document, range, domHelper);

        expect(result).toBe(2);
    });

    it('should work with span elements', () => {
        container.innerHTML = '<div><span>first</span><span>second</span></div>';
        const secondSpanText = container.querySelectorAll('span')[1].firstChild!;
        const range = createRange(secondSpanText, 3);

        const result = getTextOffset(document, range, domHelper);

        // "first" (5) + "sec" (3) = 8
        expect(result).toBe(8);
    });
});
