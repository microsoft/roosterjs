import { parseValueWithUnit } from '../../../lib/formatHandlers/utils/parseValueWithUnit';

describe('parseValueWithUnit with element', () => {
    function runTest(unit: string, results: number[]) {
        const mockedElement = ({
            ownerDocument: {
                defaultView: {
                    getComputedStyle: () => ({
                        fontSize: '15pt',
                    }),
                },
                querySelector: () => mockedElement,
            },
            offsetWidth: 1000,
        } as any) as HTMLElement;

        ['0', '1', '1.1', '-1.1'].forEach((value, i) => {
            const input = value + unit;
            const result = parseValueWithUnit(input, mockedElement);

            if (Number.isNaN(results[i])) {
                expect(result).toBeNaN();
            } else {
                expect(Math.abs(result - results[i])).toBeLessThan(1e-3, input);
            }
        });
    }

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

    it('rem', () => {
        runTest('rem', [0, 20, 22, -22]);
    });

    it('rem with root using root based style', () => {
        const results = [0, 32, 35.2, -35.2];
        const mockedElement = ({
            ownerDocument: {
                defaultView: {
                    getComputedStyle: () => ({
                        fontSize: '2rem',
                    }),
                },
                querySelector: () => mockedElement,
            },
            offsetWidth: 1000,
        } as any) as HTMLElement;

        ['0', '1', '1.1', '-1.1'].forEach((value, i) => {
            const input = value + 'rem';
            const context = <any>{
                rootDocumentFormat: {},
            };
            const result = parseValueWithUnit(input, mockedElement, 'px', context);

            if (Number.isNaN(results[i])) {
                expect(result).toBeNaN();
            } else {
                expect(result).toEqual(results[i], input);
            }
            expect(context).toEqual({
                rootDocumentFormat: {
                    fontSize: '2rem',
                },
            });
        });
    });

    it('no unit', () => {
        runTest('', [0, 0, 0, 0]);
    });

    it('unknown unit', () => {
        runTest('unknown', [0, 0, 0, 0]);
    });

    it('%', () => {
        runTest('% ', [0, 0.2, 0.22, -0.22]);
    });

    it('px to pt', () => {
        const result = parseValueWithUnit('16px', undefined, 'pt');

        expect(result).toBe(12);
    });

    it('pt to pt', () => {
        const result = parseValueWithUnit('16pt', undefined, 'pt');

        expect(result).toBe(16);
    });

    it('in to px', () => {
        runTest('in', [0, 96, 105.6, -105.6]);
    });
});

describe('parseValueWithUnit with number', () => {
    function runTest(unit: string, results: number[]) {
        ['0', '1', '1.1', '-1.1'].forEach((value, i) => {
            const input = value + unit;
            const result = parseValueWithUnit(input, 20);

            if (Number.isNaN(results[i])) {
                expect(result).toBeNaN();
            } else {
                expect(Math.abs(result - results[i])).toBeLessThan(1e-3, input);
            }
        });
    }

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
        runTest('% ', [0, 0.2, 0.22, -0.22]);
    });

    it('px to pt', () => {
        const result = parseValueWithUnit('16px', undefined, 'pt');

        expect(result).toBe(12);
    });

    it('pt to pt', () => {
        const result = parseValueWithUnit('16pt', undefined, 'pt');

        expect(result).toBe(16);
    });

    it('in to px', () => {
        runTest('in', [0, 96, 105.6, -105.6]);
    });
});
