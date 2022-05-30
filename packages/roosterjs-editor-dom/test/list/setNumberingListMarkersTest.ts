import setNumberingListMarkers from '../../lib/list/setNumberingListMarkers';
import { NumberingListType } from 'roosterjs-editor-types';

describe('setNumberingListMarkers', () => {
    function runTest(bulletType: NumberingListType, level: number, expectedStyle: string) {
        const li = document.createElement('li');
        document.body.appendChild(li);
        li.style.removeProperty('list-style-type');
        setNumberingListMarkers(li, bulletType, level);
        expect(li.style.listStyleType).toBe(expectedStyle);
        document.body.removeChild(li);
    }

    it('1.', () => {
        runTest(NumberingListType.Decimal, 1, '"1. "');
    });

    it('1-', () => {
        runTest(NumberingListType.DecimalDash, 1, '"1- "');
    });

    it('1)', () => {
        runTest(NumberingListType.DecimalParenthesis, 1, '"1) "');
    });

    it('(1)', () => {
        runTest(NumberingListType.DecimalDoubleParenthesis, 1, '"(1) "');
    });

    it('b.', () => {
        runTest(NumberingListType.LowerAlpha, 2, '"b. "');
    });

    it('b-', () => {
        runTest(NumberingListType.LowerAlphaDash, 2, '"b- "');
    });

    it('b)', () => {
        runTest(NumberingListType.LowerAlphaParenthesis, 2, '"b) "');
    });

    it('(b)', () => {
        runTest(NumberingListType.LowerAlphaDoubleParenthesis, 2, '"(b) "');
    });

    it('B.', () => {
        runTest(NumberingListType.UpperAlpha, 2, '"B. "');
    });

    it('B-', () => {
        runTest(NumberingListType.UpperAlphaDash, 2, '"B- "');
    });

    it('B)', () => {
        runTest(NumberingListType.UpperAlphaParenthesis, 2, '"B) "');
    });

    it('(B)', () => {
        runTest(NumberingListType.UpperAlphaDoubleParenthesis, 2, '"(B) "');
    });

    it('iii.', () => {
        runTest(NumberingListType.LowerRoman, 3, '"iii. "');
    });

    it('iii-', () => {
        runTest(NumberingListType.LowerRomanDash, 3, '"iii- "');
    });

    it('iii)', () => {
        runTest(NumberingListType.LowerRomanParenthesis, 3, '"iii) "');
    });

    it('(iii)', () => {
        runTest(NumberingListType.LowerRomanDoubleParenthesis, 3, '"(iii) "');
    });

    it('IV.', () => {
        runTest(NumberingListType.UpperRoman, 4, '"IV. "');
    });

    it('IV-', () => {
        runTest(NumberingListType.UpperRomanDash, 4, '"IV- "');
    });

    it('IV)', () => {
        runTest(NumberingListType.UpperRomanParenthesis, 4, '"IV) "');
    });

    it('(IV)', () => {
        runTest(NumberingListType.UpperRomanDoubleParenthesis, 4, '"(IV) "');
    });
});
