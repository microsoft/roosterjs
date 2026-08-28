import * as cleanForbiddenElementsFile from '../../../lib/dragAndDrop/utils/cleanForbiddenElements';
import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import { handleDroppedExternalContent } from '../../../lib/dragAndDrop/utils/handleDroppedExternalContent';
import {
    ContentModelDocument,
    ContentModelListItem,
    ContentModelParagraph,
    ContentModelText,
    IEditor,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

function createHtmlDataTransfer(html: string): DataTransfer {
    return ({
        types: ['text/html'],
        items: [
            {
                kind: 'string',
                type: 'text/html',
                getAsString: (callback: (value: string) => void) => callback(html),
            },
        ],
        getData: (type: string) => (type === 'text/html' ? html : ''),
    } as any) as DataTransfer;
}

function createPlainTextDataTransfer(text: string): DataTransfer {
    return ({
        types: ['text/plain'],
        items: [
            {
                kind: 'string',
                type: 'text/plain',
                getAsString: (callback: (value: string) => void) => callback(text),
            },
        ],
        getData: (type: string) => (type === 'text/plain' ? text : ''),
    } as any) as DataTransfer;
}

describe('handleDroppedExternalContent', () => {
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

    it('should do nothing when dataTransfer is missing', async () => {
        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            dataTransfer: undefined,
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe']);

        expect(getNodePositionFromEventSpy).not.toHaveBeenCalled();
        expect(htmlToDOMSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(stopPropagationSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when domPosition is null', async () => {
        getNodePositionFromEventSpy.and.returnValue(null);

        const parsedDoc = document.implementation.createHTMLDocument();
        parsedDoc.body.innerHTML = '<p>test</p>';
        htmlToDOMSpy.and.returnValue(parsedDoc);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            dataTransfer: createHtmlDataTransfer('<p>test</p>'),
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe']);

        expect(getNodePositionFromEventSpy).toHaveBeenCalledWith(doc, {}, 100, 200);
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('should prevent native insertion before dropped content is extracted', async () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        let extractContent: (() => void) | undefined;
        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const event = {
            x: 100,
            y: 200,
            dataTransfer: {
                items: [
                    {
                        kind: 'string',
                        type: 'text/plain',
                        getAsString: (callback: (value: string) => void) => {
                            extractContent = () => callback('dropped content');
                        },
                    },
                ],
            },
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        const dropPromise = handleDroppedExternalContent(editor, event, ['iframe']);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).not.toHaveBeenCalled();

        extractContent!();
        await dropPromise;

        expect(formatContentModelSpy).toHaveBeenCalled();
    });

    it('should insert dropped content at the correct position', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p>dropped content</p>'),
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe', 'script']);

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

    it('should create range at correct position', async () => {
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
            dataTransfer: createHtmlDataTransfer('<span>inserted</span>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

        const formatCall = formatContentModelSpy.calls.mostRecent();
        const options = formatCall.args[1];
        const range = options.selectionOverride.range as Range;

        expect(range.startContainer).toBe(textNode);
        expect(range.startOffset).toBe(5);
        expect(range.collapsed).toBe(true);
    });

    it('should call cleanForbiddenElements with correct parameters', async () => {
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
            dataTransfer: createHtmlDataTransfer('<div><iframe></iframe></div>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        const forbiddenElements = ['iframe', 'script', 'object'];
        await handleDroppedExternalContent(editor, event, forbiddenElements);

        expect(cleanForbiddenElementsSpy).toHaveBeenCalledWith(parsedDoc, forbiddenElements);
    });

    it('should insert plain text content when only plain text is available', async () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            dataTransfer: createPlainTextDataTransfer('plain text content'),
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe']);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(htmlToDOMSpy).not.toHaveBeenCalled();
        expect(cleanForbiddenElementsSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();

        const formatCall = formatContentModelSpy.calls.mostRecent();
        const options = formatCall.args[1];
        expect(options.selectionOverride.type).toBe('range');
        expect(options.selectionOverride.isReverted).toBe(false);
    });

    it('should insert an image when a single image file is dropped', async () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const file = new File(['data'], 'image.png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            dataTransfer,
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe']);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(htmlToDOMSpy).not.toHaveBeenCalled();
        expect(cleanForbiddenElementsSpy).not.toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalled();
    });

    it('should handle empty forbidden elements list', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p>content</p>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

        expect(cleanForbiddenElementsSpy).toHaveBeenCalledWith(parsedDoc, []);
        expect(formatContentModelSpy).toHaveBeenCalled();
    });
});

describe('handleDroppedExternalContent - model verification', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let getDOMCreatorSpy: jasmine.Spy;
    let htmlToDOMSpy: jasmine.Spy;
    let capturedCallback: ((model: ContentModelDocument, context: any) => boolean) | null;

    beforeEach(() => {
        doc = document;
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

    it('should merge dropped paragraph with text into model', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p>dropped text</p>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

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

    it('should merge dropped content on an empty line after a list as the last list item', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p>dropped text</p>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const listParagraph = createParagraph();
        const paragraphAfterList = createParagraph();

        listParagraph.segments.push(createText('existing item'));
        listItem.blocks.push(listParagraph);
        paragraphAfterList.segments.push(createSelectionMarker());
        model.blocks.push(listItem, paragraphAfterList);

        expect(capturedCallback).not.toBeNull();
        capturedCallback!(model, {});

        const newListItem = model.blocks[1] as ContentModelListItem;

        expect(newListItem.blockGroupType).toBe('ListItem');
        expect(newListItem.levels).toEqual(listItem.levels);
        expect(newListItem.blocks[0].blockType).toBe('Paragraph');
        expect((newListItem.blocks[0] as ContentModelParagraph).segments).toContain(
            jasmine.objectContaining({
                segmentType: 'Text',
                text: 'dropped text',
            })
        );
        expect(model.blocks[2]).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('should merge dropped bold text into model', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p><b>bold text</b></p>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

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

    it('should merge dropped content into existing model with text', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p>new content</p>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

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

    it('should remove forbidden elements before merging into model', async () => {
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
            dataTransfer: createHtmlDataTransfer(
                '<p>safe content</p><iframe src="bad.com"></iframe>'
            ),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe']);

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

    it('should merge multiple paragraphs into model', async () => {
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
            dataTransfer: createHtmlDataTransfer('<p>first paragraph</p><p>second paragraph</p>'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, []);

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

    it('should merge dropped plain text into model when only plain text is available', async () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const event = {
            x: 0,
            y: 0,
            dataTransfer: createPlainTextDataTransfer('plain dropped text'),
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        await handleDroppedExternalContent(editor, event, ['iframe']);

        // htmlToDOM should not be used for plain text
        expect(htmlToDOMSpy).not.toHaveBeenCalled();

        // Create a model to merge into
        const model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createSelectionMarker());
        model.blocks.push(para);

        // Execute the captured callback
        expect(capturedCallback).not.toBeNull();
        const result = capturedCallback!(model, {});

        expect(result).toBe(true);

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

        expect(textSegments.some(seg => seg.text === 'plain dropped text')).toBe(true);
    });
});
