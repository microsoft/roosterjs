import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createListLevel } from '../../../lib/modelApi/creators/createListLevel';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { mutateBlock, mutateSegment, mutateSegments } from '../../../lib/modelApi/common/mutate';

const mockedCache = 'CACHE' as any;

describe('mutate', () => {
    it('mutate a block without cache', () => {
        const block = {} as any;

        const mutatedBlock = mutateBlock(block);

        expect(mutatedBlock).toBe(block);
        expect(mutatedBlock).toEqual({} as any);
    });

    it('mutate a block with cache', () => {
        const block = {} as any;

        block.cachedElement = mockedCache;

        const mutatedBlock = mutateBlock(block);

        expect(mutatedBlock).toBe(block);
        expect(mutatedBlock).toEqual({} as any);
    });

    it('mutate a block group with cache', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();

        doc.cachedElement = mockedCache;
        para.cachedElement = mockedCache;

        doc.blocks.push(para);

        const mutatedBlock = mutateBlock(doc);

        expect(mutatedBlock).toBe(doc);
        expect(mutatedBlock).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    cachedElement: mockedCache,
                },
            ],
        } as any);
    });

    it('mutate a table', () => {
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();

        table.cachedElement = mockedCache;
        table.rows[0].cachedElement = mockedCache;
        cell.cachedElement = mockedCache;
        para.cachedElement = mockedCache;

        cell.blocks.push(para);
        table.rows[0].cells.push(cell);

        const mutatedBlock = mutateBlock(table);

        expect(mutatedBlock).toBe(table);
        expect(mutatedBlock).toEqual({
            blockType: 'Table',
            rows: [
                {
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [],
                                    format: {},
                                    cachedElement: mockedCache,
                                },
                            ],
                            format: {},
                            spanLeft: false,
                            spanAbove: false,
                            isHeader: false,
                            dataset: {},
                            cachedElement: mockedCache,
                        },
                    ],
                    height: 0,
                    format: {},
                },
            ],
            format: {},
            widths: [],
            dataset: {},
        } as any);
    });

    it('mutate a list', () => {
        const level = createListLevel('OL');
        const list = createListItem([level]);
        const para = createParagraph();

        level.cachedElement = mockedCache;
        list.cachedElement = mockedCache;
        para.cachedElement = mockedCache;

        list.blocks.push(para);

        const mutatedBlock = mutateBlock(list);

        expect(mutatedBlock).toBe(list);
        expect(mutatedBlock).toEqual({
            blockType: 'BlockGroup',
            format: {},
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    cachedElement: mockedCache,
                },
            ],
            levels: [{ listType: 'OL', format: {}, dataset: {} }],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
        } as any);
    });
});

describe('mutateSegments', () => {
    it('empty paragraph', () => {
        const para = createParagraph();

        para.cachedElement = mockedCache;

        const result = mutateSegments(para, []);

        expect(result).toEqual([para, [], []]);
        expect(result[0].cachedElement).toBeUndefined();
    });

    it('Paragraph with correct segments', () => {
        const para = createParagraph();

        para.cachedElement = mockedCache;

        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        para.segments.push(text1, text2, text3, text4);

        const result = mutateSegments(para, [text2, text4]);

        expect(result).toEqual([para, [text2, text4], [1, 3]]);
        expect(result[0].cachedElement).toBeUndefined();
    });

    it('Paragraph with incorrect segments', () => {
        const para = createParagraph();

        para.cachedElement = mockedCache;

        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        para.segments.push(text1, text2, text3);

        const result = mutateSegments(para, [text2, text4]);

        expect(result).toEqual([para, [text2], [1]]);
        expect(result[0].cachedElement).toBeUndefined();
    });
});

describe('mutateSegment', () => {
    let callbackSpy: jasmine.Spy;

    beforeEach(() => {
        callbackSpy = jasmine.createSpy('callback');
    });

    it('Paragraph with correct segment', () => {
        const para = createParagraph();

        para.cachedElement = mockedCache;

        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para.segments.push(text1, text2, text3);

        const result = mutateSegment(para, text2, callbackSpy);

        expect(result).toEqual([para, text2, 1]);
        expect(result[0].cachedElement).toBeUndefined();
        expect(callbackSpy).toHaveBeenCalledTimes(1);
        expect(callbackSpy).toHaveBeenCalledWith(text2, para, 1);
    });

    it('Paragraph with incorrect segment', () => {
        const para = createParagraph();

        para.cachedElement = mockedCache;

        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para.segments.push(text1, text3);

        const result = mutateSegment(para, text2, callbackSpy);

        expect(result).toEqual([para, null, -1]);
        expect(result[0].cachedElement).toBeUndefined();
        expect(callbackSpy).toHaveBeenCalledTimes(0);
    });
});
