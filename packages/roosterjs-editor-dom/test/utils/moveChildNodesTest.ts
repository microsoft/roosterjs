import * as DomTestHelper from '../DomTestHelper';
import moveChildNodes from '../../lib/utils/moveChildNodes';

describe('moveChildNodes', () => {
    function runTest(
        targetHtml: string,
        sourceHtml: string,
        keepExisting: boolean,
        expectedTargetHtml: string
    ) {
        const source = sourceHtml ? (DomTestHelper.htmlToDom(sourceHtml)[0] as HTMLElement) : null;
        const target = targetHtml ? (DomTestHelper.htmlToDom(targetHtml)[0] as HTMLElement) : null;

        moveChildNodes(target, source, keepExisting);

        const targetResult = target ? target.outerHTML : '';

        expect(targetResult).toBe(expectedTargetHtml);
    }

    it('null input', () => {
        runTest(null, null, true, '');
        runTest(null, null, false, '');
    });

    it('null target input', () => {
        runTest(null, '<div><span>test</span></div>', true, '');
        runTest(null, '<div><span>test</span></div>', false, '');
    });

    it('null source input', () => {
        runTest('<div><span>test</span></div>', null, true, '<div><span>test</span></div>');
        runTest('<div><span>test</span></div>', null, false, '<div></div>');
    });

    it('null source input', () => {
        runTest('<div><span>test</span></div>', null, true, '<div><span>test</span></div>');
        runTest('<div><span>test</span></div>', null, false, '<div></div>');
    });

    it('regular case', () => {
        runTest(
            '<div><span>test1</span><span>test2</span></div>',
            '<div><span>test3</span><span>test4</span></div>',
            false,
            '<div><span>test3</span><span>test4</span></div>'
        );
        runTest(
            '<div><span>test1</span><span>test2</span></div>',
            '<div><span>test3</span><span>test4</span></div>',
            true,
            '<div><span>test1</span><span>test2</span><span>test3</span><span>test4</span></div>'
        );
    });
});
