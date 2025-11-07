import { getRangesByText } from '../../lib/domUtils/getRangesByText';

describe('getRangesByText', () => {
    it('Empty text returns empty array', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a test.</p><p>Another paragraph for testing.</p>';

        const ranges = getRangesByText(container, '', false, false);

        expect(ranges.length).toBe(0);
    });

    it('Empty container returns empty array', () => {
        const container = document.createElement('div');
        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(0);
    });

    it('Find text without matchCase and wholeWord', () => {
        const container = document.createElement('div');
        container.innerHTML =
            '<p>This is a test. This test is only a test.</p><p>Another paragraph for testing. Test cases are important.</p>';
        const ranges = getRangesByText(container, 'test', false, false);

        const p1 = container.firstChild!.firstChild as Node;
        const p2 = container.lastChild!.firstChild as Node;

        expect(ranges.length).toBe(5);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(p1);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(p1);
        expect(ranges[0].endOffset).toBe(14);

        expect(ranges[1].toString()).toBe('test');
        expect(ranges[1].startContainer).toBe(p1);
        expect(ranges[1].startOffset).toBe(21);
        expect(ranges[1].endContainer).toBe(p1);
        expect(ranges[1].endOffset).toBe(25);

        expect(ranges[2].toString()).toBe('test');
        expect(ranges[2].startContainer).toBe(p1);
        expect(ranges[2].startOffset).toBe(36);
        expect(ranges[2].endContainer).toBe(p1);
        expect(ranges[2].endOffset).toBe(40);

        expect(ranges[3].toString()).toBe('test');
        expect(ranges[3].startContainer).toBe(p2);
        expect(ranges[3].startOffset).toBe(22);
        expect(ranges[3].endContainer).toBe(p2);
        expect(ranges[3].endOffset).toBe(26);

        expect(ranges[4].toString()).toBe('Test');
        expect(ranges[4].startContainer).toBe(p2);
        expect(ranges[4].startOffset).toBe(31);
        expect(ranges[4].endContainer).toBe(p2);
        expect(ranges[4].endOffset).toBe(35);
    });

    it('Find text without matchCase and wholeWord - nested case', () => {
        const container = document.createElement('div');
        container.innerHTML =
            '<div id="div1">This is a test. This test is only a test.<div id="div2">Another paragraph for testing.</div>Test cases are important.</div></div>';
        const ranges = getRangesByText(container, 'test', false, false);

        const p1 = container.querySelector('#div1')!.firstChild!;
        const p2 = container.querySelector('#div2')!.firstChild!;
        const p3 = container.querySelector('#div1')!.lastChild!;

        expect(ranges.length).toBe(5);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(p1);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(p1);
        expect(ranges[0].endOffset).toBe(14);

        expect(ranges[1].toString()).toBe('test');
        expect(ranges[1].startContainer).toBe(p1);
        expect(ranges[1].startOffset).toBe(21);
        expect(ranges[1].endContainer).toBe(p1);
        expect(ranges[1].endOffset).toBe(25);

        expect(ranges[2].toString()).toBe('test');
        expect(ranges[2].startContainer).toBe(p1);
        expect(ranges[2].startOffset).toBe(36);
        expect(ranges[2].endContainer).toBe(p1);
        expect(ranges[2].endOffset).toBe(40);

        expect(ranges[3].toString()).toBe('test');
        expect(ranges[3].startContainer).toBe(p2);
        expect(ranges[3].startOffset).toBe(22);
        expect(ranges[3].endContainer).toBe(p2);
        expect(ranges[3].endOffset).toBe(26);

        expect(ranges[4].toString()).toBe('Test');
        expect(ranges[4].startContainer).toBe(p3);
        expect(ranges[4].startOffset).toBe(0);
        expect(ranges[4].endContainer).toBe(p3);
        expect(ranges[4].endOffset).toBe(4);
    });

    it('Find text with matchCase and wholeWord', () => {
        const container = document.createElement('div');
        container.innerHTML =
            '<p>This is a test. This test is only a test.</p><p>Another paragraph for testing. Test cases are important. test</p>';
        const ranges = getRangesByText(container, 'test', true, true);
        const p1 = container.firstChild!.firstChild as Node;
        const p2 = container.lastChild!.firstChild as Node;
        expect(ranges.length).toBe(4);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(p1);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(p1);
        expect(ranges[0].endOffset).toBe(14);
        expect(ranges[1].toString()).toBe('test');
        expect(ranges[1].startContainer).toBe(p1);
        expect(ranges[1].startOffset).toBe(21);
        expect(ranges[1].endContainer).toBe(p1);
        expect(ranges[1].endOffset).toBe(25);
        expect(ranges[2].toString()).toBe('test');
        expect(ranges[2].startContainer).toBe(p1);
        expect(ranges[2].startOffset).toBe(36);
        expect(ranges[2].endContainer).toBe(p1);
        expect(ranges[2].endOffset).toBe(40);
        expect(ranges[2].toString()).toBe('test');
        expect(ranges[3].startContainer).toBe(p2);
        expect(ranges[3].startOffset).toBe(57);
        expect(ranges[3].endContainer).toBe(p2);
        expect(ranges[3].endOffset).toBe(61);
    });

    it('Find text in editable only', () => {
        const container = document.createElement('div');
        container.innerHTML =
            '<p contenteditable="true">This is a test.</p><p>This test should not be found.</p><div contenteditable="true">Another test here.</div>';
        const ranges = getRangesByText(container, 'test', false, false, true);
        const p1 = container.firstChild!.firstChild as Node;
        const p3 = container.lastChild!.firstChild as Node;

        expect(ranges.length).toBe(2);

        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(p1);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(p1);
        expect(ranges[0].endOffset).toBe(14);

        expect(ranges[1].toString()).toBe('test');
        expect(ranges[1].startContainer).toBe(p3);
        expect(ranges[1].startOffset).toBe(8);
        expect(ranges[1].endContainer).toBe(p3);
        expect(ranges[1].endOffset).toBe(12);
    });

    it('Find text across multiple text nodes', () => {
        const container = document.createElement('div');
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('This is a te'));
        p.appendChild(document.createTextNode('st.'));
        container.appendChild(p);

        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(1);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(p.firstChild!);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(p.lastChild!);
        expect(ranges[0].endOffset).toBe(2);
    });

    it('Find text across multiple text nodes - more nodes', () => {
        const container = document.createElement('div');
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('This is a t'));
        p.appendChild(document.createTextNode('e'));
        p.appendChild(document.createTextNode('s'));
        p.appendChild(document.createTextNode('t.'));
        container.appendChild(p);

        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(1);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(p.firstChild!);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(p.lastChild!);
        expect(ranges[0].endOffset).toBe(1);
    });

    it('Find text across multiple text nodes under different parents', () => {
        const container = document.createElement('div');
        const span1 = document.createElement('span');
        span1.appendChild(document.createTextNode('This is a te'));

        const span2 = document.createElement('span');
        span2.appendChild(document.createTextNode('st.'));

        container.appendChild(span1);
        container.appendChild(span2);

        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(1);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(span1.firstChild!);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(span2.firstChild!);
        expect(ranges[0].endOffset).toBe(2);
    });

    it('Find text across multiple text nodes under different parents - nested case', () => {
        const container = document.createElement('div');
        const span1 = document.createElement('span');

        const span2 = document.createElement('span');

        const t1 = document.createTextNode('This is a te');
        const t2 = document.createTextNode('st. This is another te');
        const t3 = document.createTextNode('st.');

        span1.appendChild(t1);
        span1.appendChild(span2);
        span2.appendChild(t2);
        span2.appendChild(t3);

        container.appendChild(span1);

        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(2);
        expect(ranges[0].toString()).toBe('test');
        expect(ranges[0].startContainer).toBe(t1);
        expect(ranges[0].startOffset).toBe(10);
        expect(ranges[0].endContainer).toBe(t2);
        expect(ranges[0].endOffset).toBe(2);

        expect(ranges[1].toString()).toBe('test');
        expect(ranges[1].startContainer).toBe(t2);
        expect(ranges[1].startOffset).toBe(20);
        expect(ranges[1].endContainer).toBe(t3);
        expect(ranges[1].endOffset).toBe(2);
    });

    it('Find text across multiple blocks', () => {
        const container = document.createElement('div');
        const p1 = document.createElement('p');
        p1.appendChild(document.createTextNode('This is a te'));

        const p2 = document.createElement('p');
        p2.appendChild(document.createTextNode('st.'));
        container.appendChild(p1);
        container.appendChild(p2);

        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(0);
    });

    it('Find text across multiple blocks - nested case', () => {
        const container = document.createElement('div');
        const div1 = document.createElement('div');

        const div2 = document.createElement('div');

        const t1 = document.createTextNode('This is a te');
        const t2 = document.createTextNode('st. This is another te');
        const t3 = document.createTextNode('st.');

        div1.appendChild(t1);
        div1.appendChild(div2);
        div2.appendChild(t2);
        div1.appendChild(t3);

        container.appendChild(div1);

        const ranges = getRangesByText(container, 'test', false, false);

        expect(ranges.length).toBe(0);
    });

    it('No match found', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>This is a test.</p><p>Another paragraph for testing.</p>';
        const ranges = getRangesByText(container, 'not found', false, false);
        expect(ranges.length).toBe(0);
    });
});
