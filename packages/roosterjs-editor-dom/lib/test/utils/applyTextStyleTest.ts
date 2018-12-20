import applyTextStyle from '../../utils/applyTextStyle';
import Position from '../../selection/Position';

describe('applyTextStyle()', () => {
    function runTest1(
        caseIndex: number,
        startNodeIndex: number,
        startNodeOffset: number,
        endNodeIndex: number,
        endNodeOffset: number,
        result: string
    ) {
        runTest(
            caseIndex,
            ['test'],
            startNodeIndex,
            startNodeOffset,
            endNodeIndex,
            endNodeOffset,
            result
        );
    }

    function runTest2(
        caseIndex: number,
        startNodeIndex: number,
        startNodeOffset: number,
        endNodeIndex: number,
        endNodeOffset: number,
        result: string
    ) {
        runTest(
            caseIndex,
            ['test1', 'test2'],
            startNodeIndex,
            startNodeOffset,
            endNodeIndex,
            endNodeOffset,
            result
        );
    }

    function runTest3(
        caseIndex: number,
        startNodeIndex: number,
        startNodeOffset: number,
        endNodeIndex: number,
        endNodeOffset: number,
        result: string
    ) {
        runTest(
            caseIndex,
            ['test1', 'test2', 'test3'],
            startNodeIndex,
            startNodeOffset,
            endNodeIndex,
            endNodeOffset,
            result
        );
    }

    function runTest(
        caseIndex: number,
        texts: string[],
        startNodeIndex: number,
        startNodeOffset: number,
        endNodeIndex: number,
        endNodeOffset: number,
        result: string
    ) {
        let div = document.createElement('DIV');
        let span = document.createElement('SPAN');
        div.appendChild(span);
        for (let text of texts) {
            span.appendChild(document.createTextNode(text));
        }
        let start =
            span.childNodes[startNodeIndex] &&
            new Position(span.childNodes[startNodeIndex], startNodeOffset);
        let end =
            span.childNodes[endNodeIndex] &&
            new Position(span.childNodes[endNodeIndex], endNodeOffset);
        applyTextStyle(span, node => (node.style.color = 'red'), start, end);
        expect(div.innerHTML).toBe(result, `Index: ${caseIndex}`);
    }

    it('applyTextStyle() empty text node', () => {
        runTest(0, [], -1, 0, -1, 0, '<span></span>');
        runTest(1, [''], -1, 0, -1, 0, '<span style="color: red;"></span>');
    });

    it('applyTextStyle() single text node', () => {
        runTest1(0, 0, 0, 0, 0, '<span>test</span>');
        runTest1(1, -1, 0, -1, 0, '<span style="color: red;">test</span>');
        runTest1(2, -1, 0, 0, 2, '<span style="color: red;">te</span><span>st</span>');
        runTest1(3, 0, 1, -1, 0, '<span>t</span><span style="color: red;">est</span>');
        runTest1(4, 0, 1, 0, 3, '<span>t</span><span style="color: red;">es</span><span>t</span>');
        runTest1(5, 0, 0, 0, 4, '<span style="color: red;">test</span>');
        runTest1(6, 0, 0, 0, 5, '<span style="color: red;">test</span>');
        runTest1(7, 0, 3, 0, 2, '<span>test</span>');
    });

    it('applyTextStyle() two text nodes', () => {
        runTest2(0, 0, 0, 0, 0, '<span>test1test2</span>');
        runTest2(1, 1, 0, 1, 0, '<span>test1test2</span>');
        runTest2(
            2,
            1,
            0,
            1,
            2,
            '<span>test1</span><span style="color: red;">te</span><span>st2</span>'
        );
        runTest2(3, 1, 2, -1, 0, '<span>test1te</span><span style="color: red;">st2</span>');
        runTest2(
            4,
            1,
            1,
            1,
            3,
            '<span>test1t</span><span style="color: red;">es</span><span>t2</span>'
        );
        runTest2(5, -1, 0, 1, 2, '<span style="color: red;">test1te</span><span>st2</span>');
        runTest2(6, -1, 0, 1, 6, '<span style="color: red;">test1test2</span>');
        runTest2(7, -1, 0, -1, 0, '<span style="color: red;">test1test2</span>');
        runTest2(8, 0, 2, -1, 0, '<span>te</span><span style="color: red;">st1test2</span>');
        runTest2(
            9,
            0,
            2,
            1,
            2,
            '<span>te</span><span style="color: red;">st1te</span><span>st2</span>'
        );
        runTest2(10, 0, 6, -1, 0, '<span>test1</span><span style="color: red;">test2</span>');
        runTest2(11, 0, 0, -1, 0, '<span style="color: red;">test1test2</span>');
        runTest2(
            12,
            0,
            2,
            1,
            0,
            '<span>te</span><span style="color: red;">st1</span><span>test2</span>'
        );
        runTest2(13, 0, 2, 1, 6, '<span>te</span><span style="color: red;">st1test2</span>');
    });

    it('applyTextStyle() three text nodes', () => {
        runTest3(0, 0, 0, 0, 0, '<span>test1test2test3</span>');
        runTest3(1, 0, 0, -1, 0, '<span style="color: red;">test1test2test3</span>');
        runTest3(
            2,
            0,
            2,
            0,
            4,
            '<span>te</span><span style="color: red;">st</span><span>1test2test3</span>'
        );
        runTest3(3, 2, 0, 0, 0, '<span>test1test2test3</span>');
        runTest3(4, 0, 0, 2, 0, '<span style="color: red;">test1test2</span><span>test3</span>');
        runTest3(
            5,
            0,
            2,
            2,
            2,
            '<span>te</span><span style="color: red;">st1test2te</span><span>st3</span>'
        );
        runTest3(6, -1, 0, -1, 0, '<span style="color: red;">test1test2test3</span>');
    });
});
