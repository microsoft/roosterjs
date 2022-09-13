import * as generalBlockProcessor from '../../../lib/domToModel/processors/generalBlockProcessor';
import * as generalSegmentProcessor from '../../../lib/domToModel/processors/generalSegmentProcessor';
import * as textProcessor from '../../../lib/domToModel/processors/textProcessor';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { containerProcessor } from '../../../lib/domToModel/processors/containerProcessor';
import { ContentModelDocument } from '../../../lib/publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createText } from '../../../lib/modelApi/creators/createText';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';

describe('containerProcessor', () => {
    let doc: ContentModelDocument;
    let context: DomToModelContext;

    beforeEach(() => {
        doc = createContentModelDocument(document);
        context = createDomToModelContext();
        spyOn(generalBlockProcessor, 'generalBlockProcessor');
        spyOn(generalSegmentProcessor, 'generalSegmentProcessor');
        spyOn(textProcessor, 'textProcessor');
    });

    it('Process a document fragment', () => {
        const fragment = document.createDocumentFragment();

        containerProcessor(doc, fragment, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(generalBlockProcessor.generalBlockProcessor).not.toHaveBeenCalled();
        expect(generalSegmentProcessor.generalSegmentProcessor).not.toHaveBeenCalled();
        expect(textProcessor.textProcessor).not.toHaveBeenCalled();
    });

    it('Process an empty DIV', () => {
        const div = document.createElement('div');

        containerProcessor(doc, div, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(generalBlockProcessor.generalBlockProcessor).not.toHaveBeenCalled();
        expect(generalSegmentProcessor.generalSegmentProcessor).not.toHaveBeenCalled();
        expect(textProcessor.textProcessor).not.toHaveBeenCalled();
    });

    it('Process a DIV with text node', () => {
        const div = document.createElement('div');
        div.textContent = 'test';

        containerProcessor(doc, div, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(generalBlockProcessor.generalBlockProcessor).not.toHaveBeenCalled();
        expect(generalSegmentProcessor.generalSegmentProcessor).not.toHaveBeenCalled();
        expect(textProcessor.textProcessor).toHaveBeenCalledTimes(1);
        expect(textProcessor.textProcessor).toHaveBeenCalledWith(doc, 'test', context);
    });

    it('Process a DIV with SPAN node', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        containerProcessor(doc, div, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(generalBlockProcessor.generalBlockProcessor).not.toHaveBeenCalled();
        expect(generalSegmentProcessor.generalSegmentProcessor).toHaveBeenCalledTimes(1);
        expect(generalSegmentProcessor.generalSegmentProcessor).toHaveBeenCalledWith(
            doc,
            span,
            context
        );
        expect(textProcessor.textProcessor).not.toHaveBeenCalled();
    });

    it('Process a DIV with SPAN, DIV and text node', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const innerDiv = document.createElement('div');
        const text = document.createTextNode('test');
        div.appendChild(span);
        div.appendChild(innerDiv);
        div.appendChild(text);

        containerProcessor(doc, div, context);

        expect(doc).toEqual({
            blockType: 'BlockGroup',
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(generalBlockProcessor.generalBlockProcessor).toHaveBeenCalledTimes(1);
        expect(generalBlockProcessor.generalBlockProcessor).toHaveBeenCalledWith(
            doc,
            innerDiv,
            context
        );
        expect(generalSegmentProcessor.generalSegmentProcessor).toHaveBeenCalledTimes(1);
        expect(generalSegmentProcessor.generalSegmentProcessor).toHaveBeenCalledWith(
            doc,
            span,
            context
        );
        expect(textProcessor.textProcessor).toHaveBeenCalledTimes(1);
        expect(textProcessor.textProcessor).toHaveBeenCalledWith(doc, 'test', context);
    });
});

describe('containerProcessor', () => {
    let doc: ContentModelDocument;
    let context: DomToModelContext;

    beforeEach(() => {
        doc = createContentModelDocument(document);
        context = createDomToModelContext();
        spyOn(generalSegmentProcessor, 'generalSegmentProcessor').and.callFake(
            (group, element, context) => {
                const segment = createText(element.textContent!) as any;

                if (context.isInSelection) {
                    segment.isSelected = true;
                }

                addSegment(group, segment);
            }
        );
    });

    it('Process a DIV with element selection', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span>test1</span><span>test2</span><span>test3</span>';
        context.regularSelection = {
            startContainer: div,
            startOffset: 1,
            endContainer: div,
            endOffset: 2,
            isSelectionCollapsed: false,
        };

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
        });
    });

    it('Process a DIV with element collapsed selection', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span>test1</span><span>test2</span><span>test3</span>';
        context.regularSelection = {
            startContainer: div,
            startOffset: 1,
            endContainer: div,
            endOffset: 1,
            isSelectionCollapsed: true,
        };

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2', format: {} },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
        });
    });

    it('Process a DIV with SPAN and text selection', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test1test2test3';
        context.regularSelection = {
            startContainer: div.firstChild!,
            startOffset: 5,
            endContainer: div.firstChild!,
            endOffset: 10,
            isSelectionCollapsed: false,
        };

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
        });
    });

    it('Process a DIV with SPAN and collapsed text selection', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test1test2test3';
        context.regularSelection = {
            startContainer: div.firstChild!,
            startOffset: 5,
            endContainer: div.firstChild!,
            endOffset: 5,
            isSelectionCollapsed: true,
        };

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1', format: {} },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test2test3', format: {} },
            ],
            isImplicit: true,
        });
    });

    // Skip this test for now, we will reenable it once we are ready to write e2e test case of creating model from dom
    it('Process a DIV with mixed selection', () => {
        const div = document.createElement('div');
        div.innerHTML = '<span>test1</span>test2test3';
        context.regularSelection = {
            startContainer: div.firstChild!,
            startOffset: 1,
            endContainer: div.lastChild!,
            endOffset: 5,
            isSelectionCollapsed: false,
        };

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'Text', text: 'test1test2', format: {} },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                { segmentType: 'Text', text: 'test3', format: {} },
            ],
            isImplicit: true,
        });
    });

    it('Process with segment format', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';
        context.segmentFormat = { a: 'b' } as any;

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [{ segmentType: 'Text', text: 'test', format: { a: 'b' } as any }],
            isImplicit: true,
        });
    });

    it('Process with segment format and selection marker', () => {
        const div = document.createElement('div');
        context.segmentFormat = { a: 'b' } as any;
        context.regularSelection = {
            startContainer: div,
            startOffset: 0,
            endContainer: div,
            endOffset: 0,
            isSelectionCollapsed: true,
        };

        containerProcessor(doc, div, context);

        expect(context.isInSelection).toBeFalse();
        expect(doc.blocks[0]).toEqual({
            blockType: 'Paragraph',
            segments: [
                { segmentType: 'SelectionMarker', format: { a: 'b' } as any, isSelected: true },
            ],
            isImplicit: true,
        });
    });
});
