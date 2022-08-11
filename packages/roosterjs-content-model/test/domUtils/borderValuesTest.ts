import { combineBorderValue, extractBorderValues } from '../../lib/domUtils/borderValues';

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

    it('Five values', () => {
        expect(extractBorderValues('test1 test2 test3 test4 test5')).toEqual([
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

describe('combineBorderValue', () => {
    it('empty array', () => {
        expect(combineBorderValue([], 'default')).toEqual('');
    });

    it('array with partial values', () => {
        expect(combineBorderValue(['a', undefined!, 'b'], 'default')).toEqual('a default b');
    });

    it('array with full values', () => {
        expect(combineBorderValue(['a', 'b', 'c', 'd'], 'default')).toEqual('a b c d');
    });

    it('array with extract values', () => {
        expect(combineBorderValue(['a', 'b', 'c', 'd', 'e'], 'default')).toEqual('a b c d');
    });
});
