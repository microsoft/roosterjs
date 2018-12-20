import contains from '../../utils/contains';
import createRange from '../../selection/createRange';
import Position from '../../selection/Position';

describe('contains()', () => {
    it('node in node, treatSameNodeAsContain = false', () => {
        runTestForNode(0, '', 'id1', 'id2', false, false, false);
        runTestForNode(1, '<div id=id1></div>', 'id1', 'id2', false, false, false);
        runTestForNode(2, '<div id=id1></div>', 'id2', 'id1', false, false, false);
        runTestForNode(3, '<div id=id1></div>', 'id1', 'id1', false, false, false);
        runTestForNode(4, '<div id=id1><div id=id2></div></div>', 'id1', 'id2', false, true, false);
        runTestForNode(
            5,
            '<div id=id1><div><div id=id2></div></div></div>',
            'id1',
            'id2',
            false,
            true,
            false
        );
        runTestForNode(
            6,
            '<div id=id1><div><div id=id2></div></div></div>',
            'id2',
            'id1',
            false,
            false,
            false
        );
        runTestForNode(
            7,
            '<div id=id1><div></div><div id=id2></div></div>',
            'id1',
            'id2',
            false,
            true,
            false
        );
        runTestForNode(
            8,
            '<div id=id1></div><div id=id2></div>',
            'id1',
            'id2',
            false,
            false,
            false
        );
        runTestForNode(
            9,
            '<div id=id1></div><div id=id2>Test</div>',
            'id1',
            'id2',
            false,
            false,
            false
        );
        runTestForNode(
            10,
            '<div id=id1><div id=id2>Test</div></div>',
            'id1',
            'id2',
            false,
            true,
            true
        );
        runTestForNode(11, '<div id=id1>Test</div>', 'id1', 'id1', false, false, true);
    });

    it('node in node, treatSameNodeAsContain = true', () => {
        runTestForNode(0, '', 'id1', 'id2', true, false, false);
        runTestForNode(1, '<div id=id1></div>', 'id1', 'id2', true, false, false);
        runTestForNode(2, '<div id=id1></div>', 'id2', 'id1', true, false, false);
        runTestForNode(3, '<div id=id1></div>', 'id1', 'id1', true, true, false);
        runTestForNode(4, '<div id=id1><div id=id2></div></div>', 'id1', 'id2', true, true, false);
        runTestForNode(
            5,
            '<div id=id1><div><div id=id2></div></div></div>',
            'id1',
            'id2',
            true,
            true,
            false
        );
        runTestForNode(
            6,
            '<div id=id1><div><div id=id2></div></div></div>',
            'id2',
            'id1',
            true,
            false,
            false
        );
        runTestForNode(
            7,
            '<div id=id1><div></div><div id=id2></div></div>',
            'id1',
            'id2',
            true,
            true,
            false
        );
        runTestForNode(8, '<div id=id1></div><div id=id2></div>', 'id1', 'id2', true, false, false);
        runTestForNode(
            9,
            '<div id=id1></div><div id=id2>Test</div>',
            'id1',
            'id2',
            true,
            false,
            false
        );
        runTestForNode(
            10,
            '<div id=id1><div id=id2>Test</div></div>',
            'id1',
            'id2',
            true,
            true,
            true
        );
        runTestForNode(11, '<div id=id1>Test</div>', 'id1', 'id1', true, true, true);
    });

    it('range in node', () => {
        runTestForRange(0, '', 'id0', () => null, false);
        runTestForRange(1, '<span id=id1></span>', 'id1', () => null, false);
        runTestForRange(2, '', 'id0', () => document.createRange(), false);
        runTestForRange(
            3,
            '<span id=id1>test</span>',
            'id1',
            container => createRange(container),
            false
        );
        runTestForRange(
            4,
            '<span id=id1><span>test1</span><span>test2</span></span>',
            'id1',
            container => createRange(container.firstChild),
            true
        );
        runTestForRange(
            5,
            '<span id=id1><span>test1</span><span>test2</span></span>',
            'id1',
            container => createRange(container.firstChild.firstChild),
            true
        );
        runTestForRange(
            6,
            '<span id=id1><span>test1</span><span>test2</span></span>',
            'id1',
            container => createRange(container.firstChild, container.lastChild),
            true
        );
        runTestForRange(
            7,
            '<span id=id1><span>test1</span><span>test2</span></span>',
            'id1',
            container =>
                createRange(container.firstChild.firstChild, container.lastChild.lastChild),
            true
        );
        runTestForRange(
            8,
            '<span id=id1><span>test1</span><span>test2</span></span>',
            'id1',
            container =>
                createRange(
                    new Position(container.firstChild.firstChild, 2),
                    new Position(container.lastChild.lastChild, 2)
                ),
            true
        );
        runTestForRange(
            9,
            '<span id=id1><span id=id2>test1</span><span id=id3>test2</span></span>',
            'id2',
            () => createRange(document.getElementById('id3')),
            false
        );
        runTestForRange(
            10,
            '<span id=id1><span id=id2>test1</span><span id=id3>test2</span></span>',
            'id2',
            () => {
                let start = new Position(document.getElementById('id2').firstChild, 2);
                let end = new Position(document.getElementById('id3').firstChild, 2);
                return createRange(start, end);
            },
            false
        );
    });

    function runTestForNode(
        caseIndex: number,
        html: string,
        containerId: string,
        containedId: string,
        treatSameNodeAsContain: boolean,
        expectResult: boolean,
        expectChildResult: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = html;
        let container = document.getElementById(containerId);
        let contained = document.getElementById(containedId);
        let result = contains(container, contained, treatSameNodeAsContain);
        expect(result).toBe(expectResult, `case index: ${caseIndex}`);

        if (contained) {
            result = contains(container, contained.firstChild, treatSameNodeAsContain);
            expect(result).toBe(expectChildResult, `case index: ${caseIndex} - Child`);
        }
        document.body.removeChild(div);
    }

    function runTestForRange(
        caseIndex: number,
        html: string,
        containerId: string,
        containedCallback: (container: Node) => Range,
        expectResult: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = html;
        let container = document.getElementById(containerId);
        let contained = containedCallback(container);
        let result = contains(container, contained);
        expect(result).toBe(expectResult, `case index: ${caseIndex}`);

        document.body.removeChild(div);
    }
});
