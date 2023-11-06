import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ContentModelDocument, ContentModelParagraph } from 'roosterjs-content-model-types';
import { formatParagraphWithContentModel } from '../../../lib/publicApi/utils/formatParagraphWithContentModel';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
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

    const mockedContainer = 'C' as any;
    const mockedOffset = 'O' as any;

    const apiName = 'mockedApi';

    beforeEach(() => {
        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    });
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

        spyOn(pendingFormat, 'formatAndKeepPendingFormat').and.callThrough();

        const callback = (paragraph: ContentModelParagraph) => {
            paragraph.format.backgroundColor = 'red';
        };

        formatParagraphWithContentModel(editor, apiName, callback);

        expect(pendingFormat.formatAndKeepPendingFormat).toHaveBeenCalled();
    });
});
