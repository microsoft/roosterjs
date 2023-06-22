import * as addSegment from 'roosterjs-content-model-dom/lib/modelApi/common/addSegment';
import * as createSelectionMarker from 'roosterjs-content-model-dom/lib/modelApi/creators/createSelectionMarker';
import { collapseTableSelection } from '../../../lib/modelApi/selection/collapseTableSelection';
import { ContentModelSelectionMarker } from 'roosterjs-content-model-types';
import { createTable, createTableCell } from 'roosterjs-content-model-dom';

describe('collapseTableSelection', () => {
    it('Collapse Selection to first cell', () => {
        const selectionMarker = <ContentModelSelectionMarker>{};
        spyOn(createSelectionMarker, 'createSelectionMarker').and.returnValue(selectionMarker);
        spyOn(addSegment, 'addSegment');

        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        table.rows[0].cells.push(cell1, cell2);

        collapseTableSelection(table.rows, { firstCol: 0, firstRow: 0, lastCol: 0, lastRow: 0 });

        expect(addSegment.addSegment).toHaveBeenCalledWith(table.rows[0].cells[0], selectionMarker);
    });

    it('First cell undefined, do not collapse selection', () => {
        const selectionMarker = <ContentModelSelectionMarker>{};
        spyOn(createSelectionMarker, 'createSelectionMarker').and.returnValue(selectionMarker);
        spyOn(addSegment, 'addSegment');

        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        table.rows[0].cells.push(cell1, cell2);

        collapseTableSelection(table.rows, { firstCol: 1, firstRow: 1, lastCol: 0, lastRow: 0 });

        expect(createSelectionMarker.createSelectionMarker).not.toHaveBeenCalled();
        expect(addSegment.addSegment).not.toHaveBeenCalled();
    });
});
