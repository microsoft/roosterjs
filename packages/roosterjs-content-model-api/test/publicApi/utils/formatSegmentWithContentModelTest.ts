import { EntityOperationEvent, FormattableRoot } from 'roosterjs-content-model-types';
import { expectHtml } from 'roosterjs-content-model-dom/test/testUtils';
import { formatSegmentWithContentModel } from '../../../lib/publicApi/utils/formatSegmentWithContentModel';
import {
    ContentModelBlockFormat,
    IEditor,
    ReadonlyContentModelParagraphDecorator,
} from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    ContentModelFormatter,
    FormatContentModelContext,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph as originalCreateParagraph,
    createSelectionMarker,
    createText,
    createEntity,
} from 'roosterjs-content-model-dom';

describe('formatSegmentWithContentModel', () => {
    let editor: IEditor;
    let focus: jasmine.Spy;
    let model: ContentModelDocument;
    let formatContentModel: jasmine.Spy;
    let formatResult: boolean | undefined;
    let context: FormatContentModelContext | undefined;
    let triggerEvent: jasmine.Spy;

    const mockedCachedElement = 'CACHE' as any;
    const mockedDOMHelper = {
        calculateZoomScale: () => {},
    } as any;

    function createParagraph(
        isImplicit?: boolean,
        blockFormat?: Readonly<ContentModelBlockFormat>,
        segmentFormat?: Readonly<ContentModelSegmentFormat>,
        decorator?: ReadonlyContentModelParagraphDecorator
    ) {
        const result = originalCreateParagraph(isImplicit, blockFormat, segmentFormat, decorator);
        result.cachedElement = mockedCachedElement;
        return result;
    }

    const apiName = 'mockedApi';

    beforeEach(() => {
        context = undefined;
        formatResult = undefined;
        focus = jasmine.createSpy('focus');

        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                context = {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                };
                formatResult = callback(model, context);
            });

        triggerEvent = jasmine.createSpy('triggerEvent');

        editor = {
            focus,
            formatContentModel,
            triggerEvent,
            getDOMHelper: () => mockedDOMHelper,
            isDarkMode: () => false,
            getDocument: () => document,
            getColorManager: () => {},
        } as any;
    });

    it('empty doc', () => {
        model = createContentModelDocument();

        const callback = jasmine
            .createSpy('callback')
            .and.callFake((format: ContentModelSegmentFormat) => {
                format.fontFamily = 'test';
            });

        formatSegmentWithContentModel(editor, apiName, callback);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeFalse();
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it('doc with selection', () => {
        model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2);
        model.blocks.push(para1, para2);

        const callback = jasmine
            .createSpy('callback')
            .and.callFake((format: ContentModelSegmentFormat) => {
                format.fontFamily = 'test';
            });

        formatSegmentWithContentModel(editor, apiName, callback);

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
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                    cachedElement: mockedCachedElement,
                },
            ],
        });
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(text1.format, true, text1, para1);
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

        const callback = jasmine
            .createSpy('callback')
            .and.callFake((format: ContentModelSegmentFormat) => {
                format.fontFamily = 'test';
            });

        formatSegmentWithContentModel(editor, apiName, callback);
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
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(marker.format, true, marker, para);
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

    it('doc with entity selection, no plugin handle it', () => {
        model = createContentModelDocument();

        const div = document.createElement('div');
        const span = document.createElement('span');
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test2');
        const text3 = document.createTextNode('test3');

        span.appendChild(text2);
        div.appendChild(text1);
        div.appendChild(span);
        div.appendChild(text3);

        const entity = createEntity(div, true, {}, 'TestEntity', 'TestEntity1');

        model.blocks.push(entity);
        entity.isSelected = true;

        const callback = jasmine
            .createSpy('callback')
            .and.callFake((format: ContentModelSegmentFormat) => {
                format.fontFamily = 'test';
            });

        formatSegmentWithContentModel(editor, apiName, callback);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: { id: 'TestEntity1', entityType: 'TestEntity', isReadonly: true },
                    wrapper: div,
                    isSelected: true,
                },
            ],
        });
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeFalse();
        expect(callback).toHaveBeenCalledTimes(0);
        expectHtml(div.innerHTML, 'test1<span>test2</span>test3');
    });

    it('doc with entity selection, plugin returns formattable root', () => {
        model = createContentModelDocument();

        const div = document.createElement('div');
        const span = document.createElement('span');
        const text1 = document.createTextNode('test1');
        const text2 = document.createTextNode('test2');
        const text3 = document.createTextNode('test3');

        span.appendChild(text2);
        div.appendChild(text1);
        div.appendChild(span);
        div.appendChild(text3);

        const entity = createEntity(div, true, {}, 'TestEntity', 'TestEntity1');

        model.blocks.push(entity);
        entity.isSelected = true;

        let formattableRoots: FormattableRoot[] | undefined;

        const callback = jasmine
            .createSpy('callback')
            .and.callFake((format: ContentModelSegmentFormat) => {
                format.fontFamily = 'test';
            });

        triggerEvent.and.callFake((eventType: string, event: EntityOperationEvent) => {
            expect(eventType).toBe('entityOperation');
            expect(event.operation).toBe('beforeFormat');
            expect(event.entity).toEqual({
                id: 'TestEntity1',
                type: 'TestEntity',
                isReadonly: true,
                wrapper: div,
            });
            expect(event.formattableRoots).toEqual([]);

            formattableRoots = event.formattableRoots;
            formattableRoots?.push({
                element: span,
            });
        });

        formatSegmentWithContentModel(editor, apiName, callback);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: { id: 'TestEntity1', entityType: 'TestEntity', isReadonly: true },
                    wrapper: div,
                    isSelected: true,
                },
            ],
        });
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith('entityOperation', {
            entity: { id: 'TestEntity1', type: 'TestEntity', isReadonly: true, wrapper: div },
            operation: 'beforeFormat',
            formattableRoots: formattableRoots,
        });
        expectHtml(
            div.innerHTML,
            'test1<span><span style="font-family: test;">test2</span></span>test3'
        );
    });
});
