import * as getComputedStyles from 'roosterjs-editor-dom/lib/utils/getComputedStyles';
import { parseValueWithUnit } from '../../../lib/formatHandlers/utils/parseValueWithUnit';

describe('parseValueWithUnit', () => {
    function runTest(unit: string, results: number[]) {
        const mockedElement = {
            offsetWidth: 1000,
        } as HTMLElement;

        ['0', '1', '1.1', '-1.1'].forEach((value, i) => {
            const input = value + unit;
            const result = parseValueWithUnit(input, mockedElement);

            expect(result).toBe(results[i], input);
        });
    }

    beforeEach(() => {
        spyOn(getComputedStyles, 'getComputedStyle').and.returnValue('15pt');
    });

    it('empty', () => {
        expect(parseValueWithUnit()).toBe(0);
        expect(parseValueWithUnit('')).toBe(0);
        expect(parseValueWithUnit('', {} as HTMLElement)).toBe(0);
    });

    it('px', () => {
        runTest('px', [0, 1, 1.1, -1.1]);
    });

    it('pt', () => {
        runTest('pt', [0, 1.333, 1.467, -1.467]);
    });

    it('em', () => {
        runTest('em', [0, 20, 22, -22]);
    });

    it('ex', () => {
        runTest('ex', [0, 10, 11, -11]);
    });

    it('no unit', () => {
        runTest('', [0, 0, 0, 0]);
    });

    it('unknown unit', () => {
        runTest('unknown', [0, 0, 0, 0]);
    });

    it('%', () => {
        runTest('% ', [0, 10, 11, -11]);
    });

    it('px to pt', () => {
        const result = parseValueWithUnit('16px', undefined, 'pt');

        expect(result).toBe(12);
    });

    it('pt to pt', () => {
        const result = parseValueWithUnit('16pt', undefined, 'pt');

        expect(result).toBe(16);
    });
});
