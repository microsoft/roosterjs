import * as generalBlockProcessor from '../../../lib/domToModel/processors/generalBlockProcessor';
import * as generalSegmentProcessor from '../../../lib/domToModel/processors/generalSegmentProcessor';
import * as textProcessor from '../../../lib/domToModel/processors/textProcessor';
import { containerProcessor } from '../../../lib/domToModel/processors/containerProcessor';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelDocument } from '../../../lib/publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/domToModel/creators/createContentModelDocument';
import { createFormatContext } from '../../../lib/formatHandlers/createFormatContext';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';

describe('containerProcessor', () => {
    let doc: ContentModelDocument;
    let context: FormatContext;

    beforeEach(() => {
        doc = createContentModelDocument(document);
        context = createFormatContext();
        spyOn(generalBlockProcessor, 'generalBlockProcessor');
        spyOn(generalSegmentProcessor, 'generalSegmentProcessor');
        spyOn(textProcessor, 'textProcessor');
    });

    it('Process a document fragment', () => {
        const fragment = document.createDocumentFragment();

        containerProcessor(doc, fragment, context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
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
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
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
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [],
            document: document,
        });
        expect(generalBlockProcessor.generalBlockProcessor).not.toHaveBeenCalled();
        expect(generalSegmentProcessor.generalSegmentProcessor).not.toHaveBeenCalled();
        expect(textProcessor.textProcessor).toHaveBeenCalledTimes(1);
        expect(textProcessor.textProcessor).toHaveBeenCalledWith(doc, 'test');
    });

    it('Process a DIV with SPAN node', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        containerProcessor(doc, div, context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
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
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
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
        expect(textProcessor.textProcessor).toHaveBeenCalledWith(doc, 'test');
    });
});
