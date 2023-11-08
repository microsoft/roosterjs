import { ContentModelDocument, ContentModelParagraph } from 'roosterjs-content-model-types';
import { formatParagraphWithContentModel } from '../../../lib/publicApi/utils/formatParagraphWithContentModel';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import {
    createContentModelDocument,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('formatParagraphWithContentModel', () => {
    let editor: IContentModelEditor;
    let model: ContentModelDocument;
    let context: FormatWithContentModelContext;

    const mockedContainer = 'C' as any;
    const mockedOffset = 'O' as any;

    const apiName = 'mockedApi';

    beforeEach(() => {
        context = undefined!;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    context = {
                        newEntities: [],
                        newImages: [],
                        deletedEntities: [],
                        rawEvent: options.rawEvent,
                    };

                    callback(model, context);
                }
            );

        editor = ({
            getCustomData: () => ({}),
            getFocusedPosition: () => ({ node: mockedContainer, offset: mockedOffset }),
            formatContentModel,
        } as any) as IContentModelEditor;
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
    });
});
