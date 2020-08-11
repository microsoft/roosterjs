import createRange from '../../selection/createRange';
import Position from '../../selection/Position';
import { PositionType } from 'roosterjs-editor-types';

describe('createRange() with nodes', () => {
    function runTest(
        input: string,
        getNodes: () => [Node, Node],
        expectRange: () => [Node, number, Node, number]
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let nodes = getNodes();
        let range = createRange(nodes[0], nodes[1]);
        let expectResult = expectRange();
        if (range) {
            let [startContainer, startOffset, endContainer, endOffset] = expectResult;
            expect(range.startContainer).toBe(startContainer, 'startContainer');
            expect(range.startOffset).toBe(startOffset, 'startOffset');
            expect(range.endContainer).toBe(endContainer, 'endContainer');
            expect(range.endOffset).toBe(endOffset, 'endOffset');
        } else {
            expect(expectResult).toBe(null, 'Range');
        }
        document.body.removeChild(div);
    }

    it('Null', () => {
        runTest(
            '',
            () => [null, null],
            () => null
        );
    });

    it('Collapsed', () => {
        runTest(
            '<div id=id1><div id=id2></div></div>',
            () => [$('id2'), null],
            () => [$('id1'), 0, $('id1'), 1]
        );
    });

    it('Under same node', () => {
        runTest(
            '<div id=id1><div id=id2></div><div id=id3></div></div>',
            () => [$('id2'), $('id3')],
            () => [$('id1'), 0, $('id1'), 2]
        );
    });

    it('Under different node', () => {
        runTest(
            '<div id=id1><div id=id2></div></div><div id=id3><div id=id4></div></div>',
            () => [$('id2'), $('id4')],
            () => [$('id1'), 0, $('id3'), 1]
        );
    });

    it('Void node', () => {
        runTest(
            '<div id=id1><img id=id2><img id=id3></div>',
            () => [$('id2'), $('id3')],
            () => [$('id1'), 0, $('id1'), 2]
        );
    });
});

describe('createRange() with positions', () => {
    function runTest(
        input: string,
        getPositions: () => [Position, Position],
        expectRange: () => [Node, number, Node, number]
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let positions = getPositions();
        let range = createRange(positions[0], positions[1]);
        let expectResult = expectRange();
        if (range) {
            let [startContainer, startOffset, endContainer, endOffset] = expectResult;
            expect(range.startContainer).toBe(startContainer, 'startContainer');
            expect(range.startOffset).toBe(startOffset, 'startOffset');
            expect(range.endContainer).toBe(endContainer, 'endContainer');
            expect(range.endOffset).toBe(endOffset, 'endOffset');
        } else {
            expect(expectResult).toBe(null, 'Range');
        }
        document.body.removeChild(div);
    }

    it('Collapsed', () => {
        runTest(
            '<div id=id1><div id=id2></div></div>',
            () => [$p('id2', 0), null],
            () => [$('id2'), 0, $('id2'), 0]
        );
    });

    it('Under same node', () => {
        runTest(
            '<div id=id1><div id=id2>test1</div><div id=id3>test2</div></div>',
            () => [$pChild('id2', 2), $pChild('id2', 2)],
            () => [$Child('id2'), 2, $Child('id2'), 2]
        );
    });

    it('Under different node', () => {
        runTest(
            '<div id=id1><div id=id2>test1</div><div id=id3>test2</div></div>',
            () => [$pChild('id2', 2), $pChild('id3', 3)],
            () => [$Child('id2'), 2, $Child('id3'), 3]
        );
    });

    it('Void node 1', () => {
        runTest(
            '<div id=id1><img id=id2><img id=id3></div>',
            () => [$p('id2', 0), $p('id3', 0)],
            () => [$('id1'), 0, $('id1'), 1]
        );
    });

    it('Void node 2', () => {
        runTest(
            '<div id=id1><img id=id2><img id=id3></div>',
            () => [$p('id2', 0), $p('id3', 1)],
            () => [$('id1'), 0, $('id1'), 2]
        );
    });

    it('Before/After orphan node', () => {
        let range = createRange(document.createElement('div'), PositionType.After);
        expect(range).toBeNull();

        range = createRange(document.createElement('div'), PositionType.Before);
        expect(range).toBeNull();
    });
});

function $(id: string) {
    return document.getElementById(id);
}

function $Child(id: string) {
    return document.getElementById(id).firstChild;
}

function $p(id: string, offset: number) {
    return new Position($(id), offset);
}

function $pChild(id: string, offset: number) {
    return new Position($Child(id), offset);
}
