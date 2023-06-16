import createElement from '../../lib/utils/createElement';
import { CreateElementData, KnownCreateElementDataIndex } from 'roosterjs-editor-types';

describe('createElement', () => {
    function runTest(input: CreateElementData | KnownCreateElementDataIndex, output: string) {
        const result = createElement(input, document);
        const html = result ? result.outerHTML : null;
        expect(html).toBe(output);
    }

    it('null', () => {
        runTest(null, null);
    });

    it('create by index', () => {
        runTest(KnownCreateElementDataIndex.EmptyLine, '<div><br></div>');
    });

    it('create by index with span', () => {
        runTest(KnownCreateElementDataIndex.EmptyLineFormatInSpan, '<div><span><br></span></div>');
    });

    it('create by tag', () => {
        runTest({ tag: 'div' }, '<div></div>');
    });

    it('create by tag and namespace', () => {
        runTest({ tag: 'svg', namespace: 'http://www.w3.org/2000/svg' }, '<svg></svg>');
    });
    it('create by tag and class', () => {
        runTest({ tag: 'div', className: 'test' }, '<div class="test"></div>');
    });
    it('create by tag and style', () => {
        runTest(
            { tag: 'div', style: 'position: absolute' },
            '<div style="position: absolute"></div>'
        );
    });
    it('create by tag and dataset', () => {
        runTest({ tag: 'div', dataset: null }, '<div></div>');
        runTest({ tag: 'div', dataset: {} }, '<div></div>');
        runTest({ tag: 'div', dataset: { x: '1', y: '2' } }, '<div data-x="1" data-y="2"></div>');
    });
    it('create by tag and attributes', () => {
        runTest({ tag: 'div', attributes: null }, '<div></div>');
        runTest({ tag: 'div', attributes: {} }, '<div></div>');
        runTest(
            { tag: 'div', attributes: { contenteditable: 'true', align: 'left' } },
            '<div contenteditable="true" align="left"></div>'
        );
    });

    it('create by tag and everthing', () => {
        runTest(
            {
                tag: 'div',
                className: 'test1',
                style: 'position:absolute',
                dataset: { x: '1' },
                attributes: { contenteditable: 'true' },
            },
            '<div style="position:absolute" class="test1" data-x="1" contenteditable="true"></div>'
        );
    });
    it('create by tag and children', () => {
        runTest({ tag: 'div', children: null }, '<div></div>');
        runTest({ tag: 'div', children: [] }, '<div></div>');
        runTest({ tag: 'div', children: ['text'] }, '<div>text</div>');
        runTest(
            { tag: 'div', children: [{ tag: 'span' }, 'text', { tag: 'span' }] },
            '<div><span></span>text<span></span></div>'
        );
        runTest(
            { tag: 'div', children: [null, 'text', { tag: 'span' }, ''] },
            '<div>text<span></span></div>'
        );
    });
});
