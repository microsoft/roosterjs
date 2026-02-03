import * as alignTable from '../../../lib/modelApi/table/alignTable';
import * as alignTableCell from '../../../lib/modelApi/table/alignTableCell';
import * as deleteTable from '../../../lib/modelApi/table/deleteTable';
import * as deleteTableColumn from '../../../lib/modelApi/table/deleteTableColumn';
import * as deleteTableRow from '../../../lib/modelApi/table/deleteTableRow';
import * as formatTableWithContentModel from '../../../lib/publicApi/utils/formatTableWithContentModel';
import * as insertTableColumn from '../../../lib/modelApi/table/insertTableColumn';
import * as insertTableRow from '../../../lib/modelApi/table/insertTableRow';
import * as mergeTableCells from '../../../lib/modelApi/table/mergeTableCells';
import * as mergeTableColumn from '../../../lib/modelApi/table/mergeTableColumn';
import * as mergeTableRow from '../../../lib/modelApi/table/mergeTableRow';
import * as shiftCells from '../../../lib/modelApi/table/shiftCells';
import * as splitTableCellHorizontally from '../../../lib/modelApi/table/splitTableCellHorizontally';
import * as splitTableCellVertically from '../../../lib/modelApi/table/splitTableCellVertically';
import { editTable } from '../../../lib/publicApi/table/editTable';
import { IEditor, TableOperation } from 'roosterjs-content-model-types';

describe('editTable', () => {
    let editor: IEditor;
    let focusSpy: jasmine.Spy;
    let formatTableWithContentModelSpy: jasmine.Spy;
    let getEnvironmentSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    const mockedTable = 'TABLE' as any;

    function runTest(operation: TableOperation, expectedSpy: jasmine.Spy, ...parameters: string[]) {
        editTable(editor, operation);

        expect(formatTableWithContentModelSpy).toHaveBeenCalledWith(
            editor,
            'editTable',
            jasmine.anything()
        );
        expect(expectedSpy).toHaveBeenCalledWith(mockedTable, ...parameters);
        expect(getDOMSelectionSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    }

    beforeEach(() => {
        focusSpy = jasmine.createSpy('focus');
        getEnvironmentSpy = jasmine.createSpy('getEnvironment').and.returnValue({});
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        formatTableWithContentModelSpy = spyOn(
            formatTableWithContentModel,
            'formatTableWithContentModel'
        ).and.callFake((editorParam, apiParam, callback) => {
            callback(mockedTable);
        });

        editor = {
            focus: focusSpy,
            getEnvironment: getEnvironmentSpy,
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
        } as any;
    });

    describe('alignTableCellHorizontally', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(alignTableCell, 'alignTableCellHorizontally');
        });

        it('alignCellLeft', () => {
            runTest('alignCellLeft', spy, 'alignCellLeft');
        });

        it('alignCellCenter', () => {
            runTest('alignCellCenter', spy, 'alignCellCenter');
        });

        it('alignCellRight', () => {
            runTest('alignCellRight', spy, 'alignCellRight');
        });
    });

    describe('alignTableCellVertically', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(alignTableCell, 'alignTableCellVertically');
        });

        it('alignCellTop', () => {
            runTest('alignCellTop', spy, 'alignCellTop');
        });

        it('alignCellMiddle', () => {
            runTest('alignCellMiddle', spy, 'alignCellMiddle');
        });

        it('alignCellBottom', () => {
            runTest('alignCellBottom', spy, 'alignCellBottom');
        });
    });

    describe('alignTable', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(alignTable, 'alignTable');
        });

        it('alignCenter', () => {
            runTest('alignCenter', spy, 'alignCenter');
        });

        it('alignLeft', () => {
            runTest('alignLeft', spy, 'alignLeft');
        });

        it('alignRight', () => {
            runTest('alignRight', spy, 'alignRight');
        });
    });

    describe('deleteTableColumn', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(deleteTableColumn, 'deleteTableColumn');
        });

        it('deleteColumn', () => {
            runTest('deleteColumn', spy);
        });
    });

    describe('deleteTableRow', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(deleteTableRow, 'deleteTableRow');
        });

        it('deleteRow', () => {
            runTest('deleteRow', spy);
        });
    });

    describe('deleteTable', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(deleteTable, 'deleteTable');
        });

        it('deleteTable', () => {
            runTest('deleteTable', spy);
        });
    });

    describe('insertTableRow', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(insertTableRow, 'insertTableRow');
        });

        it('insertAbove', () => {
            runTest('insertAbove', spy, 'insertAbove');
        });

        it('insertBelow', () => {
            runTest('insertBelow', spy, 'insertBelow');
        });
    });

    describe('insertTableColumn', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(insertTableColumn, 'insertTableColumn');
        });

        it('insertLeft', () => {
            runTest('insertLeft', spy, 'insertLeft');
        });

        it('insertRight', () => {
            runTest('insertRight', spy, 'insertRight');
        });
    });

    describe('mergeTableRow', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(mergeTableRow, 'mergeTableRow');
        });

        it('mergeAbove', () => {
            runTest('mergeAbove', spy, 'mergeAbove');
        });

        it('mergeBelow', () => {
            runTest('mergeBelow', spy, 'mergeBelow');
        });
    });

    describe('mergeTableCells', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(mergeTableCells, 'mergeTableCells');
        });

        it('mergeCells', () => {
            runTest('mergeCells', spy);
        });
    });

    describe('mergeTableColumn', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(mergeTableColumn, 'mergeTableColumn');
        });

        it('mergeLeft', () => {
            runTest('mergeLeft', spy, 'mergeLeft');
        });

        it('mergeRight', () => {
            runTest('mergeRight', spy, 'mergeRight');
        });
    });

    describe('splitTableCellHorizontally', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(splitTableCellHorizontally, 'splitTableCellHorizontally');
        });

        it('splitHorizontally', () => {
            runTest('splitHorizontally', spy);
        });
    });

    describe('splitTableCellVertically', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(splitTableCellVertically, 'splitTableCellVertically');
        });

        it('splitVertically', () => {
            runTest('splitVertically', spy);
        });
    });

    describe('shiftCells', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(shiftCells, 'shiftCells');
        });

        it('shiftCellsLeft', () => {
            runTest('shiftCellsLeft', spy, 'shiftCellsLeft');
        });

        it('shiftCellsUp', () => {
            runTest('shiftCellsUp', spy, 'shiftCellsUp');
        });
    });

    it('edit in safar', () => {
        const spy = spyOn(alignTableCell, 'alignTableCellHorizontally');
        const collapseSpy = jasmine.createSpy('collapse');
        const mockedRange = {
            collapsed: false,
            collapse: collapseSpy,
        };

        getEnvironmentSpy.and.returnValue({
            isSafari: true,
        });
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: mockedRange,
        });

        editTable(editor, 'alignCellLeft');

        expect(formatTableWithContentModelSpy).toHaveBeenCalledWith(
            editor,
            'editTable',
            jasmine.anything()
        );
        expect(spy).toHaveBeenCalledWith(mockedTable, 'alignCellLeft');
        expect(getDOMSelectionSpy).toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
        expect(collapseSpy).toHaveBeenCalledWith(true);
    });
});
