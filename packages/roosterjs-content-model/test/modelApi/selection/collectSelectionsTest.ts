import * as iterateSelections from '../../../lib/modelApi/selection/iterateSelections';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createEntity } from '../../../lib/modelApi/creators/createEntity';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createText } from '../../../lib/modelApi/creators/createText';
import { TableSelectionContext } from '../../../lib/publicTypes/selection/TableSelectionContext';
import {
    getSelectedSegments,
    getSelectedParagraphs,
    getFirstSelectedListItem,
    getFirstSelectedTable,
    getOperationalBlocks,
    OperationalBlocks,
    getSelectedSegmentsAndParagraphs,
} from '../../../lib/modelApi/selection/collectSelections';

interface SelectionInfo {
    path: ContentModelBlockGroup[];
    segments?: ContentModelSegment[];
    block?: ContentModelBlock;
    tableContext?: TableSelectionContext;
}

describe('getSelectedSegmentsAndParagraphs', () => {
    function runTest(
        selections: SelectionInfo[],
        includingFormatHolder: boolean,
        expectedResult: [ContentModelSegment, ContentModelParagraph | null][]
    ) {
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            selections.forEach(({ path, tableContext, block, segments }) => {
                callback(path, tableContext, block, segments);
            });

            return false;
        });

        const result = getSelectedSegmentsAndParagraphs(null!, includingFormatHolder);

        expect(result).toEqual(expectedResult);
    }

    it('Empty result', () => {
        runTest([], false, []);
    });

    it('Add segments', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const p1 = createParagraph();
        const p2 = createParagraph();

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s3, s4],
                },
            ],
            false,
            [
                [s1, p1],
                [s2, p1],
                [s3, p2],
                [s4, p2],
            ]
        );
    });

    it('Block with incompatible types', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            false,
            []
        );
    });

    it('Block with incompatible types, include format holder', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            true,
            [
                [s3, null],
                [s4, null],
            ]
        );
    });

    it('Unmeaningful segments should be included', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const m1 = createSelectionMarker({ fontSize: '10px' });
        const m2 = createSelectionMarker({ fontSize: '20px' });
        const p1 = createParagraph();
        const p2 = createParagraph();
        const p3 = createParagraph();

        p1.segments.push(s1, m1);
        p2.segments.push(s2, s3);
        p3.segments.push(m2, s4);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [m1],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s2, s3],
                },
                {
                    path: [],
                    block: p3,
                    segments: [m2],
                },
            ],
            true,
            [
                [m1, p1],
                [s2, p2],
                [s3, p2],
                [m2, p3],
            ]
        );
    });

    it('Include editable entity, but filter out readonly entity', () => {
        const e1 = createEntity(null!, true);
        const e2 = createEntity(null!, false);
        const p1 = createParagraph();

        p1.segments.push(e1, e2);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [e1, e2],
                },
            ],
            false,
            [[e2, p1]]
        );
    });
});

describe('getSelectedSegments', () => {
    function runTest(
        selections: SelectionInfo[],
        includingFormatHolder: boolean,
        expectedResult: ContentModelSegment[]
    ) {
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            selections.forEach(({ path, tableContext, block, segments }) => {
                callback(path, tableContext, block, segments);
            });

            return false;
        });

        const result = getSelectedSegments(null!, includingFormatHolder);

        expect(result).toEqual(expectedResult);
    }

    it('Empty result', () => {
        runTest([], false, []);
    });

    it('Add segments', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const p1 = createParagraph();
        const p2 = createParagraph();

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s3, s4],
                },
            ],
            false,
            [s1, s2, s3, s4]
        );
    });

    it('Block with incompatible types', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            false,
            []
        );
    });

    it('Block with incompatible types, include format holder', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            true,
            [s3, s4]
        );
    });

    it('Unmeaningful segments should be included', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const m1 = createSelectionMarker({ fontSize: '10px' });
        const m2 = createSelectionMarker({ fontSize: '20px' });
        const p1 = createParagraph();
        const p2 = createParagraph();
        const p3 = createParagraph();

        p1.segments.push(s1, m1);
        p2.segments.push(s2, s3);
        p3.segments.push(m2, s4);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [m1],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s2, s3],
                },
                {
                    path: [],
                    block: p3,
                    segments: [m2],
                },
            ],
            true,
            [m1, s2, s3, m2]
        );
    });

    it('Include editable entity, but filter out readonly entity', () => {
        const e1 = createEntity(null!, true);
        const e2 = createEntity(null!, false);
        const p1 = createParagraph();

        p1.segments.push(e1, e2);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [e1, e2],
                },
            ],
            false,
            [e2]
        );
    });
});

describe('getSelectedParagraphs', () => {
    function runTest(selections: SelectionInfo[], expectedResult: ContentModelParagraph[]) {
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            selections.forEach(({ path, tableContext, block, segments }) => {
                callback(path, tableContext, block, segments);
            });

            return false;
        });

        const result = getSelectedParagraphs(null!);

        expect(result).toEqual(expectedResult);
    }

    it('Empty result', () => {
        runTest([], []);
    });

    it('Add segments', () => {
        const p1 = createParagraph(false, { lineHeight: '10px' });
        const p2 = createParagraph(false, { lineHeight: '20px' });

        runTest(
            [
                {
                    path: [],
                    block: p1,
                },
                {
                    path: [],
                    block: p2,
                },
            ],
            [p1, p2]
        );
    });

    it('Block with incompatible types', () => {
        const b1 = createDivider('div');
        const p2 = createParagraph(false, { lineHeight: '20px' });

        runTest(
            [
                {
                    path: [],
                    block: b1,
                },
                {
                    path: [],
                    block: p2,
                },
            ],
            [p2]
        );
    });

    it('Block with incompatible types, include format holder', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            []
        );
    });

    it('Unmeaningful segments should not be included', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const m1 = createSelectionMarker({ fontSize: '10px' });
        const m2 = createSelectionMarker({ fontSize: '20px' });
        const p1 = createParagraph();
        const p2 = createParagraph();
        const p3 = createParagraph();

        p1.segments.push(s1, m1);
        p2.segments.push(s2, s3);
        p3.segments.push(m2, s4);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [m1],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s2, s3],
                },
                {
                    path: [],
                    block: p3,
                    segments: [m2],
                },
            ],
            [p2]
        );
    });

    it('Unmeaningful segments should not be included 2', () => {
        const s1 = createText('test1');
        const s4 = createText('test4');
        const m1 = createSelectionMarker({ fontSize: '10px' });
        const m2 = createSelectionMarker({ fontSize: '20px' });
        const p1 = createParagraph();
        const p3 = createParagraph();

        p1.segments.push(s1, m1);
        p3.segments.push(m2, s4);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [m1],
                },
                {
                    path: [],
                    block: p3,
                    segments: [m2],
                },
            ],
            [p1]
        );
    });

    it('Unmeaningful segments should not be included 3', () => {
        const s1 = createText('test1');
        const m1 = createSelectionMarker({ fontSize: '10px' });
        const p1 = createParagraph();

        p1.segments.push(m1, s1);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [m1],
                },
            ],
            [p1]
        );
    });
});

describe('getFirstSelectedTable', () => {
    function runTest(selections: SelectionInfo[], expectedResult: ContentModelTable | undefined) {
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            selections.forEach(({ path, tableContext, block, segments }) => {
                callback(path, tableContext, block, segments);
            });

            return false;
        });

        const result = getFirstSelectedTable(null!);

        expect(result).toEqual(expectedResult);
    }

    it('Empty selection', () => {
        runTest([], undefined);
    });

    it('Single table selection in context', () => {
        const table = createTable(1);

        runTest(
            [
                {
                    path: [],
                    tableContext: {
                        table: table,
                        colIndex: 0,
                        rowIndex: 0,
                        isWholeTableSelected: false,
                    },
                },
            ],
            table
        );
    });

    it('Single table selection in block', () => {
        const table = createTable(1);

        runTest(
            [
                {
                    path: [],
                    block: table,
                },
            ],
            table
        );
    });

    it('2 table selections', () => {
        const table1 = createTable(1);
        const table2 = createTable(2);

        runTest(
            [
                {
                    path: [],
                    block: table1,
                    tableContext: {
                        table: table2,
                        rowIndex: 0,
                        colIndex: 0,
                        isWholeTableSelected: false,
                    },
                },
            ],
            table1
        );
    });

    it('2 table selections in blocks', () => {
        const table1 = createTable(1);
        const table2 = createTable(2);

        runTest(
            [
                {
                    path: [],
                    block: table1,
                },
                {
                    path: [],
                    block: table2,
                },
            ],
            table1
        );
    });

    it('2 table selections in context', () => {
        const table1 = createTable(1);
        const table2 = createTable(2);

        runTest(
            [
                {
                    path: [],
                    tableContext: {
                        table: table1,
                        rowIndex: 0,
                        colIndex: 0,
                        isWholeTableSelected: false,
                    },
                },
                {
                    path: [],
                    tableContext: {
                        table: table2,
                        rowIndex: 0,
                        colIndex: 0,
                        isWholeTableSelected: false,
                    },
                },
            ],
            table1
        );
    });

    it('With other selections', () => {
        const p = createParagraph();
        const table1 = createTable(1);

        runTest(
            [
                {
                    path: [],
                    block: p,
                },
                {
                    path: [],
                    block: table1,
                },
            ],
            table1
        );
    });
});

describe('getFirstSelectedListItem', () => {
    it('Empty group', () => {
        const group = createContentModelDocument();

        const result = getFirstSelectedListItem(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(result).toBeUndefined();
    });

    it('Group without selection', () => {
        const group = createContentModelDocument();
        const para = createParagraph();

        group.blocks.push(para);

        const result = getFirstSelectedListItem(group);

        expect(result).toBeUndefined();
    });

    it('Group with list selection', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        group.blocks.push(para);

        text.isSelected = true;

        const result = getFirstSelectedListItem(group);

        expect(result).toBeUndefined();
    });

    it('Group with list selection', () => {
        const group = createContentModelDocument();
        const listItem = createListItem([{ listType: 'OL' }]);
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        text.isSelected = true;

        const result = getFirstSelectedListItem(group);

        expect(result).toBe(listItem);
    });

    it('Group with multiple list selection', () => {
        const group = createContentModelDocument();
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        group.blocks.push(listItem1);
        group.blocks.push(listItem2);

        text2.isSelected = true;

        const result = getFirstSelectedListItem(group);

        expect(result).toBe(listItem2);
    });

    it('Group with selection that is not start from list', () => {
        const group = createContentModelDocument();
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem2.blocks.push(para2);
        group.blocks.push(para1);
        group.blocks.push(listItem2);

        text1.isSelected = true;
        text2.isSelected = true;

        const result = getFirstSelectedListItem(group);

        expect(result).toEqual(listItem2);
    });
});

describe('getOperationalBlocks', () => {
    it('empty input', () => {
        const result = getOperationalBlocks(createContentModelDocument(), ['ListItem'], []);

        expect(result).toEqual([]);
    });

    function runTest(
        selections: SelectionInfo[],
        blockGroupTypes: ContentModelBlockGroupType[],
        stopTypes: ContentModelBlockGroupType[],
        deepFirst: boolean,
        expectedResult: OperationalBlocks<ContentModelBlockGroup>[]
    ) {
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            selections.forEach(({ path, tableContext, block, segments }) => {
                callback(path, tableContext, block, segments);
            });

            return false;
        });

        const result = getOperationalBlocks(null!, blockGroupTypes, stopTypes, deepFirst);

        expect(result).toEqual(expectedResult);
    }

    it('selected paragraph without expect group type', () => {
        const group = createContentModelDocument();
        const para = createParagraph();

        runTest(
            [
                {
                    path: [group],
                    block: para,
                },
            ],
            ['ListItem'],
            ['TableCell'],
            false,
            [{ block: para, parent: group }]
        );
    });

    it('selected paragraph with expect group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);

        runTest(
            [
                { block: para1, path: [listItem, group] },
                { block: para2, path: [group] },
            ],
            ['ListItem'],
            ['TableCell'],
            false,
            [
                {
                    block: listItem,
                    parent: group,
                },
                {
                    block: para2,
                    parent: group,
                },
            ]
        );
    });

    it('selected multiple paragraphs in same expect group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const listItem = createListItem([]);

        runTest(
            [
                { block: para1, path: [listItem, group] },
                { block: para2, path: [listItem, group] },
                { block: para3, path: [group] },
            ],
            ['ListItem'],
            ['TableCell'],
            false,
            [
                { block: listItem, parent: group },
                { block: para3, parent: group },
            ]
        );
    });

    it('selected paragraph with stop type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem1 = createListItem([]);
        const listItem2 = createListItem([]);
        const quote = createQuote();

        runTest(
            [
                { block: para1, path: [listItem1, group] },
                { block: para2, path: [quote, listItem2, group] },
            ],
            ['ListItem'],
            ['FormatContainer'],
            false,
            [
                { block: listItem1, parent: group },
                { block: para2, parent: quote },
            ]
        );
    });

    it('selected paragraph with multiple group type', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);
        const quote = createQuote();

        runTest(
            [
                { block: para1, path: [listItem, group] },
                { block: para2, path: [quote, group] },
            ],
            ['ListItem', 'FormatContainer'],
            ['TableCell'],
            false,
            [
                {
                    block: listItem,
                    parent: group,
                },
                { block: quote, parent: group },
            ]
        );
    });

    it('multiple group type, width first', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { backgroundColor: 'red' });
        const para2 = createParagraph(false, { backgroundColor: 'green' });
        const listItem = createListItem([]);
        const quote1 = createQuote({ backgroundColor: 'blue' });
        const quote2 = createQuote({ backgroundColor: 'black' });

        runTest(
            [
                { block: para1, path: [quote1, listItem, group] },
                { block: para2, path: [quote2, group] },
            ],
            ['ListItem', 'FormatContainer'],
            ['TableCell'],
            false,
            [
                { block: quote1, parent: listItem },
                { block: quote2, parent: group },
            ]
        );
    });

    it('multiple group type, deep first', () => {
        const group = createContentModelDocument();
        const para1 = createParagraph(false, { backgroundColor: 'red' });
        const para2 = createParagraph(false, { backgroundColor: 'green' });
        const listItem = createListItem([]);
        const quote1 = createQuote({ backgroundColor: 'blue' });
        const quote2 = createQuote({ backgroundColor: 'black' });

        runTest(
            [
                { block: para1, path: [quote1, listItem, group] },
                { block: para2, path: [quote2, group] },
            ],
            ['ListItem', 'FormatContainer'],
            ['TableCell'],
            true,
            [
                { block: listItem, parent: group },
                { block: quote2, parent: group },
            ]
        );
    });
});
