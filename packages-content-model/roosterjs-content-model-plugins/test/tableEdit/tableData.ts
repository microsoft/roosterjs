import { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * Regular 3 x 3 Table
 */
export function getModelTable(): ContentModelTable {
    /*
     *   ——————————————
     *  | a1 | b1 | c1 |
     *   ——————————————
     *  | a2 | b2 | c2 |
     *   ——————————————
     *  | a3 | b3 | c3 |
     *   ——————————————
     */
    return {
        blockType: 'Table',
        rows: [
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c1',
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
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a2',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b2',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c2',
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
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a3',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b3',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c3',
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
                    },
                ],
            },
        ],
        format: {},
        widths: [50, 50, 50],
        dataset: {},
    };
}

/**
 * 3 x 3 Table with merged central column
 */
export function getMergedCenterColumnTable(): ContentModelTable {
    /*
     *   ——————————————
     *  | a1 |    | c1 |
     *   ————      ————
     *  | a2 | b1 | c2 |
     *   ————      ————
     *  | a3 |    | c3 |
     *   ——————————————
     */
    return {
        blockType: 'Table',
        rows: [
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c1',
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
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a2',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft: false,
                        spanAbove: true,
                        isHeader: false,
                        dataset: {},
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c2',
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
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a3',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft: false,
                        spanAbove: true,
                        isHeader: false,
                        dataset: {},
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c3',
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
                    },
                ],
            },
        ],
        format: {},
        widths: [50, 50, 50],
        dataset: {},
    };
}

/**
 * 3 x 3 Table with merged central row
 */
export function getMergedCenterRowTable(): ContentModelTable {
    /*
     *   ——————————————
     *  | a1 | b1 | c1 |
     *   ——————————————
     *  | a2           |
     *   ——————————————
     *  | a3 | b3 | c3 |
     *   ——————————————
     */
    return {
        blockType: 'Table',
        rows: [
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c1',
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
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a2',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft: true,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft: true,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a3',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b3',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'c3',
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
                    },
                ],
            },
        ],
        format: {},
        widths: [50, 50, 50],
        dataset: {},
    };
}

/**
 * 2 x 2 Table with merged top row
 */
export function getMergedTopRowTable(): ContentModelTable {
    /*
     *   —————————
     *  | a1      |
     *   —————————
     *  | a2 | b2 |
     *   —————————
     */
    return {
        blockType: 'Table',
        rows: [
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft: true,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a2',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b2',
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
                    },
                ],
            },
        ],
        format: {},
        widths: [50, 50],
        dataset: {},
    };
}

/**
 * 2 x 2 Table with merged first column
 */
export function getMergedFirstColumnTable(): ContentModelTable {
    /*
     *   —————————
     *  | a1 | b1 |
     *        ————
     *  |    | b2 |
     *   —————————
     */
    return {
        blockType: 'Table',
        rows: [
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a1',
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b1',
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
                    },
                ],
            },
            {
                height: 50,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft: false,
                        spanAbove: true,
                        isHeader: false,
                        dataset: {},
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'b2',
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
                    },
                ],
            },
        ],
        format: {},
        widths: [50, 50],
        dataset: {},
    };
}
