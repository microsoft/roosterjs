import * as iterateSelections from '../../../lib/modelApi/selection/iterateSelections';
import { applyTableFormat } from '../../../lib/modelApi/table/applyTableFormat';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { FormatState } from 'roosterjs-editor-types';
import { retrieveModelFormatState } from '../../../lib/modelApi/common/retrieveModelFormatState';

describe('retrieveModelFormatState', () => {
    const segmentFormat: ContentModelSegmentFormat = {
        backgroundColor: 'red',
        fontFamily: 'Arial',
        fontSize: '10px',
        fontWeight: 'bold',
        italic: true,
        strikethrough: true,
        superOrSubScriptSequence: 'super',
        textColor: 'green',
        underline: true,
    };

    const baseFormatResult: FormatState = {
        backgroundColor: 'red',
        fontName: 'Arial',
        fontSize: '10px',
        isBold: true,
        isItalic: true,
        isStrikeThrough: true,
        isSuperscript: true,
        isSubscript: false,
        textColor: 'green',
        isUnderline: true,
        canUnlink: false,
        canAddImageAltText: false,
    };

    it('Empty model', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({});
    });

    it('Single selection', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para = createParagraph();
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual(baseFormatResult);
    });

    it('Single selection with list', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para = createParagraph();
        const listItem = createListItem([{ listType: 'OL' }]);
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([listItem], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isBullet: false,
            isNumbering: true,
        });
    });

    it('Single selection with quote', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para = createParagraph();
        const quote = createQuote();
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([quote], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isBlockQuote: true,
        });
    });

    it('Single selection with header', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para = createParagraph(false, undefined, {
            format: {},
            tagName: 'h1',
        });
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            headerLevel: 1,
        });
    });

    it('Single selection with table', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph(false, undefined);
        const marker = createSelectionMarker(segmentFormat);

        table.cells[0].push(cell);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(
                path,
                {
                    table: table,
                    colIndex: 0,
                    rowIndex: 0,
                    isWholeTableSelected: false,
                },
                para,
                [marker]
            );
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isInTable: true,
            tableHasHeader: false,
        });
    });

    it('Single selection with table and format', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph(false, undefined);
        const marker = createSelectionMarker(segmentFormat);

        table.cells[0].push(cell);
        applyTableFormat(table);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(
                path,
                {
                    table: table,
                    colIndex: 0,
                    rowIndex: 0,
                    isWholeTableSelected: false,
                },
                para,
                [marker]
            );
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isInTable: true,
            tableHasHeader: false,
            tableFormat: {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: false,
                hasFirstColumn: false,
                hasBandedRows: false,
                hasBandedColumns: false,
                bgColorEven: null,
                bgColorOdd: '#ABABAB20',
                headerRowColor: '#ABABAB',
                tableBorderFormat: 0,
            },
        });
    });

    it('With table header', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell(false, false, true);

        table.cells[0].push(cell1, cell2);
        model.blocks.push(table);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, { table: table, rowIndex: 0, colIndex: 0, isWholeTableSelected: false });
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isInTable: true,
            tableHasHeader: true,
        });
    });

    it('Multiple selections', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para1 = createParagraph(false, undefined);
        const para2 = createParagraph(false, undefined);
        const marker1 = createSelectionMarker(segmentFormat);
        const marker2 = createSelectionMarker();

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, undefined, para1, [marker1]);
            callback(path, undefined, para2, [marker2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isMultilineSelection: true,
        });
    });

    it('Multiple selections with other types', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para1 = createParagraph(false, undefined);
        const divider = createDivider('hr');
        const marker1 = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, undefined, para1, [marker1]);
            callback(path, undefined, divider);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isMultilineSelection: true,
        });
    });

    it('First selection is of other types', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para1 = createParagraph(false, undefined);
        const divider = createDivider('hr');
        const marker1 = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, undefined, divider);
            callback(path, undefined, para1, [marker1]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isMultilineSelection: true,
        });
    });

    it('With pending format', () => {
        const model = createContentModelDocument();
        const result: FormatState = {};
        const para1 = createParagraph(false, undefined);
        const marker1 = createSelectionMarker(segmentFormat);
        const pendingFormat: ContentModelSegmentFormat = {
            backgroundColor: 'blue',
            fontFamily: 'Test',
            textColor: 'block',
        };

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(path, undefined, para1, [marker1]);
            return false;
        });

        retrieveModelFormatState(model, pendingFormat, result);

        expect(result).toEqual({
            fontName: 'Test',
            fontSize: undefined,
            backgroundColor: 'blue',
            textColor: 'block',
            isBold: false,
            isItalic: undefined,
            isUnderline: undefined,
            isStrikeThrough: undefined,
            isSuperscript: false,
            isSubscript: false,
            canUnlink: false,
            canAddImageAltText: false,
        });
    });
});
