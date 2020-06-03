import * as DomTestHelper from '../DomTestHelper';
import isNodeInRegion from '../../region/isNodeInRegion';
import { getRegionCreator } from '../../region/getRegionsFromRange';
import { Region } from 'roosterjs-editor-types';

const testID = 'isNodeInRegion';
const RegionRoot = 'root';
const NodeBefore = 'before';
const NodeAfter = 'after';
const TargetNode = 'target';

describe('isNodeInRegion', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, expectation: boolean) {
        // Arrange
        DomTestHelper.createElementFromContent(testID, input);
        const root = document.getElementById(RegionRoot);
        const before = document.getElementById(NodeBefore);
        const after = document.getElementById(NodeAfter);
        const target = document.getElementById(TargetNode);

        if (!root) {
            throw new Error('root node not found.');
        }

        const creator = getRegionCreator(document.createRange(), ['TABLE']);
        const region = creator(root, before, after);

        // Act
        const result = isNodeInRegion(region, target);

        // Assert
        expect(result).toEqual(expectation);
    }

    it('Null input', () => {
        expect(isNodeInRegion(null, document.createElement('div'))).toBeFalsy();
        expect(isNodeInRegion(({} as any) as Region, null)).toBeFalsy();
        expect(isNodeInRegion(null, null)).toBeFalsy();
    });

    it('Target node is out of region', () => {
        runTest(`<div id="${RegionRoot}"></div><div id="${TargetNode}">line 1</div>`, false);
    });

    it('Target node is in of region', () => {
        runTest(`<div id="${RegionRoot}"><div id="${TargetNode}">line 1</div></div>`, true);
    });

    it('Target node is before nodeBefore', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                `<div id="${TargetNode}">line 1</div>` +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                '<div>line 5</div>' +
                '</div>',
            false
        );
    });

    it('Target node is in nodeBefore', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}"><span id="${TargetNode}">line 2</span></div>` +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                '<div>line 5</div>' +
                '</div>',
            false
        );
    });

    it('Target node is in nodeAfter', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}"><span id="${TargetNode}">line 4</span></div>` +
                '<div>line 5</div>' +
                '</div>',
            false
        );
    });

    it('Target node is after nodeAfter', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                `<div><span id="${TargetNode}">line 5</span></div>` +
                '</div>',
            false
        );
    });

    it('No target node', () => {
        runTest(
            `<div id="${RegionRoot}">` +
                '<div>line 1</div>' +
                `<div id="${NodeBefore}">line 2</div>` +
                '<div>line 3</div>' +
                `<div id="${NodeAfter}">line 4</div>` +
                '<div>line 5</div>' +
                '</div>',
            false
        );
    });
});
