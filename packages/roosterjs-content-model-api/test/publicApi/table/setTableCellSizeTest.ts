import * as normalizeTable from 'roosterjs-content-model-dom/lib/modelApi/editing/normalizeTable';
import { setTableCellSize } from '../../../lib/publicApi/table/setTableCellSize';
import {
    contentModelToDom,
    createContentModelDocument,
    createModelToDomContext,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelTable,
    IEditor,
} from 'roosterjs-content-model-types';

describe('setTableCellSize', () => {
    let editor: jasmine.SpyObj<IEditor>;
    let model: ContentModelDocument;
    let table: ContentModelTable;
    let result: boolean | undefined;

    beforeEach(() => {
        spyOn(normalizeTable, 'normalizeTable');
        editor = jasmine.createSpyObj<IEditor>('editor', ['focus', 'formatContentModel']);
        model = createContentModelDocument();
        table = createTable(2);
        table.widths = [100, 120, 140];
        table.rows.forEach(row => {
            row.height = 40;
            row.cells = [createTableCell(), createTableCell(), createTableCell()];
        });
        model.blocks.push(table);
        editor.formatContentModel.and.callFake(callback => {
            result = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
            });
        });
    });

    it('sets both dimensions for a selected cell and preserves selection', () => {
        table.rows[0].cells[1].isSelected = true;

        setTableCellSize(editor, 60, 80);

        expect(table.rows.map(row => row.height)).toEqual([60, 40]);
        expect(table.widths).toEqual([100, 80, 140]);
        expect(table.rows[0].cells[1].isSelected).toBeTrue();
        expect(result).toBeTrue();
        expect(editor.focus).toHaveBeenCalledTimes(1);
        expect(editor.formatContentModel).toHaveBeenCalledWith(
            jasmine.any(Function),
            { apiName: 'setTableCellSize' },
            { recalculateTableSize: 'selected' }
        );
    });

    it('sets height only for a caret inside a cell', () => {
        const paragraph = createParagraph();
        paragraph.segments.push(createSelectionMarker());
        table.rows[1].cells[2].blocks.push(paragraph);

        setTableCellSize(editor, 75);

        expect(table.rows.map(row => row.height)).toEqual([40, 75]);
        expect(table.widths).toEqual([100, 120, 140]);
        expect(result).toBeTrue();
    });

    it('sets width only for multiple selected rows and columns', () => {
        table.rows[0].cells[0].isSelected = true;
        table.rows[1].cells[1].isSelected = true;

        setTableCellSize(editor, undefined, 90.5);

        expect(table.rows.map(row => row.height)).toEqual([40, 40]);
        expect(table.widths).toEqual([90.5, 90.5, 140]);
        expect(result).toBeTrue();
    });

    it('clamps dimensions to the resizer minimums', () => {
        table.rows[0].cells[0].isSelected = true;

        setTableCellSize(editor, 1, 1);

        expect(table.rows[0].height).toBe(22);
        expect(table.widths[0]).toBe(30);
    });

    it('invalidates cached table, rows and cells, including unselected cells', () => {
        table.cachedElement = document.createElement('table');
        table.rows.forEach(row => {
            row.cachedElement = document.createElement('tr');
            row.cells.forEach(cell => (cell.cachedElement = document.createElement('td')));
        });
        table.rows[0].cells[0].isSelected = true;
        table.format.width = '360px';
        table.format.height = '80px';

        setTableCellSize(editor, 50, 150);

        expect(table.cachedElement).toBeUndefined();
        expect(table.format.width).toBeUndefined();
        expect(table.format.height).toBeUndefined();
        table.rows.forEach(row => {
            expect(row.cachedElement).toBeUndefined();
            row.cells.forEach(cell => {
                expect(cell.cachedElement).toBeUndefined();
                expect(cell.format.useBorderBox).toBeTrue();
            });
        });
    });

    it('preserves the table size constraint for an unchanged dimension', () => {
        table.rows[0].cells[0].isSelected = true;
        table.format.width = '360px';
        table.format.height = '80px';

        setTableCellSize(editor, 55);

        expect(table.format.width).toBe('360px');
        expect(table.format.height).toBeUndefined();
    });

    it('replaces explicit cell sizes in the DOM, including cells sharing a row or column', () => {
        table.rows[0].cells[1].isSelected = true;
        table.rows.forEach(row =>
            row.cells.forEach((cell, column) => {
                cell.format.width = table.widths[column] + 'px';
                cell.format.height = '40px';
            })
        );

        setTableCellSize(editor, 65, 85);

        const div = document.createElement('div');
        contentModelToDom(document, div, model, createModelToDomContext());
        const cells = div.querySelectorAll('td');

        expect(cells[0].style.width).toBe('100px');
        expect(cells[0].style.height).toBe('65px');
        expect(cells[1].style.width).toBe('85px');
        expect(cells[1].style.height).toBe('65px');
        expect(cells[4].style.width).toBe('85px');
        expect(cells[4].style.height).toBe('40px');
    });

    it('resizes the underlying columns of a merged cell selected by a caret', () => {
        const paragraph = createParagraph();
        paragraph.segments.push(createSelectionMarker());
        table.rows[0].cells[0].blocks.push(paragraph);
        table.rows[0].cells[1].spanLeft = true;

        setTableCellSize(editor, undefined, 80);

        expect(table.widths).toEqual([80, 80, 140]);
        expect(table.rows[0].cells[1].spanLeft).toBeTrue();
        const div = document.createElement('div');
        contentModelToDom(document, div, model, createModelToDomContext());

        expect(div.querySelector('td').colSpan).toBe(2);
        expect(div.querySelector('td').style.width).toBe('160px');
    });

    it('resizes the underlying rows of a vertically merged selected cell', () => {
        table.rows[0].cells[0].isSelected = true;
        table.rows[1].cells[0].spanAbove = true;

        setTableCellSize(editor, 60);

        expect(table.rows.map(row => row.height)).toEqual([60, 60]);
        expect(table.rows[1].cells[0].spanAbove).toBeTrue();
        const div = document.createElement('div');
        contentModelToDom(document, div, model, createModelToDomContext());

        expect(div.querySelector('td').rowSpan).toBe(2);
        expect(div.querySelector('td').style.height).toBe('120px');
    });

    it('does not change a table without selection', () => {
        setTableCellSize(editor, 60, 80);

        expect(result).toBeFalse();
        expect(table.widths).toEqual([100, 120, 140]);
        expect(table.rows.map(row => row.height)).toEqual([40, 40]);
    });

    it('does not change an empty document', () => {
        model.blocks = [];

        setTableCellSize(editor, 60, 80);

        expect(result).toBeFalse();
        expect(model.blocks).toEqual([]);
    });

    it('does not change anything when both dimensions are omitted', () => {
        table.rows[0].cells[0].isSelected = true;

        setTableCellSize(editor);

        expect(result).toBeFalse();
        expect(table.widths).toEqual([100, 120, 140]);
    });

    [0, -1].forEach(size => {
        it(`clamps dimensions below the resizer minimums (${size}) without throwing`, () => {
            table.rows[0].cells[0].isSelected = true;

            expect(() => setTableCellSize(editor, size, size)).not.toThrow();

            expect(table.rows[0].height).toBe(22);
            expect(table.widths[0]).toBe(30);
            expect(result).toBeTrue();
        });
    });
});
