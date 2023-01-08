import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { formatSegmentWithContentModel } from '../../../lib/publicApi/utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('formatSegmentWithContentModel', () => {
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
            getPendingFormat: (): ContentModelDocument | null => null,
            setPendingFormat: () => {},
        } as any) as IExperimentalContentModelEditor;
    });

    it('empty doc', () => {
        model = createContentModelDocument();

        formatSegmentWithContentModel(editor, apiName, format => (format.fontFamily = 'test'));

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

        formatSegmentWithContentModel(editor, apiName, format => (format.fontFamily = 'test'));
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
    });

    it('doc with selection, all segments are already in expected state', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        model.blocks.push(para);

        const segmentHasStyleCallback = jasmine.createSpy().and.returnValue(true);
        const toggleStyleCallback = jasmine
            .createSpy()
            .and.callFake(format => (format.fontFamily = 'test'));

        formatSegmentWithContentModel(
            editor,
            apiName,
            toggleStyleCallback,
            segmentHasStyleCallback
        );

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(segmentHasStyleCallback).toHaveBeenCalledTimes(1);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text.format);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(1);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text.format, false);
    });

    it('doc with selection, some segments are in expected state', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        text1.isSelected = true;
        text3.isSelected = true;

        para.segments.push(text1);
        para.segments.push(text2);
        para.segments.push(text3);
        model.blocks.push(para);

        const segmentHasStyleCallback = jasmine
            .createSpy()
            .and.callFake(format => format == text1.format);
        const toggleStyleCallback = jasmine
            .createSpy()
            .and.callFake(format => (format.fontFamily = 'test'));

        formatSegmentWithContentModel(
            editor,
            apiName,
            toggleStyleCallback,
            segmentHasStyleCallback
        );

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test3',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(segmentHasStyleCallback).toHaveBeenCalledTimes(2);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text1.format);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text3.format);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(2);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text1.format, true);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text3.format, true);
    });
});
