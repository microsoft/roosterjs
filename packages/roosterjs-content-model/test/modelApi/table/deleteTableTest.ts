import { createTable } from '../../../lib/modelApi/creators/createTable';
import { deleteTable } from '../../../lib/modelApi/table/deleteTable';

describe('deleteTable', () => {
    it('deleteTable', () => {
        const table = createTable(2);

        table.cachedElement = {} as any;

        deleteTable(table);

        expect(table.rows).toEqual([]);
        expect(table.cachedElement).toBeUndefined();
    });
});
