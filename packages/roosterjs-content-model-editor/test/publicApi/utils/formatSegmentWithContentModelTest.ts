import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { formatSegmentWithContentModel } from '../../../lib/publicApi/utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { NodePosition } from 'roosterjs-editor-types';

describe('formatSegmentWithContentModel', () => {
    let editor: IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let model: ContentModelDocument;
    let getPendingFormat: jasmine.Spy;
    let setPendingFormat: jasmine.Spy;

    const apiName = 'mockedApi';

    beforeEach(() => {
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot').and.callFake(callback => callback());
        setContentModel = jasmine.createSpy('setContentModel');
        focus = jasmine.createSpy('focus');

        setPendingFormat = spyOn(pendingFormat, 'setPendingFormat');
        getPendingFormat = spyOn(pendingFormat, 'getPendingFormat');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel: () => model,
            setContentModel,
            getFocusedPosition: () => null as NodePosition,
        } as any) as IContentModelEditor;
    });

    it('empty doc', () => {
        model = createContentModelDocument();

        formatSegmentWithContentModel(editor, apiName, format => (format.fontFamily = 'test'));

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
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
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
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
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text.format, text, para);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(1);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text.format, false, text);
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
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
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text1.format, text1, para);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text3.format, text3, para);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(2);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text1.format, true, text1);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text3.format, true, text3);
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('Collapsed selection', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const format: ContentModelSegmentFormat = {
            fontSize: '10px',
        };
        const marker = createSelectionMarker(format);

        para.segments.push(marker);
        model.blocks.push(para);

        const mockedPosition = ('Position' as any) as NodePosition;

        editor.getFocusedPosition = () => mockedPosition;

        formatSegmentWithContentModel(editor, apiName, format => (format.fontFamily = 'test'));
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontSize: '10px',
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(addUndoSnapshot).toHaveBeenCalledTimes(0);
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(
            editor,
            {
                fontSize: '10px',
                fontFamily: 'test',
            },
            mockedPosition
        );
    });

    it('With pending format', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        model.blocks.push(para);

        const pendingFormat: ContentModelSegmentFormat = {
            fontSize: '10px',
        };

        getPendingFormat.and.returnValue(pendingFormat);

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
                            format: {},
                        },
                    ],
                },
            ],
        });
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(pendingFormat).toEqual({
            fontSize: '10px',
            fontFamily: 'test',
        });
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
    });
});
