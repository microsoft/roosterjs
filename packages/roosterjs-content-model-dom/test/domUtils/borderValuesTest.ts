import { combineBorderValue, extractBorderValues } from '../../lib/domUtils/borderValues';

describe('extractBorderValues', () => {
    it('undefined string', () => {
        expect(extractBorderValues(undefined)).toEqual({});
    });

    it('empty string', () => {
        expect(extractBorderValues('')).toEqual({});
    });

    it('Single value', () => {
        expect(extractBorderValues('test1')).toEqual({
            color: 'test1',
        });
    });

    it('Two values', () => {
        expect(extractBorderValues('test1 test2')).toEqual({
            color: 'test1',
        });
    });

    it('value with rgb color', () => {
        expect(extractBorderValues('rgb(1, 2, 3)')).toEqual({
            color: 'rgb(1,2,3)',
        });
    });

    it('value with style', () => {
        expect(extractBorderValues('none')).toEqual({
            style: 'none',
        });
    });

    it('value with width 1', () => {
        expect(extractBorderValues('thin')).toEqual({
            width: 'thin',
        });
    });

    it('value with width 2', () => {
        expect(extractBorderValues('2px')).toEqual({
            width: '2px',
        });
    });

    it('full value 1', () => {
        expect(extractBorderValues('red 2px solid')).toEqual({
            color: 'red',
            width: '2px',
            style: 'solid',
        });
    });

    it('full value 2', () => {
        expect(extractBorderValues('rgb(1, 2, 3) thick solid')).toEqual({
            color: 'rgb(1,2,3)',
            width: 'thick',
            style: 'solid',
        });
    });
});

describe('combineBorderValue', () => {
    it('empty array', () => {
        expect(combineBorderValue({})).toEqual('none');
    });

    it('array with partial values', () => {
        expect(
            combineBorderValue({
                color: 'red',
            })
        ).toEqual('red');
    });

    it('array with full values', () => {
        expect(
            combineBorderValue({
                color: 'rgb(1,2,3)',
                style: 'solid',
                width: 'thick',
            })
        ).toEqual('thick solid rgb(1,2,3)');
    });
});
