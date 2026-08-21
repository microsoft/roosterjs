import * as cloneModelFile from 'roosterjs-content-model-dom/lib/modelApi/editing/cloneModel';
import * as deleteSelectionFile from 'roosterjs-content-model-dom/lib/modelApi/editing/deleteSelection';
import * as formatInsertPointWithContentModelFile from 'roosterjs-content-model-api/lib/publicApi/utils/formatInsertPointWithContentModel';
import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import * as trimModelForSelectionFile from 'roosterjs-content-model-dom/lib/domUtils/selection/trimModelForSelection';
import { handleDroppedInternalContent } from '../../../lib/dragAndDrop/utils/handleDroppedInternalContent';
import {
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelListItem,
    ContentModelParagraph,
    ContentModelTable,
    ContentModelText,
    DOMSelection,
    FormatContentModelContext,
    IEditor,
    InsertPoint,
} from 'roosterjs-content-model-types';
import {
    createBr,
    createContentModelDocument,
    createEntity,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';
import { reorderList } from '../../../lib/dragAndDrop/utils/reorderList';

describe('handleDroppedInternalContent', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let formatInsertPointWithContentModelSpy: jasmine.Spy;
    let selection: DOMSelection;

    beforeEach(() => {
        doc = document;
        selection = { type: 'range' } as any;

        getNodePositionFromEventSpy = spyOn(
            getNodePositionFromEventFile,
            'getNodePositionFromEvent'
        );
        formatInsertPointWithContentModelSpy = spyOn(
            formatInsertPointWithContentModelFile,
            'formatInsertPointWithContentModel'
        );

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue(selection);

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
            getDOMSelection: getDOMSelectionSpy,
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

        handleDroppedInternalContent(editor, event);

        expect(getNodePositionFromEventSpy).toHaveBeenCalledWith(doc, {}, 100, 200);
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(formatInsertPointWithContentModelSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when there is no selection', () => {
        const textNode = document.createTextNode('test');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 2,
        });
        getDOMSelectionSpy.and.returnValue(null);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');

        const event = {
            x: 100,
            y: 200,
            preventDefault: preventDefaultSpy,
            stopPropagation: stopPropagationSpy,
        } as any;

        handleDroppedInternalContent(editor, event);

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

        handleDroppedInternalContent(editor, event);

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

        handleDroppedInternalContent(editor, event);

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
    let getDOMSelectionSpy: jasmine.Spy;
    let cloneModelForPasteSpy: jasmine.Spy;
    let trimModelForSelectionSpy: jasmine.Spy;
    let selection: DOMSelection;
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
        selection = { type: 'range' } as any;

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

        // The dropped content is a clone of the current model trimmed for the current
        // selection. Control what gets merged by stubbing these helpers so the merge
        // behavior can be verified directly.
        cloneModelForPasteSpy = spyOn(cloneModelFile, 'cloneModelForPaste');
        trimModelForSelectionSpy = spyOn(trimModelForSelectionFile, 'trimModelForSelection');

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue(selection);

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
            getDOMSelection: getDOMSelectionSpy,
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

    function getAllEntities(model: ContentModelDocument): ContentModelEntity[] {
        const entities: ContentModelEntity[] = [];

        model.blocks.forEach(block => {
            if (block.blockType === 'Entity') {
                entities.push(block as ContentModelEntity);
            } else if (block.blockType === 'Paragraph') {
                (block as ContentModelParagraph).segments.forEach(segment => {
                    if (segment.segmentType === 'Entity') {
                        entities.push(segment as ContentModelEntity);
                    }
                });
            }
        });

        return entities;
    }

    function createMergeContext(): FormatContentModelContext {
        return {
            newEntities: [],
            newImages: [],
            deletedEntities: [],
        } as FormatContentModelContext;
    }

    function getAllTextDeep(group: ContentModelBlockGroup): string[] {
        const allText: string[] = [];

        group.blocks.forEach(block => {
            if (block.blockType === 'Paragraph') {
                block.segments.forEach(segment => {
                    if (segment.segmentType === 'Text') {
                        allText.push(segment.text);
                    }
                });
            } else if (block.blockType === 'Table') {
                block.rows.forEach(row => {
                    row.cells.forEach(cell => {
                        allText.push(...getAllTextDeep(cell));
                    });
                });
            } else if (block.blockType === 'BlockGroup') {
                allText.push(...getAllTextDeep(block));
            }
        });

        return allText;
    }

    function getAllTables(model: ContentModelDocument): ContentModelTable[] {
        return model.blocks.filter(
            (block): block is ContentModelTable => block.blockType === 'Table'
        );
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
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        expect(cloneModelForPasteSpy).toHaveBeenCalledWith(model);
        expect(trimModelForSelectionSpy).toHaveBeenCalledWith(droppedModel, selection);
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
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

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
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

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
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        const allText = getAllText(model);
        expect(allText.some(text => text === 'first paragraph')).toBe(true);
        expect(allText.some(text => text === 'second paragraph')).toBe(true);
    });

    it('should merge dropped content on an empty line after a list as the last list item', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();

        droppedParagraph.segments.push(createText('dropped text'));
        droppedModel.blocks.push(droppedParagraph);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            ctrlKey: true,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const listParagraph = createParagraph();
        const paragraphAfterList = createParagraph();
        const marker = createSelectionMarker();

        listParagraph.segments.push(createText('existing item'));
        listItem.blocks.push(listParagraph);
        paragraphAfterList.segments.push(marker);
        model.blocks.push(listItem, paragraphAfterList);

        const insertPoint: InsertPoint = {
            marker,
            paragraph: paragraphAfterList,
            path: [model],
        };

        expect(capturedCallback).not.toBeNull();
        capturedCallback!(model, createMergeContext(), insertPoint);

        const newListItem = model.blocks[1] as ContentModelListItem;

        expect(newListItem.blockGroupType).toBe('ListItem');
        expect(newListItem.levels).toEqual(listItem.levels);
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
        expect(getAllTextDeep(model)).toEqual(['existing item', 'dropped text']);
    });

    it('should reorder list items when moving a list item out of the list', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const droppedModel = createContentModelDocument();
        const droppedListItem = createListItem([createListLevel('UL')]);
        const droppedParagraph = createParagraph();

        droppedParagraph.segments.push(createText('item 2'));
        droppedListItem.blocks.push(droppedParagraph);
        droppedModel.blocks.push(droppedListItem);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const model = createContentModelDocument();
        const firstListItem = createListItem([createListLevel('UL')]);
        const secondListItem = createListItem([createListLevel('UL')]);
        const firstParagraph = createParagraph();
        const secondParagraph = createParagraph();
        const targetParagraph = createParagraph();
        const marker = createSelectionMarker();
        const selectedText = createText('item 2');

        marker.isSelected = false;
        selectedText.isSelected = true;
        firstParagraph.segments.push(createText('item 1'));
        secondParagraph.segments.push(selectedText);
        targetParagraph.segments.push(createText('outside list'), marker, createBr());
        firstListItem.blocks.push(firstParagraph);
        secondListItem.blocks.push(secondParagraph);
        model.blocks.push(firstListItem, secondListItem, targetParagraph);

        const insertPoint: InsertPoint = {
            marker,
            paragraph: targetParagraph,
            path: [model],
        };

        capturedCallback!(model, createMergeContext(), insertPoint);

        expect(getAllTextDeep(model)).toEqual(['item 1', 'outside list', 'item 2']);
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
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

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

    it('should merge dropped inline entity into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const wrapper = document.createElement('span');
        wrapper.textContent = 'inline entity';
        const entity = createEntity(wrapper, true, {}, 'MyInlineEntity', 'entity-1');

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(entity);
        droppedModel.blocks.push(droppedParagraph);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const entities = getAllEntities(model);
        const droppedEntity = entities.find(e => e.entityFormat.id === 'entity-1');
        expect(droppedEntity).toBeDefined();
        expect(droppedEntity?.segmentType).toBe('Entity');
        expect(droppedEntity?.entityFormat.entityType).toBe('MyInlineEntity');
        expect(droppedEntity?.wrapper).toBe(wrapper);
    });

    it('should merge dropped block-level entity into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const wrapper = document.createElement('div');
        wrapper.textContent = 'block entity';
        const entity = createEntity(wrapper, true, {}, 'MyBlockEntity', 'block-entity-1');

        const droppedModel = createContentModelDocument();
        droppedModel.blocks.push(entity);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const entities = getAllEntities(model);
        const droppedEntity = entities.find(e => e.entityFormat.id === 'block-entity-1');
        expect(droppedEntity).toBeDefined();
        expect(droppedEntity?.blockType).toBe('Entity');
        expect(droppedEntity?.entityFormat.entityType).toBe('MyBlockEntity');
        expect(droppedEntity?.wrapper).toBe(wrapper);
    });

    it('should merge dropped content with text and entity into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const wrapper = document.createElement('span');
        wrapper.textContent = 'entity';
        const entity = createEntity(wrapper, true, {}, 'MixedEntity', 'mixed-entity-1');

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(createText('before '), entity, createText(' after'));
        droppedModel.blocks.push(droppedParagraph);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const allText = getAllText(model);
        expect(allText.some(text => text === 'before ')).toBe(true);
        expect(allText.some(text => text === ' after')).toBe(true);

        const entities = getAllEntities(model);
        expect(entities.some(e => e.entityFormat.id === 'mixed-entity-1')).toBe(true);
    });

    it('should preserve readonly flag of dropped entity', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const wrapper = document.createElement('span');
        wrapper.textContent = 'editable entity';
        const entity = createEntity(wrapper, false, {}, 'EditableEntity', 'editable-entity-1');

        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(entity);
        droppedModel.blocks.push(droppedParagraph);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const entities = getAllEntities(model);
        const droppedEntity = entities.find(e => e.entityFormat.id === 'editable-entity-1');
        expect(droppedEntity).toBeDefined();
        expect(droppedEntity?.entityFormat.isReadonly).toBe(false);
    });

    it('should merge partially dragged text into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        // Dragging only part of a text selection results in a trimmed model that
        // contains just the selected portion of the original text.
        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(createText('partial'));
        droppedModel.blocks.push(droppedParagraph);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        // The clone is trimmed for the current selection so only the selected text is dropped
        expect(cloneModelForPasteSpy).toHaveBeenCalledWith(model);
        expect(trimModelForSelectionSpy).toHaveBeenCalledWith(droppedModel, selection);

        const allText = getAllText(model);
        expect(allText.some(text => text === 'partial')).toBe(true);
    });

    it('should merge partially dragged text preserving its formatting', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        // A partial selection that starts in the middle of a formatted run keeps its format
        const droppedModel = createContentModelDocument();
        const droppedParagraph = createParagraph();
        droppedParagraph.segments.push(createText('lic text', { italic: true }));
        droppedModel.blocks.push(droppedParagraph);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const textSegments: ContentModelText[] = [];
        model.blocks.forEach(block => {
            if (block.blockType === 'Paragraph') {
                block.segments.forEach(segment => {
                    if (segment.segmentType === 'Text') {
                        textSegments.push(segment);
                    }
                });
            }
        });

        const partialSegment = textSegments.find(seg => seg.text === 'lic text');
        expect(partialSegment).toBeDefined();
        expect(partialSegment?.format.italic).toBe(true);
    });

    it('should merge dragged table cells into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        // Dragging table cells results in a trimmed model containing a table
        const droppedModel = createContentModelDocument();
        const table = createTable(2);

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const cell = createTableCell();
                const cellParagraph = createParagraph();
                cellParagraph.segments.push(createText(`cell-${row}-${col}`));
                cell.blocks.push(cellParagraph);
                table.rows[row].cells.push(cell);
            }
        }

        droppedModel.blocks.push(table);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const tables = getAllTables(model);
        expect(tables.length).toBe(1);
        expect(tables[0].rows.length).toBe(2);
        expect(tables[0].rows[0].cells.length).toBe(2);

        const allText = getAllTextDeep(model);
        expect(allText).toContain('cell-0-0');
        expect(allText).toContain('cell-0-1');
        expect(allText).toContain('cell-1-0');
        expect(allText).toContain('cell-1-1');
    });

    it('should merge a partial selection of table cells into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        // Selecting only some cells of a table yields a trimmed table where the
        // unselected cells are emptied out.
        const droppedModel = createContentModelDocument();
        const table = createTable(2);

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const cell = createTableCell();
                const cellParagraph = createParagraph();
                const isSelected = col === 0;
                cellParagraph.segments.push(createText(isSelected ? `selected-${row}` : ''));
                cell.blocks.push(cellParagraph);
                table.rows[row].cells.push(cell);
            }
        }

        droppedModel.blocks.push(table);
        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        expect(trimModelForSelectionSpy).toHaveBeenCalledWith(droppedModel, selection);

        const tables = getAllTables(model);
        expect(tables.length).toBe(1);

        const allText = getAllTextDeep(model);
        expect(allText).toContain('selected-0');
        expect(allText).toContain('selected-1');
    });

    it('should merge dragged text mixed with a table into model', () => {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        // A selection that spans partial text followed by a table cell
        const droppedModel = createContentModelDocument();

        const leadingParagraph = createParagraph();
        leadingParagraph.segments.push(createText('trailing text'));
        droppedModel.blocks.push(leadingParagraph);

        const table = createTable(1);
        const cell = createTableCell();
        const cellParagraph = createParagraph();
        cellParagraph.segments.push(createText('cell content'));
        cell.blocks.push(cellParagraph);
        table.rows[0].cells.push(cell);
        droppedModel.blocks.push(table);

        cloneModelForPasteSpy.and.returnValue(droppedModel);

        const event = {
            x: 0,
            y: 0,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, createMergeContext(), insertPoint);

        const tables = getAllTables(model);
        expect(tables.length).toBe(1);

        const allText = getAllTextDeep(model);
        expect(allText).toContain('trailing text');
        expect(allText).toContain('cell content');
    });
});

describe('handleDroppedInternalContent - ctrl key', () => {
    let editor: IEditor;
    let doc: Document;
    let getNodePositionFromEventSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let deleteSelectionSpy: jasmine.Spy;
    let selection: DOMSelection;
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
        selection = { type: 'range' } as any;

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

        // Stub the clone/trim helpers so the merge does not depend on real content, and
        // spy on the delete helpers to verify whether the original selection is removed.
        spyOn(cloneModelFile, 'cloneModelForPaste').and.returnValue(createContentModelDocument());
        spyOn(trimModelForSelectionFile, 'trimModelForSelection');
        deleteSelectionSpy = spyOn(deleteSelectionFile, 'deleteSelection').and.returnValue({
            deleteResult: 'range',
        } as any);

        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({});
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue(selection);

        editor = ({
            getDocument: () => doc,
            getDOMHelper: getDOMHelperSpy,
            getDOMSelection: getDOMSelectionSpy,
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

    function runWithCtrlKey(ctrlKey: boolean): ContentModelDocument {
        const textNode = document.createTextNode('existing');
        getNodePositionFromEventSpy.and.returnValue({
            node: textNode,
            offset: 0,
        });

        const event = {
            x: 0,
            y: 0,
            ctrlKey,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        handleDroppedInternalContent(editor, event);

        expect(capturedCallback).not.toBeNull();

        const { model, insertPoint } = createInsertPointModel();

        capturedCallback!(model, {} as FormatContentModelContext, insertPoint);

        return model;
    }

    it('should not delete the original selection when ctrl key is pressed', () => {
        runWithCtrlKey(true);

        expect(deleteSelectionSpy).not.toHaveBeenCalled();
    });

    it('should delete the original selection when ctrl key is not pressed', () => {
        const model = runWithCtrlKey(false);

        expect(deleteSelectionSpy).toHaveBeenCalledWith(model, [reorderList], jasmine.anything());
    });
});
