import { replaceTextInRange } from '../../../lib/findReplace/utils/replaceTextInRange';

describe('replaceTextInRange', () => {
    it('replaces text in a single text node', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a test.</p>';
        const range = document.createRange();
        range.setStart(container.firstChild!.firstChild!, 10);
        range.setEnd(container.firstChild!.firstChild!, 14);

        const newRange = replaceTextInRange(range, 'TEST', [range]);

        expect(newRange).not.toBeNull();
        expect(newRange!.startContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.startOffset).toBe(14);
        expect(newRange!.endContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.endOffset).toBe(14);
        expect(container.innerHTML).toBe('<p>This is a TEST.</p>');
    });

    it('returns null when range start or end container is not a text node', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a test.</p>';

        const range = document.createRange();
        range.setStart(container.firstChild!, 0);
        range.setEnd(container.firstChild!, 1);

        const newRange = replaceTextInRange(range, 'TEST', [range]);

        expect(newRange).toBeNull();
    });

    it('adjusts other ranges after replacement', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a test. This is another test.</p>';

        const range1 = document.createRange();
        range1.setStart(container.firstChild!.firstChild!, 10);
        range1.setEnd(container.firstChild!.firstChild!, 14); // "test"

        const range2 = document.createRange();
        range2.setStart(container.firstChild!.firstChild!, 20);
        range2.setEnd(container.firstChild!.firstChild!, 27);

        const newRange = replaceTextInRange(range1, 'TEST', [range1, range2]);

        expect(newRange).not.toBeNull();
        expect(newRange!.startContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.startOffset).toBe(14);
        expect(newRange!.endContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.endOffset).toBe(14);
        expect(container.innerHTML).toBe('<p>This is a TEST. This is another test.</p>');
        expect(range2.startOffset).toBe(20);
        expect(range2.endOffset).toBe(27);
    });

    it('adjusts other ranges after replacement, replace with a different length of text', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a test. This is another test.</p>';

        const range1 = document.createRange();
        range1.setStart(container.firstChild!.firstChild!, 10);
        range1.setEnd(container.firstChild!.firstChild!, 14); // "test"

        const range2 = document.createRange();
        range2.setStart(container.firstChild!.firstChild!, 20);
        range2.setEnd(container.firstChild!.firstChild!, 27);

        const newRange = replaceTextInRange(range1, 'TESTTEST', [range1, range2]);

        expect(newRange).not.toBeNull();
        expect(newRange!.startContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.startOffset).toBe(18);
        expect(newRange!.endContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.endOffset).toBe(18);
        expect(container.innerHTML).toBe('<p>This is a TESTTEST. This is another test.</p>');
        expect(range2.startOffset).toBe(24);
        expect(range2.endOffset).toBe(31);
    });

    it('adjusts other ranges after replacement, replace with a different length of text, under multiple nodes', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a t<span>es</span>t. This is another test.</p>';

        const range1 = document.createRange();
        range1.setStart(container.firstChild!.firstChild!, 0);
        range1.setEnd(container.firstChild!.firstChild!, 4);

        const range2 = document.createRange();
        range2.setStart(container.firstChild!.firstChild!, 10);
        range2.setEnd(container.firstChild!.lastChild!, 1); // "test"

        const range3 = document.createRange();
        range3.setStart(container.firstChild!.lastChild!, 19);
        range3.setEnd(container.firstChild!.lastChild!, 23);

        const newRange = replaceTextInRange(range2, 'TESTTEST', [range1, range2, range3]);

        expect(newRange).not.toBeNull();
        expect(container.innerHTML).toBe('<p>This is a TESTTEST. This is another test.</p>');

        expect(newRange!.startContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.startOffset).toBe(18);
        expect(newRange!.endContainer).toBe(container.firstChild!.firstChild!);
        expect(newRange!.endOffset).toBe(18);

        expect(range1.startContainer).toBe(container.firstChild!.firstChild!);
        expect(range1.endContainer).toBe(container.firstChild!.firstChild!);
        expect(range1.startOffset).toBe(0);
        expect(range1.endOffset).toBe(4);

        expect(range3.startContainer).toBe(container.firstChild!.lastChild!);
        expect(range3.endContainer).toBe(container.firstChild!.lastChild!);
        expect(range3.startOffset).toBe(18);
        expect(range3.endOffset).toBe(22);
    });
});
