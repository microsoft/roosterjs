import * as splitSelectedParagraphByBrModule from '../../../lib/modelApi/block/splitSelectedParagraphByBr';
import { formatParagraphWithContentModel } from '../../../lib/publicApi/utils/formatParagraphWithContentModel';
import { IEditor } from 'roosterjs-content-model-types';

import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelFormatter,
    FormatContentModelContext,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('formatParagraphWithContentModel', () => {
    let editor: IEditor;
    let model: ContentModelDocument;
    let context: FormatContentModelContext;
    let splitSelectedParagraphByBrSpy: jasmine.Spy;

    const mockedContainer = 'C' as any;
    const mockedOffset = 'O' as any;

    const apiName = 'mockedApi';

    beforeEach(() => {
        context = undefined!;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                context = {
                    newEntities: [],
                    newImages: [],
                    deletedEntities: [],
                    rawEvent: options.rawEvent,
                };

                callback(model, context);
            });

        editor = ({
            getFocusedPosition: () => ({ node: mockedContainer, offset: mockedOffset }),
            formatContentModel,
        } as any) as IEditor;

        splitSelectedParagraphByBrSpy = spyOn(
            splitSelectedParagraphByBrModule,
            'splitSelectedParagraphByBr'
        ).and.callThrough();
    });

    it('empty doc', () => {
        model = createContentModelDocument();

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'red')
        );

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(model);
    });

    it('doc with selection', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        model.blocks.push(para);

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'red')
        );
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { backgroundColor: 'red' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(model);
    });

    it('Preserve pending format', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        model.blocks.push(para);

        const callback = (paragraph: ContentModelParagraph) => {
            paragraph.format.backgroundColor = 'red';
        };

        formatParagraphWithContentModel(editor, apiName, callback);

        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
            rawEvent: undefined,
            newPendingFormat: 'preserve',
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(model);
    });

    it('multiple paragraphs selected', () => {
        model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        model.blocks.push(para1, para2);

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'red')
        );

        expect(para1.format.backgroundColor).toBe('red');
        expect(para2.format.backgroundColor).toBe('red');
    });

    it('paragraph in list item', () => {
        model = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const para = createParagraph();
        const text = createText('item');

        text.isSelected = true;
        para.segments.push(text);
        listItem.blocks.push(para);
        model.blocks.push(listItem);

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'blue')
        );

        expect(para.format.backgroundColor).toBe('blue');
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
    });

    it('paragraph in table cell', () => {
        model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();
        const text = createText('cell content');

        text.isSelected = true;
        para.segments.push(text);
        cell.blocks.push(para);
        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'green')
        );

        expect(para.format.backgroundColor).toBe('green');
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
    });

    it('returns false when no paragraphs are selected', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        para.segments.push(createText('unselected'));
        model.blocks.push(para);

        let callbackReturn: boolean | undefined;
        (editor.formatContentModel as jasmine.Spy).and.callFake(
            (callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                context = {
                    newEntities: [],
                    newImages: [],
                    deletedEntities: [],
                    rawEvent: options.rawEvent,
                };
                callbackReturn = callback(model, context);
            }
        );

        formatParagraphWithContentModel(editor, apiName, () => {});

        expect(callbackReturn).toBe(false);
    });

    it('passes apiName to formatContentModel options', () => {
        model = createContentModelDocument();

        formatParagraphWithContentModel(editor, apiName, () => {});

        expect(editor.formatContentModel).toHaveBeenCalledWith(
            jasmine.any(Function),
            jasmine.objectContaining({ apiName })
        );
    });
});
