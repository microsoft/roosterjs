import { areSameSelections } from '../../../lib/corePlugin/cache/areSameSelections';
import { CacheSelection, DOMSelection } from 'roosterjs-content-model-types';

describe('areSameSelections', () => {
    const startContainer = 'MockedStartContainer' as any;
    const endContainer = 'MockedEndContainer' as any;
    const startOffset = 1;
    const endOffset = 2;
    const table = 'MockedTable' as any;
    const image = 'MockedImage' as any;

    function runTest(r1: DOMSelection, r2: DOMSelection | CacheSelection, result: boolean) {
        expect(areSameSelections(r1, r2)).toBe(result);
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
                isReverted: false,
            },
            {
                type: 'range',
                start: {
                    node: startContainer,
                    offset: startOffset,
                },
                end: {
                    node: endContainer,
                    offset: endOffset,
                },
                isReverted: false,
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
                isReverted: false,
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
                isReverted: false,
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
                isReverted: false,
            },
            {
                type: 'range',
                start: {
                    node: 'Container 2' as any,
                    offset: startOffset,
                },
                end: {
                    node: endContainer,
                    offset: endOffset,
                },
                isReverted: false,
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
                isReverted: false,
            },
            {
                type: 'range',
                start: {
                    node: startContainer,
                    offset: startOffset,
                },
                end: {
                    node: 'Container 2' as any,
                    offset: endOffset,
                },
                isReverted: false,
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
                isReverted: false,
            },
            {
                type: 'range',
                start: {
                    node: startContainer,
                    offset: 3,
                },
                end: {
                    node: endContainer,
                    offset: endOffset,
                },
                isReverted: false,
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
                isReverted: false,
            },
            {
                type: 'range',
                start: {
                    node: startContainer,
                    offset: startOffset,
                },
                end: {
                    node: endContainer,
                    offset: 4,
                },
                isReverted: false,
            },
            false
        );
    });

    it('different normal range - 5', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
                isReverted: false,
            },
            {
                type: 'range',
                range: {
                    startContainer: 'Container 2' as any,
                    startOffset: startOffset,
                    endContainer: endContainer,
                    endOffset: endOffset,
                } as any,
                isReverted: false,
            },
            false
        );
    });

    it('different normal range - 6', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
                isReverted: false,
            },
            {
                type: 'range',
                range: {
                    startContainer: startContainer,
                    startOffset: startOffset,
                    endContainer: 'Container 2' as any,
                    endOffset: endOffset,
                } as any,
                isReverted: false,
            },
            false
        );
    });

    it('different normal range - 7', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
                isReverted: false,
            },
            {
                type: 'range',
                range: {
                    startContainer: startContainer,
                    startOffset: 3,
                    endContainer: endContainer,
                    endOffset: endOffset,
                } as any,
                isReverted: false,
            },
            false
        );
    });

    it('different normal range - 8', () => {
        runTest(
            {
                type: 'range',
                range: {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                } as any,
                isReverted: false,
            },
            {
                type: 'range',
                range: {
                    startContainer: startContainer,
                    startOffset: startOffset,
                    endContainer: endContainer,
                    endOffset: 4,
                } as any,
                isReverted: false,
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
