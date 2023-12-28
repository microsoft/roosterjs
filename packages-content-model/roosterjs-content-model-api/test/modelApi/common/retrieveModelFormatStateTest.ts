import * as iterateSelections from 'roosterjs-content-model-core/lib/publicApi/selection/iterateSelections';
import { applyTableFormat } from 'roosterjs-content-model-core';
import { ContentModelFormatState, ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { retrieveModelFormatState } from '../../../lib/modelApi/common/retrieveModelFormatState';
import {
    addCode,
    addSegment,
    createContentModelDocument,
    createDivider,
    createFormatContainer,
    createImage,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

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

    const baseFormatResult: ContentModelFormatState = {
        backgroundColor: 'red',
        fontName: 'Arial',
        fontSize: '7.5pt',
        isBold: true,
        isItalic: true,
        isStrikeThrough: true,
        isSuperscript: true,
        isSubscript: false,
        textColor: 'green',
        isUnderline: true,
        canUnlink: false,
        canAddImageAltText: false,
        fontWeight: 'bold',
    };

    it('Empty model', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({});
    });

    it('Single selection', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({ ...baseFormatResult, isBlockQuote: false, isCodeInline: false });
    });

    it('Single selection with Code', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const marker = createSelectionMarker(segmentFormat);

        addCode(marker, { format: { fontFamily: 'monospace' } });

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isBlockQuote: false,
            fontName: 'monospace',
            isCodeInline: true,
        });
    });

    it('Single selection with list', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const listItem = createListItem([createListLevel('OL')]);
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([listItem], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isCodeInline: false,
            isBullet: false,
            isNumbering: true,
            isBlockQuote: false,
        });
    });

    it('Single selection with quote', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const quote = createFormatContainer('blockquote');
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([quote], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isCodeInline: false,
            isBlockQuote: true,
        });
    });

    it('Single selection with heading', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph(false, undefined, undefined, {
            format: {},
            tagName: 'h1',
        });
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            headingLevel: 1,
            isBlockQuote: false,
            isCodeInline: false,
        });
    });

    it('Single selection with margin format', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const paraFormat = {
            marginTop: '2px',
            marginBottom: '5px',
        };
        const para = createParagraph(false, paraFormat);
        const marker = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            ...paraFormat,
            isCodeInline: false,
            isBlockQuote: false,
        });
    });

    it('Single selection with table', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph(false, undefined);
        const marker = createSelectionMarker(segmentFormat);

        table.rows[0].cells.push(cell);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(
                [path],
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
            isCodeInline: false,
            isInTable: true,
            tableHasHeader: false,
            isBlockQuote: false,
        });
    });

    it('Single selection with table and format', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph(false, undefined);
        const marker = createSelectionMarker(segmentFormat);

        table.rows[0].cells.push(cell);
        applyTableFormat(table);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback(
                [path],
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
            isBlockQuote: false,
            isCodeInline: false,
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
                verticalAlign: null,
            },
        });
    });

    it('With table heading', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell(false, false, true);

        table.rows[0].cells.push(cell1, cell2);
        model.blocks.push(table);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], {
                table: table,
                rowIndex: 0,
                colIndex: 0,
                isWholeTableSelected: false,
            });
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isInTable: true,
            tableHasHeader: true,
            isBlockQuote: false,
        });
    });

    it('Multiple selection markers', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para1 = createParagraph(false, undefined);
        const para2 = createParagraph(false, undefined);
        const marker1 = createSelectionMarker(segmentFormat);
        const marker2 = createSelectionMarker();

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para1, [marker1]);
            callback([path], undefined, para2, [marker2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isCodeInline: false,
            canAddImageAltText: false,
            canUnlink: false,
            isBlockQuote: false,
            isSubscript: false,
            isMultilineSelection: true,
            isBold: true,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            fontName: 'Arial',
            isSuperscript: true,
            fontSize: '7.5pt',
            backgroundColor: 'red',
            textColor: 'green',
            fontWeight: 'bold',
        });
    });

    it('With multiple text selection in same format', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontFamily: 'Arial' });
        const text2 = createText('test2', { fontFamily: 'Arial' });
        const result: ContentModelFormatState = {};

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [text1, text2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            fontName: 'Arial',
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
        });
    });

    it('With multiple text selection in different format', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontFamily: 'Arial' });
        const text2 = createText('test2', { fontFamily: 'Times' });
        const result: ContentModelFormatState = {};

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [text1, text2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
        });
    });

    it('With multiple text selection in different format but second one is selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test1', { fontFamily: 'Arial' });
        const marker = createSelectionMarker({ fontFamily: 'Times' });
        const result: ContentModelFormatState = {};

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [text, marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
            fontName: 'Arial',
        });
    });

    it('Multiple selections with other types', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para1 = createParagraph(false, undefined);
        const divider = createDivider('hr');
        const marker1 = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para1, [marker1]);
            callback([path], undefined, divider);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isCodeInline: false,
            isMultilineSelection: true,
            isBlockQuote: false,
        });
    });

    it('First selection is of other types', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para1 = createParagraph(false, undefined);
        const divider = createDivider('hr');
        const marker1 = createSelectionMarker(segmentFormat);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, divider);
            callback([path], undefined, para1, [marker1]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            ...baseFormatResult,
            isCodeInline: false,
            isMultilineSelection: true,
            isBlockQuote: false,
        });
    });

    it('With pending format', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para1 = createParagraph(false, undefined);
        const marker1 = createSelectionMarker(segmentFormat);
        const pendingFormat: ContentModelSegmentFormat = {
            backgroundColor: 'blue',
            fontFamily: 'Test',
            textColor: 'block',
        };

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para1, [marker1]);
            return false;
        });

        retrieveModelFormatState(model, pendingFormat, result);

        expect(result).toEqual({
            fontName: 'Test',
            backgroundColor: 'blue',
            textColor: 'block',
            isBold: true,
            isSuperscript: true,
            isSubscript: false,
            canUnlink: false,
            canAddImageAltText: false,
            isBlockQuote: false,
            isCodeInline: false,
            isItalic: true,
            isUnderline: true,
            isStrikeThrough: true,
            fontSize: '7.5pt',
            fontWeight: 'bold',
        });
    });

    it('With single table cell selected', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const table = createTable(1);

        cell2.isSelected = true;
        table.rows[0] = { format: {}, height: 0, cells: [cell1, cell2, cell3] };
        model.blocks.push(table);

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isInTable: true,
            tableHasHeader: false,
            isBlockQuote: false,
        });
    });

    it('With multiple table cell selected', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const table = createTable(1);

        cell2.isSelected = true;
        cell3.isSelected = true;
        table.rows[0] = { format: {}, height: 0, cells: [cell1, cell2, cell3] };
        model.blocks.push(table);

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isInTable: true,
            tableHasHeader: false,
            isMultilineSelection: true,
            canMergeTableCell: true,
            isBlockQuote: false,
        });
    });

    it('With multiple table cell selected, multiple content is in table cell', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const table = createTable(1);

        const text1 = createText('text1');
        const text2 = createText('text2');
        const text3 = createText('text3');
        const text4 = createText('text4');

        cell2.isSelected = true;
        cell3.isSelected = true;

        addSegment(cell2, text1);
        addSegment(cell2, text2);
        addSegment(cell3, text3);
        addSegment(cell3, text4);

        table.rows[0] = { format: {}, height: 0, cells: [cell1, cell2, cell3] };
        model.blocks.push(table);

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isInTable: true,
            tableHasHeader: false,
            isMultilineSelection: true,
            canMergeTableCell: true,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            canUnlink: false,
            canAddImageAltText: false,
            isBlockQuote: false,
            isCodeInline: false,
        });
    });

    it('With selection marker under table cell', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();
        const table = createTable(1);

        const marker = createSelectionMarker();
        addSegment(cell2, marker);

        table.rows[0] = { format: {}, height: 0, cells: [cell1, cell2, cell3] };
        model.blocks.push(table);

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            canUnlink: false,
            canAddImageAltText: false,
            isInTable: true,
            tableHasHeader: false,
            isBlockQuote: false,
            isCodeInline: false,
        });
    });

    it('With selection under image', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const image = createImage('test', {
            borderTop: 'solid 2px red',
        });
        image.isSelected = true;
        para.segments.push(image);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [image]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: true,
            imageFormat: {
                borderColor: 'red',
                borderWidth: '2px',
                borderStyle: 'solid',
                boxShadow: undefined,
                borderRadius: undefined,
            },
        });
    });

    it('With multiple image selection', () => {
        const model = createContentModelDocument();
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const image = createImage('test', {
            borderTop: 'solid 2px red',
        });
        const image2 = createImage('test', {
            borderTop: 'solid 2px blue',
        });
        image.isSelected = true;
        image2.isSelected = true;
        para.segments.push(image);
        para.segments.push(image2);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [image, image2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: true,
            imageFormat: undefined,
        });
    });

    it('With default format but no format in body', () => {
        const model = createContentModelDocument({
            fontFamily: 'Arial',
            fontSize: '12px',
        });
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const marker = createSelectionMarker();
        para.segments.push(marker);

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [marker]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            fontName: 'Arial',
            fontSize: '9pt',
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
        });
    });

    it('With default format and other different format', () => {
        const model = createContentModelDocument({
            fontFamily: 'Arial',
            fontSize: '12px',
            underline: true,
            fontWeight: 'bold',
            italic: true,
        });
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const text1 = createText('test1', { fontFamily: 'Tahoma', fontSize: '15px' });
        para.segments.push(text1);

        text1.isSelected = true;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [text1]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            fontSize: '11.25pt',
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
            fontName: 'Tahoma',
        });
    });

    it('With default format and other different format', () => {
        const model = createContentModelDocument({
            fontFamily: 'Arial',
            fontSize: '12px',
        });
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2', { fontFamily: 'Tahoma', fontSize: '12px' });
        para.segments.push(text1, text2);

        text1.isSelected = true;
        text2.isSelected = true;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [text1, text2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            fontSize: '9pt',
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
        });
    });

    it('With same format but using px and pt', () => {
        const model = createContentModelDocument({});
        const result: ContentModelFormatState = {};
        const para = createParagraph();
        const text1 = createText('test1', { fontSize: '16pt' });
        const text2 = createText('test2', { fontSize: '21.3333px' });
        para.segments.push(text1, text2);

        text1.isSelected = true;
        text2.isSelected = true;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((path, callback) => {
            callback([path], undefined, para, [text1, text2]);
            return false;
        });

        retrieveModelFormatState(model, null, result);

        expect(result).toEqual({
            isBlockQuote: false,
            isBold: false,
            isSuperscript: false,
            isSubscript: false,
            fontSize: '16pt',
            isCodeInline: false,
            canUnlink: false,
            canAddImageAltText: false,
        });
    });
});
