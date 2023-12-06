import * as createRange from 'roosterjs-editor-dom/lib/selection/createRange';
import * as getSelectionPath from 'roosterjs-editor-dom/lib/selection/getSelectionPath';
import * as queryElements from 'roosterjs-editor-dom/lib/utils/queryElements';
import * as tableCellUtils from 'roosterjs-content-model-core/lib/publicApi/domUtils/tableCellUtils';
import { ContentMetadata, SelectionRangeTypes } from 'roosterjs-editor-types';
import { DOMSelection } from 'roosterjs-content-model-types';
import {
    convertDomSelectionToMetadata,
    convertDomSelectionToRangeEx,
    convertMetadataToDOMSelection,
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

describe('convertDomSelectionToMetadata', () => {
    let getSelectionPathSpy: jasmine.Spy;

    beforeEach(() => {
        getSelectionPathSpy = spyOn(getSelectionPath, 'default');
    });

    it('null selection', () => {
        const mockedDiv = 'DIV' as any;
        const result = convertDomSelectionToMetadata(mockedDiv, null);

        expect(result).toBeNull();
        expect(getSelectionPathSpy).not.toHaveBeenCalled();
    });

    it('range selection', () => {
        const mockedDiv = 'DIV' as any;
        const mockedRange = 'RANGE' as any;
        const mockedPathStart = 'START' as any;
        const mockedPathEnd = 'END' as any;

        const selection: DOMSelection = {
            type: 'range',
            range: mockedRange,
        };
        const mockedPath = {
            start: mockedPathStart,
            end: mockedPathEnd,
        } as any;

        getSelectionPathSpy.and.returnValue(mockedPath);
        const result = convertDomSelectionToMetadata(mockedDiv, selection);

        expect(result).toEqual({
            type: SelectionRangeTypes.Normal,
            isDarkMode: false,
            start: mockedPathStart,
            end: mockedPathEnd,
        });
        expect(getSelectionPathSpy).toHaveBeenCalledWith(mockedDiv, mockedRange);
    });

    it('image selection', () => {
        const mockedDiv = 'DIV' as any;
        const mockedImageId = 'IMAGEID';
        const mockedImage = {
            id: mockedImageId,
        } as any;

        const selection: DOMSelection = {
            type: 'image',
            image: mockedImage,
        };

        const result = convertDomSelectionToMetadata(mockedDiv, selection);

        expect(result).toEqual({
            type: SelectionRangeTypes.ImageSelection,
            isDarkMode: false,
            imageId: mockedImageId,
        });
        expect(getSelectionPathSpy).not.toHaveBeenCalled();
    });

    it('table selection', () => {
        const mockedDiv = 'DIV' as any;
        const mockedTableId = 'TABLEID';
        const mockedTable = {
            id: mockedTableId,
        } as any;

        const selection: DOMSelection = {
            type: 'table',
            table: mockedTable,
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        };

        const result = convertDomSelectionToMetadata(mockedDiv, selection);

        expect(result).toEqual({
            type: SelectionRangeTypes.TableSelection,
            isDarkMode: false,
            tableId: mockedTableId,
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        });
        expect(getSelectionPathSpy).not.toHaveBeenCalled();
    });
});

describe('convertMetadataToDOMSelection', () => {
    let createRangeSpy = jasmine.createSpy('createRange');
    let queryElementsSpy = jasmine.createSpy('queryElements');

    beforeEach(() => {
        createRangeSpy = spyOn(createRange, 'default');
        queryElementsSpy = spyOn(queryElements, 'default');
    });

    it('null selection', () => {
        const mockedDiv = 'DIV' as any;
        const result = convertMetadataToDOMSelection(mockedDiv, undefined);

        expect(result).toBeNull();
        expect(createRangeSpy).not.toHaveBeenCalled();
        expect(queryElementsSpy).not.toHaveBeenCalled();
    });

    it('range selection', () => {
        const mockedDiv = 'DIV' as any;
        const mockedStartPath = 'START' as any;
        const mockedEndPath = 'END' as any;
        const mockedRange = 'RANGE' as any;
        const metadata: ContentMetadata = {
            type: SelectionRangeTypes.Normal,
            isDarkMode: false,
            start: mockedStartPath,
            end: mockedEndPath,
        };

        createRangeSpy.and.returnValue(mockedRange);

        const result = convertMetadataToDOMSelection(mockedDiv, metadata);

        expect(result).toEqual({
            type: 'range',
            range: mockedRange,
        });
        expect(createRangeSpy).toHaveBeenCalledWith(mockedDiv, mockedStartPath, mockedEndPath);
        expect(queryElementsSpy).not.toHaveBeenCalled();
    });

    it('image selection', () => {
        const mockedDiv = 'DIV' as any;
        const mockedImage = 'IMAGE' as any;
        const mockedImageId = 'IMAGEID';
        const metadata: ContentMetadata = {
            type: SelectionRangeTypes.ImageSelection,
            isDarkMode: false,
            imageId: mockedImageId,
        };

        queryElementsSpy.and.returnValue([mockedImage]);

        const result = convertMetadataToDOMSelection(mockedDiv, metadata);

        expect(result).toEqual({
            type: 'image',
            image: mockedImage,
        });
        expect(createRangeSpy).not.toHaveBeenCalled();
        expect(queryElementsSpy).toHaveBeenCalledWith(mockedDiv, '#' + mockedImageId);
    });

    it('table selection', () => {
        const mockedDiv = 'DIV' as any;
        const mockedTable = 'TABLE' as any;
        const mockedTableId = 'TABLEID';
        const metadata: ContentMetadata = {
            type: SelectionRangeTypes.TableSelection,
            isDarkMode: false,
            tableId: mockedTableId,
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };

        queryElementsSpy.and.returnValue([mockedTable]);

        const result = convertMetadataToDOMSelection(mockedDiv, metadata);

        expect(result).toEqual({
            type: 'table',
            table: mockedTable,
            firstColumn: 1,
            firstRow: 2,
            lastColumn: 3,
            lastRow: 4,
        });
        expect(createRangeSpy).not.toHaveBeenCalled();
        expect(queryElementsSpy).toHaveBeenCalledWith(mockedDiv, '#' + mockedTableId);
    });
});
