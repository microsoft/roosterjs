import * as formatInsertPointWithContentModelFile from 'roosterjs-content-model-api/lib/publicApi/utils/formatInsertPointWithContentModel';
import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import { handleDroppedInternalContent } from '../../../lib/dragAndDrop/utils/handleDroppedInternalContent';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
    IEditor,
    InsertPoint,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('handleDroppedInternalContent', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let formatInsertPointWithContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        doc = document;

        getNodePositionFromEventSpy = spyOn(
            getNodePositionFromEventFile,
            'getNodePositionFromEvent'
        );
        formatInsertPointWithContentModelSpy = spyOn(
            formatInsertPointWithContentModelFile,
            'formatInsertPointWithContentModel'
        );

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
        } as any) as IEditor;
    });

    it('should do nothing when domPosition is null', () => {
        getNodePositionFromEventSpy.and.returnValue(null);
        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        const droppedModel = createContentModelDocument();

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(getNodePositionFromEventSpy).toHaveBeenCalledWith(doc, {}, 100, 200);
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(formatInsertPointWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('should insert dropped content at the correct position', () => {
        const textNode = document.createTextNode('test');
        const domPosition = {
            node: textNode,
            offset: 2,
        };
        getNodePositionFromEventSpy.and.returnValue(domPosition);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        const droppedModel = createContentModelDocument();

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(getNodePositionFromEventSpy).toHaveBeenCalledWith(doc, {}, 100, 200);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(formatInsertPointWithContentModelSpy).toHaveBeenCalled();

        const formatCall = formatInsertPointWithContentModelSpy.calls.mostRecent();
        expect(formatCall.args[0]).toBe(editor);
        expect(formatCall.args[1]).toBe(domPosition as any);
        expect(typeof formatCall.args[2]).toBe('function');
    });

    it('should not fail when insertPoint is undefined', () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        const droppedModel = createContentModelDocument();

        handleDroppedInternalContent(editor, event, droppedModel);

        const callback = formatInsertPointWithContentModelSpy.calls.mostRecent().args[2];
        const model = createContentModelDocument();

        // Should not throw when insertPoint is undefined
        expect(() => callback(model, {}, undefined)).not.toThrow();
    });
});

describe('handleDroppedInternalContent - model verification', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let capturedCallback:
        | ((
              model: ContentModelDocument,
              context: FormatContentModelContext,
              insertPoint?: InsertPoint
          ) => void)
        | null;

    beforeEach(() => {
        doc = document;
        capturedCallback = null;

        getNodePositionFromEventSpy = spyOn(
            getNodePositionFromEventFile,
            'getNodePositionFromEvent'
        );

        spyOn(
            formatInsertPointWithContentModelFile,
            'formatInsertPointWithContentModel'
        ).and.callFake((_editor: any, _insertPoint: any, callback: any) => {
            capturedCallback = callback;
        });

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
        } as any) as IEditor;
    });

    function createInsertPointModel(): {
        model: ContentModelDocument;
        insertPoint: InsertPoint;
    } {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const marker = createSelectionMarker();

        paragraph.segments.push(marker);
        model.blocks.push(paragraph);

        const insertPoint: InsertPoint = {
            marker,
            paragraph,
            path: [model],
        };

        return { model, insertPoint };
    }

    function getAllText(model: ContentModelDocument): string[] {
        const allText: string[] = [];

        model.blocks.forEach(block => {
            if (block.blockType === 'Paragraph') {
                (block as ContentModelParagraph).segments.forEach(segment => {
                    if (segment.segmentType === 'Text') {
                        allText.push((segment as ContentModelText).text);
                    }
                });
            }
        });

        return allText;
    }

    it('should merge dropped paragraph with text into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(createText('dropped text'));
        droppedModel.blocks.push(droppedParagraph);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        expect(getAllText(model).some(text => text === 'dropped text')).toBe(true);
    });

    it('should merge dropped bold text into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        const boldText = createText('bold text', { fontWeight: 'bold' });
        droppedParagraph.segments.push(boldText);
        droppedModel.blocks.push(droppedParagraph);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        const textSegments: ContentModelText[] = [];
        model.blocks.forEach(block => {
            if (block.blockType === 'Paragraph') {
                (block as ContentModelParagraph).segments.forEach(segment => {
                    if (segment.segmentType === 'Text') {
                        textSegments.push(segment as ContentModelText);
                    }
                });
            }
        });

        const boldSegment = textSegments.find(seg => seg.text === 'bold text');
        expect(boldSegment).toBeDefined();
        expect(boldSegment?.format.fontWeight).toBe('bold');
    });

    it('should merge dropped content into existing model with text', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(createText('new content'));
        droppedModel.blocks.push(droppedParagraph);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(capturedCallback).not.toBeNull();

        // Build a model that already has some text before the insert point
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        paragraph.segments.push(createText('existing text'), marker);
        model.blocks.push(paragraph);

        const insertPoint: InsertPoint = {
            marker,
            paragraph,
            path: [model],
        };

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        const allText = getAllText(model);
        expect(allText.some(text => text.includes('existing text'))).toBe(true);
        expect(allText.some(text => text === 'new content')).toBe(true);
    });

    it('should merge multiple dropped paragraphs into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const firstParagraph = createParagraph();
        firstParagraph.segments.push(createText('first paragraph'));
        const secondParagraph = createParagraph();
        secondParagraph.segments.push(createText('second paragraph'));
        droppedModel.blocks.push(firstParagraph, secondParagraph);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        const allText = getAllText(model);
        expect(allText.some(text => text === 'first paragraph')).toBe(true);
        expect(allText.some(text => text === 'second paragraph')).toBe(true);
    });

    it('should set selection after merging dropped content', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(createText('dropped text'));
        droppedModel.blocks.push(droppedParagraph);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event, droppedModel);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        // Collect all selected segments in the model
        const selectedSegments: ContentModelText[] = [];
        let hasSelectionMarker = false;
        model.blocks.forEach(block => {
            if (block.blockType === 'Paragraph') {
                (block as ContentModelParagraph).segments.forEach(segment => {
                    if (segment.isSelected) {
                        if (segment.segmentType === 'Text') {
                            selectedSegments.push(segment as ContentModelText);
                        }
                        if (segment.segmentType === 'SelectionMarker') {
                            hasSelectionMarker = true;
                        }
                    }
                });
            }
        });

        // The dropped text should be within the resulting selection
        expect(
            hasSelectionMarker || selectedSegments.some(seg => seg.text === 'dropped text')
        ).toBe(true);
    });
});
