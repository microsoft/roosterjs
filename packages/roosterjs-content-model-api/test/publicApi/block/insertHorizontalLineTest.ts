import { insertHorizontalLine } from '../../../lib/publicApi/block/insertHorizontalLine';
import {
    createBr,
    createContentModelDocument,
    createDivider,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

describe('insertHorizontalLine', () => {
    let model: ContentModelDocument;
    let context: FormatContentModelContext;
    let editor: IEditor;
    let focus: jasmine.Spy;
    let formatContentModel: jasmine.Spy;
    let formatResult: boolean | undefined;

    beforeEach(() => {
        model = createContentModelDocument();
        context = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        focus = jasmine.createSpy('focus');
        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) => {
                formatResult = callback(model, context);
            });
        editor = ({
            focus,
            formatContentModel,
        } as Partial<IEditor>) as IEditor;
    });

    it('inserts a default horizontal line and keeps the caret after it', () => {
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        paragraph.segments.push(marker);
        model.blocks.push(paragraph);

        insertHorizontalLine(editor);

        expect(focus).toHaveBeenCalledTimes(1);
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatContentModel.calls.argsFor(0)[1]).toEqual({
            apiName: 'insertHorizontalLine',
        });
        expect(formatResult).toBe(true);
        expect(model.blocks).toEqual([
            {
                blockType: 'Divider',
                tagName: 'hr',
                format: {
                    borderTop: '1px none',
                    borderRight: '1px none',
                    borderBottom: '1px solid',
                    borderLeft: '1px none',
                    width: '98%',
                    display: 'inline-block',
                },
            },
            {
                ...createParagraph(),
                segments: [marker, createBr()],
            },
        ]);
        expect(marker.isSelected).toBe(true);
        expect(context.canUndoByBackspace).toBeUndefined();
    });

    it('replaces selected text with a custom horizontal line', () => {
        const paragraph = createParagraph();
        const before = createText('before');
        const selected = createText('selected');
        const after = createText('after');
        const start = createSelectionMarker();
        const end = createSelectionMarker();
        selected.isSelected = true;
        paragraph.segments.push(before, start, selected, end, after);
        model.blocks.push(paragraph);
        const format = { borderBottom: '3px dotted red', width: '50%' };

        insertHorizontalLine(editor, format);

        expect(formatResult).toBe(true);
        expect(model.blocks.length).toBe(3);
        expect(model.blocks[0]).toEqual(jasmine.objectContaining({ segments: [before] }));
        expect(model.blocks[1]).toEqual(createDivider('hr', format));
        expect(model.blocks[2]).toEqual(
            jasmine.objectContaining({
                segments: [jasmine.objectContaining({ segmentType: 'SelectionMarker' }), after],
            })
        );
        expect(format).toEqual({ borderBottom: '3px dotted red', width: '50%' });
    });

    it('does not insert a horizontal line without a selection', () => {
        const paragraph = createParagraph();
        paragraph.segments.push(createText('text'));
        model.blocks.push(paragraph);

        insertHorizontalLine(editor);

        expect(formatResult).toBe(false);
        expect(model.blocks).toEqual([paragraph]);
        expect(paragraph.segments).toEqual([createText('text')]);
    });
});
