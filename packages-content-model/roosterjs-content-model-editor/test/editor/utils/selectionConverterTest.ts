import * as createRange from 'roosterjs-editor-dom/lib/selection/createRange';
import * as tableCellUtils from 'roosterjs-content-model-core/lib/publicApi/domUtils/tableCellUtils';
import { DOMSelection } from 'roosterjs-content-model-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    convertDomSelectionToRangeEx,
    convertRangeExToDomSelection,
} from '../../../lib/editor/utils/selectionConverter';

describe('convertRangeExToDomSelection', () => {
    it('null selection', () => {
        const result = convertRangeExToDomSelection(null);

        expect(result).toBeNull();
    });

    it('range selection', () => {
        const mockedRange = 'RANGE' as any;
        const result = convertRangeExToDomSelection({
            type: SelectionRangeTypes.Normal,
            ranges: [mockedRange],
            areAllCollapsed: true,
        });

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
        });
    });

    it('range selection without range', () => {
        const result = convertRangeExToDomSelection({
            type: SelectionRangeTypes.Normal,
            ranges: [],
            areAllCollapsed: true,
        });

        expect(result).toBeNull();
    });

    it('image selection', () => {
        const mockedImage = 'Image' as any;
        const result = convertRangeExToDomSelection({
            type: SelectionRangeTypes.ImageSelection,
            ranges: [],
            image: mockedImage,
            areAllCollapsed: false,
        });

        expect(result).toEqual({
            type: 'image',
            image: mockedImage,
        });
    });

    it('table selection', () => {
        const mockedTable = 'Table' as any;
        const result = convertRangeExToDomSelection({
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            table: mockedTable,
            coordinates: {
                firstCell: {
                    x: 0,
                    y: 1,
                },
                lastCell: { x: 2, y: 3 },
            },
            areAllCollapsed: false,
        });

        expect(result).toEqual({
            type: 'table',
            table: mockedTable,
            firstColumn: 0,
            firstRow: 1,
            lastColumn: 2,
            lastRow: 3,
        });
    });

    it('table selection without coordinates', () => {
        const mockedTable = 'Table' as any;
        const result = convertRangeExToDomSelection({
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            table: mockedTable,
            coordinates: undefined,
            areAllCollapsed: false,
        });

        expect(result).toBeNull();
    });
});

describe('convertDomSelectionToRangeEx', () => {
    let createRangeSpy: jasmine.Spy;
    let tableCellUtilsSpy: jasmine.Spy;

    beforeEach(() => {
        createRangeSpy = spyOn(createRange, 'default');
        tableCellUtilsSpy = spyOn(tableCellUtils, 'createTableRanges');
    });

    it('null selection', () => {
        const result = convertDomSelectionToRangeEx(null);

        expect(result).toEqual({
            type: SelectionRangeTypes.Normal,
            ranges: [],
            areAllCollapsed: true,
        });
        expect(createRangeSpy).not.toHaveBeenCalled();
    });

    it('range selection', () => {
        const mockedRange = {
            collapsed: false,
        } as any;
        const result = convertDomSelectionToRangeEx({
            type: 'range',
            range: mockedRange,
        });

        expect(result).toEqual({
            type: SelectionRangeTypes.Normal,
            ranges: [mockedRange],
            areAllCollapsed: false,
        });
        expect(createRangeSpy).not.toHaveBeenCalled();
    });

    it('image selection', () => {
        const mockedImage = 'IMAGE' as any;
        const mockedRange = 'RANGE' as any;

        createRangeSpy.and.returnValue(mockedRange);

        const result = convertDomSelectionToRangeEx({
            type: 'image',
            image: mockedImage,
        });

        expect(result).toEqual({
            type: SelectionRangeTypes.ImageSelection,
            ranges: [mockedRange],
            image: mockedImage,
            areAllCollapsed: false,
        });
        expect(createRangeSpy).toHaveBeenCalledWith(mockedImage);
    });

    it('table selection', () => {
        const mockedTable = 'TABLE' as any;
        const mockedRanges = 'RANGE' as any;

        tableCellUtilsSpy.and.returnValue(mockedRanges);

        const selection: DOMSelection = {
            type: 'table',
            table: mockedTable,
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        };

        const result = convertDomSelectionToRangeEx(selection);

        expect(result).toEqual({
            type: SelectionRangeTypes.TableSelection,
            ranges: mockedRanges,
            table: mockedTable,
            areAllCollapsed: false,
            coordinates: {
                firstCell: { x: 1, y: 2 },
                lastCell: { x: 3, y: 4 },
            },
        });
        expect(tableCellUtilsSpy).toHaveBeenCalledWith(selection);
    });
});
