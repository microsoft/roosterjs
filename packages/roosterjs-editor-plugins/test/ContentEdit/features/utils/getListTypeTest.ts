import getListType from '../../../../lib/plugins/ContentEdit/utils/getListType';
import { ListType } from 'roosterjs-editor-types';

describe('getListType', () => {
    function runTest(textBeforeCursor: string, expectedListType: ListType) {
        const listType = getListType(textBeforeCursor);
        expect(listType).toBe(expectedListType);
    }

    it('1. ', () => {
        runTest('1. ', ListType.Ordered);
    });

    it('A- ', () => {
        runTest('A- ', ListType.Ordered);
    });

    it('a) ', () => {
        runTest('a) ', ListType.Ordered);
    });

    it('(i) ', () => {
        runTest('(i) ', ListType.Ordered);
    });

    it('=> ', () => {
        runTest('=> ', ListType.Unordered);
    });

    it('--> ', () => {
        runTest('--> ', ListType.Unordered);
    });

    it('-- ', () => {
        runTest('-- ', ListType.Unordered);
    });
});
