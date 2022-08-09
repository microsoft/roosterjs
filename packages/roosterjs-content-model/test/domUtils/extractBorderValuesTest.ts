import { extractBorderValues } from '../../lib/domUtils/extractBorderValues';

describe('extractBorderValues', () => {
    it('empty string', () => {
        expect(extractBorderValues('')).toEqual(['', '', '', '']);
    });

    it('Single value', () => {
        expect(extractBorderValues('test1')).toEqual(['test1', 'test1', 'test1', 'test1']);
    });

    it('Two values', () => {
        expect(extractBorderValues('test1 test2')).toEqual(['test1', 'test2', 'test1', 'test2']);
    });

    it('Three values', () => {
        expect(extractBorderValues('test1 test2 test3')).toEqual([
            'test1',
            'test2',
            'test3',
            'test2',
        ]);
    });

    it('Four values', () => {
        expect(extractBorderValues('test1 test2 test3 test4')).toEqual([
            'test1',
            'test2',
            'test3',
            'test4',
        ]);
    });

    it('value with ()', () => {
        expect(extractBorderValues('test1 ( ) test2 (test 3)')).toEqual([
            'test1',
            '( )',
            'test2',
            '(test 3)',
        ]);
    });

    it('value rgb', () => {
        expect(extractBorderValues('rgb(1, 2, 3) transparent')).toEqual([
            'rgb(1, 2, 3)',
            'transparent',
            'rgb(1, 2, 3)',
            'transparent',
        ]);
    });
});
