import parseColor from '../../lib/utils/parseColor';

describe('parseColor', () => {
    it('empty string', () => {
        const result = parseColor('');
        expect(result).toBe(null);
    });

    it('unrecognized color', () => {
        const result = parseColor('aaa');
        expect(result).toBe(null);
    });

    it('short hex 1', () => {
        const result = parseColor('#aaa');
        expect(result).toEqual([170, 170, 170]);
    });

    it('short hex 2', () => {
        const result = parseColor('#aaab');
        expect(result).toEqual(null);
    });

    it('short hex 3', () => {
        const result = parseColor('   #aaa   ');
        expect(result).toEqual([170, 170, 170]);
    });

    it('long hex 1', () => {
        const result = parseColor('#ababab');
        expect(result).toEqual([171, 171, 171]);
    });

    it('long hex 2', () => {
        const result = parseColor('#abababc');
        expect(result).toEqual(null);
    });

    it('long hex 3', () => {
        const result = parseColor('  #ababab  ');
        expect(result).toEqual([171, 171, 171]);
    });

    it('rgb 1', () => {
        const result = parseColor('rgb(1,2,3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 2', () => {
        const result = parseColor('   rgb(   1   ,   2  ,  3  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 3', () => {
        const result = parseColor('rgb(1.1, 2.2, 3.3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 1', () => {
        const result = parseColor('rgba(1, 2, 3, 4)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 2', () => {
        const result = parseColor('    rgba(   1.1   ,    2.2   ,  3.3  ,  4.4  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 3', () => {
        const result = parseColor('rgba(1.1, 2.2, 3.3, 4.4)');
        expect(result).toEqual([1, 2, 3]);
    });
});
