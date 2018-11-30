import createRange from '../../selection/createRange';
import getPositionRect from '../../selection/getPositionRect';
import Position from '../../selection/Position';
import { markSelection, removeMarker } from '../../deprecated/selectionMarker';

function runTestGlobal(
    input: string,
    getNode1: () => Node,
    offset1: number,
    getNode2: () => Node,
    offset2: number,
    useInlineMarker: boolean,
    expectHtml: string,
    expectStartLeft: number,
    expectEndLeft: number
) {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '10px';
    div.style.top = '10px';
    div.style.fontSize = '20px';
    div.style.fontFamily = 'Arial';
    document.body.appendChild(div);
    div.innerHTML = input;
    let node1 = getNode1();
    let node2 = getNode2();
    let position1 = node1 && new Position(node1, offset1);
    let position2 = node2 && new Position(node2, offset2);
    let range = createRange(position1, position2);
    markSelection(div, range, useInlineMarker);
    expect(div.innerHTML).toBe(expectHtml, 'MarkSelection');
    range = removeMarker(div, true);
    expect(div.innerHTML).toBe(input, 'RemoveMarker');
    if (node1) {
        position1 = Position.getStart(range);
        position2 = Position.getEnd(range);
        let startLeft = getPositionRect(position1).left;
        let endLeft = getPositionRect(position2).left;
        expect(startLeft).toBeGreaterThanOrEqual(expectStartLeft - 1, 'Start Left');
        expect(endLeft).toBeGreaterThanOrEqual(expectEndLeft - 1, 'End Left');
        expect(startLeft).toBeLessThanOrEqual(expectStartLeft + 1, 'Start Left');
        expect(endLeft).toBeLessThanOrEqual(expectEndLeft + 1, 'End Left');
    } else {
        expect(range).toBeUndefined('Range');
    }
    document.body.removeChild(div);
}

describe('markSelection() use inlineMarker', () => {
    function runTest(
        input: string,
        getNode1: () => Node,
        offset1: number,
        getNode2: () => Node,
        offset2: number,
        expectHtml: string,
        expectStartLeft: number,
        expectEndLeft: number
    ) {
        runTestGlobal(
            input,
            getNode1,
            offset1,
            getNode2,
            offset2,
            true,
            expectHtml,
            expectStartLeft,
            expectEndLeft
        );
    }

    it('null', () => {
        runTest('', () => null, 0, () => null, 0, '', 0, 0);
    });

    it('Collapsed - At beginning of text', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            0,
            () => $('id1').firstChild,
            0,
            '<div><div id="id1"><span id="cursor-single" data-offset1="0" data-offset2="0"></span>test</div></div>',
            10,
            10
        );
    });

    it('Collapsed - At middle of text', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            2,
            () => $('id1').firstChild,
            2,
            '<div><div id="id1">te<span id="cursor-single" data-offset1="0" data-offset2="0"></span>st</div></div>',
            27,
            27
        );
    });

    it('Collapsed - At end of text', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            4,
            () => $('id1').firstChild,
            4,
            '<div><div id="id1">test<span id="cursor-single" data-offset1="0" data-offset2="0"></span></div></div>',
            42,
            42
        );
    });

    it('Collapsed - At beginning of element', () => {
        runTest(
            '<div><div id="id1"><span>test</span><span>test</span></div></div>',
            () => $('id1'),
            0,
            () => $('id1'),
            0,
            '<div><div id="id1"><span><span id="cursor-single" data-offset1="0" data-offset2="0"></span>test</span><span>test</span></div></div>',
            10,
            10
        );
    });

    it('Collapsed - At middle of element', () => {
        runTest(
            '<div><div id="id1"><span>test</span><span>test</span></div></div>',
            () => $('id1'),
            1,
            () => $('id1'),
            1,
            '<div><div id="id1"><span>test</span><span><span id="cursor-single" data-offset1="0" data-offset2="0"></span>test</span></div></div>',
            42,
            42
        );
    });

    it('Collapsed - At end of element', () => {
        runTest(
            '<div><div id="id1"><span>test</span><span>test</span></div></div>',
            () => $('id1'),
            2,
            () => $('id1'),
            2,
            '<div><div id="id1"><span>test</span><span>test<span id="cursor-single" data-offset1="0" data-offset2="0"></span></span></div></div>',
            74,
            74
        );
    });

    it('Collapsed - Before void element', () => {
        runTest(
            '<div><div id="id1"><img></div></div>',
            () => $('id1'),
            0,
            () => $('id1'),
            0,
            '<div><div id="id1"><span id="cursor-single" data-offset1="0" data-offset2="0"></span><img></div></div>',
            10,
            10
        );
    });

    it('Collapsed - After void element', () => {
        runTest(
            '<div><div id="id1"><img></div></div>',
            () => $('id1'),
            1,
            () => $('id1'),
            1,
            '<div><div id="id1"><img><span id="cursor-single" data-offset1="0" data-offset2="0"></span></div></div>',
            10,
            10
        );
    });

    it('Expanded - Same text node', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            1,
            () => $('id1').firstChild,
            3,
            '<div><div id="id1">t<span id="cursor-start" data-offset1="0" data-offset2="0"></span>es<span id="cursor-end" data-offset1="0" data-offset2="0"></span>t</div></div>',
            16,
            37
        );
    });

    it('Expanded - Different text node', () => {
        runTest(
            '<div><div id="id1">test</div><div id="id2">test</div></div>',
            () => $('id1').firstChild,
            1,
            () => $('id2').firstChild,
            3,
            '<div><div id="id1">t<span id="cursor-start" data-offset1="0" data-offset2="0"></span>est</div><div id="id2">tes<span id="cursor-end" data-offset1="0" data-offset2="0"></span>t</div></div>',
            16,
            37
        );
    });

    it('Expanded - Text and element', () => {
        runTest(
            '<div><div id="id1">test</div><span id="id2"></span></div>',
            () => $('id1').firstChild,
            1,
            () => $('id2'),
            0,
            '<div><div id="id1">t<span id="cursor-start" data-offset1="0" data-offset2="0"></span>est</div><span id="cursor-end" data-offset1="0" data-offset2="0"></span><span id="id2"></span></div>',
            16,
            10
        );
    });

    it('Expanded - Element and text', () => {
        runTest(
            '<div><span id="id2"></span><div id="id1">test</div></div>',
            () => $('id2'),
            0,
            () => $('id1').firstChild,
            3,
            '<div><span id="cursor-start" data-offset1="0" data-offset2="0"></span><span id="id2"></span><div id="id1">tes<span id="cursor-end" data-offset1="0" data-offset2="0"></span>t</div></div>',
            10,
            37
        );
    });

    it('Expanded - Text and void element', () => {
        runTest(
            '<div><div id="id1">test</div><div id="id2"><img></div></div>',
            () => $('id1').firstChild,
            1,
            () => $('id2').firstChild,
            1,
            '<div><div id="id1">t<span id="cursor-start" data-offset1="0" data-offset2="0"></span>est</div><div id="id2"><img><span id="cursor-end" data-offset1="0" data-offset2="0"></span></div></div>',
            16,
            10
        );
    });
});

describe('markSelection() not use inlineMarker', () => {
    function runTest(
        input: string,
        getNode1: () => Node,
        offset1: number,
        getNode2: () => Node,
        offset2: number,
        expectHtml: string,
        expectStartLeft: number,
        expectEndLeft: number
    ) {
        runTestGlobal(
            input,
            getNode1,
            offset1,
            getNode2,
            offset2,
            false,
            expectHtml,
            expectStartLeft,
            expectEndLeft
        );
    }

    it('null', () => {
        runTest('', () => null, 0, () => null, 0, '', 0, 0);
    });

    it('Collapsed - At beginning of text', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            0,
            () => $('id1').firstChild,
            0,
            '<div><div id="id1"><span id="cursor-single" data-offset1="0" data-offset2="0"></span>test</div></div>',
            10,
            10
        );
    });

    it('Collapsed - At middle of text', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            2,
            () => $('id1').firstChild,
            2,
            '<div><div id="id1"><span id="cursor-single" data-offset1="2" data-offset2="2"></span>test</div></div>',
            27,
            27
        );
    });

    it('Collapsed - At end of text', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            4,
            () => $('id1').firstChild,
            4,
            '<div><div id="id1"><span id="cursor-single" data-offset1="4" data-offset2="4"></span>test</div></div>',
            42,
            42
        );
    });

    it('Collapsed - At beginning of element', () => {
        runTest(
            '<div><div id="id1"><span>test</span><span>test</span></div></div>',
            () => $('id1'),
            0,
            () => $('id1'),
            0,
            '<div><div id="id1"><span><span id="cursor-single" data-offset1="0" data-offset2="0"></span>test</span><span>test</span></div></div>',
            10,
            10
        );
    });

    it('Collapsed - At middle of element', () => {
        runTest(
            '<div><div id="id1"><span>test</span><span>test</span></div></div>',
            () => $('id1'),
            1,
            () => $('id1'),
            1,
            '<div><div id="id1"><span>test</span><span><span id="cursor-single" data-offset1="0" data-offset2="0"></span>test</span></div></div>',
            42,
            42
        );
    });

    it('Collapsed - At end of element', () => {
        runTest(
            '<div><div id="id1"><span>test</span><span>test</span></div></div>',
            () => $('id1'),
            2,
            () => $('id1'),
            2,
            '<div><div id="id1"><span>test</span><span><span id="cursor-single" data-offset1="4" data-offset2="4"></span>test</span></div></div>',
            74,
            74
        );
    });

    it('Collapsed - Before void element', () => {
        runTest(
            '<div><div id="id1"><img></div></div>',
            () => $('id1'),
            0,
            () => $('id1'),
            0,
            '<div><div id="id1"><span id="cursor-single" data-offset1="0" data-offset2="0"></span><img></div></div>',
            10,
            10
        );
    });

    it('Collapsed - After void element', () => {
        runTest(
            '<div><div id="id1"><img></div></div>',
            () => $('id1'),
            1,
            () => $('id1'),
            1,
            '<div><div id="id1"><span id="cursor-single" data-offset1="1" data-offset2="1"></span><img></div></div>',
            10,
            10
        );
    });

    it('Expanded - Same text node', () => {
        runTest(
            '<div><div id="id1">test</div></div>',
            () => $('id1').firstChild,
            1,
            () => $('id1').firstChild,
            3,
            '<div><div id="id1"><span id="cursor-single" data-offset1="1" data-offset2="3"></span>test</div></div>',
            16,
            37
        );
    });

    it('Expanded - Different text node', () => {
        runTest(
            '<div><div id="id1">test</div><div id="id2">test</div></div>',
            () => $('id1').firstChild,
            1,
            () => $('id2').firstChild,
            3,
            '<div><div id="id1"><span id="cursor-start" data-offset1="1" data-offset2="0"></span>test</div><div id="id2"><span id="cursor-end" data-offset1="3" data-offset2="0"></span>test</div></div>',
            16,
            37
        );
    });

    it('Expanded - Text and element', () => {
        runTest(
            '<div><div id="id1">test</div><span id="id2"></span></div>',
            () => $('id1').firstChild,
            1,
            () => $('id2'),
            0,
            '<div><div id="id1"><span id="cursor-start" data-offset1="1" data-offset2="0"></span>test</div><span id="cursor-end" data-offset1="0" data-offset2="0"></span><span id="id2"></span></div>',
            16,
            10
        );
    });

    it('Expanded - Element and text', () => {
        runTest(
            '<div><span id="id2"></span><div id="id1">test</div></div>',
            () => $('id2'),
            0,
            () => $('id1').firstChild,
            3,
            '<div><span id="cursor-start" data-offset1="0" data-offset2="0"></span><span id="id2"></span><div id="id1"><span id="cursor-end" data-offset1="3" data-offset2="0"></span>test</div></div>',
            10,
            37
        );
    });

    it('Expanded - Text and void element', () => {
        runTest(
            '<div><div id="id1">test</div><div id="id2"><img></div></div>',
            () => $('id1').firstChild,
            1,
            () => $('id2').firstChild,
            1,
            '<div><div id="id1"><span id="cursor-start" data-offset1="1" data-offset2="0"></span>test</div><div id="id2"><span id="cursor-end" data-offset1="1" data-offset2="0"></span><img></div></div>',
            16,
            10
        );
    });
});

function $(id: string) {
    return document.getElementById(id);
}
