import { findPositionByTextOffset } from '../../../lib/corePlugin/selection/findPositionByTextOffset';

describe('findPositionByTextOffset', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('should find position at start of single text node', () => {
        container.innerHTML = 'hello';
        const textNode = container.firstChild!;

        const result = findPositionByTextOffset(document, container, 0);

        expect(result.node).toBe(textNode);
        expect(result.offset).toBe(0);
    });

    it('should find position in middle of single text node', () => {
        container.innerHTML = 'hello';
        const textNode = container.firstChild!;

        const result = findPositionByTextOffset(document, container, 3);

        expect(result.node).toBe(textNode);
        expect(result.offset).toBe(3);
    });

    it('should find position at end of single text node', () => {
        container.innerHTML = 'hello';
        const textNode = container.firstChild!;

        const result = findPositionByTextOffset(document, container, 5);

        expect(result.node).toBe(textNode);
        expect(result.offset).toBe(5);
    });

    it('should find position in first text node when multiple text nodes exist', () => {
        // Creates: "hel" + <b>"lo"</b>
        container.innerHTML = 'hel<b>lo</b>';
        const firstTextNode = container.firstChild!;

        const result = findPositionByTextOffset(document, container, 2);

        expect(result.node).toBe(firstTextNode);
        expect(result.offset).toBe(2);
    });

    it('should find position in second text node when offset crosses boundary', () => {
        // Creates: "hel" + <b>"lo"</b>
        container.innerHTML = 'hel<b>lo</b>';
        const boldElement = container.querySelector('b')!;
        const secondTextNode = boldElement.firstChild!;

        const result = findPositionByTextOffset(document, container, 4);

        expect(result.node).toBe(secondTextNode);
        expect(result.offset).toBe(1);
    });

    it('should find position at boundary between text nodes', () => {
        // Creates: "hel" + <b>"lo"</b>
        container.innerHTML = 'hel<b>lo</b>';
        const firstTextNode = container.firstChild!;

        const result = findPositionByTextOffset(document, container, 3);

        // At boundary, position is at end of first text node (offset 3)
        expect(result.node).toBe(firstTextNode);
        expect(result.offset).toBe(3);
    });

    it('should handle deeply nested elements', () => {
        // Creates: <div><span><b>"hello"</b></span></div>
        container.innerHTML = '<div><span><b>hello</b></span></div>';
        const textNode = container.querySelector('b')!.firstChild!;

        const result = findPositionByTextOffset(document, container, 3);

        expect(result.node).toBe(textNode);
        expect(result.offset).toBe(3);
    });

    it('should handle multiple formatted segments', () => {
        // Creates: <b>"hel"</b><i>"lo"</i><u>" world"</u>
        container.innerHTML = '<b>hel</b><i>lo</i><u> world</u>';
        const italicTextNode = container.querySelector('i')!.firstChild!;

        const result = findPositionByTextOffset(document, container, 4);

        expect(result.node).toBe(italicTextNode);
        expect(result.offset).toBe(1);
    });

    it('should position at end of last text node when offset exceeds total length', () => {
        container.innerHTML = 'hello';
        const textNode = container.firstChild!;

        const result = findPositionByTextOffset(document, container, 100);

        expect(result.node).toBe(textNode);
        expect(result.offset).toBe(5);
    });

    it('should handle empty container by using normalizePos fallback', () => {
        container.innerHTML = '';

        const result = findPositionByTextOffset(document, container, 5);

        expect(result.node).toBe(container);
        expect(result.offset).toBe(0);
    });

    it('should handle container with only element children (no text)', () => {
        container.innerHTML = '<br><br>';

        const result = findPositionByTextOffset(document, container, 5);

        expect(result.node).toBe(container);
        expect(result.offset).toBe(0);
    });

    it('should work with paragraph elements', () => {
        container.innerHTML = '<p>first line</p><p>second line</p>';
        const firstPara = container.querySelector('p')!;
        const textNode = firstPara.firstChild!;

        const result = findPositionByTextOffset(document, firstPara, 5);

        expect(result.node).toBe(textNode);
        expect(result.offset).toBe(5);
    });

    it('should handle mixed content with images', () => {
        // Creates: "before" + <img> + "after"
        container.innerHTML = 'before<img src="">after';
        const afterTextNode = container.lastChild!;

        const result = findPositionByTextOffset(document, container, 8);

        expect(result.node).toBe(afterTextNode);
        expect(result.offset).toBe(2);
    });
});
