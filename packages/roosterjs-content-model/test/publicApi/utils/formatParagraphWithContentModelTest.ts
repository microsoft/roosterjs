import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { formatParagraphWithContentModel } from '../../../lib/publicApi/utils/formatParagraphWithContentModel';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('formatParagraphWithContentModel', () => {
    let editor: IExperimentalContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let model: ContentModelDocument;

    const apiName = 'mockedApi';

    beforeEach(() => {
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot').and.callFake(callback => callback());
        setContentModel = jasmine.createSpy('setContentModel');
        focus = jasmine.createSpy('focus');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel: () => model,
            setContentModel,
            getCachedInsertPosition: (): ContentModelDocument | null => null,
            cacheInsertPosition: () => {},
        } as any) as IExperimentalContentModelEditor;
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
        expect(addUndoSnapshot).not.toHaveBeenCalled();
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
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
    });
});
