import * as createRange from 'roosterjs-editor-dom/lib/selection/createRange';
import * as tableCellUtils from 'roosterjs-content-model-core/lib/publicApi/domUtils/tableCellUtils';
import { DOMSelection } from 'roosterjs-content-model-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    convertDomSelectionToRangeEx,
    convertRangeExToDomSelection,
    createTableRanges,
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
            isReverted: false,
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
            isReverted: false,
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

describe('createTableRanges', () => {
    function runTest(
        html: string,
        firstRow: number,
        firstColumn: number,
        lastRow: number,
        lastColumn: number,
        expectedIds: (string | null)[]
    ) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const table = div.firstChild as HTMLTableElement;

        const selection: DOMSelection = {
            type: 'table',
            table: table,
            firstColumn,
            firstRow,
            lastColumn,
            lastRow,
        };

        const result = createTableRanges(selection);
        const idResult = result.map(range => {
            const startContainer = range.startContainer.childNodes[range.startOffset];
            const endContainer = range.endContainer.childNodes[range.endOffset - 1];

            return startContainer == endContainer ? (startContainer as HTMLElement).id : null;
        });

        expect(idResult).toEqual(expectedIds);
    }

    it('empty table', () => {
        runTest('<table></table>', 0, 0, 0, 0, []);
    });

    it('1*1 table, no selection', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', -1, -1, -1, -1, []);
    });

    it('1*1 table, has selection', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', 0, 0, 0, 0, ['td1']);
    });

    it('2*2 table, has sub selection', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            0,
            1,
            1,
            1,
            ['td2', 'td4']
        );
    });

    it('table with merged row - 1', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            0,
            0,
            1,
            0,
            ['td1']
        );
    });

    it('table with merged row - 2', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            0,
            1,
            1,
            1,
            ['td2', 'td4']
        );
    });

    it('table with merged col - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            0,
            0,
            0,
            1,
            ['td1']
        );
    });

    it('table with merged col - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            1,
            0,
            1,
            1,
            ['td3', 'td4']
        );
    });

    it('table with all merged cell - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>',
            0,
            0,
            0,
            0,
            ['td1']
        );
    });

    it('table with all merged cell - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>',
            1,
            1,
            1,
            1,
            []
        );
    });

    it('table with variant lengths columns', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td><td id="td5"></td></tr></table>',
            0,
            1,
            1,
            2,
            ['td2', 'td4', 'td5']
        );
    });

    it('table with complex merged cells - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            0,
            0,
            0,
            2,
            ['td1', 'td3']
        );
    });

    it('table with complex merged cells - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            1,
            0,
            1,
            2,
            ['td4', 'td5']
        );
    });

    it('table with complex merged cells - 3', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            1,
            1,
            2,
            2,
            ['td5', 'td8']
        );
    });

    it('table with complex merged cells - 4', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            0,
            0,
            2,
            2,
            ['td1', 'td3', 'td4', 'td5', 'td8']
        );
    });
});
