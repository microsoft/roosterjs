import Position from '../../selection/Position';
import { NodeType, PositionType } from 'roosterjs-editor-types';

describe('Position.ctor()', () => {
    function runTest(
        input: string,
        getNode: (root: Node) => Node,
        offset: number,
        expectNodeValue: string,
        expectOffset: number,
        expectIsAtEnd: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = getNode(div);
        let position = new Position(node, offset);
        node = position.node;
        let value = node.nodeType == NodeType.Text ? node.nodeValue : node.textContent;
        expect(value).toBe(expectNodeValue, 'NodeValue');
        expect(position.offset).toBe(expectOffset, 'Offset');
        expect(position.isAtEnd).toBe(expectIsAtEnd, 'IsAtEnd');
        document.body.removeChild(div);
    }
    it('DIV - Begin', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            0,
            'test2',
            0,
            false
        );
    });
    it('DIV - With offset', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            1,
            'test2',
            1,
            true
        );
    });
    it('DIV - With offset out of range', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            2,
            'test2',
            1,
            true
        );
    });
    it('DIV - Before', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            PositionType.Before,
            'test1test2test3',
            1,
            false
        );
    });
    it('DIV - After', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            PositionType.After,
            'test1test2test3',
            2,
            false
        );
    });
    it('DIV - End', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            PositionType.End,
            'test2',
            1,
            true
        );
    });
    it('Text - Begin', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.Begin,
            'test2',
            0,
            false
        );
    });
    it('Text - End', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.End,
            'test2',
            5,
            true
        );
    });
    it('Text - Before', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.Before,
            'test2',
            0,
            false
        );
    });
    it('Text - After', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.After,
            'test2',
            1,
            true
        );
    });
    it('Text - With offset', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            2,
            'test2',
            2,
            false
        );
    });
    it('Text - With offset out of range', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            10,
            'test2',
            5,
            true
        );
    });
    it('VOID - Begin', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.Begin,
            '',
            0,
            false
        );
    });
    it('VOID - End', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.End,
            '',
            0,
            true
        );
    });
    it('VOID - Before', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.Before,
            'test1test3',
            1,
            false
        );
    });
    it('VOID - After', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.After,
            'test1test3',
            2,
            false
        );
    });
    it('VOID - With offset', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 0, '', 0, false);
    });
    it('VOID - With offset out of range', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 2, '', 0, true);
    });
});

describe('Position.normalize()', () => {
    function runTest(
        input: string,
        getNode: (root: Node) => Node,
        offset: number,
        expectNodeValue: string,
        expectOffset: number,
        expectIsAtEnd: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = getNode(div);
        let position = new Position(node, offset).normalize();
        node = position.node;
        let value = node.nodeType == NodeType.Text ? node.nodeValue : node.textContent;
        expect(value).toBe(expectNodeValue, 'NodeValue');
        expect(position.offset).toBe(expectOffset, 'Offset');
        expect(position.isAtEnd).toBe(expectIsAtEnd, 'IsAtEnd');
        document.body.removeChild(div);
    }

    it('DIV - Begin', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            0,
            'test2',
            0,
            false
        );
    });
    it('DIV - With offset', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            1,
            'test2',
            5,
            true
        );
    });
    it('DIV - With offset out of range', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            2,
            'test2',
            5,
            true
        );
    });
    it('DIV - Before', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            PositionType.Before,
            'test2',
            0,
            false
        );
    });
    it('DIV - After', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            PositionType.After,
            'test3',
            0,
            false
        );
    });
    it('DIV - End', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            PositionType.End,
            'test2',
            5,
            true
        );
    });
    it('Text - Begin', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.Begin,
            'test2',
            0,
            false
        );
    });
    it('Text - End', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.End,
            'test2',
            5,
            true
        );
    });
    it('Text - Before', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.Before,
            'test2',
            0,
            false
        );
    });
    it('Text - After', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            PositionType.After,
            'test2',
            5,
            true
        );
    });
    it('Text - With offset', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            2,
            'test2',
            2,
            false
        );
    });
    it('Text - With offset out of range', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            10,
            'test2',
            5,
            true
        );
    });
    it('VOID - Begin', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.Begin,
            '',
            0,
            false
        );
    });
    it('VOID - End', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.End,
            '',
            0,
            true
        );
    });
    it('VOID - Before', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.Before,
            '',
            0,
            false
        );
    });
    it('VOID - After', () => {
        runTest(
            'test1<img id=id1>test3',
            () => document.getElementById('id1'),
            PositionType.After,
            'test3',
            0,
            false
        );
    });
    it('VOID - With offset', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 0, '', 0, false);
    });
    it('VOID - With offset out of range', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 2, '', 0, true);
    });
});

describe('Position.equalTo()', () => {
    function runTest(
        input: string,
        getNode1: (root: Node) => Node,
        offset1: number,
        getNode2: (root: Node) => Node,
        offset2: number,
        expectResult: boolean,
        expectResultAfterNormalize: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let position1 = new Position(getNode1(div), offset1);
        let position2 = new Position(getNode2(div), offset2);
        expect(position1.equalTo(position2)).toBe(expectResult, 'Before Normalize');
        expect(position1.normalize().equalTo(position2.normalize())).toBe(
            expectResultAfterNormalize,
            'After Normalize'
        );
        document.body.removeChild(div);
    }

    it('EQUAL', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1'),
            0,
            true,
            true
        );
    });

    it('EQUAL with BEFORE', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1').firstChild,
            PositionType.Before,
            true,
            true
        );
    });

    it('EQUAL with AFTER', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            1,
            () => document.getElementById('id1').firstChild,
            PositionType.After,
            true,
            true
        );
    });

    it('NOT EQUAL', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1'),
            1,
            false,
            false
        );
    });

    it('NOT EQUAL, EQUAL after Normalize', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1').firstChild,
            0,
            false,
            true
        );
    });

    it('NOT EQUAL by isAtEnd', () => {
        runTest(
            'test1<img id=id1>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1'),
            PositionType.End,
            false,
            false
        );
    });
});

describe('Position.isAfter()', () => {
    function runTest(
        input: string,
        getNode1: (root: Node) => Node,
        offset1: number,
        getNode2: (root: Node) => Node,
        offset2: number,
        expectResult: boolean,
        expectResultAfterNormalize: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let position1 = new Position(getNode1(div), offset1);
        let position2 = new Position(getNode2(div), offset2);
        let beforeNormalize = position1.isAfter(position2);
        let afterNormalize = position1.normalize().isAfter(position2.normalize());
        expect(beforeNormalize).toBe(expectResult, 'Before Normalize');
        expect(afterNormalize).toBe(expectResultAfterNormalize, 'After Normalize');
        document.body.removeChild(div);
    }

    it('EQUAL', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1'),
            0,
            false,
            false
        );
    });

    it('EQUAL with BEFORE', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1').firstChild,
            PositionType.Before,
            false,
            false
        );
    });

    it('EQUAL with AFTER', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            1,
            () => document.getElementById('id1').firstChild,
            PositionType.After,
            false,
            false
        );
    });

    it('BEFORE', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1'),
            1,
            false,
            false
        );
    });

    it('AFTER', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            1,
            () => document.getElementById('id1'),
            0,
            true,
            true
        );
    });

    it('NOT EQUAL, EQUAL after Normalize', () => {
        runTest(
            'test1<div id=id1>test1</div>test2',
            () => document.getElementById('id1'),
            0,
            () => document.getElementById('id1').firstChild,
            0,
            false,
            false
        );
    });

    it('AFTER by isAtEnd', () => {
        runTest(
            'test1<img id=id1>test2',
            () => document.getElementById('id1'),
            PositionType.End,
            () => document.getElementById('id1'),
            0,
            true,
            true
        );
    });

    it('Different Node', () => {
        runTest(
            'test1<img id=id1>test2<img id=id2>test3',
            () => document.getElementById('id2'),
            PositionType.End,
            () => document.getElementById('id1'),
            0,
            true,
            true
        );
    });
    it('Continuous Node', () => {
        runTest(
            'test1<img id=id1><img id=id2>test3',
            () => document.getElementById('id2'),
            0,
            () => document.getElementById('id1'),
            PositionType.End,
            true,
            true
        );
    });
    it('Nested Node', () => {
        runTest(
            'test1<div id=id1><img id=id2></div>test3',
            () => document.getElementById('id2'),
            0,
            () => document.getElementById('id1'),
            0,
            true,
            false
        );
    });
});

describe('Position.move()', () => {
    function runTest(
        input: string,
        getNode: (root: Node) => Node,
        offset: number,
        move: number,
        expectOffset: number,
        expectIsAtEnd: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let position = new Position(getNode(div), offset);
        position = position.move(move);
        expect(position.offset).toBe(expectOffset, 'Offset');
        expect(position.isAtEnd).toBe(expectIsAtEnd, 'IsAtEnd');
        document.body.removeChild(div);
    }

    it('DIV - ove right', () => {
        runTest(
            '<div id=id1><div id=id2></div><div id=id3></div><div id=id4></div></div>',
            () => document.getElementById('id1'),
            1,
            1,
            2,
            false
        );
    });

    it('DIV - Move left', () => {
        runTest(
            '<div id=id1><div id=id2></div><div id=id3></div><div id=id4></div></div>',
            () => document.getElementById('id1'),
            1,
            -1,
            0,
            false
        );
    });

    it('DIV - Move right out of range', () => {
        runTest(
            '<div id=id1><div id=id2></div><div id=id3></div><div id=id4></div></div>',
            () => document.getElementById('id1'),
            1,
            5,
            3,
            true
        );
    });

    it('DIV - Move left out of range', () => {
        runTest(
            '<div id=id1><div id=id2></div><div id=id3></div><div id=id4></div></div>',
            () => document.getElementById('id1'),
            1,
            -2,
            0,
            false
        );
    });

    it('Text Move right', () => {
        runTest(
            '<div id=id1>test</div>',
            () => document.getElementById('id1').firstChild,
            2,
            1,
            3,
            false
        );
    });

    it('Text Move left', () => {
        runTest(
            '<div id=id1>test</div>',
            () => document.getElementById('id1').firstChild,
            2,
            -1,
            1,
            false
        );
    });

    it('Text Move right out of range', () => {
        runTest(
            '<div id=id1>test</div>',
            () => document.getElementById('id1').firstChild,
            2,
            10,
            4,
            true
        );
    });

    it('Text Move left out of range', () => {
        runTest(
            '<div id=id1>test</div>',
            () => document.getElementById('id1').firstChild,
            2,
            -10,
            0,
            false
        );
    });
});
