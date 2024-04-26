import { getOrderedListNumberStr } from '../../../lib/modelApi/list/getOrderedListNumberStr';
import { NumberingListType } from '../../../lib/constants/NumberingListType';

describe('getOrderedListNumberStr', () => {
    it('Decimal', () => {
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 1)).toBe('1');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 2)).toBe('2');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 5)).toBe('5');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 10)).toBe('10');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 20)).toBe('20');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 50)).toBe('50');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 100)).toBe('100');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 1000)).toBe('1000');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 10000)).toBe('10000');
        expect(getOrderedListNumberStr(NumberingListType.Decimal, 0)).toBe('0');
    });

    it('LowerAlpha', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 1)).toBe('a');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 2)).toBe('b');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 5)).toBe('e');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 10)).toBe('j');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 20)).toBe('t');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 50)).toBe('ax');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 100)).toBe('cv');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 1000)).toBe('all');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 10000)).toBe('ntp');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlpha, 0)).toBe('');
    });

    it('LowerAlphaDash', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 1)).toBe('a');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 2)).toBe('b');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 5)).toBe('e');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 10)).toBe('j');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 20)).toBe('t');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 50)).toBe('ax');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 100)).toBe('cv');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 1000)).toBe('all');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 10000)).toBe('ntp');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDash, 0)).toBe('');
    });

    it('LowerAlphaDoubleParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 1)).toBe('a');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 2)).toBe('b');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 5)).toBe('e');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 10)).toBe(
            'j'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 20)).toBe(
            't'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 50)).toBe(
            'ax'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 100)).toBe(
            'cv'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 1000)).toBe(
            'all'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 10000)).toBe(
            'ntp'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaDoubleParenthesis, 0)).toBe('');
    });

    it('LowerAlphaParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 1)).toBe('a');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 2)).toBe('b');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 5)).toBe('e');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 10)).toBe('j');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 20)).toBe('t');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 50)).toBe('ax');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 100)).toBe('cv');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 1000)).toBe('all');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 10000)).toBe('ntp');
        expect(getOrderedListNumberStr(NumberingListType.LowerAlphaParenthesis, 0)).toBe('');
    });

    it('UpperAlpha', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 1)).toBe('A');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 2)).toBe('B');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 5)).toBe('E');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 10)).toBe('J');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 20)).toBe('T');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 50)).toBe('AX');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 100)).toBe('CV');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 1000)).toBe('ALL');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 10000)).toBe('NTP');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlpha, 0)).toBe('');
    });

    it('UpperAlphaDash', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 1)).toBe('A');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 2)).toBe('B');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 5)).toBe('E');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 10)).toBe('J');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 20)).toBe('T');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 50)).toBe('AX');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 100)).toBe('CV');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 1000)).toBe('ALL');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 10000)).toBe('NTP');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDash, 0)).toBe('');
    });

    it('UpperAlphaDoubleParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 1)).toBe('A');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 2)).toBe('B');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 5)).toBe('E');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 10)).toBe(
            'J'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 20)).toBe(
            'T'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 50)).toBe(
            'AX'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 100)).toBe(
            'CV'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 1000)).toBe(
            'ALL'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 10000)).toBe(
            'NTP'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaDoubleParenthesis, 0)).toBe('');
    });

    it('UpperAlphaParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 1)).toBe('A');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 2)).toBe('B');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 5)).toBe('E');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 10)).toBe('J');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 20)).toBe('T');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 50)).toBe('AX');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 100)).toBe('CV');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 1000)).toBe('ALL');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 10000)).toBe('NTP');
        expect(getOrderedListNumberStr(NumberingListType.UpperAlphaParenthesis, 0)).toBe('');
    });

    it('LowerRoman', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 1)).toBe('i');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 2)).toBe('ii');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 5)).toBe('v');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 10)).toBe('x');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 20)).toBe('xx');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 50)).toBe('l');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 100)).toBe('c');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 1000)).toBe('m');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 10000)).toBe('mmmmmmmmmm');
        expect(getOrderedListNumberStr(NumberingListType.LowerRoman, 0)).toBe('');
    });

    it('LowerRomanDash', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 1)).toBe('i');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 2)).toBe('ii');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 5)).toBe('v');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 10)).toBe('x');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 20)).toBe('xx');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 50)).toBe('l');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 100)).toBe('c');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 1000)).toBe('m');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 10000)).toBe('mmmmmmmmmm');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDash, 0)).toBe('');
    });

    it('LowerRomanDoubleParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 1)).toBe('i');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 2)).toBe(
            'ii'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 5)).toBe('v');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 10)).toBe(
            'x'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 20)).toBe(
            'xx'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 50)).toBe(
            'l'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 100)).toBe(
            'c'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 1000)).toBe(
            'm'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 10000)).toBe(
            'mmmmmmmmmm'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanDoubleParenthesis, 0)).toBe('');
    });

    it('LowerRomanParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 1)).toBe('i');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 2)).toBe('ii');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 5)).toBe('v');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 10)).toBe('x');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 20)).toBe('xx');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 50)).toBe('l');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 100)).toBe('c');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 1000)).toBe('m');
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 10000)).toBe(
            'mmmmmmmmmm'
        );
        expect(getOrderedListNumberStr(NumberingListType.LowerRomanParenthesis, 0)).toBe('');
    });

    it('UpperRoman', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 1)).toBe('I');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 2)).toBe('II');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 5)).toBe('V');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 10)).toBe('X');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 20)).toBe('XX');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 50)).toBe('L');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 100)).toBe('C');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 1000)).toBe('M');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 10000)).toBe('MMMMMMMMMM');
        expect(getOrderedListNumberStr(NumberingListType.UpperRoman, 0)).toBe('');
    });

    it('UpperRomanDash', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 1)).toBe('I');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 2)).toBe('II');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 5)).toBe('V');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 10)).toBe('X');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 20)).toBe('XX');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 50)).toBe('L');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 100)).toBe('C');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 1000)).toBe('M');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 10000)).toBe('MMMMMMMMMM');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDash, 0)).toBe('');
    });

    it('UpperRomanDoubleParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 1)).toBe('I');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 2)).toBe(
            'II'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 5)).toBe('V');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 10)).toBe(
            'X'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 20)).toBe(
            'XX'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 50)).toBe(
            'L'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 100)).toBe(
            'C'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 1000)).toBe(
            'M'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 10000)).toBe(
            'MMMMMMMMMM'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanDoubleParenthesis, 0)).toBe('');
    });

    it('UpperRomanParenthesis', () => {
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 1)).toBe('I');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 2)).toBe('II');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 5)).toBe('V');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 10)).toBe('X');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 20)).toBe('XX');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 50)).toBe('L');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 100)).toBe('C');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 1000)).toBe('M');
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 10000)).toBe(
            'MMMMMMMMMM'
        );
        expect(getOrderedListNumberStr(NumberingListType.UpperRomanParenthesis, 0)).toBe('');
    });
});
