import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/domToModel/creators/createContentModelDocument';
import { createTableStructure } from '../../../lib/modelApi/table/createTableStructure';

describe('createTableStructure', () => {
    it('Create 1*1 table', () => {
        const doc = createContentModelDocument(document);
        const context: ContentModelContext = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };

        createTableStructure(doc, 1, 1, context);

        expect(doc.blocks[0]).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [
                            {
                                blockType: ContentModelBlockType.Paragraph,
                                isImplicit: true,
                                segments: [
                                    {
                                        segmentType: ContentModelSegmentType.Br,
                                    },
                                ],
                            },
                        ],
                        format: {
                            width: 120,
                        },
                        spanAbove: false,
                        spanLeft: false,
                        isHeader: false,
                    },
                ],
            ],
            format: { borderCollapse: true },
        });
    });

    it('Create 2*3 table', () => {
        const doc = createContentModelDocument(document);
        const context: ContentModelContext = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };

        createTableStructure(doc, 3, 2, context);

        const table = doc.blocks[0] as ContentModelTable;

        expect(table.cells.length).toBe(2);
        expect(table.cells[0].length).toBe(3);
    });
});
