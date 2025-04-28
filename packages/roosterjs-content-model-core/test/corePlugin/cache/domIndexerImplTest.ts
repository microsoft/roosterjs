import * as setSelection from 'roosterjs-content-model-dom/lib/modelApi/selection/setSelection';
import { createRange } from 'roosterjs-content-model-dom/test/testUtils';
import {
    BlockEntityDelimiterItem,
    DomIndexerImpl,
    IndexedEntityDelimiter,
    IndexedSegmentNode,
    IndexedTableElement,
    SegmentItem,
    TableItem,
} from '../../../lib/corePlugin/cache/domIndexerImpl';
import {
    CacheSelection,
    ContentModelDocument,
    ContentModelLink,
    ContentModelSegment,
    DOMSelection,
} from 'roosterjs-content-model-types';
import {
    addLink,
    createBr,
    createContentModelDocument,
    createEntity,
    createImage,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

const ZERO_WIDTH_SPACE = '\u200B';

describe('domIndexerImpl.onSegment', () => {
    it('onSegment', () => {
        const node = {} as any;
        const paragraph = 'Paragraph' as any;
        const segment = 'Segment' as any;

        new DomIndexerImpl().onSegment(node, paragraph, [segment]);

        expect(node).toEqual({
            __roosterjsContentModel: { paragraph: 'Paragraph', segments: ['Segment'] },
        });
    });
});

describe('domIndexerImpl.onParagraph', () => {
    let domIndexerImpl: DomIndexerImpl;

    beforeEach(() => {
        domIndexerImpl = new DomIndexerImpl();
    });

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
        paragraph.segments.push(segment1, segment2, segment3);

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

        paragraph.segments.push(segment1, segment2, segment3, segment4);

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
    let domIndexerImpl: DomIndexerImpl;

    beforeEach(() => {
        domIndexerImpl = new DomIndexerImpl();
    });

    it('onTable', () => {
        const node = {} as any;
        const rows = 'ROWS' as any;
        const table = {
            rows: rows,
        } as any;

        domIndexerImpl.onTable(node, table);

        expect(node).toEqual({
            __roosterjsContentModel: { table },
        });
    });
});

describe('domIndexerImpl.onBlockEntity', () => {
    it('no delimiter', () => {
        const root = document.createElement('div');
        const wrapper = document.createElement('span');

        root.appendChild(wrapper);

        const group = createContentModelDocument();
        const entity = createEntity(wrapper);

        new DomIndexerImpl().onBlockEntity(entity, group);

        expect(root.innerHTML).toEqual('<span></span>');
    });

    it('has delimiters', () => {
        const root = document.createElement('div');
        const wrapper = document.createElement('span');
        const delimiter1 = document.createElement('span');
        const delimiter2 = document.createElement('span');
        const text1 = document.createTextNode(ZERO_WIDTH_SPACE);
        const text2 = document.createTextNode(ZERO_WIDTH_SPACE);

        delimiter1.className = 'entityDelimiterBefore';
        delimiter1.appendChild(text1);
        delimiter2.className = 'entityDelimiterAfter';
        delimiter2.appendChild(text2);

        root.appendChild(delimiter1);
        root.appendChild(wrapper);
        root.appendChild(delimiter2);

        const group = createContentModelDocument();
        const entity = createEntity(wrapper);

        new DomIndexerImpl().onBlockEntity(entity, group);

        expect((text1 as IndexedEntityDelimiter).__roosterjsContentModel).toEqual({
            entity,
            parent: group,
        });
        expect((text2 as IndexedEntityDelimiter).__roosterjsContentModel).toEqual({
            entity,
            parent: group,
        });
    });
});

describe('domIndexImpl.onMergeText', () => {
    it('Two unindexed node', () => {
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test1');
        const div = document.createElement('div');

        div.appendChild(text1);
        div.appendChild(text2);

        new DomIndexerImpl().onMergeText(text1, text2);

        expect(((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel).toBeUndefined();
        expect(((text2 as Node) as IndexedSegmentNode).__roosterjsContentModel).toBeUndefined();
    });

    it('One indexed node, one unindexed node', () => {
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test1');
        const div = document.createElement('div');

        div.appendChild(text1);
        div.appendChild(text2);

        ((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: createParagraph(),
            segments: [],
        };

        new DomIndexerImpl().onMergeText(text1, text2);

        expect(((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel).toBeUndefined();
        expect(((text2 as Node) as IndexedSegmentNode).__roosterjsContentModel).toBeUndefined();
    });

    it('Two separated indexed node', () => {
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test1');
        const div = document.createElement('div');

        div.appendChild(text1);
        div.appendChild(document.createElement('img'));
        div.appendChild(text2);

        const text1Model = createText('test1');
        const text2Model = createText('test2');
        const paragraph = createParagraph();

        paragraph.segments.push(text1Model, text2Model);

        ((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [text1Model],
        };
        ((text2 as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [text2Model],
        };

        new DomIndexerImpl().onMergeText(text1, text2);

        expect(((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel).toEqual({
            paragraph: paragraph,
            segments: [text1Model],
        });
        expect(((text2 as Node) as IndexedSegmentNode).__roosterjsContentModel).toEqual({
            paragraph: paragraph,
            segments: [text2Model],
        });
    });

    it('Two continuous indexed node', () => {
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test1');
        const div = document.createElement('div');

        div.appendChild(text1);
        div.appendChild(text2);

        const text1Model = createText('test1');
        const text2Model = createText('test2');
        const paragraph = createParagraph();

        paragraph.segments.push(text1Model, text2Model);

        ((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [text1Model],
        };
        ((text2 as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [text2Model],
        };

        new DomIndexerImpl().onMergeText(text1, text2);

        expect(((text1 as Node) as IndexedSegmentNode).__roosterjsContentModel).toEqual({
            paragraph: paragraph,
            segments: [text1Model, text2Model],
        });
        expect(((text2 as Node) as IndexedSegmentNode).__roosterjsContentModel).toBeUndefined();
    });
});

describe('domIndexerImpl.reconcileSelection', () => {
    let setSelectionSpy: jasmine.Spy;
    let model: ContentModelDocument;
    let domIndexerImpl: DomIndexerImpl;

    beforeEach(() => {
        model = createContentModelDocument();
        setSelectionSpy = spyOn(setSelection, 'setSelection').and.callThrough();
        domIndexerImpl = new DomIndexerImpl();
    });

    it('no old range, fake range', () => {
        const newRangeEx = {} as any;

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeFalse();
        expect(setSelectionSpy).not.toHaveBeenCalled();
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });

    it('no old range, normal range on indexed text, expanded on same node, reverted', () => {
        const node = document.createTextNode('test') as any;
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 1, node, 3),
            isReverted: true,
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
        expect(model.hasRevertedRangeSelection).toBeTrue();
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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

        expect(result).toBeTrue();
        expect(node1.__roosterjsContentModel).toEqual({
            paragraph,
            segments: [oldSegment1],
        });
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [oldSegment1],
        });
        expect(setSelectionSpy).toHaveBeenCalledWith(model, {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
            isSelected: true,
            isSelectedAsImageSelection: true,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        expect(oldSegment1).toEqual({
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
            isSelected: true,
            isSelectedAsImageSelection: true,
        });
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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

        expect(result).toBeTrue();
        expect(node1.__roosterjsContentModel).toEqual({
            table: tableModel,
        });
        expect(setSelectionSpy).toHaveBeenCalledWith(model, cell10, cell21);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [tableModel],
        });
        expect(model.hasRevertedRangeSelection).toBeFalsy();
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });

    it('has old range, normal range on indexed text, no segment', () => {
        const node1 = document.createTextNode('test1');
        const node2 = document.createTextNode('test2');
        const oldRangeEx: CacheSelection = {
            type: 'range',
            start: {
                node: node1,
                offset: 2,
            },
            end: {
                node: node1,
                offset: 2,
            },
            isReverted: false,
        };
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node2, 2),
            isReverted: false,
        };

        (node1 as any).__roosterjsContentModel = {
            paragraph: createParagraph(),
            segments: [],
        };

        const text2 = createText('text2');
        const para2 = createParagraph();

        para2.segments.push(text2);
        (node2 as any).__roosterjsContentModel = {
            paragraph: para2,
            segments: [text2],
        };

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx, oldRangeEx);

        expect(result).toBeTrue();
        expect(setSelectionSpy).toHaveBeenCalled();
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });

    it('has old range - collapsed, expanded new range', () => {
        const node = document.createTextNode('test') as any;
        const oldRangeEx: CacheSelection = {
            type: 'range',
            start: {
                node,
                offset: 2,
            },
            end: {
                node,
                offset: 2,
            },
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });

    it('has old range - expanded, expanded new range', () => {
        const node = document.createTextNode('test') as any;
        const oldRangeEx: CacheSelection = {
            type: 'range',
            start: {
                node,
                offset: 1,
            },
            end: {
                node,
                offset: 3,
            },
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
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });

    it('block entity: selection in first delimiter', () => {
        const root = document.createElement('div');
        const wrapper = document.createElement('span');
        const delimiter1 = document.createElement('span');
        const delimiter2 = document.createElement('span');
        const text1 = document.createTextNode(ZERO_WIDTH_SPACE);
        const text2 = document.createTextNode(ZERO_WIDTH_SPACE);

        delimiter1.className = 'entityDelimiterBefore';
        delimiter2.className = 'entityDelimiterAfter';
        delimiter1.appendChild(text1);
        delimiter2.appendChild(text2);
        root.appendChild(delimiter1);
        root.appendChild(wrapper);
        root.appendChild(delimiter2);

        const entity = createEntity(wrapper);
        const group = createContentModelDocument();

        group.blocks.push(entity);

        const index1: BlockEntityDelimiterItem = {
            entity: entity,
            parent: group,
        };
        const index2: BlockEntityDelimiterItem = {
            entity: entity,
            parent: group,
        };

        (text1 as IndexedEntityDelimiter).__roosterjsContentModel = index1;
        (text2 as IndexedEntityDelimiter).__roosterjsContentModel = index2;

        const range = document.createRange();
        range.setStart(text1, 0);

        const indexer = new DomIndexerImpl();

        const result = indexer.reconcileSelection(group, {
            type: 'range',
            range: range,
            isReverted: false,
        });

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'SelectionMarker', isSelected: true, format: {} }],
                    format: {},
                    isImplicit: true,
                },
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: { isReadonly: true, id: undefined, entityType: undefined },
                    wrapper: wrapper,
                },
            ],
        });
    });

    it('block entity: selection in last delimiter', () => {
        const root = document.createElement('div');
        const wrapper = document.createElement('span');
        const delimiter1 = document.createElement('span');
        const delimiter2 = document.createElement('span');
        const text1 = document.createTextNode(ZERO_WIDTH_SPACE);
        const text2 = document.createTextNode(ZERO_WIDTH_SPACE);

        delimiter1.className = 'entityDelimiterBefore';
        delimiter2.className = 'entityDelimiterAfter';
        delimiter1.appendChild(text1);
        delimiter2.appendChild(text2);
        root.appendChild(delimiter1);
        root.appendChild(wrapper);
        root.appendChild(delimiter2);

        const entity = createEntity(wrapper);
        const group = createContentModelDocument();

        group.blocks.push(entity);

        const index1: BlockEntityDelimiterItem = {
            entity: entity,
            parent: group,
        };
        const index2: BlockEntityDelimiterItem = {
            entity: entity,
            parent: group,
        };

        (text1 as IndexedEntityDelimiter).__roosterjsContentModel = index1;
        (text2 as IndexedEntityDelimiter).__roosterjsContentModel = index2;

        const range = document.createRange();
        range.setStart(text2, 1);

        const indexer = new DomIndexerImpl();

        const result = indexer.reconcileSelection(group, {
            type: 'range',
            range: range,
            isReverted: false,
        });

        expect(result).toBeTrue();
        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: { isReadonly: true, id: undefined, entityType: undefined },
                    wrapper: wrapper,
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'SelectionMarker', isSelected: true, format: {} }],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('Existing text has link', () => {
        const node = document.createTextNode('test') as any;
        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 2),
            isReverted: false,
        };
        const link: ContentModelLink = {
            dataset: {},
            format: {
                href: 'test',
            },
        };
        const paragraph = createParagraph();
        const segment = createText('', {}, link);

        paragraph.segments.push(segment);
        domIndexerImpl.onSegment(node, paragraph, [segment]);

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 'te',
            format: {},
            link,
        };
        const segment2: ContentModelSegment = {
            segmentType: 'Text',
            text: 'st',
            format: {},
            link,
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
                    link,
                },
                segment2,
            ],
        });
        expect(setSelectionSpy).not.toHaveBeenCalled();
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });

    it('Index segment is not in paragraph, bad index', () => {
        const node = document.createTextNode('test');
        const paragraph = createParagraph();
        const segment = createText('test');

        domIndexerImpl.onSegment(node, paragraph, [segment]);

        const newRangeEx: DOMSelection = {
            type: 'range',
            range: createRange(node, 2),
            isReverted: false,
        };

        expect(((node as Node) as IndexedSegmentNode).__roosterjsContentModel).toEqual({
            paragraph,
            segments: [segment],
        });

        const result = domIndexerImpl.reconcileSelection(model, newRangeEx);

        expect(result).toBeFalse();
        expect(setSelectionSpy).not.toHaveBeenCalled();
        expect(model.hasRevertedRangeSelection).toBeFalsy();
    });
});

describe('domIndexerImpl.reconcileChildList', () => {
    it('Empty array', () => {
        const domIndexer = new DomIndexerImpl(true);
        const result = domIndexer.reconcileChildList([], []);

        expect(result).toBeTrue();
    });

    it('Removed BR, not indexed', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br = document.createElement('br');
        const result = domIndexer.reconcileChildList([], [br]);

        expect(result).toBeFalse();
    });

    it('Removed BR, indexed, segment is not under paragraph', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br: Node = document.createElement('br');

        const paragraph = createParagraph();
        const segment = createBr();

        (br as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segment],
        };

        const result = domIndexer.reconcileChildList([], [br]);

        expect(result).toBeFalse();
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
        });
    });

    it('Removed BR, indexed, segment is under paragraph', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br: Node = document.createElement('br');

        const paragraph = createParagraph();
        const segment1 = createText('test1');
        const segment2 = createBr();
        const segment3 = createText('test3');

        paragraph.segments.push(segment1, segment2, segment3);

        (br as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segment2],
        };

        const result = domIndexer.reconcileChildList([], [br]);

        expect(result).toBeTrue();
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, segment3],
        });
    });

    it('Removed two BR, indexed', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br1: Node = document.createElement('br');
        const br2: Node = document.createElement('br');

        const paragraph = createParagraph();
        const segment1 = createBr();
        const segment2 = createBr();
        const segment3 = createText('test3');

        paragraph.segments.push(segment1, segment2, segment3);

        (br1 as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segment1],
        };

        (br2 as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segment2],
        };

        const result = domIndexer.reconcileChildList([], [br1, br2]);

        expect(result).toBeFalse();
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment1, segment2, segment3],
        });
    });

    it('Added BR', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br: Node = document.createElement('br');

        const result = domIndexer.reconcileChildList([br], []);

        expect(result).toBeFalse();
    });

    it('Added Text', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br: Text = document.createTextNode('test');

        const result = domIndexer.reconcileChildList([], [br]);

        expect(result).toBeFalse();
    });

    it('Added Text, remove BR', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br: Node = document.createElement('br');
        const text: Text = document.createTextNode('test');

        const paragraph = createParagraph();
        const segment = createBr({
            fontSize: '10pt',
        });

        paragraph.segments.push(segment);

        (br as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segment],
        };

        const result = domIndexer.reconcileChildList([text], [br]);

        expect(result).toBeTrue();
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {
                        fontSize: '10pt',
                    },
                },
            ],
        });
    });

    it('Added two Texts, remove BR', () => {
        const domIndexer = new DomIndexerImpl(true);
        const br: Node = document.createElement('br');
        const text1: Text = document.createTextNode('test1');
        const text2: Text = document.createTextNode('test2');

        const paragraph = createParagraph();
        const segment = createBr({
            fontSize: '10pt',
        });

        paragraph.segments.push(segment);

        (br as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segment],
        };

        const result = domIndexer.reconcileChildList([text1, text2], [br]);

        expect(result).toBeFalse();
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [segment],
        });
    });

    it('Added Text after link that contains image and text', () => {
        const domIndexer = new DomIndexerImpl(true);
        const a = document.createElement('a');
        const img = document.createElement('img');
        const text = document.createTextNode('test');
        const newText = document.createTextNode('a');
        const div = document.createElement('div');

        a.appendChild(img);
        a.appendChild(text);
        div.appendChild(a);
        div.appendChild(newText);

        const paragraph = createParagraph();
        const segmentImg = createImage('src');
        const segmentText = createText('test');

        addLink(segmentImg, {
            format: { href: 'test' },
            dataset: {},
        });
        addLink(segmentText, {
            format: { href: 'test' },
            dataset: {},
        });

        paragraph.segments.push(segmentImg, segmentText);

        ((img as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segmentImg],
        };
        ((text as Node) as IndexedSegmentNode).__roosterjsContentModel = {
            paragraph: paragraph,
            segments: [segmentText],
        };

        const result = domIndexer.reconcileChildList([newText], []);

        expect(result).toBeTrue();
        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Image',
                    src: 'src',
                    format: {},
                    dataset: {},
                    link: { format: { href: 'test' }, dataset: {} },
                },
                {
                    segmentType: 'Text',
                    text: 'test',
                    format: {},
                    link: { format: { href: 'test' }, dataset: {} },
                },
                { segmentType: 'Text', text: 'a', format: {} },
            ],
            format: {},
        });
        expect(((newText as Node) as IndexedSegmentNode).__roosterjsContentModel.paragraph).toBe(
            paragraph
        );
        expect(
            ((newText as Node) as IndexedSegmentNode).__roosterjsContentModel.segments.length
        ).toBe(1);
        expect(((newText as Node) as IndexedSegmentNode).__roosterjsContentModel.segments[0]).toBe(
            paragraph.segments[2]
        );
    });
});

describe('domIndexerImpl.reconcileElementId', () => {
    it('unindexed image id', () => {
        const img = document.createElement('img');
        const image = createImage('test');
        const para = createParagraph();

        para.segments.push(image);

        img.id = 'testId';

        const result = new DomIndexerImpl().reconcileElementId(img);

        expect(result).toBe(false);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        });
    });

    it('indexed image id', () => {
        const img = document.createElement('img');
        const image = createImage('test');
        const para = createParagraph();
        const segIndex: SegmentItem = {
            paragraph: para,
            segments: [image],
        };

        para.segments.push(image);

        ((img as Node) as IndexedSegmentNode).__roosterjsContentModel = segIndex;

        img.id = 'testId';

        const result = new DomIndexerImpl().reconcileElementId(img);

        expect(result).toBe(true);
        expect(image).toEqual({
            segmentType: 'Image',
            format: { id: 'testId' },
            src: 'test',
            dataset: {},
        });
    });

    it('unindexed table id', () => {
        const tb = document.createElement('table');

        tb.id = 'testId';

        const result = new DomIndexerImpl().reconcileElementId(tb);

        expect(result).toBe(false);
    });

    it('indexed table id', () => {
        const tb = document.createElement('table');
        const table = createTable(1);
        const tbIndex: TableItem = {
            table: table,
        };

        (tb as IndexedTableElement).__roosterjsContentModel = tbIndex;

        tb.id = 'testId';

        const result = new DomIndexerImpl().reconcileElementId(tb);

        expect(result).toBe(true);
        expect(table).toEqual({
            blockType: 'Table',
            format: { id: 'testId' },
            widths: [],
            dataset: {},
            rows: [
                {
                    height: 0,
                    format: {},
                    cells: [],
                },
            ],
        });
    });
});
