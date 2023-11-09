import { formatSegmentWithContentModel } from '../../../lib/publicApi/utils/formatSegmentWithContentModel';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    ContentModelFormatter,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('formatSegmentWithContentModel', () => {
    let editor: IStandaloneEditor;
    let focus: jasmine.Spy;
    let model: ContentModelDocument;
    let getPendingFormat: jasmine.Spy;
    let formatContentModel: jasmine.Spy;
    let formatResult: boolean | undefined;
    let context: FormatWithContentModelContext | undefined;

    const apiName = 'mockedApi';

    beforeEach(() => {
        context = undefined;
        formatResult = undefined;
        focus = jasmine.createSpy('focus');

        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    context = {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    };
                    formatResult = callback(model, context);
                }
            );

        getPendingFormat = jasmine.createSpy('getPendingFormat');

        editor = ({
            focus,
            formatContentModel,
            getPendingFormat,
        } as any) as IStandaloneEditor;
    });

    it('empty doc', () => {
        model = createContentModelDocument();

        formatSegmentWithContentModel(editor, apiName, format => (format.fontFamily = 'test'));

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeFalse();
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
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
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
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
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(segmentHasStyleCallback).toHaveBeenCalledTimes(1);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text.format, text, para);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(1);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text.format, false, text, para);
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
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
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(segmentHasStyleCallback).toHaveBeenCalledTimes(2);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text1.format, text1, para);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text3.format, text3, para);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(2);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text1.format, true, text1, para);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text3.format, true, text3, para);
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
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
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeFalse();
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
            newPendingFormat: {
                fontSize: '10px',
                fontFamily: 'test',
            },
        });
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
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(pendingFormat).toEqual({
            fontSize: '10px',
            fontFamily: 'test',
        });
        expect(getPendingFormat).toHaveBeenCalledTimes(1);
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        });
    });
});
