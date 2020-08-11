import * as DomTestHelper from '../DomTestHelper';
import createRange from '../../selection/createRange';
import getSelectedBlockElementsInRegion from '../../region/getSelectedBlockElementsInRegion';
import { getRegionCreator } from '../../region/getRegionsFromRange';

const testID = 'getSelectedBlockElementsInRegion';
const RegionRoot = 'root';
const NodeBefore = 'before';
const NodeAfter = 'after';
const FocusNode = 'focus';
const FocusNode1 = 'focus1';
const FocusNode2 = 'focus2';

describe('getSelectedBlockElementsInRegion', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        input: string,
        expectation: () => {
            start: Node;
            end: Node;
        }[]
    ) {
        // Arrange
        DomTestHelper.createElementFromContent(testID, input);
        const root = document.getElementById(RegionRoot);
        const before = document.getElementById(NodeBefore);
        const after = document.getElementById(NodeAfter);
        const focusNode = document.getElementById(FocusNode);
        const focusNode1 = document.getElementById(FocusNode1);
        const focusNode2 = document.getElementById(FocusNode2);

        if (!root) {
            throw new Error('root node not found.');
        }

        if (!focusNode && (!focusNode1 || !focusNode2)) {
            throw new Error('focus node not found');
        }

        const range = focusNode ? createRange(focusNode) : createRange(focusNode1, focusNode2);
        const creator = getRegionCreator(range, ['TABLE']);
        const region = creator(root, before, after);

        // Act
        const blocks = getSelectedBlockElementsInRegion(region);
        const result = blocks.map(block => ({
            start: block.getStartNode(),
            end: block.getEndNode(),
        }));

        // Assert
        expect(result).toEqual(expectation());
    }

    it('null input', () => {
        const blocks = getSelectedBlockElementsInRegion(null);
        expect(blocks).toEqual([]);
    });

    it('Single node region, selection is totally out of range', () => {
        runTest(
            `<div>line 4<span id="${FocusNode}">line 4</span>line 4</div>` +
                `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 1</div>' +
                '<div id="resultDiv2">line 2</div>' +
                '<div id="resultDiv3">line 3</div>' +
                '</div>',
            () => []
        );
    });

    it('Single node region, selection in region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="resultDiv">line 2<span id="${FocusNode}">line 2</span>line 2</div>` +
                '<div>line 3</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv'),
                    end: document.getElementById('resultDiv'),
                },
            ]
        );
    });

    it('Single node region, selection starts in region, ends out of region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="resultDiv1">line 2<span id="${FocusNode1}">line 2</span>line 2</div>` +
                '<div id="resultDiv2">line 3</div>' +
                '</div>' +
                `<div>line 4<span id="${FocusNode2}">line 4</span>line 4</div>`,
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Single node region, selection starts before region, ends in region', () => {
        runTest(
            `<div>line 4<span id="${FocusNode1}">line 4</span>line 4</div>` +
                `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 1</div>' +
                `<div id="resultDiv2">line 2<span id="${FocusNode2}">line 2</span>line 2</div>` +
                '<div>line 3</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Single node region, selection starts and ends out of region', () => {
        runTest(
            `<div>line 4<span id="${FocusNode1}">line 4</span>line 4</div>` +
                `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 1</div>' +
                '<div id="resultDiv2">line 2</div>' +
                '<div id="resultDiv3">line 3</div>' +
                '</div>' +
                `<div>line 5<span id="${FocusNode2}">line 5</span>line 5</div>`,
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
                {
                    start: document.getElementById('resultDiv3'),
                    end: document.getElementById('resultDiv3'),
                },
            ]
        );
    });

    it('Single node region, selection is totally out of region', () => {
        runTest(
            `<div>line 4<span id="${FocusNode}">line 4</span>line 4</div>` +
                `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 1</div>' +
                '<div id="resultDiv2">line 2</div>' +
                '<div id="resultDiv3">line 3</div>' +
                '</div>',
            () => []
        );
    });

    it('Region has nodeBefore, selection is in region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>line 3</div>' +
                `<div id="resultDiv"><span id="${FocusNode}">line 4</span></div>` +
                '<div>line 5</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv'),
                    end: document.getElementById('resultDiv'),
                },
            ]
        );
    });

    it('Region has nodeBefore, selection covers the whole region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div id="${FocusNode1}">line 1</div>` +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="resultDiv3"><span id="${FocusNode2}">line 5</span></div>` +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
                {
                    start: document.getElementById('resultDiv3'),
                    end: document.getElementById('resultDiv3'),
                },
            ]
        );
    });

    it('Region has nodeBefore, selection is before "NodeBefore"', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div><span id="${FocusNode}">line 1</span></div>` +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>line 3</div>' +
                '<div>line 4</div>' +
                '<div>line 5</div>' +
                '</div>',
            () => []
        );
    });

    it('Region has nodeBefore, selection start in nodeBefore, end after region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}"><span id="${FocusNode1}">line 2</span></div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                '</div>' +
                `<div><span id="${FocusNode2}">line 5</span></div>`,
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Region has nodeAfter, selection is in region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="resultDiv"><span id="${FocusNode}">line 2</span></div>` +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                '<div>line 5</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv'),
                    end: document.getElementById('resultDiv'),
                },
            ]
        );
    });

    it('Region has nodeAfter, selection covers the whole region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div id="resultDiv1"><span id="${FocusNode1}">line 1</span></div>` +
                '<div id="resultDiv2">line 2</div>' +
                '<div id="resultDiv3">line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                `<div id="resultDiv3"><span id="${FocusNode2}">line 5</span></div>` +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
                {
                    start: document.getElementById('resultDiv3'),
                    end: document.getElementById('resultDiv3'),
                },
            ]
        );
    });

    it('Region has nodeAfter, selection is after "nodeAfter"', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                '<div>line 2</div>' +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                `<div><span id="${FocusNode}">line 5</span></div>` +
                '</div>',
            () => []
        );
    });

    it('Region has nodeAfter, selection start before region, end in nodeAfter', () => {
        runTest(
            `<div><span id="${FocusNode1}">line 1</span></div>` +
                `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 2</div>' +
                '<div id="resultDiv2">line 3</div>' +
                `<div id="${NodeAfter}"><span id="${FocusNode2}">line 4</span></div>` +
                '<div>line 5</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection is in region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                `<div id="resultDiv1"><span id="${FocusNode1}">line 3</span></div>` +
                `<div id="resultDiv2"><span id="${FocusNode2}">line 4</span></div>` +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection covers the whole region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div><span id="${FocusNode1}">line 1</span></div>` +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                `<div><span id="${FocusNode2}">line 6</span></div>` +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection starts before nodeBefre ends between nodeBefore and nodeAfter', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div><span id="${FocusNode1}">line 1</span></div>` +
                `<div id="${NodeBefore}">line 2</div>` +
                `<div id="resultDiv1"><span id="${FocusNode2}">line 3</span></div>` +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
            ]
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection starts between nodeBefore and nodeAfter ends after nodeAfter ', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                `<div id="resultDiv2"><span id="${FocusNode1}">line 4</span></div>` +
                `<div id="${NodeAfter}">line 5</div>` +
                `<div><span id="${FocusNode2}">line 6</span></div>` +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection is before nodeBefore', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div><span id="${FocusNode}">line 1</span></div>` +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>',
            () => []
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection is after nodeAfter', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                `<div><span id="${FocusNode}">line 6</span></div>` +
                '</div>',
            () => []
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection is out of region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '</div>' +
                `<div><span id="${FocusNode}">line 6</span></div>`,
            () => []
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection starts in nodeBefore, ends in nodeAfter', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}"><span id="${FocusNode1}">line 2</span></div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                `<div id="${NodeAfter}"><span id="${FocusNode2}">line 5</span></div>` +
                '<div>line 6</div>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultDiv1'),
                    end: document.getElementById('resultDiv1'),
                },
                {
                    start: document.getElementById('resultDiv2'),
                    end: document.getElementById('resultDiv2'),
                },
            ]
        );
    });

    it('Region has both nodeBefore and nodeAfter, selection starts in nodeBefore, ends in nodeAfter, using StartEndBlockElement', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<span>line 1</span><br>' +
                `<div id="${NodeBefore}"><span id="${FocusNode1}">line 2</span></div>` +
                '<span id="resultSpan1">line 3</span><br id="resultBr1">' +
                '<span id="resultSpan2">line 4</span>' +
                `<div id="${NodeAfter}"><span id="${FocusNode2}">line 5</span></div>` +
                '<span>line 6</span>' +
                '</div>',
            () => [
                {
                    start: document.getElementById('resultSpan1'),
                    end: document.getElementById('resultBr1'),
                },
                {
                    start: document.getElementById('resultSpan2'),
                    end: document.getElementById('resultSpan2'),
                },
            ]
        );
    });
});
