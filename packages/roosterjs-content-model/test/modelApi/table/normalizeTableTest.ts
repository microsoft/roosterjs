import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { normalizeTable } from '../../../lib/modelApi/table/normalizeTable';

describe('normalizeTable', () => {
    it('Normalize an empty table', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [],
            format: {},
        };

        normalizeTable(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
        });
    });

    it('Normalize a table with out content', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                        blocks: [],
                    },
                ],
            ],
            format: {},
        };

        normalizeTable(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        spanAbove: false,
                        spanLeft: false,
                        format: { width: 120, useBorderBox: true },
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
                    },
                ],
            ],
            format: {
                borderCollapse: true,
                useBorderBox: true,
            },
        });
    });
});
