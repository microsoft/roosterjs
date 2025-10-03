import * as addBlockFile from 'roosterjs-content-model-dom/lib/modelApi/common/addBlock';
import * as createContentModelDocumentFile from 'roosterjs-content-model-dom/lib/modelApi/creators/createContentModelDocument';
import * as createDividerFile from 'roosterjs-content-model-dom/lib/modelApi/creators/createDivider';
import * as mergeModelFile from 'roosterjs-content-model-dom/lib/modelApi/editing/mergeModel';
import {
    insertHorizontalLineIntoModel,
    checkAndInsertHorizontalLine,
} from '../../../lib/autoFormat/horizontalLine/checkAndInsertHorizontalLine';
import {
    addBlock,
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import {
    FormatContentModelContext,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

const commonStyles = {
    width: '98%',
    display: 'inline-block',
};

describe('insertHorizontalLineIntoModel', () => {
    let model: ShallowMutableContentModelDocument;
    let context: FormatContentModelContext;

    beforeEach(() => {
        model = createContentModelDocument();
        addBlock(model, {
            blockType: 'Paragraph',
            segments: [createSelectionMarker()],
            format: {},
        });
        context = {} as FormatContentModelContext;
    });

    it('should insert a horizontal line into the model', () => {
        insertHorizontalLineIntoModel(model, context, '#');

        expect(model.blocks.length).toBe(2);
        expect(model.blocks[0].blockType).toBe('Divider');
        expect((model.blocks[0] as any).tagName).toBe('hr');
    });

    it('should call createDivider and createContentModelDocument, -', () => {
        const createDividerSpy = spyOn(createDividerFile, 'createDivider');
        const createContentModelDocumentSpy = spyOn(
            createContentModelDocumentFile,
            'createContentModelDocument'
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => null);
        const addBlockSpy = spyOn(addBlockFile, 'addBlock').and.callFake(() => {});

        insertHorizontalLineIntoModel(model, context, '-');

        expect(createDividerSpy).toHaveBeenCalledWith('hr', {
            borderTop: '1px none',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
            ...commonStyles,
        });
        expect(createContentModelDocumentSpy).toHaveBeenCalled();
        expect(mergeModelSpy).toHaveBeenCalled();
        expect(addBlockSpy).toHaveBeenCalled();
    });

    it('should call createDivider and createContentModelDocument, =', () => {
        const createDividerSpy = spyOn(createDividerFile, 'createDivider');
        const createContentModelDocumentSpy = spyOn(
            createContentModelDocumentFile,
            'createContentModelDocument'
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => null);
        const addBlockSpy = spyOn(addBlockFile, 'addBlock').and.callFake(() => {});

        insertHorizontalLineIntoModel(model, context, '=');

        expect(createDividerSpy).toHaveBeenCalledWith(
            'hr',
            Object({
                borderTop: '3pt double',
                borderRight: '3pt none',
                borderBottom: '3pt none',
                borderLeft: '3pt none',
                width: '98%',
                display: 'inline-block',
            })
        );
        expect(createContentModelDocumentSpy).toHaveBeenCalled();
        expect(mergeModelSpy).toHaveBeenCalled();
        expect(addBlockSpy).toHaveBeenCalled();
    });

    it('should call createDivider and createContentModelDocument, _', () => {
        const createDividerSpy = spyOn(createDividerFile, 'createDivider');
        const createContentModelDocumentSpy = spyOn(
            createContentModelDocumentFile,
            'createContentModelDocument'
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => null);
        const addBlockSpy = spyOn(addBlockFile, 'addBlock').and.callFake(() => {});

        insertHorizontalLineIntoModel(model, context, '_');

        expect(createDividerSpy).toHaveBeenCalledWith('hr', {
            borderTop: '1px solid',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
            ...commonStyles,
        });
        expect(createContentModelDocumentSpy).toHaveBeenCalled();
        expect(mergeModelSpy).toHaveBeenCalled();
        expect(addBlockSpy).toHaveBeenCalled();
    });

    it('should call createDivider and createContentModelDocument, *', () => {
        const createDividerSpy = spyOn(createDividerFile, 'createDivider');
        const createContentModelDocumentSpy = spyOn(
            createContentModelDocumentFile,
            'createContentModelDocument'
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => null);
        const addBlockSpy = spyOn(addBlockFile, 'addBlock').and.callFake(() => {});

        insertHorizontalLineIntoModel(model, context, '*');

        expect(createDividerSpy).toHaveBeenCalledWith(
            'hr',
            Object({
                borderTop: '1px none',
                borderRight: '1px none',
                borderBottom: '3px dotted',
                borderLeft: '1px none',
                width: '98%',
                display: 'inline-block',
            })
        );
        expect(createContentModelDocumentSpy).toHaveBeenCalled();
        expect(mergeModelSpy).toHaveBeenCalled();
        expect(addBlockSpy).toHaveBeenCalled();
    });

    it('should call createDivider and createContentModelDocument, ~', () => {
        const createDividerSpy = spyOn(createDividerFile, 'createDivider');
        const createContentModelDocumentSpy = spyOn(
            createContentModelDocumentFile,
            'createContentModelDocument'
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => null);
        const addBlockSpy = spyOn(addBlockFile, 'addBlock').and.callFake(() => {});

        insertHorizontalLineIntoModel(model, context, '~');

        expect(createDividerSpy).toHaveBeenCalledWith(
            'hr',
            Object({
                borderTop: '1px none',
                borderRight: '1px none',
                borderBottom: '1px solid',
                borderLeft: '1px none',
                width: '98%',
                display: 'inline-block',
            })
        );
        expect(createContentModelDocumentSpy).toHaveBeenCalled();
        expect(mergeModelSpy).toHaveBeenCalled();
        expect(addBlockSpy).toHaveBeenCalled();
    });

    it('should call createDivider and createContentModelDocument, #', () => {
        const createDividerSpy = spyOn(createDividerFile, 'createDivider');
        const createContentModelDocumentSpy = spyOn(
            createContentModelDocumentFile,
            'createContentModelDocument'
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.callFake(() => null);
        const addBlockSpy = spyOn(addBlockFile, 'addBlock').and.callFake(() => {});

        insertHorizontalLineIntoModel(model, context, '#');

        expect(createDividerSpy).toHaveBeenCalledWith('hr', {
            borderTop: '3pt double',
            borderRight: '3pt none',
            borderBottom: '3pt double',
            borderLeft: '3pt none',
            ...commonStyles,
        });
        expect(createContentModelDocumentSpy).toHaveBeenCalled();
        expect(mergeModelSpy).toHaveBeenCalled();
        expect(addBlockSpy).toHaveBeenCalled();
    });

    it('should not insert horizontal line when inside a list item', () => {
        // Arrange: Create a model with a list item
        model = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const textSegment = createText('---');
        const selectionMarker = createSelectionMarker();

        paragraph.segments.push(textSegment, selectionMarker);
        listItem.blocks.push(paragraph);
        model.blocks.push(listItem);

        // Act
        const result = checkAndInsertHorizontalLine(model, paragraph, context);

        // Assert
        expect(result).toBe(false);
        expect(model.blocks.length).toBe(1); // Should still only have the list item
        expect(model.blocks[0].blockType).toBe('BlockGroup');
        expect((model.blocks[0] as any).blockGroupType).toBe('ListItem');

        // Verify the paragraph content is unchanged
        const listItemBlock = model.blocks[0] as any;
        expect(listItemBlock.blocks[0].segments.length).toBe(2); // text + selection marker
        expect(listItemBlock.blocks[0].segments[0].text).toBe('---');
    });
});
