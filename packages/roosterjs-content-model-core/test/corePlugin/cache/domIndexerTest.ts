import * as setSelection from '../../../lib/publicApi/selection/setSelection';
import { createRange } from 'roosterjs-content-model-dom/test/testUtils';
import { domIndexerImpl } from '../../../lib/corePlugin/cache/domIndexerImpl';
import {
    ContentModelDocument,
    ContentModelSegment,
    DOMSelection,
} from 'roosterjs-content-model-types';
import {
    createBr,
    createContentModelDocument,
    createImage,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('domIndexerImpl.onSegment', () => {
    it('onSegment', () => {
        const node = {} as any;
        const paragraph = 'Paragraph' as any;
        const segment = 'Segment' as any;

        domIndexerImpl.onSegment(node, paragraph, [segment]);

        expect(node).toEqual({
            __roosterjsContentModel: { paragraph: 'Paragraph', segments: ['Segment'] },
        });
    });
});

describe('domIndexerImpl.onParagraph', () => {
    it('Paragraph, no child', () => {
        const node = document.createElement('div');

        domIndexerImpl.onParagraph(node);

        expect(node.outerHTML).toBe('<div></div>');
    });

    it('Indexed paragraph, has single text child', () => {
        const node = document.createElement('div');
        const paragraph = createParagraph();
        const text = document.createTextNode('test') as any;
        const segment = 'Segment' as any;

        text.__roosterjsContentModel = {
            paragraph,
            segments: [segment],
        };
        node.appendChild(text);

        domIndexerImpl.onParagraph(node);

        expect(text.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment],
        });
        expect(node.outerHTML).toBe('<div>test</div>');
    });

    it('Indexed paragraph, has multiple text children', () => {
        const node = document.createElement('div');
        const paragraph = createParagraph();
        const text1 = document.createTextNode('test1') as any;
        const text2 = document.createTextNode('test2') as any;
        const text3 = document.createTextNode('test3') as any;
        const segment1 = 'Segment1' as any;
        const segment2 = 'Segment2' as any;
        const segment3 = 'Segment3' as any;

        text1.__roosterjsContentModel = {
            paragraph,
            segments: [segment1],
        };
        text2.__roosterjsContentModel = {
            paragraph,
            segments: [segment2],
        };
        text3.__roosterjsContentModel = {
            paragraph,
            segments: [segment3],
        };
        node.appendChild(text1);
        node.appendChild(text2);
        node.appendChild(text3);

        domIndexerImpl.onParagraph(node);

        expect(text1.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2, segment3],
        });
        expect(text2.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [],
        });
        expect(text3.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [],
        });
        expect(node.outerHTML).toBe('<div>test1test2test3</div>');
    });

    it('Indexed paragraph, has multiple text children and HTML element between', () => {
        const node = document.createElement('div');
        const paragraph = createParagraph();
        const text1 = document.createTextNode('test1') as any;
        const text2 = document.createTextNode('test2') as any;
        const span = document.createElement('span');
        const text3 = document.createTextNode('test3') as any;
        const text4 = document.createTextNode('test4') as any;
        const segment1 = 'Segment1' as any;
        const segment2 = 'Segment2' as any;
        const segment3 = 'Segment3' as any;
        const segment4 = 'Segment4' as any;

        text1.__roosterjsContentModel = {
            paragraph,
            segments: [segment1],
        };
        text2.__roosterjsContentModel = {
            paragraph,
            segments: [segment2],
        };
        text3.__roosterjsContentModel = {
            paragraph,
            segments: [segment3],
        };
        text4.__roosterjsContentModel = {
            paragraph,
            segments: [segment4],
        };
        node.appendChild(text1);
        node.appendChild(text2);
        node.appendChild(span);
        node.appendChild(text3);
        node.appendChild(text4);

        domIndexerImpl.onParagraph(node);

        expect(text1.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2],
        });
        expect(text2.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [],
        });
        expect(text3.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment3, segment4],
        });
        expect(text4.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [],
        });
        expect(node.outerHTML).toBe('<div>test1test2<span></span>test3test4</div>');
    });
});

describe('domIndexerImpl.onTable', () => {
    it('onTable', () => {
        const node = {} as any;
        const rows = 'ROWS' as any;
        const table = {
            rows: rows,
        } as any;

        domIndexerImpl.onTable(node, table);

        expect(node).toEqual({
            __roosterjsContentModel: { tableRows: rows },
        });
    });
});

describe('domIndexerImpl.reconcileSelection', () => {
    let setSelectionSpy: jasmine.Spy;
    let model: ContentModelDocument;

    beforeEach(() => {
        model = createContentModelDocument();
        setSelectionSpy = spyOn(setSelection, 'setSelection').and.callThrough();
    });

    it('no old range, fake range', () => {
        const newRangeEx = {} as any;

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeFalse();
        expect(setSelectionSpy).not.toHaveBeenCalled();
    });

    it('no old range, normal range on non-indexed text, collapsed', () => {
        const node = document.createTextNode('test');
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 2),
            isReverted: false,
        };

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeFalse();
        expect(setSelectionSpy).not.toHaveBeenCalled();
    });

    it('no old range, normal range on indexed text, collapsed', () => {
        const node = document.createTextNode('test') as any;
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 2),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const segment = createText('');

        paragraph.segments.push(segment);
        domIndexerImpl.onSegment(node, paragraph, [segment]);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 'te',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'st',
            format: {},
        };

        expect(result).toBeTrue();
        expect(node.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                segment1,
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                segment2,
            ],
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
    });

    it('no old range, normal range on indexed text, expanded on same node', () => {
        const node = document.createTextNode('test') as any;
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 1, node, 3),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const segment = createText('');

        paragraph.segments.push(segment);
        domIndexerImpl.onSegment(node, paragraph, [segment]);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'es',
            format: {},
            isSelected: true,
        };
        const segment3: ContentModelSegment = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };

        expect(result).toBeTrue();
        expect(node.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2, segment3],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, segment2, segment3],
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
    });

    it('no old range, normal range on indexed text, expanded on different node', () => {
        const node1 = document.createTextNode('test1') as any;
        const node2 = document.createTextNode('test2') as any;
        const parent = document.createElement('div');

        parent.appendChild(node1);
        parent.appendChild(node2);

        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node1, 2, node2, 3),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const oldSegment1 = createText('');
        const oldSegment2 = createText('');

        paragraph.segments.push(oldSegment1, oldSegment2);
        domIndexerImpl.onSegment(node1, paragraph, [oldSegment1]);
        domIndexerImpl.onSegment(node2, paragraph, [oldSegment2]);
        model.blocks.push(paragraph);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 'te',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'st1',
            format: {},
            isSelected: true,
        };
        const segment3: ContentModelSegment = {
            segmentType: 'Text',
            text: 'tes',
            format: {},
            isSelected: true,
        };
        const segment4: ContentModelSegment = {
            segmentType: 'Text',
            text: 't2',
            format: {},
        };
        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();

        expect(result).toBeTrue();
        expect(node1.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2],
        });
        expect(node2.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment3, segment4],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, marker1, segment2, segment3, marker2, segment4],
        });
        expect(setSelectionSpy).toHaveBeenCalledWith(model, marker1, marker2);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
    });

    it('no old range, normal range on indexed text, expanded on other type of node', () => {
        const node1 = document.createTextNode('test1') as any;
        const node2 = document.createElement('br') as any;
        const parent = document.createElement('div');

        parent.appendChild(node1);
        parent.appendChild(node2);

        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node1, 2, parent, 2),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const oldSegment1 = createText('');
        const oldSegment2 = createBr();

        paragraph.segments.push(oldSegment1, oldSegment2);
        domIndexerImpl.onSegment(node1, paragraph, [oldSegment1]);
        domIndexerImpl.onSegment(node2, paragraph, [oldSegment2]);
        model.blocks.push(paragraph);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 'te',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'st1',
            format: {},
            isSelected: true,
        };

        const marker1 = createSelectionMarker();
        const marker2 = createSelectionMarker();

        expect(result).toBeTrue();
        expect(node1.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2],
        });
        expect(node2.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [oldSegment2],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, marker1, segment2, oldSegment2, marker2],
        });
        expect(setSelectionSpy).toHaveBeenCalledWith(model, marker1, marker2);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
    });

    it('no old range, image range on indexed text', () => {
        const node1 = document.createTextNode('img') as any;
        const parent = document.createElement('div');

        parent.appendChild(node1);

        const newRangeEx: DOMSelection = {
            type: 'image',
            image: node1,
        };
        const paragraph = createParagraph();
        const oldSegment1 = createImage('test');

        paragraph.segments.push(oldSegment1);
        domIndexerImpl.onSegment(node1, paragraph, [oldSegment1]);
        model.blocks.push(paragraph);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeFalse();
        expect(node1.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [oldSegment1],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [oldSegment1],
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(oldSegment1).toEqual({
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        });
    });

    it('no old range, table range on indexed text', () => {
        const node1 = document.createTextNode('table') as any;
        const parent = document.createElement('div');

        parent.appendChild(node1);

        const newRangeEx: DOMSelection = {
            type: 'table',
            table: node1,
            firstColumn: 0,
            firstRow: 1,
            lastColumn: 1,
            lastRow: 2,
        };
        const tableModel = createTable(3);
        const cell00 = createTableCell();
        const cell01 = createTableCell();
        const cell02 = createTableCell();
        const cell10 = createTableCell();
        const cell11 = createTableCell();
        const cell12 = createTableCell();
        const cell20 = createTableCell();
        const cell21 = createTableCell();
        const cell22 = createTableCell();
        tableModel.rows[0].cells.push(cell00, cell01, cell02);
        tableModel.rows[1].cells.push(cell10, cell11, cell12);
        tableModel.rows[2].cells.push(cell20, cell21, cell22);

        domIndexerImpl.onTable(node1, tableModel);
        model.blocks.push(tableModel);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeFalse();
        expect(node1.__roosterjsContentModel).toEqual({
            tableRows: tableModel.rows,
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [tableModel],
        });
    });

    it('no old range, collapsed range after last node', () => {
        const node = document.createElement('br') as any;
        const parent = document.createElement('div');

        parent.appendChild(node);

        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(parent, 1),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const segment = createBr({ fontFamily: 'Arial' });

        paragraph.segments.push(segment);
        domIndexerImpl.onSegment(node, paragraph, [segment]);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeTrue();
        expect(node.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment, createSelectionMarker({ fontFamily: 'Arial' })],
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
    });

    it('has old range - collapsed, expanded new range', () => {
        const node = document.createTextNode('test') as any;
        const oldRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 2),
            isReverted: false,
        };
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 1, node, 3),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const oldSegment1 = createText('te');
        const oldSegment2 = createText('st');

        paragraph.segments.push(oldSegment1, createSelectionMarker(), oldSegment2);
        domIndexerImpl.onSegment(node, paragraph, [oldSegment1, oldSegment2]);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx, oldRangeEx);

        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'es',
            format: {},
            isSelected: true,
        };
        const segment3: ContentModelSegment = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };

        expect(result).toBeTrue();
        expect(node.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2, segment3],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, segment2, segment3],
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
    });

    it('has old range - expanded, expanded new range', () => {
        const node = document.createTextNode('test') as any;
        const oldRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 1, node, 3),
            isReverted: false,
        };
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 2),
            isReverted: false,
        };
        const paragraph = createParagraph();
        const oldSegment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };
        const oldSegment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'es',
            format: {},
            isSelected: true,
        };
        const oldSegment3: ContentModelSegment = {
            segmentType: 'Text',
            text: 't',
            format: {},
        };

        paragraph.segments.push(oldSegment1, oldSegment2, oldSegment3);
        domIndexerImpl.onSegment(node, paragraph, [oldSegment1, oldSegment2, oldSegment3]);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx, oldRangeEx);

        const segment1 = createText('te');
        const segment2 = createText('st');

        expect(result).toBeTrue();
        expect(node.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment1, segment2],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, createSelectionMarker(), segment2],
        });
        expect(setSelectionSpy).toHaveBeenCalled();
    });
});
