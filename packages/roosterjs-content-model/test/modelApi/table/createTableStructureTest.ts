import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createTableStructure } from '../../../lib/modelApi/table/createTableStructure';

describe('createTableStructure', () => {
    it('Create 1*1 table', () => {
        const doc = createContentModelDocument(document);

        createTableStructure(doc, 1, 1);

        expect(doc.blocks[0]).toEqual({
            blockType: 'Table',
            cells: [
                [
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
            ],
            format: {},
            widths: [],
            heights: [],
            dataset: {},
        });
    });

    it('Create 2*3 table', () => {
        const doc = createContentModelDocument(document);

        createTableStructure(doc, 3, 2);

        const table = doc.blocks[0] as ContentModelTable;

        expect(table.cells.length).toBe(2);
        expect(table.cells[0].length).toBe(3);
    });
});
