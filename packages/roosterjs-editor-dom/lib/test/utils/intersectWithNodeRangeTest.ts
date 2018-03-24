import intersectWithNodeRange from '../../utils/intersectWithNodeRange';
import * as DomTestHelper from '../DomTestHelper';

describe('intersectWithNodeRange()', () => {
    let testID = 'intersectWithNodeRange';

    it('All 3 nodes are same', () => {
        runTest('<div id="div"></div>', 'div', 'div', 'div', false, true, '0');
        runTest('<div id="div"></div>', 'div', 'div', 'div', true, true, '1');
    });

    it('Node is inside range', () => {
        runTest(
            '<div id="start"></div><div id="node"></div><div id="end"></div>',
            'node',
            'start',
            'end',
            false,
            true,
            '0'
        );
        runTest(
            '<div id="start"></div><div id="node"></div><div id="end"></div>',
            'node',
            'start',
            'end',
            true,
            true,
            '1'
        );
    });

    it('Node is outside range', () => {
        runTest(
            '<div id="node"></div><div id="start"></div><div id="end"></div>',
            'node',
            'start',
            'end',
            false,
            false,
            '0'
        );
        runTest(
            '<div id="node"></div><div id="start"></div><div id="end"></div>',
            'node',
            'start',
            'end',
            true,
            false,
            '1'
        );
        runTest(
            '<div id="start"></div><div id="end"></div><div id="node"></div>',
            'node',
            'start',
            'end',
            false,
            false,
            '2'
        );
        runTest(
            '<div id="start"></div><div id="end"></div><div id="node"></div>',
            'node',
            'start',
            'end',
            true,
            false,
            '3'
        );
    });

    it('Node is inside start/end node', () => {
        runTest(
            '<div id="start"><div id="node"></div></div><div id="end"></div>',
            'node',
            'start',
            'end',
            false,
            true,
            '0'
        );
        runTest(
            '<div id="start"><div id="node"></div></div><div id="end"></div>',
            'node',
            'start',
            'end',
            true,
            true,
            '1'
        );
        runTest(
            '<div id="start"></div><div id="end"><div id="node"></div></div>',
            'node',
            'start',
            'end',
            false,
            true,
            '2'
        );
        runTest(
            '<div id="start"></div><div id="end"><div id="node"></div></div>',
            'node',
            'start',
            'end',
            true,
            true,
            '3'
        );
    });

    it('Node contains start/end node', () => {
        runTest(
            '<div id="node"><div id="start"></div></div><div id="end"></div>',
            'node',
            'start',
            'end',
            false,
            true,
            '0'
        );
        runTest(
            '<div id="node"><div id="start"></div></div><div id="end"></div>',
            'node',
            'start',
            'end',
            true,
            false,
            '1'
        );
        runTest(
            '<div id="start"></div><div id="node"><div id="end"></div></div>',
            'node',
            'start',
            'end',
            false,
            true,
            '2'
        );
        runTest(
            '<div id="start"></div><div id="node"><div id="end"></div></div>',
            'node',
            'start',
            'end',
            true,
            false,
            '3'
        );
    });

    it('Node contains start and end node', () => {
        runTest(
            '<div id="node"><div id="start"></div><div id="end"></div></div>',
            'node',
            'start',
            'end',
            false,
            true,
            '0'
        );
        runTest(
            '<div id="node"><div id="start"></div><div id="end"></div></div>',
            'node',
            'start',
            'end',
            true,
            false,
            '1'
        );
    });

    function runTest(
        input: string,
        nodeId: string,
        startNodeId: string,
        endNodeId: string,
        containOnly: boolean,
        expectResult: boolean,
        msg: string
    ) {
        // Arrange
        DomTestHelper.createElementFromContent(testID, input);
        let node = document.getElementById(nodeId);
        let start = document.getElementById(startNodeId);
        let end = document.getElementById(endNodeId);

        // Act
        let result = intersectWithNodeRange(node, start, end, containOnly);

        // Clean up
        DomTestHelper.removeElement(testID);

        expect(result).toBe(expectResult, msg);
    }
});
