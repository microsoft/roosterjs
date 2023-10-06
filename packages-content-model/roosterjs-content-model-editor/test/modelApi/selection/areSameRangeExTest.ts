import { areSameRangeEx } from '../../../lib/modelApi/selection/areSameRangeEx';
import { DOMSelection } from 'roosterjs-content-model-types';

describe('areSameRangeEx', () => {
    const startContainer = 'MockedStartContainer' as any;
    const endContainer = 'MockedEndContainer' as any;
    const startOffset = 1;
    const endOffset = 2;
    const table = 'MockedTable' as any;
    const image = 'MockedImage' as any;

    function runTest(r1: DOMSelection, r2: DOMSelection, result: boolean) {
        expect(areSameRangeEx(r1, r2)).toBe(result);
    }

    it('Same object', () => {
        const r = 'MockedRange' as any;
        runTest(r, r, true);
    });

    it('Same normal range', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            true
        );
    });

    it('Same table range', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                lastColumn: 3,
                firstRow: 2,
                lastRow: 4,
            },
            {
                type: 'table',
                table,
                firstColumn: 1,
                lastColumn: 3,
                firstRow: 2,
                lastRow: 4,
            },
            true
        );
    });

    it('Same image range', () => {
        runTest(
            {
                type: 'image',
                image,
            },
            {
                type: 'image',
                image,
            },
            true
        );
    });

    it('normal range and table range', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'table',
                table,
                firstColumn: 1,
                lastColumn: 3,
                firstRow: 2,
                lastRow: 4,
            },
            false
        );
    });

    it('normal range and image range', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'image',
                image,
            },
            false
        );
    });

    it('table range and image range', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            {
                type: 'image',
                image,
            },
            false
        );
    });

    it('different normal range - 1', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'range',
                range: {
                    startContainer: 'Container 2' as any,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            false
        );
    });

    it('different normal range - 2', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer: 'Container 2' as any,
                    startOffset,
                    endOffset,
                } as any,
            },
            false
        );
    });

    it('different normal range - 3', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset: 3,
                    endOffset,
                } as any,
            },
            false
        );
    });

    it('different normal range - 4', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
            },
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset: 4,
                } as any,
            },
            false
        );
    });

    it('different table range - 1', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            {
                type: 'table',
                table: 'Table2' as any,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            false
        );
    });

    it('different table range - 2', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            {
                type: 'table',
                table,
                firstColumn: 0,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            false
        );
    });

    it('different table range - 2', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 0,
                lastColumn: 3,
                lastRow: 4,
            },
            false
        );
    });

    it('different table range - 3', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 0,
                lastRow: 4,
            },
            false
        );
    });

    it('different table range - 4', () => {
        runTest(
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 4,
            },
            {
                type: 'table',
                table,
                firstColumn: 1,
                firstRow: 2,
                lastColumn: 3,
                lastRow: 0,
            },
            false
        );
    });

    it('different image range', () => {
        runTest(
            {
                type: 'image',
                image,
            },
            {
                type: 'image',
                image: 'Image 2' as any,
            },
            false
        );
    });
});
