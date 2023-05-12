import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createTableStructure } from '../../../lib/modelApi/table/createTableStructure';

describe('createTableStructure', () => {
    it('Create 1*1 table', () => {
        const doc = createContentModelDocument();

        createTableStructure(doc, 1, 1);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Table',
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {},
                            spanAbove: false,
                            spanLeft: false,
                            isHeader: false,
                            dataset: {},
                        },
                    ],
                },
            ],
            format: {},
            widths: [],
            dataset: {},
        });
    });

    it('Create 2*3 table', () => {
        const doc = createContentModelDocument();

        createTableStructure(doc, 3, 2);

        const table = doc.blocks[0] as ContentModelTable;

        expect(table.rows.length).toBe(2);
        expect(table.rows[0].cells.length).toBe(3);
    });
});
