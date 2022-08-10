import { createTable } from '../../../lib/modelApi/creators/createTable';
import { deleteTable } from '../../../lib/modelApi/table/deleteTable';

describe('deleteTable', () => {
    it('deleteTable', () => {
        const table = createTable(2);

        deleteTable(table);

        expect(table.cells).toEqual([]);
    });
});
