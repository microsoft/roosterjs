import { getNumberingListStyle } from '../../../lib/autoFormat/list/getNumberingListStyle';
import { NumberingListType } from 'roosterjs-content-model-core';

describe('getNumberingListStyle', () => {
    function runTest(
        listMarker: string,
        expectedResult?: number,
        previousListIndex?: number | undefined,
        previousListStyle?: number | undefined
    ) {
        const index = getNumberingListStyle(listMarker, previousListIndex, previousListStyle);
        expect(index).toBe(expectedResult);
    }

    it('1. ', () => {
        runTest('1.', NumberingListType.Decimal);
    });

    it('1- ', () => {
        runTest('1- ', NumberingListType.DecimalDash);
    });

    it('1) ', () => {
        runTest('1) ', NumberingListType.DecimalParenthesis);
    });

    it('(1) ', () => {
        runTest('(1) ', NumberingListType.DecimalDoubleParenthesis);
    });

    it('A.', () => {
        runTest('A. ', NumberingListType.UpperAlpha);
    });

    it('A- ', () => {
        runTest('A- ', NumberingListType.UpperAlphaDash);
    });

    it('A) ', () => {
        runTest('A) ', NumberingListType.UpperAlphaParenthesis);
    });

    it('(A) ', () => {
        runTest('(A) ', NumberingListType.UpperAlphaDoubleParenthesis);
    });

    it('a. ', () => {
        runTest('a. ', NumberingListType.LowerAlpha);
    });

    it('a- ', () => {
        runTest('a- ', NumberingListType.LowerAlphaDash);
    });

    it('a) ', () => {
        runTest('a) ', NumberingListType.LowerAlphaParenthesis);
    });

    it('(a) ', () => {
        runTest('(a) ', NumberingListType.LowerAlphaDoubleParenthesis);
    });

    it('i. ', () => {
        runTest('i. ', NumberingListType.LowerRoman);
    });

    it('i- ', () => {
        runTest('i- ', NumberingListType.LowerRomanDash);
    });

    it('i) ', () => {
        runTest('i) ', NumberingListType.LowerRomanParenthesis);
    });

    it('(i) ', () => {
        runTest('(i) ', NumberingListType.LowerRomanDoubleParenthesis);
    });

    it('I. ', () => {
        runTest('I. ', NumberingListType.UpperRoman);
    });

    it('I- ', () => {
        runTest('I- ', NumberingListType.UpperRomanDash);
    });

    it('I) ', () => {
        runTest('I) ', NumberingListType.UpperRomanParenthesis);
    });

    it('(I) ', () => {
        runTest('(I) ', NumberingListType.UpperRomanDoubleParenthesis);
    });

    it('4) ', () => {
        runTest('4) ', 3, NumberingListType.DecimalParenthesis);
    });

    it('1:1. ', () => {
        runTest('1:1. ', undefined);
    });

    it('30%). ', () => {
        runTest('30%). ', undefined);
    });

    it('4th. ', () => {
        runTest('4th. ', undefined);
    });

    it('30%) ', () => {
        runTest('30%) ', undefined);
    });
});
