import isPositionAtBeginningOf from '../../selection/isPositionAtBeginningOf';
import Position from '../../selection/Position';

describe('isPositionAtBeginningOf()', () => {
    function runTest(
        input: string,
        getNode: () => Node,
        offset: number,
        getTargetNode: () => Node,
        expectResult: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = getNode();
        let position = node && new Position(node, offset);
        let targetNode = getTargetNode();
        let result = isPositionAtBeginningOf(position, targetNode);
        expect(result).toBe(expectResult);
        document.body.removeChild(div);
    }

    it('Position is null', () => {
        runTest(
            '',
            () => null,
            0,
            () => null,
            false
        );
    });

    it('Target node is null', () => {
        runTest(
            '<div id=id1></div>',
            () => $('id1'),
            0,
            () => null,
            false
        );
    });

    it('Is first child', () => {
        runTest(
            '<div id=id1>test</div>',
            () => $('id1'),
            0,
            () => $('id1'),
            true
        );
    });

    it('Has space before position', () => {
        runTest(
            '<div id=id1> <span></span>test</div>',
            () => $('id1'),
            1,
            () => $('id1'),
            false
        );
        runTest(
            '<div id=id1>&#8203;<span></span>test</div>',
            () => $('id1'),
            1,
            () => $('id1'),
            true
        );
        runTest(
            '<div id=id1>&nbsp;<span></span>test</div>',
            () => $('id1'),
            1,
            () => $('id1'),
            false
        );
    });

    it('Inside text', () => {
        runTest(
            '<div id=id1>test</div>',
            () => $('id1').firstChild,
            0,
            () => $('id1'),
            true
        );
        runTest(
            '<div id=id1>test</div>',
            () => $('id1').firstChild,
            2,
            () => $('id1'),
            false
        );
    });

    it('Nested node', () => {
        runTest(
            '<div id=id1><div id=id2>test</div></div>',
            () => $('id2'),
            0,
            () => $('id1'),
            true
        );
        runTest(
            '<div id=id1><div><div id=id2>test</div></div></div>',
            () => $('id2'),
            0,
            () => $('id1'),
            true
        );
    });

    it('Has visible nodes before 1', () => {
        runTest(
            '<div id=id1><img><div id=id2>test</div></div>',
            () => $('id2'),
            0,
            () => $('id1'),
            false
        );
    });

    it('Has visible nodes before 2', () => {
        runTest(
            '<div id=id1><div>test2</div><div id=id2>test</div></div>',
            () => $('id2'),
            0,
            () => $('id1'),
            false
        );
    });

    it('Has visible nodes before 3', () => {
        runTest(
            '<div id=id1><div><div>test2</div></div><div id=id2>test</div></div>',
            () => $('id2'),
            0,
            () => $('id1'),
            false
        );
    });

    it('Position just before node', () => {
        runTest(
            '<div id=id1>test<div id=id2>test</div></div>',
            () => $('id1'),
            1,
            () => $('id2'),
            true
        );
    });

    it('There is a BR before the position', () => {
        runTest(
            '<div id=id1><br><span id=span1></div>',
            () => $('span1'),
            0,
            () => $('id1'),
            false
        );
    });
});

function $(id: string) {
    return document.getElementById(id);
}
