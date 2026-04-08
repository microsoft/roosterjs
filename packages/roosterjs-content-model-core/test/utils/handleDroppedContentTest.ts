import * as cleanForbiddenElementsFile from '../../lib/utils/cleanForbiddenElements';
import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import { handleDroppedContent } from '../../lib/utils/handleDroppedContent';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    IEditor,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('handleDroppedContent', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let getDOMCreatorSpy: jasmine.Spy;
    let htmlToDOMSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let cleanForbiddenElementsSpy: jasmine.Spy;

    beforeEach(() => {
        doc = document;

        getNodePositionFromEventSpy = spyOn(
            getNodePositionFromEventFile,
            'getNodePositionFromEvent'
        );
        cleanForbiddenElementsSpy = spyOn(cleanForbiddenElementsFile, 'cleanForbiddenElements');

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});
        htmlToDOMSpy = jasmine.createSpy('htmlToDOM');
        getDOMCreatorSpy = jasmine.createSpy('getDOMCreator').and.returnValue({
            htmlToDOM: htmlToDOMSpy,
        });
        formatContentModelSpy = jasmine.createSpy('formatContentModel');

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
            getDOMCreator: getDOMCreatorSpy,
            formatContentModel: formatContentModelSpy,
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

        handleDroppedContent(editor, event, '<p>test</p>', ['iframe']);

        expect(getNodePositionFromEventSpy).toHaveBeenCalledWith(doc, {}, 100, 200);
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(htmlToDOMSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('should insert dropped content at the correct position', () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 2,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>dropped content</p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        handleDroppedContent(editor, event, '<p>dropped content</p>', ['iframe', 'script']);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(htmlToDOMSpy).toHaveBeenCalledWith('<p>dropped content</p>');
        expect(cleanForbiddenElementsSpy).toHaveBeenCalledWith(parsedDoc, ['iframe', 'script']);
        expect(formatContentModelSpy).toHaveBeenCalled();

        const formatCall = formatContentModelSpy.calls.mostRecent();
        const options = formatCall.args[1];
        expect(options.selectionOverride.type).toBe('range');
        expect(options.selectionOverride.isReverted).toBe(false);
    });

    it('should create range at correct position', () => {
        const container = document.createElement('div');
        container.innerHTML = 'hello world';
        const textNode = container.firstChild!;

        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 5,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<span>inserted</span>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 50,
            y: 75,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<span>inserted</span>', []);

        const formatCall = formatContentModelSpy.calls.mostRecent();
        const options = formatCall.args[1];
        const range = options.selectionOverride.range as Range;

        expect(range.startContainer).toBe(textNode);
        expect(range.startOffset).toBe(5);
        expect(range.collapsed).toBe(true);
    });

    it('should call cleanForbiddenElements with correct parameters', () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<div><iframe></iframe></div>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        const forbiddenElements = ['iframe', 'script', 'object'];
        handleDroppedContent(editor, event, '<div><iframe></iframe></div>', forbiddenElements);

        expect(cleanForbiddenElementsSpy).toHaveBeenCalledWith(parsedDoc, forbiddenElements);
    });

    it('should handle empty forbidden elements list', () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>content</p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<p>content</p>', []);

        expect(cleanForbiddenElementsSpy).toHaveBeenCalledWith(parsedDoc, []);
        expect(formatContentModelSpy).toHaveBeenCalled();
    });
});

describe('handleDroppedContent - model verification', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let getDOMCreatorSpy: jasmine.Spy;
    let htmlToDOMSpy: jasmine.Spy;
    let capturedModel: ContentModelDocument | null;
    let capturedCallback: ((model: ContentModelDocument, context: any) => boolean) | null;

    beforeEach(() => {
        doc = document;
        capturedModel = null;
        capturedCallback = null;

        getNodePositionFromEventSpy = spyOn(
            getNodePositionFromEventFile,
            'getNodePositionFromEvent'
        );

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});
        htmlToDOMSpy = jasmine.createSpy('htmlToDOM');
        getDOMCreatorSpy = jasmine.createSpy('getDOMCreator').and.returnValue({
            htmlToDOM: htmlToDOMSpy,
        });

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
            getDOMCreator: getDOMCreatorSpy,
            formatContentModel: (callback: any, _options: any) => {
                capturedCallback = callback;
            },
        } as any) as IEditor;
    });

    it('should merge dropped paragraph with text into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>dropped text</p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<p>dropped text</p>', []);

        // Create a model to merge into
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createSelectionMarker());
        model.blocks.push(para);

        // Execute the captured callback
        expect(capturedCallback).not.toBeNull();
        const result = capturedCallback!(model, {});

        expect(result).toBe(true);
        // Verify model has been modified - should now contain the dropped content
        expect(model.blocks.length).toBeGreaterThan(0);

        // Find text segments in the model
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

        expect(textSegments.length).toBeGreaterThan(0);
        expect(textSegments.some(seg => seg.text === 'dropped text')).toBe(true);
    });

    it('should merge dropped bold text into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p><b>bold text</b></p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<p><b>bold text</b></p>', []);

        // Create initial model with selection
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createSelectionMarker());
        model.blocks.push(para);

        // Execute callback
        expect(capturedCallback).not.toBeNull();
        const result = capturedCallback!(model, {});

        expect(result).toBe(true);

        // Find text segments and verify bold formatting
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

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>new content</p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<p>new content</p>', []);

        // Create model with existing text
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createText('existing text'), createSelectionMarker());
        model.blocks.push(para);

        // Verify initial state
        expect(model.blocks.length).toBe(1);

        // Execute callback
        expect(capturedCallback).not.toBeNull();
        const result = capturedCallback!(model, {});

        expect(result).toBe(true);

        // Find all text in the model after merge
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

        // Model should contain both existing and new content
        expect(allText.some(text => text.includes('existing text'))).toBe(true);
        expect(allText.some(text => text === 'new content')).toBe(true);
    });

    it('should remove forbidden elements before merging into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>safe content</p><iframe src="bad.com"></iframe>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<p>safe content</p><iframe src="bad.com"></iframe>', [
            'iframe',
        ]);

        // Create model
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createSelectionMarker());
        model.blocks.push(para);

        // Execute callback
        expect(capturedCallback).not.toBeNull();
        const result = capturedCallback!(model, {});

        expect(result).toBe(true);

        // Verify no iframe entity in the model (iframe would become an entity)
        let hasIframeEntity = false;
        model.blocks.forEach(block => {
            if (block.blockType === 'Entity') {
                const wrapper = (block as any).wrapper as HTMLElement;
                if (wrapper?.tagName?.toLowerCase() === 'iframe') {
                    hasIframeEntity = true;
                }
            }
        });

        expect(hasIframeEntity).toBe(false);

        // Verify safe content is present
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

        expect(textSegments.some(seg => seg.text === 'safe content')).toBe(true);
    });

    it('should merge multiple paragraphs into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>first paragraph</p><p>second paragraph</p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedContent(editor, event, '<p>first paragraph</p><p>second paragraph</p>', []);

        // Create model
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createSelectionMarker());
        model.blocks.push(para);

        // Execute callback
        expect(capturedCallback).not.toBeNull();
        const result = capturedCallback!(model, {});

        expect(result).toBe(true);

        // Find all text content
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

        expect(allText.some(text => text === 'first paragraph')).toBe(true);
        expect(allText.some(text => text === 'second paragraph')).toBe(true);
    });
});
