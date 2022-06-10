import getListInfo from '../../../../lib/plugins/ContentEdit/utils/getListInfo';
import { BulletListType, ListType, NumberingListType } from 'roosterjs-editor-types';

describe('getListInfo ', () => {
    function runTest(
        textBeforeCursor: string,
        listType: ListType,
        listStyle: BulletListType | NumberingListType
    ) {
        const style = getListInfo(textBeforeCursor);
        expect(style).toEqual({ listType, listStyle });
    }

    it('1. ', () => {
        runTest('1.', ListType.Ordered, NumberingListType.Decimal);
    });

    it('1- ', () => {
        runTest('1- ', ListType.Ordered, NumberingListType.DecimalDash);
    });

    it('1) ', () => {
        runTest('1) ', ListType.Ordered, NumberingListType.DecimalParenthesis);
    });

    it('(1) ', () => {
        runTest('(1) ', ListType.Ordered, NumberingListType.DecimalDoubleParenthesis);
    });

    it('A.', () => {
        runTest('A. ', ListType.Ordered, NumberingListType.UpperAlpha);
    });

    it('A- ', () => {
        runTest('A- ', ListType.Ordered, NumberingListType.UpperAlphaDash);
    });

    it('A) ', () => {
        runTest('A) ', ListType.Ordered, NumberingListType.UpperAlphaParenthesis);
    });

    it('(A) ', () => {
        runTest('(A) ', ListType.Ordered, NumberingListType.UpperAlphaDoubleParenthesis);
    });

    it('a. ', () => {
        runTest('a. ', ListType.Ordered, NumberingListType.LowerAlpha);
    });

    it('a- ', () => {
        runTest('a- ', ListType.Ordered, NumberingListType.LowerAlphaDash);
    });

    it('a) ', () => {
        runTest('a) ', ListType.Ordered, NumberingListType.LowerAlphaParenthesis);
    });

    it('(a) ', () => {
        runTest('(a) ', ListType.Ordered, NumberingListType.LowerAlphaDoubleParenthesis);
    });

    it('i. ', () => {
        runTest('i. ', ListType.Ordered, NumberingListType.LowerRoman);
    });

    it('i- ', () => {
        runTest('i- ', ListType.Ordered, NumberingListType.LowerRomanDash);
    });

    it('i) ', () => {
        runTest('i) ', ListType.Ordered, NumberingListType.LowerRomanParenthesis);
    });

    it('(i) ', () => {
        runTest('(i) ', ListType.Ordered, NumberingListType.LowerRomanDoubleParenthesis);
    });

    it('I. ', () => {
        runTest('I. ', ListType.Ordered, NumberingListType.UpperRoman);
    });

    it('I- ', () => {
        runTest('I- ', ListType.Ordered, NumberingListType.UpperRomanDash);
    });

    it('I) ', () => {
        runTest('I) ', ListType.Ordered, NumberingListType.UpperRomanParenthesis);
    });

    it('(I) ', () => {
        runTest('(I) ', ListType.Ordered, NumberingListType.UpperRomanDoubleParenthesis);
    });

    it('=> ', () => {
        runTest('=> ', ListType.Unordered, BulletListType.UnfilledArrow);
    });

    it('--> ', () => {
        runTest('--> ', ListType.Unordered, BulletListType.LongArrow);
    });

    it('-> ', () => {
        runTest('-> ', ListType.Unordered, BulletListType.LongArrow);
    });

    it('> ', () => {
        runTest('> ', ListType.Unordered, BulletListType.ShortArrow);
    });

    it('-- ', () => {
        runTest('-- ', ListType.Unordered, BulletListType.Square);
    });

    it('- ', () => {
        runTest('- ', ListType.Unordered, BulletListType.Dash);
    });

    it('* ', () => {
        runTest('* ', ListType.Unordered, BulletListType.Disc);
    });
});
