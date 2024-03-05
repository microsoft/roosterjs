import * as applyTableFormat from 'roosterjs-content-model-core/lib/publicApi/table/applyTableFormat';
import * as ensureFocusableParagraphForTable from '../../../lib/modelApi/table/ensureFocusableParagraphForTable';
import * as hasSelectionInBlock from 'roosterjs-content-model-core/lib/publicApi/selection/hasSelectionInBlock';
import * as normalizeTable from 'roosterjs-content-model-core/lib/publicApi/table/normalizeTable';
import { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';
import { formatTableWithContentModel } from '../../../lib/publicApi/utils/formatTableWithContentModel';
import {
    createContentModelDocument,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';

describe('formatTableWithContentModel', () => {
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let model: ContentModelDocument;
    let formatResult: boolean | undefined;

    beforeEach(() => {
        formatResult = undefined;
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function) => {
                formatResult = callback(model);
            });
        editor = {
            formatContentModel: formatContentModelSpy,
        } as any;
    });

    it('Empty model', () => {
        model = createContentModelDocument();
        const callback = jasmine.createSpy('callback');

        formatTableWithContentModel(editor, 'editTable', callback);

        expect(callback).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'editTable',
            selectionOverride: undefined,
        });
        expect(formatResult).toBeFalse();
    });

    it('Model with table but not selected', () => {
        model = createContentModelDocument();
        const table = createTable(1);
        const tableCell = createTableCell();

        table.rows[0].cells.push(tableCell);
        model.blocks.push(table);

        const callback = jasmine.createSpy('callback');

        formatTableWithContentModel(editor, 'editTable', callback);

        expect(callback).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'editTable',
            selectionOverride: undefined,
        });
        expect(formatResult).toBeFalse();
    });

    it('Model with selected table, has selection in block, no metadata', () => {
        model = createContentModelDocument();
        const table = createTable(1);
        const tableCell = createTableCell();

        tableCell.isSelected = true;

        table.rows[0].cells.push(tableCell);
        model.blocks.push(table);

        spyOn(hasSelectionInBlock, 'hasSelectionInBlock').and.returnValue(true);
        spyOn(ensureFocusableParagraphForTable, 'ensureFocusableParagraphForTable');
        spyOn(normalizeTable, 'normalizeTable');
        spyOn(applyTableFormat, 'applyTableFormat');

        const callback = jasmine.createSpy('callback');

        formatTableWithContentModel(editor, 'editTable', callback);

        expect(callback).toHaveBeenCalledWith(table);
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'editTable',
            selectionOverride: undefined,
        });
        expect(
            ensureFocusableParagraphForTable.ensureFocusableParagraphForTable
        ).not.toHaveBeenCalled();
        expect(normalizeTable.normalizeTable).toHaveBeenCalledWith(table, undefined);
        expect(applyTableFormat.applyTableFormat).not.toHaveBeenCalled();
        expect(formatResult).toBeTrue();
    });

    it('Model with selected table, no selection in block, no metadata', () => {
        model = createContentModelDocument();
        const table = createTable(1);
        const tableCell = createTableCell();

        tableCell.isSelected = true;

        table.rows[0].cells.push(tableCell);
        model.blocks.push(table);

        spyOn(hasSelectionInBlock, 'hasSelectionInBlock').and.returnValue(false);
        spyOn(
            ensureFocusableParagraphForTable,
            'ensureFocusableParagraphForTable'
        ).and.callThrough();
        spyOn(normalizeTable, 'normalizeTable');
        spyOn(applyTableFormat, 'applyTableFormat');

        const callback = jasmine.createSpy('callback');

        formatTableWithContentModel(editor, 'editTable', callback);

        expect(callback).toHaveBeenCalledWith(table);
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'editTable',
            selectionOverride: undefined,
        });
        expect(
            ensureFocusableParagraphForTable.ensureFocusableParagraphForTable
        ).toHaveBeenCalledWith(model, [model], table);
        expect(normalizeTable.normalizeTable).toHaveBeenCalledWith(table, undefined);
        expect(applyTableFormat.applyTableFormat).not.toHaveBeenCalled();
        expect(formatResult).toBeTrue();
        expect(tableCell).toEqual({
            blockGroupType: 'TableCell',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        });
    });

    it('Model with selected table, no selection in block, has metadata', () => {
        model = createContentModelDocument();
        const table = createTable(1);
        const tableCell = createTableCell();

        tableCell.isSelected = true;

        table.dataset.editingInfo = '{}';
        table.rows[0].cells.push(tableCell);
        model.blocks.push(table);

        spyOn(hasSelectionInBlock, 'hasSelectionInBlock').and.returnValue(false);
        spyOn(
            ensureFocusableParagraphForTable,
            'ensureFocusableParagraphForTable'
        ).and.callThrough();
        spyOn(normalizeTable, 'normalizeTable');
        spyOn(applyTableFormat, 'applyTableFormat');

        const callback = jasmine.createSpy('callback');

        formatTableWithContentModel(editor, 'editTable', callback);

        expect(callback).toHaveBeenCalledWith(table);
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'editTable',
            selectionOverride: undefined,
        });
        expect(
            ensureFocusableParagraphForTable.ensureFocusableParagraphForTable
        ).toHaveBeenCalledWith(model, [model], table);
        expect(normalizeTable.normalizeTable).toHaveBeenCalledWith(table, undefined);
        expect(applyTableFormat.applyTableFormat).toHaveBeenCalledWith(table, undefined, true);
        expect(formatResult).toBeTrue();
        expect(tableCell).toEqual({
            blockGroupType: 'TableCell',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        });
    });

    it('With default format and additional parameters', () => {
        model = createContentModelDocument({
            fontSize: '10pt',
        });
        const table = createTable(1);
        const tableCell = createTableCell();

        tableCell.isSelected = true;

        table.dataset.editingInfo = '{}';
        table.rows[0].cells.push(tableCell);
        model.blocks.push(table);

        spyOn(hasSelectionInBlock, 'hasSelectionInBlock').and.returnValue(false);
        spyOn(
            ensureFocusableParagraphForTable,
            'ensureFocusableParagraphForTable'
        ).and.callThrough();
        spyOn(normalizeTable, 'normalizeTable');
        spyOn(applyTableFormat, 'applyTableFormat');

        const callback = jasmine.createSpy('callback');
        const mockedSelection = 'SELECTION' as any;

        formatTableWithContentModel(editor, 'editTable', callback, mockedSelection);

        expect(callback).toHaveBeenCalledWith(table);
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'editTable',
            selectionOverride: mockedSelection,
        });
        expect(
            ensureFocusableParagraphForTable.ensureFocusableParagraphForTable
        ).toHaveBeenCalledWith(model, [model], table);
        expect(normalizeTable.normalizeTable).toHaveBeenCalledWith(table, { fontSize: '10pt' });
        expect(applyTableFormat.applyTableFormat).toHaveBeenCalledWith(table, undefined, true);
        expect(formatResult).toBeTrue();
        expect(tableCell).toEqual({
            blockGroupType: 'TableCell',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: { fontSize: '10pt' },
                        },
                        {
                            segmentType: 'Br',
                            format: { fontSize: '10pt' },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontSize: '10pt',
                    },
                },
            ],
            format: {},
            spanLeft: false,
            spanAbove: false,
            isHeader: false,
            dataset: {},
        });
    });
});
