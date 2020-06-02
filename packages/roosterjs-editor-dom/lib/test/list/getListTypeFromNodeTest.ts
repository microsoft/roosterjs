import getListTypeFromNode, { isListElement } from '../../list/getListTypeFromNode';
import { ListType } from 'roosterjs-editor-types';

describe('getListTypeFromNode', () => {
    function runTest(tag: string, expected: ListType) {
        expect(getListTypeFromNode(document.createElement(tag))).toBe(expected);
    }

    it('OL', () => {
        runTest('ol', ListType.Ordered);
    });

    it('UL', () => {
        runTest('ul', ListType.Unordered);
    });

    it('Others', () => {
        runTest('div', ListType.None);
    });
});

describe('isListElement', () => {
    function runTest(tag: string, expected: boolean) {
        expect(isListElement(document.createElement(tag))).toBe(expected);
    }

    it('OL', () => {
        runTest('ol', true);
    });

    it('UL', () => {
        runTest('ul', true);
    });

    it('Others', () => {
        runTest('div', false);
    });
});
