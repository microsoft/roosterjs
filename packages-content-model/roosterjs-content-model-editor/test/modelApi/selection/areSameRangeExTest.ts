import { areSameRangeEx } from '../../../lib/modelApi/selection/areSameRangeEx';
import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';

describe('areSameRangeEx', () => {
    const startContainer = 'MockedStartContainer' as any;
    const endContainer = 'MockedEndContainer' as any;
    const startOffset = 1;
    const endOffset = 2;
    const table = 'MockedTable' as any;
    const image = 'MockedImage' as any;

    function runTest(r1: SelectionRangeEx, r2: SelectionRangeEx, result: boolean) {
        expect(areSameRangeEx(r1, r2)).toBe(result);
    }

    it('Same object', () => {
        const r = 'MockedRange' as any;
        runTest(r, r, true);
    });

    it('Same normal range', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            true
        );
    });

    it('Same table range', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            true
        );
    });

    it('Same image range', () => {
        runTest(
            {
                type: SelectionRangeTypes.ImageSelection,
                areAllCollapsed: true,
                ranges: [],
                image,
            },
            {
                type: SelectionRangeTypes.ImageSelection,
                areAllCollapsed: true,
                ranges: [],
                image,
            },
            true
        );
    });

    it('normal range and table range', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            false
        );
    });

    it('normal range and image range', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.ImageSelection,
                areAllCollapsed: true,
                ranges: [],
                image,
            },
            false
        );
    });

    it('table range and image range', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.ImageSelection,
                areAllCollapsed: true,
                ranges: [],
                image,
            },
            false
        );
    });

    it('different normal range - 1', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer: 'Container 2' as any,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            false
        );
    });

    it('different normal range - 2', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer: 'Container 2' as any,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            false
        );
    });

    it('different normal range - 3', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset: 3,
                        endOffset,
                    } as any,
                ],
            },
            false
        );
    });

    it('different normal range - 4', () => {
        runTest(
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset,
                    } as any,
                ],
            },
            {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [
                    {
                        startContainer,
                        endContainer,
                        startOffset,
                        endOffset: 4,
                    } as any,
                ],
            },
            false
        );
    });

    it('different table range - 1', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table: 'Table2' as any,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            false
        );
    });

    it('different table range - 2', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 0, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            false
        );
    });

    it('different table range - 2', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 0 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            false
        );
    });

    it('different table range - 3', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 0, y: 4 },
                },
            },
            false
        );
    });

    it('different table range - 4', () => {
        runTest(
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 4 },
                },
            },
            {
                type: SelectionRangeTypes.TableSelection,
                areAllCollapsed: true,
                ranges: [],
                table,
                coordinates: {
                    firstCell: { x: 1, y: 2 },
                    lastCell: { x: 3, y: 0 },
                },
            },
            false
        );
    });

    it('different image range', () => {
        runTest(
            {
                type: SelectionRangeTypes.ImageSelection,
                areAllCollapsed: true,
                ranges: [],
                image,
            },
            {
                type: SelectionRangeTypes.ImageSelection,
                areAllCollapsed: true,
                ranges: [],
                image: 'Image 2' as any,
            },
            false
        );
    });
});
