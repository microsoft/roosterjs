import * as DomTestHelper from '../DomTestHelper';
import collapseNodesInRegion from '../../region/collapseNodesInRegion';
import { getRegionCreator } from '../../region/getRegionsFromRange';
import { Region } from 'roosterjs-editor-types';

const testID = 'collapseNodesInRegion';
const RegionRoot = 'root';
const NodeBefore = 'before';
const NodeAfter = 'after';

describe('collapseNodesInRegion', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        input: string,
        nodes: (div: HTMLElement) => Node[],
        expectedNodes: (div: HTMLElement) => Node[],
        expectedHtml: string
    ) {
        // Arrange
        const div = DomTestHelper.createElementFromContent(testID, input);
        const root = document.getElementById(RegionRoot);
        const before = document.getElementById(NodeBefore);
        const after = document.getElementById(NodeAfter);

        if (!root) {
            throw new Error('root node not found.');
        }

        const creator = getRegionCreator(document.createRange(), ['TABLE']);
        const region = creator(root, before, after);

        // Act
        const nodesResult = collapseNodesInRegion(region, nodes(div));

        // Assert
        expect(nodesResult).toEqual(expectedNodes(div));
        expect(div.innerHTML).toEqual(expectedHtml);
    }

    it('Null input', () => {
        expect(collapseNodesInRegion(null, [document.createElement('div')])).toEqual([]);
        expect(collapseNodesInRegion(({} as any) as Region, null)).toEqual([]);
        expect(collapseNodesInRegion(null, null)).toEqual([]);
    });

    it('Nodes are in region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>',
            () => [document.getElementById('resultDiv1'), document.getElementById('resultDiv2')],
            () => [document.getElementById('resultDiv1'), document.getElementById('resultDiv2')],
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>'
        );
    });

    it('Nodes are out region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div>line 3</div>' +
                '<div>line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>' +
                '<div id="resultDiv1">line 7</div>' +
                '<div id="resultDiv2">line 8</div>',
            () => [document.getElementById('resultDiv1'), document.getElementById('resultDiv2')],
            () => [],
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div>line 3</div>' +
                '<div>line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>' +
                '<div id="resultDiv1">line 7</div>' +
                '<div id="resultDiv2">line 8</div>'
        );
    });

    it('Nodes are in and out region', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div id="resultDiv1">line 3</div>' +
                '<div>line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>' +
                '<div id="resultDiv2">line 7</div>',
            () => [document.getElementById('resultDiv1'), document.getElementById('resultDiv2')],
            () => [document.getElementById('resultDiv1')],
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div id="resultDiv1">line 3</div>' +
                '<div>line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div>line 6</div>' +
                '</div>' +
                '<div id="resultDiv2">line 7</div>'
        );
    });

    it('Nodes are in and out region, case 2', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div id="resultDiv2">line 3</div>' +
                '<div id="resultDiv3">line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div id="resultDiv4">line 6</div>' +
                '</div>',
            () => [
                document.getElementById('resultDiv1'),
                document.getElementById('resultDiv2'),
                document.getElementById('resultDiv3'),
                document.getElementById('resultDiv4'),
            ],
            () => [document.getElementById('resultDiv2'), document.getElementById('resultDiv3')],
            `<div id="${RegionRoot}">` +
                '<div id="resultDiv1">line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>' +
                '<div id="resultDiv2">line 3</div>' +
                '<div id="resultDiv3">line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div id="resultDiv4">line 6</div>' +
                '</div>'
        );
    });

    it('Nodes need collapse', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2">' +
                '<div id="resultDiv3">line 4</div>' +
                '</div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div id="resultDiv4">line 6</div>' +
                '</div>',
            () => [
                document.getElementById('resultDiv1'),
                document.getElementById('resultDiv2'),
                document.getElementById('resultDiv3'),
                document.getElementById('resultDiv4'),
            ],
            () => [document.getElementById('resultDiv1'), document.getElementById('resultDiv2')],
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1">line 3</div>' +
                '<div id="resultDiv2"><div id="resultDiv3">line 4</div></div>' +
                `<div id="${NodeAfter}">line 5</div>` +
                '<div id="resultDiv4">line 6</div>' +
                '</div>'
        );
    });

    it('Nodes need collapse case 2', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1"><div id="resultDiv2">line 3</div></div>' +
                '<div id="resultDiv3"><div id="resultDiv4">line 4</div><div id="resultDiv5">line 5</div></div>' +
                `<div id="${NodeAfter}">line 6</div>` +
                '</div>',
            () => [
                document.getElementById('resultDiv1'),
                document.getElementById('resultDiv2'),
                document.getElementById('resultDiv3'),
                document.getElementById('resultDiv4'),
            ],
            () => [document.getElementById('resultDiv1'), document.getElementById('resultDiv3')],
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div id="resultDiv1"><div id="resultDiv2">line 3</div></div>' +
                '<div id="resultDiv3"><div id="resultDiv4">line 4</div></div>' +
                '<div><div id="resultDiv5">line 5</div></div>' +
                `<div id="${NodeAfter}">line 6</div>` +
                '</div>'
        );
    });
});
